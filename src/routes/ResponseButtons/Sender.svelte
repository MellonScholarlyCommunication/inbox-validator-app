<script lang="ts">
    import { get } from 'svelte/store'; 
    import { createEventDispatcher } from 'svelte';
    import { notificationData, defaultActor, defaultOrigin, defaultOptions } from '../../store';
    import { 
        type Notification,
        type PageObject, 
        genUUID,
        sendNotification } from '../../inbox';
    import whooshUrl from '../../assets/woosh.mp3';
    import { 
        AS, COAR_NOTIFY, SORG, 
        announceTypes, offerTypes
    } from '../../globals';
    import To from './SenderParts/To.svelte';
    import ItemObject from './SenderParts/ItemObject.svelte';
    import RelationshipObject from './SenderParts/RelationshipObject.svelte';
    import ServiceResultObject from './SenderParts/ServiceResultObject.svelte';
    import PreviousNotification from './SenderParts/PreviousNotification.svelte';
   
    export let notificationType : string;

    // Read in the notification
    let notification : Notification = get(notificationData) as Notification;

    // Create custom changeTab events for this component (see later in this document)
    const dispatch = createEventDispatcher();

    let tentativeFlag : boolean;
    let isTentative : boolean;
    let summary : string;
    
    let inbox : string;

    let addedNotificationType : string;
    let asObjectType : string;
    let sorgObjectType : string;

    let subjectId : string;
    let relationshipId : string;
    let objectId : string;

    let ietfCiteAs : string;

    let objectItemId : string;
    let objectItemMediaType : string;
    let objectItemAsType : string;
    let objectItemSorgType : string;

    let contextId : string;
    let contextIetfCiteAs : string;
    let contextAsType : string;
    let contextSorgType : string;
    let contextItemId : string;
    let contextItemMediaType : string;
    let contextItemAsType : string;
    let contextItemSorgType : string;

    let inReplyTo : string;

    let previousNotification : Notification;

    let targetId : string;
    let targetName : string;
    let targetType : string;

    initForm();

    function initForm() {
        // Check if we allow tentatives...
        tentativeFlag = notificationType === 'Accept' ||
                        notificationType === 'Reject' ? true : false;
                        
        // Tentative fields
        isTentative = false;
        summary = "";

        // Find out the right inbox to send notifications to...
        const inboxInit : string | undefined = notification.object?.origin?.inbox ?
                notification.object?.origin?.inbox :
                notification.object?.actor?.inbox;

        inbox = inboxInit ?? "";

        if ($defaultOptions.preferredTargetInbox) {
            inbox = $defaultOptions.preferredTargetInbox;
        }

        // Possible announce types
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
        asObjectType = "Page";

        // Set the AS objec type to 'Relationship' when we respond with a coar-notify:RelationshipAction
        if (addedNotificationType === 'coar-notify:RelationshipAction') {
            asObjectType = 'Relationship';
        }

        // Possible sorg object type
        sorgObjectType = 'sorg:WebPage';

        // Possible as:subject
        subjectId = "";

        // Possible as:relationship
        relationshipId = "";

        // Possible as:object
        objectId = "";

        // Possible ietf:cite-as
        ietfCiteAs = "";

        // Possible object item
        objectItemId = "";
        objectItemMediaType = "application/pdf";
        objectItemAsType = "Page";
        objectItemSorgType = "sorg:WebPage";

        // Possible context
        contextId = "";
        contextIetfCiteAs = "";
        contextAsType = "Page";
        contextSorgType = "sorg:AboutPage";
        contextItemId = "";
        contextItemMediaType = "application/pdf";
        contextItemAsType = "Page";
        contextItemSorgType = "sorg:WebPage";

        // Set the context fields if we create a response based on an existing object
        if (notification.object?.object) {
            const obj = notification.object.object;

            if (notification.object.id) {
                inReplyTo = notification.object.id;
            }

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

        // Possible target
        targetId   = notification.object?.actor?.id ?? "";
        targetName = notification.object?.actor?.name ?? "" ;
        targetType = notification.object?.actor?.type.replace(AS,"") ?? "";
    }

    function handleReset() {
        initForm();
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
                throw new Error('No inbox location set');
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
                'object': notification.object
            }

            if (inReplyTo) {
                payload['inReplyTo'] = inReplyTo;
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
            else {
                throw new Error(`No target set?`);
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
            else if (notificationType === 'Offer') {
                payload['type'] = [ 'Offer', addedNotificationType ];
                
                payload['object'] = { 
                    id : objectId,
                    type: [ asObjectType , sorgObjectType ]
                };

                if (ietfCiteAs.length) {
                    payload['object']['ietf:cite-as'] = ietfCiteAs;
                }

                payload['object']['ietf:item'] = {
                    id: objectItemId ,
                    mediaType: objectItemMediaType ,
                    type: [ objectItemAsType , objectItemSorgType ]
                };
            }
            else if (notificationType === 'Undo') {
                payload['object'] = JSON.parse(previousNotification.data);
                delete payload['object']['@context'];
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

<form on:submit|preventDefault={handleSubmit}>
    <h3>To</h3>
    <To bind:inbox={inbox} 
        bind:targetId={targetId} 
        bind:targetName={targetName} 
        bind:targetType={targetType}/>

    {#if notificationType === 'Announce'}
        <h3>What</h3>

        <div class="mb-3">
            <label for="notifAddedNotificationType" class="form-label">Announce Type</label>
            <select bind:value={addedNotificationType}>
                {#each announceTypes as option}
                <option value={option.iri}>{option.label}</option>
                {/each}
            </select>
        </div>

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
            itemRequired={false}
            bind:id={contextId} 
            bind:ietfCiteAs={contextIetfCiteAs}
            bind:asType={contextAsType}
            bind:sorgType={contextSorgType}
            bind:itemId={contextItemId}
            bind:itemMediaType={contextItemMediaType}
            bind:itemAsType={contextItemAsType}
            bind:itemSorgType={contextItemSorgType}/>
    {/if}

    {#if notificationType === 'Offer'}
        <h3>What</h3>

        <div class="mb-3">
            <label for="notifAddedNotificationType" class="form-label">Offer Type</label>
            <select bind:value={addedNotificationType} required>
                {#each offerTypes as option}
                <option value={option.iri}>{option.label}</option>
                {/each}
            </select>
        </div>

        <ItemObject 
            itemRequired={true}
            bind:id={objectId} 
            bind:ietfCiteAs={ietfCiteAs}
            bind:asType={asObjectType}
            bind:sorgType={sorgObjectType}
            bind:itemId={objectItemId}
            bind:itemMediaType={objectItemMediaType}
            bind:itemAsType={objectItemAsType}
            bind:itemSorgType={objectItemSorgType}/>
    {/if}

    {#if isTentative || notificationType === 'Flag' || notificationType == 'Undo'}
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

    {#if notificationType === 'Undo'}
        <h3>Previous Offer</h3>

        <PreviousNotification
            bind:notification={previousNotification}
            bind:targetInbox={inbox}
            bind:targetId={targetId}
            bind:targetName={targetName}
            bind:targetType={targetType}/>
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