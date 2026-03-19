<script lang="ts">
	import { listInbox , type Member } from "../inbox";

	//let inbox = "http://localhost:3001/inbox/";
	let inbox = "https://patrickhochstenbach.net/";

</script>

{#await listInbox(inbox)}
  <p>Loading {inbox}...</p>
{:then notifications} 
<h3>{inbox}</h3>
<table class="table table-hover table-sm mb-0">
  <thead class="text-muted small text-uppercase">
    <tr>
      <th class="type-width">Type</th>
      <th>Name</th>
      <th class="text-end">Size</th>
      <th>Modified</th>
    </tr>
  </thead>

  {#if notifications}
  <tbody>
    {#each notifications as member}
      <tr>
        <td>
          <span class="member-icon icon-txt">
            {#if member.mimeType}
              {#if member.mimeType === 'application/ld+json'}
              JSON-LD
              {:else if member.mimeType === 'application/json'}
              JSON
              {:else if member.mimeType === 'text/turtle'}
              TURTLE
              {:else}
              OTHER
              {/if}
            {:else}
              OTHER
            {/if}
          </span>
        </td>
        <td><a href="#/notification/{member.name}">{member.name}</a></td>
        <td class="text-end text-muted">{ member.size ?? "--"}</td>
        <td class="text-muted">{ member.date ?? "--"}</td>
      </tr>
    {/each}
  </tbody>
  {/if}
</table>
{:catch error}
  <p>Failed to load {inbox}</p>
{/await}

<style>
.type-width {
    width: 80px;
}
.table {
    margin-top: 30px;
}
</style>