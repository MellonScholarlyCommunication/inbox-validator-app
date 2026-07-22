<script lang="ts">
  import 'bootstrap/dist/css/bootstrap.min.css';
  import 'bootstrap/dist/js/bootstrap.bundle.min.js';
  import { defaultOptions} from "../store";
	import { listInbox, getNotification } from "../inbox";
  import { AS } from "../globals";

  let inbox : string;

  if ($defaultOptions) {
	  inbox = $defaultOptions.inboxUrl;
  }

  // Lazily fetch a member's notification once and pull out the bits the list
  // shows (the AS2 activity type and the actor id); failures resolve to empty.
  async function loadMeta(name: string) : Promise<{ type?: string; actor?: string }> {
    try {
      const notification = await getNotification(inbox + name);
      return {
        type: mainType(notification.object?.type),
        actor: notification.object?.actor?.id
      };
    }
    catch {
      return {};
    }
  }

  // The activity's main AS2 type (e.g. Announce, Offer), stripped of its namespace.
  function mainType(types?: string[]) : string | undefined {
    const as2 = types?.find(t => t.startsWith(AS));
    return as2 ? as2.replace(AS, "") : undefined;
  }

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
      <th>Actor</th>
      <th class="text-end">Size</th>
      <th>Modified</th>
    </tr>
  </thead>

  {#if notifications}
  <tbody>
    {#each notifications as member}
      {@const meta = loadMeta(member.name)}
      <tr>
        <td>
          <span class="member-icon icon-txt">
            {#await meta}
              <span class="text-secondary">…</span>
            {:then meta}
              {meta.type ?? "--"}
            {:catch}
              --
            {/await}
          </span>
        </td>
        <td><a href="#/notification/{member.name}">{member.name}</a></td>
        <td class="text-muted">
          {#await meta}
            <span class="text-secondary">…</span>
          {:then meta}
            {meta.actor ?? "--"}
          {:catch}
            --
          {/await}
        </td>
        <td class="text-end text-muted">{ member.size ?? "--"}</td>
        <td class="text-muted">{ member.date ?? "--"}</td>
      </tr>
    {/each}
  </tbody>
  {/if}
</table>
{:catch error}
  <p class="error">Failed to load {inbox}</p>
  <p>{error}</p>
{/await}

<style>
.type-width {
    width: 80px;
}
.table {
    margin-top: 30px;
}
.error {
    color: #dc3545;          /* Bootstrap's danger red */
    background-color: #f8d7da;
    border: 1px solid #f5c2c7;
    border-radius: 0.375rem;
    padding: 0.75rem 1rem;
    margin-top: 1rem;
}
</style>