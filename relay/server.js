// Trust-bearing outbound hop: the browser can't satisfy a receiver's host
// allowlist/CORS, so the SPA POSTs here and we forward. RELAY_TOKEN_DIR holds
// one file per bearer token (filename = token, body = metadata); read per
// request so tokens revoke without a restart. Empty dir => fail closed.
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';

const PORT = Number(process.env.RELAY_PORT) || 5052;
const TOKEN_DIR = process.env.RELAY_TOKEN_DIR || 'token';
const ALLOW_ORIGIN = process.env.RELAY_ALLOW_ORIGIN || '*';

const MAX_BODY = 1024 * 1024;        // 1 MB cap on forwarded payloads
const FORWARD_TIMEOUT_MS = 15_000;   // upstream deadline

// log4js-style lines so relay output matches the inbox's; honours the same
// LOG4JS level from .env. Zero-dep by design — mimics the layout, not the lib.
const LEVELS = { trace: 0, debug: 1, info: 2, warn: 3, error: 4, fatal: 5, off: 99 };
const MIN_LEVEL = LEVELS[(process.env.RELAY_LOG_LEVEL || process.env.LOG4JS || 'info').toLowerCase()] ?? LEVELS.info;

function log(level, message) {
    if (LEVELS[level] < MIN_LEVEL) return;
    process.stdout.write(`[${new Date().toISOString()}] [${level.toUpperCase()}] relay - ${message}\n`);
}

// --- Extension seams (documented next hardening step, not implemented here) ---
// RELAY_ALLOW_HOSTS: a target hostname allowlist + private-range/loopback guard
//   to stop a token holder using the relay for SSRF to internal services.
// Per-token rate limiting: keyed on the bearer token (e.g. in-memory token bucket).
// Per-token actor/origin pinning: bind a token file to an actor/origin id and
//   reject notifications whose actor/origin doesn't match.

function listTokens() {
    try {
        return fs.readdirSync(TOKEN_DIR, { withFileTypes: true })
            .filter(e => e.isFile() && !e.name.startsWith('.'))
            .map(e => e.name);
    } catch {
        return [];
    }
}

// token has already matched a directory entry, so path.join here can't traverse.
function tokenRecipient(token) {
    try {
        const lines = fs.readFileSync(path.join(TOKEN_DIR, token), 'utf8')
            .split(/\r?\n/).map(l => l.trim()).filter(Boolean);
        const to = lines.find(l => /^to:/i.test(l));
        return to ? to.replace(/^to:\s*/i, '') : (lines[0] ?? '');
    } catch {
        return '';
    }
}

// Empty/over-long/control-char/'/' tokens can't name a file — reject up front.
function bearer(req) {
    const m = /^Bearer\s+(.+)$/.exec(req.headers['authorization'] || '');
    const t = m ? m[1].trim() : '';
    if (!t || t.length > 512 || /[\x00-\x1f\x7f/]/.test(t)) return '';
    return t;
}

function clientIp(req) {
    const fwd = (req.headers['x-forwarded-for'] || '').split(',')[0].trim();
    return fwd || req.socket.remoteAddress || '-';
}

function corsHeaders() {
    return {
        'Access-Control-Allow-Origin': ALLOW_ORIGIN,
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'authorization, content-type, x-forward-to',
    };
}

function send(res, status, message) {
    res.writeHead(status, { 'Content-Type': 'text/plain', 'Access-Control-Allow-Origin': ALLOW_ORIGIN });
    res.end(message + '\n');
}

function audit({ token, to, ip, target, status }) {
    const prefix = token ? token.slice(0, 6) : '-';
    log('info', `token=${prefix} to=${JSON.stringify(to || '')} ip=${ip} target=${target || '-'} -> ${status}`);
}

function readBody(req, cap) {
    return new Promise((resolve, reject) => {
        const chunks = [];
        let size = 0;
        let over = false;
        req.on('data', c => {
            if (over) return;              // past the cap: drain and discard the rest
            size += c.length;
            if (size > cap) {
                over = true;
                reject({ tooLarge: true });
                return;
            }
            chunks.push(c);
        });
        req.on('end', () => { if (!over) resolve(Buffer.concat(chunks)); });
        req.on('error', e => { if (!over) reject(e); });
    });
}

async function handleRelay(req, res) {
    const ip = clientIp(req);

    // Membership check, not a path lookup — a `../…` token can't match.
    const tokens = listTokens();
    if (tokens.length === 0) {
        audit({ ip, status: 503 });
        return send(res, 503, 'Relay has no tokens configured');
    }
    const token = bearer(req);
    if (!token || !tokens.includes(token)) {
        audit({ token, ip, status: 401 });
        return send(res, 401, 'Unauthorized');
    }

    let target;
    try {
        const u = new URL(req.headers['x-forward-to'] || '');
        if (u.protocol !== 'http:' && u.protocol !== 'https:') throw new Error('scheme');
        target = u.toString();
    } catch {
        audit({ token, ip, status: 400 });
        return send(res, 400, 'Bad or missing X-Forward-To header');
    }

    let body;
    try {
        body = await readBody(req, MAX_BODY);
    } catch (e) {
        if (e && e.tooLarge) {
            audit({ token, ip, target, status: 413 });
            res.setHeader('Connection', 'close');   // stop the client's upload, don't reuse
            return send(res, 413, 'Payload too large');
        }
        audit({ token, ip, target, status: 400 });
        return send(res, 400, 'Could not read request body');
    }

    const to = tokenRecipient(token);

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), FORWARD_TIMEOUT_MS);
    let upstream;
    try {
        upstream = await fetch(target, {
            method: 'POST',
            headers: { 'Content-Type': req.headers['content-type'] || 'application/ld+json' },
            body,
            signal: controller.signal,
        });
    } catch {
        clearTimeout(timer);
        audit({ token, to, ip, target, status: 502 });
        return send(res, 502, 'Upstream request failed');
    }
    clearTimeout(timer);

    const upstreamBody = Buffer.from(await upstream.arrayBuffer());
    const headers = {
        'Content-Type': upstream.headers.get('content-type') || 'application/octet-stream',
        'Access-Control-Allow-Origin': ALLOW_ORIGIN,
    };
    const location = upstream.headers.get('location');
    if (location) headers['Location'] = location;
    res.writeHead(upstream.status, headers);
    res.end(upstreamBody);
    audit({ token, to, ip, target, status: upstream.status });
}

const server = http.createServer((req, res) => {
    const { pathname } = new URL(req.url, 'http://localhost');
    const isRelay = pathname === '/relay/' || pathname === '/relay';

    if (req.method === 'OPTIONS' && isRelay) {
        res.writeHead(204, corsHeaders());
        return res.end();
    }
    if (req.method === 'GET' && pathname === '/relay/health') {
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        return res.end('ok\n');
    }
    if (req.method === 'POST' && isRelay) {
        handleRelay(req, res).catch(e => {
            log('error', `unhandled: ${e?.stack || e}`);
            if (!res.headersSent) send(res, 500, 'Internal relay error');
        });
        return;
    }
    send(res, 404, 'Not found');
});

server.listen(PORT, () => {
    log('info', `listening on :${PORT} (token dir: ${TOKEN_DIR})`);
});
