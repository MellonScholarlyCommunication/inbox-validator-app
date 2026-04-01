<script lang="ts">
    import { type Agent } from "../../inbox";
    export let actor : Agent;

    function cleanNS(term: string) {
        if (term) {
            return term.replaceAll(/.*[\/#]/g,'');
        }
        else {
            return "";
        }
    }
</script>

{#if actor}
    [{cleanNS(actor.type)}] {#if actor.name !== undefined} 
        {actor.name}
    {/if}
    (<a href={actor.id}>{actor.id}</a>)
{/if}