<script lang="ts">
    import { type Agent } from "../inbox";
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

    let actor : Agent = {
        id: "http://generic.service.org",
        type: "https://www.w3.org/ns/activitystreams#Person",
        name: "My Lovely Service",
        inbox: undefined
    };

    let origin : Agent = {
        id: "http://generic.service.org/service",
        type: "https://www.w3.org/ns/activitystreams#Service",
        name: "My Lovely Service Software",
        inbox: undefined
    };

    function handleSubmit() {}
</script>

<h3>Configuration</h3>

<p>
    General configuration settings for sending notifications.
</p>

<form on:submit|preventDefault={handleSubmit}>
    <h5>Your Actor Identity</h5>
    <div class="mb-3">
        <label for="actorId" class="form-label">Id</label>
        <input 
            type="text" 
            class="form-control" 
            id="actorId" 
            placeholder="e.g. A unique id for your organization"
            bind:value={actor.id} 
            required
        />
    </div>

    <div class="mb-3">
        <label for="actorName" class="form-label">Name</label>
        <input 
            type="text" 
            class="form-control" 
            id="actorName"
            placeholder="e.g. Name of your organization"
            bind:value={actor.name} 
        />
    </div>

    <div class="mb-3">
    <label for="actorType" class="form-label">Type</label>
    <select 
        id="actorType" 
        class="form-select" 
        bind:value={actor.type}
    >
        <option disabled value="">Choose a type...</option>
        {#each categories as category}
            <option value={category.iri}>
                {category.label}
            </option>
        {/each}
        </select>
    </div>

    <h5>Your Origin Identity</h5>
    <div class="mb-3">
        <label for="originId" class="form-label">Id</label>
        <input 
            type="text" 
            class="form-control" 
            id="originId" 
            placeholder="e.g. A unique id for your organization"
            bind:value={origin.id} 
            required
        />
    </div>

    <div class="mb-3">
        <label for="originName" class="form-label">Name</label>
        <input 
            type="text" 
            class="form-control" 
            id="originName"
            placeholder="e.g. Name of your organization"
            bind:value={origin.name} 
        />
    </div>

    <div class="mb-3">
    <label for="originType" class="form-label">Type</label>
    <select 
        id="originType" 
        class="form-select" 
        bind:value={origin.type}
    >
        <option disabled value="">Choose a type...</option>
        {#each categories as category}
            <option value={category.iri}>
                {category.label}
            </option>
        {/each}
        </select>
    </div>
</form>