<script lang="ts">
  import 'bootstrap/dist/css/bootstrap.min.css';
  import 'bootstrap/dist/js/bootstrap.bundle.min.js';
  import { defaultOptions} from "../store";
	import { listInbox, getNotification } from "../inbox";
  import { AS } from "../globals";

  let inbox = "";

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

  // Same colours as the reply buttons (Notification.svelte, New.svelte)
  const TYPE_COLORS : Record<string, string> = {
    Offer: 'primary',
    Accept: 'info',
    TentativeAccept: 'info',
    Reject: 'warning',
    TentativeReject: 'warning',
    Flag: 'danger',
    Announce: 'success',
    Undo: 'warning'
  };

  function badgeClass(type?: string) : string {
    const color = type && TYPE_COLORS[type];
    return color ? `bg-white border border-${color} text-${color}-emphasis` : 'bg-white border text-secondary';
  }

  function formatDate(iso?: string) : string {
    if (!iso) return "--";
    const d = new Date(iso);
    const pad = (n: number) => String(n).padStart(2, "0");
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
  }

  interface InboxError {
    title: string;
    hint: string;
  }

  // fetch() rejects with a TypeError on network and CORS failures; listInbox
  // throws plain Errors for HTTP statuses and unparseable responses.
  function describeError(error: unknown) : InboxError {
    const message = error instanceof Error ? error.message : String(error);
    if (error instanceof TypeError) {
      return {
        title: 'No LDN inbox service found',
        hint: 'The server could not be reached. Check that the inbox service is running, that the address is correct and that it allows cross-origin (CORS) requests.'
      };
    }
    if (message.startsWith('HTTP error')) {
      return {
        title: 'Inbox not available',
        hint: `The server answered with ${message.replace('HTTP error: ', 'HTTP ')}. Check that the address points to an LDN inbox.`
      };
    }
    return {
      title: 'Not an LDN inbox',
      hint: 'The server answered, but not with an LDN inbox (an LDP container in JSON-LD or Turtle).'
    };
  }

  let inboxPromise = listInbox(inbox);

</script>

{#await inboxPromise}
  <p>Loading {inbox}...</p>
{:then notifications} 
<h3>{inbox}</h3>
<table class="table table-hover table-sm mb-0 inbox-table">
  <thead class="text-muted small text-uppercase">
    <tr>
      <th class="col-type">Type</th>
      <th>Name</th>
      <th>Actor</th>
      <th class="col-size text-end">Size</th>
      <th class="col-date">Modified</th>
    </tr>
  </thead>

  {#if notifications}
  <tbody>
    {#each notifications as member}
      {@const meta = loadMeta(member.name)}
      <tr>
        <td>
          {#await meta}
            <span class="badge rounded-pill type-badge {badgeClass()}">…</span>
          {:then meta}
            <span class="badge rounded-pill type-badge {badgeClass(meta.type)}" title={meta.type}>{meta.type ?? "--"}</span>
          {:catch}
            <span class="badge rounded-pill type-badge {badgeClass()}">--</span>
          {/await}
        </td>
        <td class="text-truncate" title={member.name}><a href="#/notification/{member.name}">{member.name}</a></td>
        {#await meta}
          <td class="text-muted text-truncate"><span class="text-secondary">…</span></td>
        {:then meta}
          <td class="text-muted text-truncate" title={meta.actor}>{meta.actor ?? "--"}</td>
        {:catch}
          <td class="text-muted text-truncate">--</td>
        {/await}
        <td class="text-end text-muted">{ member.size ?? "--"}</td>
        <td class="text-muted text-nowrap" title={member.date}>{formatDate(member.date)}</td>
      </tr>
    {/each}
  </tbody>
  {/if}
</table>
{:catch error}
  {@const info = describeError(error)}
  <div class="alert alert-danger mt-3" role="alert">
    <h4 class="alert-heading h5">{info.title}</h4>
    <p class="mb-2">Could not open the inbox at <code>{inbox}</code>.</p>
    <p class="mb-3">{info.hint}</p>
    <div class="d-flex flex-wrap gap-2">
      <button type="button" class="btn btn-sm btn-outline-danger" on:click={() => inboxPromise = listInbox(inbox)}>Try again</button>
      <a href="#/configure" class="btn btn-sm btn-outline-secondary">Change the Main inbox</a>
    </div>
    <details class="mt-3 small">
      <summary>Technical details</summary>
      <code>{error}</code>
    </details>
  </div>
{/await}

<style>
.table {
    margin-top: 30px;
}
.inbox-table {
    table-layout: fixed;
}
.col-type {
    width: 130px;
}
.col-size {
    width: 70px;
}
.col-date {
    width: 150px;
}
.type-badge {
    display: block;
    overflow: hidden;
    text-overflow: ellipsis;
    font-weight: 500;
}
</style>