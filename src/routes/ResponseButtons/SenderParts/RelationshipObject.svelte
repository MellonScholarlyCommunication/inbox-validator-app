<script lang="ts">
    export let subjectId: string;
    export let relationshipId : string;
    export let objectId : string;
</script>

<div class="mb-3">
    <label for="notifSubject" class="form-label">Subject</label>
    <input 
        type="text" 
        class="form-control" 
        id="notifSubject" 
        bind:value={subjectId}
        placeholder="e.g. A subject URL"
        required
    />
</div>

<div class="mb-3">
    <label for="notifRelationship" class="form-label">Relationship</label>
    <input 
        type="text" 
        class="form-control" 
        id="notifRelationship" 
        bind:value={relationshipId}
        placeholder="e.g. A relationship URI"
        required
    />
</div>

<div class="mb-3">
    <label for="notifObject" class="form-label">Object</label>
    <input 
        type="text" 
        class="form-control" 
        id="notifObject"
        bind:value={objectId}
        placeholder="e.g. An object URL"
        required
    />
</div>

<div class="mb-3">
    <label for="notifAsObjectType" class="form-label">Type</label>
    <i>as:Relationship</i>
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