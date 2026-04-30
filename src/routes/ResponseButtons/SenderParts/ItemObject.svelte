<script lang="ts">
    import { asObjectTypes, sorgObjectTypes } from "../../../globals";

    export let id : string;
    export let ietfCiteAs : string;
    export let asType : string;
    export let sorgType : string;
    export let itemId : string;
    export let itemMediaType : string;
    export let itemAsType : string;
    export let itemSorgType : string;

    if (! sorgType || sorgType.length == 0) {
        sorgType = "sorg:AboutPage";
    }

    $: itemRequired = itemId.trim() !== '';
</script>

<div class="mb-3">
    <label for="objectId" class="form-label">Id (landing page)</label>
    <input 
        type="text" 
        class="form-control" 
        id="objectId" 
        bind:value={id}
        placeholder="e.g. A resource landing page URL"
        required
    />
</div>

<details>
    <summary>More details</summary>


<div class="mb-3">
    <label for="ietfCiteAs" class="form-label">Cite As</label>
    <input 
        type="text" 
        class="form-control" 
        id="ietfCiteAs" 
        bind:value={ietfCiteAs}
        placeholder="e.g. A citable resource URL"
    />
</div>

<div class="mb-3">
    <label for="contextType" class="form-label">Type</label>
    <i>as:</i>
    <select bind:value={asType}>
        {#each asObjectTypes as option}
            <option value={option.iri}>{option.label}</option>
        {/each}
    </select>
    <i>sorg:</i>
    <select bind:value={sorgType}>
        {#each sorgObjectTypes as option}
            <option value={option.iri}>{option.label}</option>
        {/each}
    </select>
</div>

<div class="mb-3">
    <label for="objectItemId" class="form-label">Item (content resource)</label>
    <input 
        type="text" 
        class="form-control" 
        id="objectItemId" 
        bind:value={itemId}
        placeholder="e.g. A resource item URL"
    />
</div>
        
<div class="mb-3">
    <label for="objectItemMediaType" class="form-label">Media Type</label>
    <input 
        type="text" 
        class="form-control" 
        id="objectItemMediaType" 
        bind:value={itemMediaType}
        required={itemRequired}
        placeholder="e.g. A media type for the item"
    />
</div>

<div class="mb-3">
    <label for="objectItemType" class="form-label">Type</label>
    <i>as:</i>
    <select bind:value={itemAsType} required={itemRequired}>
        {#each asObjectTypes as option}
            <option value={option.iri}>{option.label}</option>
        {/each}
    </select>
    <i>sorg:</i>
    <select bind:value={itemSorgType} required={itemRequired}>
        {#each sorgObjectTypes as option}
            <option value={option.iri}>{option.label}</option>
        {/each}
    </select>
</div>

</details>

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