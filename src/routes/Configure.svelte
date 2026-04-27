<script lang="ts">
    import { link } from 'svelte-spa-router';
    import { defaultActor, defaultOrigin } from '../store';

    const AS = 'https://www.w3.org/ns/activitystreams#';
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

<h3>Configuration</h3>

<nav class="navbar">
    <a href="/" use:link class="btn btn-light text-decoration-none">&lt; BACK TO INBOX</a>
</nav>

<p>
    General configuration settings for sending notifications.
</p>

{#if $defaultActor && $defaultOrigin}
<form on:submit|preventDefault={handleSubmit}>
    <h5>Your Actor Identity</h5>
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
            placeholder="e.g. Location of your inbox"
            bind:value={$defaultActor.inbox} 
        />
    </div>
    
    </div>

    <h5>Your Origin Identity</h5>
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