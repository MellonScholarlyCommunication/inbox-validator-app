<script lang="ts">
    import { link } from 'svelte-spa-router';
    import { defaultActor, defaultOrigin, defaultOptions } from '../store';
    import { AS } from '../globals';

    // Possible actor types (limited for now)...
    interface Category {
        iri: string;
        label: string;
    }

    const categories : Category[] = [
        { iri: `${AS}Person`, label: 'Person' },
        { iri: `${AS}Organization`, label: 'Organization' },
        { iri: `${AS}Service`, label: 'Service' }
    ];

    function handleSubmit() {
        console.log("Saving:", $defaultActor, $defaultOrigin);
    }
</script>

<h3>Settings</h3>

<nav class="navbar">
    <a href="/" use:link class="btn btn-light text-decoration-none">&lt; BACK TO INBOX</a>
</nav>

<p>
    General configuration settings for reading, sending and receiving notifications.
</p>

{#if $defaultActor && $defaultOrigin && $defaultOptions}
<form on:submit|preventDefault={handleSubmit}>
    <div id="myOptions">
        <div class="mb-3">
            <label for="inboxUrl" class="form-label">Main inbox</label>
            <input
                type="text"
                class="form-control"
                id="inboxUrl"
                placeholder="e.g. Location of the main inbox"
                aria-describedby="inboxUrlHelp"
                bind:value={$defaultOptions.inboxUrl}
            />
            <div id="inboxUrlHelp" class="form-text">
                The main inbox that will be used to by this application.
            </div>
        </div>

        <div class="mb-3">
            <label for="validationUrl" class="form-label">Validator endpoint</label>
            <input
                type="text"
                class="form-control"
                id="validationUrl"
                placeholder=""
                aria-describedby="validationUrlHelp"
                bind:value={$defaultOptions.validatorUrl}
            />
            <div id="validationUrlHelp" class="form-text">
                The location of the SHACL/JSON-Schema validator REST API.
            </div>
        </div>

        <div class="mb-3">
            <label for="preferredTargetInbox" class="form-label">Default reply inbox</label>
            <input
                type="text"
                class="form-control"
                id="preferredTargetInbox"
                placeholder="e.g. Location a test inbox"
                aria-describedby="preferredTargetInboxHelp"
                bind:value={$defaultOptions.preferredTargetInbox}
            />
            <div id="preferredTargetInboxHelp" class="form-text">
                Overrides the inbox discovered for the recipient, sending all replies here instead. Useful for testing against a local inbox.
            </div>
        </div>

        <div class="mb-3">
            <label for="relayUrl" class="form-label">Relay endpoint</label>
            <input
                type="text"
                class="form-control"
                id="relayUrl"
                placeholder="e.g. http://localhost:5052/relay/"
                aria-describedby="relayUrlHelp"
                bind:value={$defaultOptions.relayUrl}
            />
            <div id="relayUrlHelp" class="form-text">
                Where to POST for server-side forwarding to registered receivers. Leave blank to send directly from the browser.
            </div>
        </div>

        <div class="mb-3">
            <label for="relayToken" class="form-label">Relay token</label>
            <input
                type="password"
                class="form-control"
                id="relayToken"
                placeholder=""
                aria-describedby="relayTokenHelp"
                bind:value={$defaultOptions.relayToken}
            />
            <div id="relayTokenHelp" class="form-text">
                Bearer token issued by the relay operator. Only used when a relay endpoint is set.
            </div>
        </div>
    </div>

    <h5>Your Actor Identity</h5>
    <small>Set the your identity when sending notifications.</small>
    <div id="actorConfig">
    <div class="mb-3">
        <label for="actorId" class="form-label">Id</label>
        <input 
            type="text" 
            class="form-control" 
            id="actorId" 
            placeholder="e.g. A unique id for your organization"
            bind:value={$defaultActor.id} 
            required
        />
    </div>

    <div class="mb-3">
    <label for="actorType" class="form-label">Type</label>
    <select 
        id="actorType" 
        class="form-select" 
        bind:value={$defaultActor.type}
    >
        <option disabled value="">Choose a type...</option>
        {#each categories as category}
            <option value={category.iri}>
                {category.label}
            </option>
        {/each}
        </select>
    </div>

    <div class="mb-3">
        <label for="actorName" class="form-label">Name</label>
        <input 
            type="text" 
            class="form-control" 
            id="actorName"
            placeholder="e.g. Name of your organization"
            bind:value={$defaultActor.name} 
        />
    </div>

    <div class="mb-3">
        <label for="actorInbox" class="form-label">Inbox</label>
        <input 
            type="text" 
            class="form-control" 
            id="actorName"
            placeholder="e.g. Location of your personal inbox"
            bind:value={$defaultActor.inbox} 
        />
    </div>
    
    </div>

    <h5>Your Origin Identity</h5>
    <small>Set the your origin identity when sending notifications. The origin is the program or service that sends and receives notifications.</small>

    <div id="originConfig">
    <div class="mb-3">
        <label for="originId" class="form-label">Id</label>
        <input 
            type="text" 
            class="form-control" 
            id="originId" 
            placeholder="e.g. A unique id for your organization"
            bind:value={$defaultOrigin.id} 
            required
        />
    </div>

    <div class="mb-3">
    <label for="originType" class="form-label">Type</label>
    <select 
        id="originType" 
        class="form-select" 
        bind:value={$defaultOrigin.type}
    >
        <option disabled value="">Choose a type...</option>
        {#each categories as category}
            <option value={category.iri}>
                {category.label}
            </option>
        {/each}
        </select>
    </div>

    <div class="mb-3">
        <label for="originName" class="form-label">Name</label>
        <input 
            type="text" 
            class="form-control" 
            id="originName"
            placeholder="e.g. Name of your organization"
            bind:value={$defaultOrigin.name} 
        />
    </div>

    <div class="mb-3">
        <label for="originInbox" class="form-label">Inbox</label>
        <input 
            type="text" 
            class="form-control" 
            id="originInbox"
            placeholder="e.g. Location of your inbox"
            bind:value={$defaultOrigin.inbox} 
        />
    </div>

    </div>

    <div class="d-grid gap-2 d-md-flex justify-content-md-end">
        <button type="submit" class="btn btn-primary">Save</button>
    </div>
</form>
{/if}

<style>
    #actorConfig {
        padding: 16px;
        border: 1px solid #cccccc;
        border-radius: 15px;
        margin-bottom: 10px;
    }
    #originConfig {
        padding: 16px;
        border: 1px solid #cccccc;
        border-radius: 15px;
        margin-bottom: 10px;        
    }

    label {
        font-weight: bold;
    }
</style>