<script lang="ts">
    import { onMount, onDestroy } from 'svelte';
    import ForceGraph from 'force-graph';
    import { parseGraph } from '../../inbox';
    import { AS, LDP, POSIX, IANA, IETF, COAR_NOTIFY, SORG } from '../../globals';

    export let data: string;

    const RDF = 'http://www.w3.org/1999/02/22-rdf-syntax-ns#';
    const PREFIXES: [string, string][] = [
        [AS, 'as:'], [LDP, 'ldp:'], [COAR_NOTIFY, 'coar:'], [SORG, 'schema:'],
        [POSIX, 'posix:'], [IANA, 'iana:'], [IETF, 'rel:'], [RDF, 'rdf:'],
    ];

    function shorten(iri: string): string {
        for (const [ns, p] of PREFIXES) {
            if (iri.startsWith(ns)) return p + iri.slice(ns.length);
        }
        return iri;
    }

    interface Node { id: string; label: string; literal: boolean; }
    interface Link { source: string; target: string; label: string; }

    let container: HTMLDivElement;
    let graph: any;
    let resizeObserver: ResizeObserver;

    onMount(async () => {
        const triples = await parseGraph(data);

        const nodes = new Map<string, Node>();
        const links: Link[] = [];
        let lit = 0;

        for (const t of triples) {
            if (!nodes.has(t.subject)) {
                nodes.set(t.subject, { id: t.subject, label: shorten(t.subject), literal: false });
            }
            let objId: string;
            if (t.objectIsLiteral) {
                objId = `_lit${lit++}`;
                nodes.set(objId, { id: objId, label: t.object, literal: true });
            } else {
                objId = t.object;
                if (!nodes.has(objId)) {
                    nodes.set(objId, { id: objId, label: shorten(objId), literal: false });
                }
            }
            links.push({ source: t.subject, target: objId, label: shorten(t.predicate) });
        }

        graph = new ForceGraph(container)
            .backgroundColor('#1e1e1e')
            .width(container.clientWidth)
            .height(container.clientHeight)
            .graphData({ nodes: [...nodes.values()], links })
            .nodeLabel((n: any) => (n.literal ? n.label : n.id))
            .nodeRelSize(5)
            .linkColor(() => '#666')
            .linkDirectionalArrowLength(4)
            .linkDirectionalArrowRelPos(1)
            .nodeCanvasObject((node: any, ctx: CanvasRenderingContext2D, scale: number) => {
                const r = node.literal ? 4 : 6;
                ctx.beginPath();
                ctx.arc(node.x, node.y, r, 0, 2 * Math.PI);
                ctx.fillStyle = node.literal ? '#ce9178' : '#4caf50';
                ctx.fill();
                const fontSize = 11 / scale;
                ctx.font = `${fontSize}px Sans-Serif`;
                ctx.fillStyle = '#d4d4d4';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'top';
                ctx.fillText(node.label, node.x, node.y + r + 1);
            })
            .linkCanvasObjectMode(() => 'after')
            .linkCanvasObject((link: any, ctx: CanvasRenderingContext2D, scale: number) => {
                if (typeof link.source !== 'object' || typeof link.target !== 'object') return;
                const x = (link.source.x + link.target.x) / 2;
                const y = (link.source.y + link.target.y) / 2;
                const fontSize = 10 / scale;
                ctx.font = `${fontSize}px Sans-Serif`;
                ctx.fillStyle = '#9cdcfe';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText(link.label, x, y);
            });

        // Spread nodes out: stronger repulsion and longer links than the defaults.
        graph.d3Force('charge').strength(-250);
        graph.d3Force('link').distance(70);
        graph.d3ReheatSimulation();

        resizeObserver = new ResizeObserver(() => {
            graph.width(container.clientWidth).height(container.clientHeight);
        });
        resizeObserver.observe(container);
    });

    onDestroy(() => {
        resizeObserver?.disconnect();
        graph?._destructor?.();
    });
</script>

<div class="graph-viewer border rounded" bind:this={container}></div>

<style>
    .graph-viewer {
        width: 100%;
        height: 500px;
        overflow: hidden;
        background-color: #1e1e1e;
    }
</style>
