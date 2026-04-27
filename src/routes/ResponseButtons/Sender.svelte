<script lang="ts">
    import { notificationData, defaultActor, defaultOrigin } from '../../store';
    import { get } from 'svelte/store'; // Import store getter
    import { 
        type Notification, 
        type Agent,
        genUUID,
        sendNotification } from '../../inbox';
    import { createEventDispatcher } from 'svelte';
    import whooshUrl from '../../assets/woosh.mp3';

   
    export let notificationType = 'Accept';

    const AS    = 'https://www.w3.org/ns/activitystreams#';
    const dispatch = createEventDispatcher();

    // Check if we allow tentatives...
    let tentativeFlag = notificationType === 'Accept' ||
                        notificationType === 'Reject' ? true : false;
                        
    // Tentative fields
    let isTentative = false;
    let summary = "";

    // Read in the notification
    let notification : Notification = get(notificationData) as Notification;

    // Find out the right inbox to send notifications to...
    const inboxInit : string | undefined = notification.object?.origin?.inbox ?
            notification.object?.origin?.inbox :
            notification.object?.actor?.inbox;

    let inbox: string | undefined = inboxInit;

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

    function handleReset() {
        inbox = inboxInit;
    }

    const playWhoosh = () => {
        const audio = new Audio(whooshUrl);
        audio.volume = 0.5; // Optional: set volume between 0 and 1
        audio.play().catch(error => {
            // Browsers often block audio if the user hasn't interacted with the page yet
            console.error("Audio playback failed:", error);
        });
    };
    
    let showToast = false;
    let errorMessage = "";

    async function handleSubmit() {
        if (!inbox) {
            return;
        }

        let payload : any = {
            '@context': [
                "https://www.w3.org/ns/activitystreams",
                "https://coar-notify.net"
            ],
            'id': genUUID(),
            'type': notificationType,
            'actor': $defaultActor,
            'origin': $defaultOrigin,
            'object': notification.object,
            'target': notification.object?.actor
        }

        if (isTentative) {
            payload['type'] = 'Tentative' + notificationType;
            payload['summary'] = summary;
        }

        try {
            await sendNotification(inbox,payload); 
            dispatch('changeTab','Successfully Sent Notification!');
            playWhoosh();
        }
        catch (e: any) {
            showToast = true;
            errorMessage = e.message;
        }
    }
</script>

{#if showToast}
  <div class="toast-container position-fixed bottom-0 end-0 p-3">
    <div class="toast show align-items-center text-white bg-danger border-0" role="alert">
      <div class="d-flex">
        <div class="toast-body">
          {errorMessage}
        </div>
        <button 
          type="button" 
          class="btn-close btn-close-white me-2 m-auto" 
          on:click={() => showToast = false}>
        </button>
      </div>
    </div>
  </div>
{/if}

<h3>Send {notificationType} Notification</h3>

{#if tentativeFlag}
<div class="mb-3">
    <input class="form-check-input" type="checkbox" id="tentative" bind:checked={isTentative}>
    <label class="form-check-label" for="tentative">
        Tentative {notificationType} 
    </label>
</div>
{/if}

<form on:submit|preventDefault={handleSubmit}>
    <h3>To</h3>
    <div class="mb-3">
        <label for="notifInbox" class="form-label">Inbox</label>
        <input 
            type="text" 
            class="form-control" 
            id="notifId" 
            placeholder="e.g. NOTIF-001"
            bind:value={inbox} 
            required
        />
    </div>

    {#if notificationType === 'Announce'}
        <h3>What</h3>
        <div class="mb-3">
            <label for="notifObject" class="form-label">Object</label>
            <input 
                type="text" 
                class="form-control" 
                id="notifObject" 
                placeholder="e.g. An internet resource URL"
                required
            />
        </div>
    {/if}

    {#if isTentative}
        <div class="mb-3">
            <label class="form-label" for="summary"><b>Summary</b></label>
            <input 
                class="form-control" 
                type="text" 
                id="summary" 
                bind:value={summary}
                placeholder="Write a short summary why you tentative {notificationType.toLowerCase()} this notification."
                required>
        </div> 
    {/if}

    <div class="d-grid gap-2 d-md-flex justify-content-md-end">
        <button type="button" 
            class="btn btn-outline-secondary"
            on:click={handleReset}>Reset</button>
        <button type="submit" class="btn btn-primary">Send</button>
    </div>
</form>

<style>
    label {
        font-weight: bold;
    }
</style>