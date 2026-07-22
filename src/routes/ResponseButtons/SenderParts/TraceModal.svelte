<script lang="ts">
    import { createEventDispatcher } from 'svelte';
    import type { RelayTrace } from '../../../inbox';

    export let trace : RelayTrace | null;

    const dispatch = createEventDispatcher();
    const close = () => dispatch('close');

    const is2xx = (s : number) => s >= 200 && s < 300;
</script>

{#if trace}
<div class="modal-backdrop show"></div>
<div class="modal show d-block" tabindex="-1" role="dialog">
    <div class="modal-dialog modal-lg modal-dialog-scrollable" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">Delivery trace</h5>
                <button type="button" class="btn-close" aria-label="Close" on:click={close}></button>
            </div>
            <div class="modal-body">
                <p class="mb-1"><strong>Server contacted</strong></p>
                <p class="text-break"><code>{trace.target}</code></p>

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
                        <pre class="bg-light border rounded p-2 mb-0"><code>{trace.final.bodySnippet}</code></pre>
                    {/if}
                {:else}
                    <div class="alert alert-danger mb-0">
                        <strong>Delivery failed:</strong> {trace.error}
                    </div>
                {/if}
            </div>
            <div class="modal-footer">
                <button type="button" class="btn {trace.ok ? 'btn-primary' : 'btn-secondary'}" on:click={close}>
                    {trace.ok ? 'Done' : 'Close'}
                </button>
            </div>
        </div>
    </div>
</div>
{/if}
