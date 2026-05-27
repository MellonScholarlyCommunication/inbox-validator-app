<script lang="ts">
    import { AS } from "../../../globals";
    import { listInbox , getNotification , type Notification } from "../../../inbox";
    import { defaultOptions } from "../../../store";

    export let notification : Notification | undefined = undefined;
    export let targetInbox : string | undefined = undefined;
    export let targetId : string | undefined = undefined;
    export let targetName : string | undefined = undefined;
    export let targetType : string | undefined = undefined;

    const inbox = $defaultOptions?.inboxUrl ?? "";

    // When an Offer is selected, fill in the target from the Offer's target
    $: if (notification) {
        targetId    = notification.object?.target?.id ?? "";
        targetName  = notification.object?.target?.name ?? "";
        targetType  = notification.object?.target?.type?.replace(AS, "") ?? "";
        targetInbox = $defaultOptions.inboxUrl.length ?
            $defaultOptions.inboxUrl :
                notification.object?.target?.inbox ?? "";
    }

    async function loadOffers() : Promise<Notification[]> {
        const members = await listInbox(inbox);

        const notifications = await Promise.all(
            members.map(member => getNotification(inbox + member.name))
        );

        return notifications.filter(
            n => n.object?.type?.includes(AS + 'Offer')
        );
    }

    function offerFrom(offer: Notification) {
        return offer.object?.actor?.name ?? offer.object?.actor?.id ?? "unknown";
    }

    function offerTo(offer: Notification) {
        return offer.object?.target?.name ?? offer.object?.target?.id ?? "unknown";
    }

    function offerTypes(offer: Notification) {
        return offer.object?.type?.map(t => t.replace(/.*[\/#]/g, "")).join(", ") ?? "";
    }

    function offerObject(offer: Notification) {
        return offer.object?.object?.id;
    }
</script>

{#await loadOffers()}
  <p>Loading {inbox}...</p>
{:then offers}
  {#if offers.length}
    Choose one Offer:
    <div class="list-group">
      {#each offers as offer}
        <label class="list-group-item d-flex gap-2">
          <input
            class="form-check-input flex-shrink-0 mt-1"
            type="radio"
            name="previousOffer"
            value={offer}
            bind:group={notification}/>
          <span>
            <span class="fw-bold">{offerFrom(offer)} &rarr; {offerTo(offer)}</span>
            {#if offerObject(offer)} 
              <small class="d-block">{offerObject(offer)}</small>
            {/if}
            {#if offerTypes(offer)}
              <small class="d-block text-muted">{offerTypes(offer)}</small>
            {/if}
            <small class="d-block text-muted text-break">{offer.object?.id}</small>
          </span>
        </label>
      {/each}
    </div>
    <small>In the demo we use existing Offers from the Inbox. In a production system you would need to choose and Offer from previously sent notifications.</small>
  {:else}
    <p>No previous offers found in {inbox}</p>
  {/if}
{:catch error}
  <p class="error">Failed to load {inbox}</p>
  <p>{error}</p>
{/await}
