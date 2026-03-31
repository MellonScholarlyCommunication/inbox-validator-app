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

    function requestIcon(types: string[]) {
        for (let i = 0 ; i < types.length ; i++) {
            switch (types[i]) {
                case 'https://www.w3.org/ns/activitystreams#Accept':
                    return "&#9989;";
                case 'https://www.w3.org/ns/activitystreams#Announce':
                    return "&#128227;";
                case 'https://www.w3.org/ns/activitystreams#Flag':
                    return "&#128681;";
                case 'https://www.w3.org/ns/activitystreams#Offer':
                    return "&#127873;";
                case 'https://www.w3.org/ns/activitystreams#Reject':
                    return "&#128683;";
                case 'https://www.w3.org/ns/activitystreams#TentativeAccept':
                    return "&#9989;";
                case 'https://www.w3.org/ns/activitystreams#TentativeReject':
                    return "&#128683;";
                case 'https://www.w3.org/ns/activitystreams#Undo':
                    return "&#x238C;";
                default:
                    // Do nothing..next type
            }
        }
        return "&#129335;";
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
    {#if object.type && object.type.length > 0}
        <h4>{@html requestIcon(object.type)} {requestType(object.type)} : {object.type?.map(s => cleanNS(s)).join(" + ")}</h4>
    {:else}
        <h4>Body</h4>
    {/if}
    <dl class="parsed-body">
        <dt></dt>
        <dd class:parsed-more={object.object?.kind === 'generic'}>
            {#if object.object?.kind === 'relationship' }
                <Relationship object={object.object}/>
            {:else if object.object?.kind === 'page'}
                <Page object={object.object}/>
            {:else if object.object?.kind === 'generic'}
                <ParsedNotification object={object.object}/>
            {:else if object.id}
                <i>Unprocessable</i>
            {/if}
        </dd>
        {#if object.summary}
            <dt>Summary</dt>
            <dd>
                {object.summary}
            </dd>
        {/if}
        {#if object.inReplyTo} 
            <dt>In-Reply-To</dt>
            <dd>
                {object.inReplyTo}
            </dd>
        {/if}
        {#if object.context} 
            <dt>Context</dt>
            <dd>
                <a href={object.context.id}>{object.context.id}</a>
            </dd>
        {/if}
    </dl>
{/if}

<style>
  .parsed-head {
    background-color: #EEEEEE;
    padding: 4px;
  }

  .parsed-head dt {
    display: inline-block;
    width: 10%; /* Or a fixed px width */
    font-weight: bold;
    vertical-align: top;
  }

  .parsed-head dd {
    display: inline-block;
    width: 85%; /* Ensure total width is < 100% to account for whitespace */
    margin: 0;
    vertical-align: top;
  }

  .parsed-body dt {
    display: inline-block;
    width: 10%; /* Or a fixed px width */
    font-weight: bold;
    vertical-align: top;
  }

  .parsed-body dd {
    display: inline-block;
    width: 85%; /* Ensure total width is < 100% to account for whitespace */
    margin: 0;
    vertical-align: top;
  }

  .parsed-more {
   border-left: 6px solid #ccc;
   padding-left: 10px;
   margin-left: 4px;
   color: #555;
  }
</style>