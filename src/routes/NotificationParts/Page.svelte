<script lang="ts">
    import { type PageObject } from '../../inbox';
    export let object : PageObject;

    function cleanNS(term: string) {
        if (term) {
            return term.replaceAll(/.*[\/#]/g,'');
        }
        else {
            return "";
        }
    }
</script>

{#if object}
    <dl>
        <dt>Id</dt>
        <dd><a href={object.id}>{object.id}</a></dd>
        <dt>Type</dt>
        <dd>{object.type?.map(s => cleanNS(s)).join(" + ")}</dd>
        {#if object.citeAs}
            <dt>Cite-As</dt>
            <dd><a href={object.citeAs}>{object.citeAs}</a></dd>
        {/if}
        {#if object.item}
            <dt>Item</dt>
            <dd class="page-item">
                <dl>
                    <dt>Id</dt>
                    <dd>
                        <a href={object.item.id}>{object.item.id}</a>
                        {#if object.item.warning}
                            <span class="item-warning" role="img" aria-label={object.item.warning} data-tip={object.item.warning}>⚠️</span>
                        {/if}
                    </dd>
                    <dt>Type</dt>
                    <dd>{object.item.type?.map(s => cleanNS(s)).join(" + ")}</dd>
                    <dt>Media-Type</dt>
                    <dd>{object.item.mediaType}</dd>
                </dl>
            </dd>
        {/if}
    </dl>
{/if}

<style>
  .page-item {
    padding-left: 25px;
  }

  .item-warning {
    position: relative;
    cursor: help;
  }

  .item-warning:hover::after {
    content: attr(data-tip);
    position: absolute;
    left: 0;
    top: 1.6em;
    z-index: 10;
    width: max-content;
    max-width: 24rem;
    padding: 6px 8px;
    border-radius: 4px;
    background-color: #333;
    color: #fff;
    font-size: 0.85rem;
    white-space: normal;
  }
</style>