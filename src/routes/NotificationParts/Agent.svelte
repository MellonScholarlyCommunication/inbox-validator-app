<script lang="ts">
    import { defaultActor, defaultOrigin } from '../../store';
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

<div class="actor {( actor.id === $defaultActor.id || actor.id === $defaultOrigin.id) ? 'actor_you' : 'actor_else'}">
{#if actor}
    [{cleanNS(actor.type)}] {#if actor.name !== undefined} 
        {actor.name}
    {/if}
    (<a href={actor.id}>{actor.id}</a>)
{/if}

{#if actor.id === $defaultActor.id}
 (👈 that is you)
{/if}
</div>

<style>
    .actor_you {
        color:green;
        font-weight: bold;
    }
    .actor_you a {
        font-weight: normal;
        color: green;
    }
    .actor_else a {
        color: black;
    }
</style>