<script lang="ts">
    import { asObjectTypes, sorgObjectTypes } from "../../../globals";

    export let objectId : string;
    export let ietfCiteAs : string;
    export let asObjectType : string;
    export let sorgObjectType : string;
</script>

<div class="mb-3">
    <label for="notifObject" class="form-label">Object</label>
    <input 
        type="text" 
        class="form-control" 
        id="notifObject"
        bind:value={objectId}
        placeholder="e.g. A resource URL"
        required
    />
</div>

<div class="mb-3">
    <label for="notifIETFCiteAs" class="form-label">Cite As</label>
    <input 
        type="text" 
        class="form-control" 
        id="notifIETFCiteAs" 
        bind:value={ietfCiteAs}
        placeholder="e.g. A citable resource URL"
    />
</div>

<div class="mb-3">
    <label for="notifAsObjectType" class="form-label">Type</label>
    <i>as:</i>
    <select bind:value={asObjectType} required>
    {#each asObjectTypes as option}
        <option value={option.iri}>{option.label}</option>
    {/each}
    </select>
    <i>sorg:</i>
    <select bind:value={sorgObjectType} required>
    {#each sorgObjectTypes as option}
        <option value={option.iri}>{option.label}</option>
    {/each}
    </select>
</div>

<style>
    label {
        font-weight: bold;
    }

    input:required,
    select:required {
        border-left: 3px solid red;
    }
</style>