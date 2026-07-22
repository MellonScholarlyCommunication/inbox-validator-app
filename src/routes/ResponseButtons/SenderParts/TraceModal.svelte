<script lang="ts">
    import { createEventDispatcher } from 'svelte';
    import type { RelayTrace } from '../../../inbox';

    export let trace : RelayTrace | null = null;
    export let pending : boolean = false;
    export let error : string | null = null;
    export let target : string = '';
    export let payload : any = null;

    const dispatch = createEventDispatcher();
    const close = () => dispatch('close');

    const is2xx = (s : number) => s >= 200 && s < 300;

    $: ok = trace?.ok ?? false;
    $: state = pending ? 'sending' : (trace && ok ? 'ok' : 'fail');
    $: headerBg = state === 'sending' ? 'bg-secondary' : (state === 'ok' ? 'bg-success' : 'bg-danger');
    $: headerText = state === 'sending' ? 'Sending…' : (state === 'ok' ? 'Notification delivered' : 'Delivery failed');
    $: server = trace?.target || target;
    $: prettyPayload = payload ? JSON.stringify(payload, null, 2) : '';
</script>

<div class="modal-backdrop show"></div>
<div class="modal show d-block" tabindex="-1" role="dialog">
    <div class="modal-dialog modal-lg modal-dialog-scrollable" role="document">
        <div class="modal-content" class:trace-ok={state === 'ok'} class:trace-fail={state === 'fail'}>
            <div class="modal-header text-white {headerBg}">
                <h5 class="modal-title">
                    {#if pending}<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>{/if}
                    {headerText}
                </h5>
                <button type="button" class="btn-close btn-close-white" aria-label="Close" on:click={close}></button>
            </div>
            <div class="modal-body">
                {#if server}
                    <p class="mb-1"><strong>Server contacted</strong></p>
                    <p class="text-break"><code>{server}</code></p>
                {/if}

                {#if pending}
                    <p class="text-muted">Waiting for the remote inbox to respond — this can take a while for slow servers…</p>
                {:else if trace}
                    {#if trace.hops.length}
                        <p class="mb-1"><strong>Redirects</strong></p>
                        <ol class="mb-3">
                            {#each trace.hops as hop}
                                <li class="text-break">
                                    <code>{hop.url}</code>
                                    <span class="badge bg-secondary">{hop.status} {hop.statusText}</span>
                                    &rarr; <code>{hop.location}</code>
                                </li>
                            {/each}
                        </ol>
                    {/if}

                    {#if trace.final}
                        <p class="mb-1"><strong>Final response</strong></p>
                        <p class="text-break">
                            <code>{trace.final.url}</code>
                            <span class="badge {is2xx(trace.final.status) ? 'bg-success' : 'bg-danger'}">
                                {trace.final.status} {trace.final.statusText}
                            </span>
                        </p>
                        {#if trace.final.location}
                            <p class="text-break"><small>Location: <code>{trace.final.location}</code></small></p>
                        {/if}
                        {#if trace.final.bodySnippet}
                            <pre class="snippet bg-light border rounded p-2 mb-0"><code>{trace.final.bodySnippet}</code></pre>
                        {/if}
                    {:else}
                        <div class="alert alert-danger">
                            <strong>Could not deliver:</strong> {trace.error}
                        </div>
                    {/if}
                {:else if error}
                    <div class="alert alert-danger">
                        <strong>Could not deliver:</strong> {error}
                    </div>
                {/if}

                {#if prettyPayload}
                    <p class="mb-1 mt-3"><strong>Notification sent</strong></p>
                    <pre class="snippet bg-light border rounded p-2 mb-0"><code>{prettyPayload}</code></pre>
                {/if}
            </div>
            <div class="modal-footer">
                {#if pending}
                    <button type="button" class="btn btn-outline-secondary" on:click={close}>Close</button>
                {:else}
                    <button type="button" class="btn {state === 'ok' ? 'btn-success' : 'btn-secondary'}" on:click={close}>
                        {state === 'ok' ? 'Done' : 'Close'}
                    </button>
                {/if}
            </div>
        </div>
    </div>
</div>

<style>
    /* Bootstrap colours <code> pink by default; tint the URLs by outcome instead. */
    .trace-ok code { color: var(--bs-success); }
    .trace-fail code { color: var(--bs-danger); }
    /* Keep the response-body snippet and the sent payload neutral and readable. */
    .snippet code { color: var(--bs-body-color); }
</style>
