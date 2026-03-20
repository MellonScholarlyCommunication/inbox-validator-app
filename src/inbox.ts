import { Readable } from 'readable-stream';
import { rdfParser } from "rdf-parse";
import type { Quad } from "@rdfjs/types";
import N3 from 'n3';

const LDP = 'http://www.w3.org/ns/ldp#';
const POSIX = 'http://www.w3.org/ns/posix/stat#';
const IANA = 'http://www.w3.org/ns/iana/media-types/';
const RDF = 'http://www.w3.org/1999/02/22-rdf-syntax-ns#';

export interface Notification {
    data: any 
}

export interface Member {
    name: string;
    mimeType?: string; 
    size?: number;
    date?: string;
}

export async function getNotification(url: string) : Promise<Notification> {
    const response = await fetch(url);

    if (! response.ok) {
        throw new Error(`HTTP error: ${response.status}`);
    }

    const json = await response.json();

    return {
        data: json
    } as Notification;
}

export async function listInbox(url: string) : Promise<Member[]> {
    const response = await fetch(url, {
        headers: {
            'Accept': 'application/ld+json, text/turtle;q=0.9'
        }
    });

    if (! response.ok) {
        throw new Error(`HTTP error: ${response.status}`);
    }

    const contentType = response.headers.get('content-type') ?? 'application/ld+json';

    let inbox : Member[];

    if (contentType.includes('application/ld+json')) {
        const text = await response.text();
        inbox = await parseInbox(text,'application/ld+json');
    }
    else if (contentType.includes('text/turtle')) {
        const text = await response.text();
        inbox = await parseInbox(text,'text/turtle');
    }
    else {
        throw new Error(`can not parse: ${contentType}`);
    }

    // Clean the members and remove the base url
    return inbox.map(member => ({
        ...member,
        name: member.name.replace(url,"")
    }));
}

async function parseInbox(data: string, type: string) : Promise<Member[]> {
    try {
        const store = await parseRDF(data, type);
        const result : Member[] = [];

        const engine = new window.Comunica.QueryEngine();
        const bindingsStream = await engine.queryBindings(
            `
            PREFIX ldp: <${LDP}>
            PREFIX posix: <${POSIX}>

            SELECT ?name ?mtime ?size ?type WHERE {
                ?s ldp:contains ?name .
                OPTIONAL {
                    ?name a ?type .
                    FILTER(STRSTARTS(STR(?type), "${IANA}"))
                }
                OPTIONAL {
                    ?name posix:mtime ?mtime .
                }
                OPTIONAL {
                    ?name posix:size ?size .
                }
            }
            `,
            {
            sources: [store]
            }
        );

        const bindings = await bindingsStream.toArray();
        
        if (bindings) {
            for (let i = 0 ; i < bindings.length ; i++) {
                const member : Member = { "name": ""};
                if (bindings[i]?.get('name')) {
                    member.name = bindings[i]?.get('name').value;
                }
                if (bindings[i]?.get('mtime')) {
                    member.date = new Date(Number(bindings[i]?.get('mtime').value)*1000).toISOString();
                }
                if (bindings[i]?.get('size')) {
                    member.size = bindings[i]?.get('size').value;
                }
                if (bindings[i]?.get('type')) {
                    member.mimeType = bindings[i]?.get('type').value
                                        .replace(IANA,"")
                                        .replaceAll(/#.*/g,'');
                }
                result.push(member);
            }
        }   

        return result;
    }
    catch (e: unknown) {
        console.log(e);
        if (e instanceof Error) {
            throw new Error(e.message);
        }
        else {
            throw new Error(`Unknown parsing error: ${e}`);
        }
    }
}

async function parseRDF(data: string, type: string) : Promise<N3.Store> {
    return new Promise<N3.Store>( (resolve,reject) => {
        const textStream = streamifyString(data);
        const store = new N3.Store();
        
        rdfParser.parse(textStream, { contentType: type })
            .on('data', (quad) => store.add(quad))
            .on('error', (error) => reject(error))
            .on('end', () => resolve(store));
    });
}

function streamifyString(data:string) {
    const stream = new Readable({
        read() {
            this.push(data);
            this.push(null); // Signals the end of the stream
        }
    });
    return stream;
}