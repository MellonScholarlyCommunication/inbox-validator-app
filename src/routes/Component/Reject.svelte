<script lang="ts">
    let isTentative = false;

    async function handlePreview() {
    }

    async function handleCancel() {

    }
</script>

<h3>Reject Notification</h3>

<div class="mb-3">
    <input class="form-check-input" type="checkbox" id="tentativeReject" bind:checked={isTentative}>
    <label class="form-check-label" for="tentativeReject">
        Tentative Reject
    </label>
</div>

{#if isTentative}
    <div class="mb-3">
        <label class="form-label" for="summary"><b>Summary</b></label>
        <input class="form-control" type="text" id="summary" placeholder="Write a short summary why you tentative reject this notification.">
    </div> 
{/if}

<button class="btn btn-success" on:click={handlePreview}>Preview</button>
<button class="btn btn-light" on:click={handleCancel}>Cancel</button>