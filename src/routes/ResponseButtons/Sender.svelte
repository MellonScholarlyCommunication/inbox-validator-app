<script lang="ts">
    import { notificationData, defaultActor, defaultOrigin } from '../../store';
    import { get } from 'svelte/store'; // Import store getter
    import { 
        type Notification,
        type PageObject, 
        genUUID,
        sendNotification } from '../../inbox';
    import { createEventDispatcher } from 'svelte';
    import whooshUrl from '../../assets/woosh.mp3';
    import { 
        AS, COAR_NOTIFY, SORG, 
        announceTypes, asObjectTypes, sorgObjectTypes
    } from '../../globals';
    import To from './SenderParts/To.svelte';
    import ItemObject from './SenderParts/ItemObject.svelte';
    import RelationshipObject from './SenderParts/RelationshipObject.svelte';
    import ServiceResultObject from './SenderParts/ServiceResultObject.svelte';
   
    export let notificationType = 'Accept';

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

    let inbox: string = inboxInit ?? "";

    // Possible announce types
    let addedNotificationType: string = '';

    if (notification.object?.type?.includes(`${COAR_NOTIFY}ReviewAction`)) {
        addedNotificationType = 'coar-notify:ReviewAction';
    }
    else if (notification.object?.type?.includes(`${COAR_NOTIFY}EndorsementAction`)) {
        addedNotificationType = 'coar-notify:EndorsementAction';
    }
    else {
        addedNotificationType = '';
    }

    // Possible AS object type
    let asObjectType: string = "Page";

    if (addedNotificationType === 'coar-notify:RelationshipAction') {
        asObjectType = 'Relationship';
    }

    // Possible sorg object type
    let sorgObjectType = 'sorg:WebPage';

    // Possible as:object
    let objectId : string = "";

    // Possible as:relationship
    let relationshipId : string = "";

    // Possible as:subject
    let subjectId : string = "";

    // Possible ietf:cite-as
    let ietfCiteAs : string = "";

    // Possible context
    let contextId : string = "";
    let contextIetfCiteAs : string = "";
    let contextAsType : string = "Page";
    let contextSorgType : string = "AboutPage";
    let contextItemId : string = "";
    let contextItemMediaType : string = "";
    let contextItemAsType : string = "";
    let contextItemSorgType : string = "";
    $: contextItemRequired = contextItemId.trim() !== '';

    // Possible target
    let targetId : string = notification.object?.target?.id ?? "";
    let targetName : string = notification.object?.target?.name ?? "" ;
    let targetType : string = notification.object?.target?.type.replace(AS,"") ?? "";

    if (notification.object?.object) {
        const obj = notification.object.object;
        if (obj.id) {
            contextId = obj.id;
        }
        if ( (obj as PageObject).citeAs ) {
            contextIetfCiteAs = (obj as PageObject).citeAs!;
        }
        if (obj.type && obj.type.some( item => item.startsWith(AS))) {
            const item = obj.type.find( item => item.startsWith(AS) )?.replaceAll(AS,"");
            if (item) {
                contextAsType = item;
            }
        }
        if (obj.type && obj.type.some( item => item.startsWith(SORG))) {
            const item = obj.type.find( item => item.startsWith(SORG) )?.replaceAll(SORG,"sorg:");
            if (item) {
                contextSorgType = item;
            }
        }
        if ( (obj as PageObject).item?.id ) {
            contextItemId = (obj as PageObject).item?.id!;
        }
        if ( (obj as PageObject).item?.mediaType ) {
            contextItemMediaType = (obj as PageObject).item?.mediaType!;
        }
        if ( (obj as PageObject).item?.type && (obj as PageObject).item?.type?.some( item => item.startsWith(AS))) {
            const item = (obj as PageObject).item?.type?.find( item => item.startsWith(AS) )?.replaceAll(AS,"");
            if (item) {
                contextItemAsType = item;
            }
        }
        if ( (obj as PageObject).item?.type && (obj as PageObject).item?.type?.some( item => item.startsWith(SORG))) {
            const item = (obj as PageObject).item?.type?.find( item => item.startsWith(SORG) )?.replaceAll(SORG,"sorg:");
            if (item) {
                contextItemSorgType = item;
            }
        }
    }

    function handleReset() {
        inbox = inboxInit ?? "";
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
        try {
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

            if (targetId.length) {
                payload['target'] = { id: targetId };
                if (targetName.length) {
                    payload['target']['name'] = targetName;
                }
                if (targetName.length) {
                    payload['target']['type'] = targetType;
                }
            }

            if (notificationType === 'Announce') {
                if (addedNotificationType === 'coar-notify:RelationshipAction') {
                    let announceObject : any = { 
                        id: genUUID(),
                        type: 'Relationship',
                        "as:subject": subjectId,
                        "as:relationship": relationshipId,
                        "as:object": objectId
                    };

                    payload['object'] = announceObject;

                    payload['type'] = [ 'Announce' , 'coar-notify:RelationshipAction' ];
                }
                else {
                    let announceObject : any = { 
                        id: objectId,
                        type: [ asObjectType , sorgObjectType ]
                    };

                    if (ietfCiteAs) {
                        announceObject['ietf:cite-as'] = ietfCiteAs;
                    }

                    payload['object'] = announceObject;

                    if (addedNotificationType !== '') {
                        payload['type'] = [ 'Announce' , addedNotificationType ];
                    }
                }    

                if (contextId.length) {
                    payload['context'] = { 
                        id : contextId,
                        type: [ contextAsType , contextSorgType ]
                    };

                    if (contextIetfCiteAs.length) {
                        payload['context']['ietf:cite-as'] = contextIetfCiteAs;
                    }

                    if (contextItemId.length) {
                        if (contextItemMediaType.length &&
                            contextItemAsType.length && 
                            contextItemSorgType.length) {
                            payload['context']['ietf:item'] = {
                                id: contextItemId ,
                                mediaType: contextItemMediaType ,
                                type: [ contextItemAsType , contextItemSorgType ]
                            };
                        }
                        else {
                            throw new Error("Context item needs a mediaType and an as:+sorg type")
                        }
                    }
                }
            }

            if (isTentative) {
                payload['type'] = 'Tentative' + notificationType;
            }

            if (isTentative || notificationType === 'Flag') {
                payload['summary'] = summary;
            }

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

{#if notificationType==="Announce"}
<div class="mb-3">
    <label for="notifAddedNotificationType" class="form-label">Announce Type</label>
    <select bind:value={addedNotificationType}>
        {#each announceTypes as option}
        <option value={option.iri}>{option.label}</option>
        {/each}
    </select>
</div>
{/if}

<form on:submit|preventDefault={handleSubmit}>
    <h3>To</h3>
    <To bind:inbox={inbox} 
        bind:targetId={targetId} 
        bind:targetName={targetName} 
        bind:targetType={targetType}/>

    {#if notificationType === 'Announce'}
        <h3>What</h3>

        {#if addedNotificationType === 'coar-notify:RelationshipAction'}
            <RelationshipObject
                bind:subjectId={subjectId}
                bind:relationshipId={relationshipId}
                bind:objectId={objectId}/>
        {:else}
            <ServiceResultObject
                bind:objectId={objectId}
                bind:ietfCiteAs={ietfCiteAs}
                bind:asObjectType={asObjectType}
                bind:sorgObjectType={sorgObjectType}/>
        {/if}
 
        <h3>Context</h3>

        <ItemObject 
            bind:id={contextId} 
            bind:ietfCiteAs={contextIetfCiteAs}
            bind:asType={contextAsType}
            bind:sorgType={contextSorgType}
            bind:itemId={contextItemId}
            bind:itemMediaType={contextItemMediaType}
            bind:itemAsType={contextItemAsType}
            bind:itemSorgType={contextItemSorgType}/>
    {/if}

    {#if isTentative || notificationType === 'Flag'}
        <div class="mb-3">
            <label class="form-label" for="summary"><b>Summary</b></label>
            <input 
                class="form-control" 
                type="text" 
                id="summary" 
                bind:value={summary}
                placeholder="Write a short summary why you {notificationType.toLowerCase()} this notification."
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

    input:required,
    select:required {
        border-left: 3px solid red;
    }
</style>