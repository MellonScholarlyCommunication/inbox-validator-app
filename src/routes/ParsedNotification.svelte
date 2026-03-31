<script lang="ts">
    import { type GenericObject } from "../inbox";
    import Agent from "./Agent.svelte";
    import Relationship from "./Relationship.svelte";
    import ParsedNotification from "./ParsedNotification.svelte";
    import Page from "./Page.svelte";
    export let object: GenericObject;
    
    function cleanNS(term: string) {
        if (term) {
            return term.replaceAll(/.*[\/#]/g,'');
        }
        else {
            return "";
        }
    }

    function requestType(types: string[]) {
        for (let i = 0 ; i < types.length ; i++) {
            switch (types[i]) {
                case 'https://www.w3.org/ns/activitystreams#Accept':
                    return "Response";
                case 'https://www.w3.org/ns/activitystreams#Announce':
                    return "Response";
                case 'https://www.w3.org/ns/activitystreams#Flag':
                    return "Response";
                case 'https://www.w3.org/ns/activitystreams#Offer':
                    return "Request";
                case 'https://www.w3.org/ns/activitystreams#Reject':
                    return "Request";
                case 'https://www.w3.org/ns/activitystreams#TentativeAccept':
                    return "Response";
                case 'https://www.w3.org/ns/activitystreams#TentativeReject':
                    return "Response";
                case 'https://www.w3.org/ns/activitystreams#Undo':
                    return "Request";
                default:
                    // Do nothing..next type
            }
        }
        return "Unknown";
    }
</script>

{#if object}
    <dl class="parsed-head">
    {#if object.actor}
        <dt>From</dt>
        <dd><Agent actor={object.actor}/></dd>
    {/if}
    {#if object.target}
        <dt>To</dt>
        <dd><Agent actor={object.target}/></dd>
    {/if}
    </dl>
    {#if object.type}
        <h4>{requestType(object.type)} : {object.type?.map(s => cleanNS(s)).join(" + ")}</h4>
    {:else}
        <h4>Body</h4>
    {/if}
    <dl>
        <dt></dt>
        <dd class="parsed-body" class:parsed-more={object.object?.kind === 'generic'}>
            {#if object.object?.kind === 'relationship' }
                <Relationship object={object.object}/>
            {:else if object.object?.kind === 'page'}
                <Page object={object.object}/>
            {:else if object.object?.kind === 'generic'}
                <ParsedNotification object={object.object}/>
            {/if}
        </dd>
        {#if object.inReplyTo} 
        <dt>In-Reply-To</dt>
        <dd>
            {object.inReplyTo}
        </dd>
        {/if}
        {#if object.context} 
        <dt>Context</dt>
        <dd>
            {object.context.id}
        </dd>
        {/if}
    </dl>
{/if}

<style>
  .parsed-head {
    background-color: #EEEEEE;
    padding: 4px;
  }
  .parsed-body {
    padding: 4px;
  }
  .parsed-more {
   border-left: 6px solid #ccc;
   padding-left: 10px;
   margin-left: 4px;
   color: #555;
  }
</style>