<script lang="ts">
    import { asObjectTypes } from "../../../globals";
    export let inbox : string;
    export let targetId : string;
    export let targetName : string;
    export let targetType : string;

    if (! targetType || targetType.length == 0) {
        targetType = "Service";
    }
</script>

<div class="mb-3">
    <label for="notifInbox" class="form-label">Inbox</label>
    <input 
        type="text" 
        class="form-control" 
        id="notifId" 
        placeholder="e.g. An LDN Inbox URL"
        bind:value={inbox} 
        required
    />
</div>

{#if targetId.length && targetType.length}
<details>
    <summary>More details</summary>

    <div class="mb-3">
        <label for="notifTargetId" class="form-label">Id</label>
        <input 
            type="text" 
            class="form-control" 
            id="notifTargetId" 
            placeholder="e.g. A target URI"
            bind:value={targetId} 
            required
        />
    </div>

    <div class="mb-3">
        <label for="notifTargetName" class="form-label">Name</label>
        <input 
            type="text" 
            class="form-control" 
            id="notifTargetName" 
            placeholder="e.g. A target name"
            bind:value={targetName} 
        />
    </div>

    <div class="mb-3">
        <label for="notifTargetType" class="form-label">Type</label>
        <i>as:</i>
        <select bind:value={targetType} required>
            {#each asObjectTypes as option}
                <option value={option.iri}>{option.label}</option>
            {/each}
        </select> 
    </div>
</details>
{:else}
    <!-- fields still need to render when condition is false -->
    <div class="mb-3">
        <label for="notifTargetId" class="form-label">Id</label>
        <input 
            type="text" 
            class="form-control" 
            id="notifTargetId" 
            placeholder="e.g. A target URI"
            bind:value={targetId} 
            required
        />
    </div>

    <div class="mb-3">
        <label for="notifTargetName" class="form-label">Name</label>
        <input 
            type="text" 
            class="form-control" 
            id="notifTargetName" 
            placeholder="e.g. A target name"
            bind:value={targetName} 
        />
    </div>

    <div class="mb-3">
        <label for="notifTargetType" class="form-label">Type</label>
        <i>as:</i>
        <select bind:value={targetType} required>
            {#each asObjectTypes as option}
                <option value={option.iri}>{option.label}</option>
            {/each}
        </select> 
    </div>
{/if}

<style>
    details {
        margin-bottom: 10px;
    }
    
    label {
        font-weight: bold;
    }

    input:required,
    select:required {
        border-left: 3px solid red;
    }
</style>