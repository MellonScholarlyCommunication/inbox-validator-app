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
    import { THIS_ACTOR } from '../../globals';
   
    export let notificationType = 'Accept';

    const AS = 'https://www.w3.org/ns/activitystreams#';
    const COAR_NOTIFY = 'http://coar-notify.net/specification/vocabulary/';
    const SORG = 'http://schema.org/';

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

    interface Category {
        iri: string;
        label: string;
    }

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

    const announceTypes : Category[] = [
        { iri: '', label: 'GenericAction' },
        { iri: `coar-notify:EndorsementAction`, label: 'EndorsementAction' },
        { iri: `coar-notify:RelationshipAction`, label: 'RelationshipAction' },
        { iri: `coar-notify:ReviewAction`, label: 'ReviewAction' },
    ];

    // Possible AS object type
    let asObjectType: string = "Page";

    if (addedNotificationType === 'coar-notify:RelationshipAction') {
        asObjectType = 'Relationship';
    }

    const asObjectTypes : Category[] = [
        { iri: 'Activity', label: 'Activity' },
        { iri: 'Application', label: 'Application' },
        { iri: 'Article', label: 'Article' },
        { iri: 'Audio', label: 'Audio' },
        { iri: 'Collection', label: 'Collection' },
        { iri: 'CollectionPage', label: 'CollectionPage' },
        { iri: 'Document', label: 'Document' },
        { iri: 'Event', label: 'Event' },
        { iri: 'Group', label: 'Group' },
        { iri: 'Image', label: 'Image' },
        { iri: 'IntransitiveActivity', label: 'IntransitiveActivity' },
        { iri: 'Note', label: 'Note' },
        { iri: 'Object', label: 'Object' },
        { iri: 'OrderedCollection', label: 'OrderedCollection' },
        { iri: 'OrderedCollectionPage', label: 'OrderedCollectionPage' },
        { iri: 'Organization', label: 'Organization' },
        { iri: 'Page', label: 'Page' },
        { iri: 'Person', label: 'Person' },
        { iri: 'Place', label: 'Place' },
        { iri: 'Profile', label: 'Profile' },
        { iri: 'Question', label: 'Question' },
        { iri: 'Relationship', label: 'Relationship' },
        { iri: 'Service', label: 'Service' },
        { iri: 'Tombstone', label: 'Tombstone' },
        { iri: 'Video', label: 'Video' },
    ];

    // Possible sorg object type
    let sorgObjectType = 'sorg:WebPage';

    const sorgObjectTypes : Category[] = [
        { iri: 'sorg:AboutPage', label: 'AboutPage' },
        { iri: 'sorg:AdvertiserContentArticle', label: 'AdvertiserContentArticle' },
        { iri: 'sorg:AmpStory', label: 'AmpStory' },
        { iri: 'sorg:ArchiveComponent', label: 'ArchiveComponent' },
        { iri: 'sorg:Article', label: 'Article' },
        { iri: 'sorg:Atlas', label: 'Atlas' },
        { iri: 'sorg:Blog', label: 'Blog' },
        { iri: 'sorg:Book', label: 'Book' },
        { iri: 'sorg:Certification', label: 'Certification' },
        { iri: 'sorg:CheckoutPage', label: 'CheckoutPage' },
        { iri: 'sorg:Chapter', label: 'Chapter' },
        { iri: 'sorg:Claim', label: 'Claim' },
        { iri: 'sorg:Clip', label: 'Clip' },
        { iri: 'sorg:Code', label: 'Code' },
        { iri: 'sorg:Collection', label: 'Collection' },
        { iri: 'sorg:CollectionPage', label: 'CollectionPage' },
        { iri: 'sorg:ComicStory', label: 'ComicStory' },
        { iri: 'sorg:Comment', label: 'Comment' },
        { iri: 'sorg:ContactPage', label: 'ContactPage' },
        { iri: 'sorg:Conversation', label: 'Convsersation' },
        { iri: 'sorg:Course', label: 'Course' },
        { iri: 'sorg:CreativeWorkSeason', label: 'CreativeWorkSeason' },
        { iri: 'sorg:CreativeWorkSeries', label: 'CreativeWorkSeries' },
        { iri: 'sorg:Credential', label: 'Credential' },
        { iri: 'sorg:DataCatalog', label: 'DataCatalog' },
        { iri: 'sorg:Dataset', label: 'Dataset' },
        { iri: 'sorg:DefinedTermSet', label: 'DefinedTermSet' },
        { iri: 'sorg:Diet', label: 'Diet' },
        { iri: 'sorg:DigitalDocument', label: 'DigitalDocument' },
        { iri: 'sorg:Drawing', label: 'Drawing' },
        { iri: 'sorg:Episode', label: 'Episode' },
        { iri: 'sorg:ExercisePlan', label: 'ExercisePlan' },
        { iri: 'sorg:FAQPage', label: 'FAQPage' },
        { iri: 'sorg:Game', label: 'Game' },
        { iri: 'sorg:Guide', label: 'Guide' },
        { iri: 'sorg:HowTo', label: 'HowTo' },
        { iri: 'sorg:HowToDirection', label: 'HowToDirection' },
        { iri: 'sorg:HowToSection', label: 'HowToSection' },
        { iri: 'sorg:HowToStep', label: 'HowToStep' },
        { iri: 'sorg:HowToTip', label: 'HowToTip' },
        { iri: 'sorg:HyperToc', label: 'HyperToc' },
        { iri: 'sorg:HyperTocEntry', label: 'HyperTocEntry' },
        { iri: 'sorg:ItemPage', label: 'ItemPage' },
        { iri: 'sorg:LearningResource', label: 'LearningResource' },
        { iri: 'sorg:Legislation', label: 'Legislation' },
        { iri: 'sorg:Manuscript', label: 'Manuscript' },
        { iri: 'sorg:Map', label: 'Map' },
        { iri: 'sorg:MathSolver', label: 'MathSolver' },
        { iri: 'sorg:MedicalWebPage', label: 'MedicalWebPage' },
        { iri: 'sorg:Menu', label: 'Menu' },
        { iri: 'sorg:MenuSection', label: 'MenuSection' },
        { iri: 'sorg:Message', label: 'Message' },
        { iri: 'sorg:Movie', label: 'Movie' },
        { iri: 'sorg:MusicComposition', label: 'MusicComposition' },
        { iri: 'sorg:MusicPlaylist', label: 'MusicPlaylist' },
        { iri: 'sorg:MusicRecording', label: 'MusicRecording' },
        { iri: 'sorg:NewsArticle', label: 'NewsArticle' },
        { iri: 'sorg:Painting', label: 'Painting' },
        { iri: 'sorg:Photograph', label: 'Photograph' },
        { iri: 'sorg:Play', label: 'Play' },
        { iri: 'sorg:Poster', label: 'Poster' },
        { iri: 'sorg:ProfilePage', label: 'ProfilePage' },
        { iri: 'sorg:PublicationIssue', label: 'PublicationIssue' },
        { iri: 'sorg:PublicationVolume', label: 'PublicationVolume' },
        { iri: 'sorg:QAPage', label: 'QAPage' },
        { iri: 'sorg:Quotation', label: 'Quotation' },
        { iri: 'sorg:RealEstateListing', label: 'RealEstateListing' },
        { iri: 'sorg:Review', label: 'Review' },
        { iri: 'sorg:SatiricalArticle', label: 'SatiricalArticle' },
        { iri: 'sorg:Sculpture', label: 'Sculpture' },
        { iri: 'sorg:SearchResultsPage', label: 'SearchResultsPage' },
        { iri: 'sorg:Season', label: 'Season' },
        { iri: 'sorg:ScholarlyArticle', label: 'ScholarlyArticle' },
        { iri: 'sorg:SheetMusic', label: 'SheetMusic' },
        { iri: 'sorg:ShortStory', label: 'ShortStory' },
        { iri: 'sorg:SocialMediaPosting', label: 'SocialMediaPosting' },
        { iri: 'sorg:SoftwareApplication', label: 'SoftwareApplication' },
        { iri: 'sorg:SoftwareSourceCode', label: 'SoftwareSourceCode' },
        { iri: 'sorg:SpecialAnnouncement', label: 'SpecialAnnouncement' },
        { iri: 'sorg:Statement', label: 'Statement' },
        { iri: 'sorg:TechArticle', label: 'TechArticle' },
        { iri: 'sorg:TVSeason', label: 'TVSeason' },
        { iri: 'sorg:TVSeries', label: 'TVSeries' },
        { iri: 'sorg:Thesis', label: 'Thesis' },
        { iri: 'sorg:VisualArtwork', label: 'VisualArtwork' },
        { iri: 'sorg:WebContent', label: 'WebContent' },
        { iri: 'sorg:WebPage', label: 'WebPage' },
        { iri: 'sorg:WebPageElement', label: 'WebPageElement' },
        { iri: 'sorg:Website', label: 'Website' },
    ];

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
    <div class="mb-3">
        <label for="notifTargetId" class="form-label">Id</label>
        <input 
            type="text" 
            class="form-control" 
            id="notifTargetId" 
            placeholder="e.g. A target URI"
            bind:value={targetId} 
            required
        />
    </div>

    <div class="mb-3">
        <label for="notifTargetName" class="form-label">Name</label>
        <input 
            type="text" 
            class="form-control" 
            id="notifTargetName" 
            placeholder="e.g. A target name"
            bind:value={targetName} 
        />
    </div>

    <div class="mb-3">
        <label for="notifInbox" class="form-label">Inbox</label>
        <input 
            type="text" 
            class="form-control" 
            id="notifId" 
            placeholder="e.g. An LDN Inbox URL"
            bind:value={inbox} 
            required
        />
    </div>

    <div class="mb-3">
        <label for="notifTargetType" class="form-label">Type</label>
        <i>as:</i>
        <select bind:value={targetType} required>
        {#each asObjectTypes as option}
            <option value={option.iri}>{option.label}</option>
        {/each}
        </select> 
    </div>

    {#if notificationType === 'Announce'}
        <h3>What</h3>

        {#if addedNotificationType === 'coar-notify:RelationshipAction'}
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
        {/if}
 
        <div class="mb-3">
            <label for="notifObject" class="form-label">Object</label>
            <input 
                type="text" 
                class="form-control" 
                id="notifObject"
                bind:value={objectId}
                placeholder="e.g. A resource URL"
                required
            />
        </div>

        {#if addedNotificationType === 'coar-notify:EndorsementAction' || addedNotificationType === 'coar-notify:ReviewAction'}
        <div class="mb-3">
            <label for="notifIETFCiteAs" class="form-label">Cite As</label>
            <input 
                type="text" 
                class="form-control" 
                id="notifIETFCiteAs" 
                bind:value={ietfCiteAs}
                placeholder="e.g. A citable resource URL"
            />
        </div>
        {/if}

        <div class="mb-3">
            <label for="notifAsObjectType" class="form-label">Type</label>
            {#if addedNotificationType === 'coar-notify:RelationshipAction'}
            <i>as:Relationship</i>
            {:else}
            <i>as:</i>
            <select bind:value={asObjectType} required>
            {#each asObjectTypes as option}
                <option value={option.iri}>{option.label}</option>
            {/each}
            </select>
            <i>sorg:</i>
            <select bind:value={sorgObjectType} required>
            {#each sorgObjectTypes as option}
                <option value={option.iri}>{option.label}</option>
            {/each}
            </select>
            {/if}
        </div>

        <h3>Context</h3>

        <div class="mb-3">
            <label for="contextId" class="form-label">Id (landing page)</label>
            <input 
                type="text" 
                class="form-control" 
                id="contextId" 
                bind:value={contextId}
                placeholder="e.g. A resource landing page URL"
                required
            />
        </div>

        <div class="mb-3">
            <label for="contextIetfCiteAs" class="form-label">Cite As</label>
            <input 
                type="text" 
                class="form-control" 
                id="contextIetfCiteAs" 
                bind:value={contextIetfCiteAs}
                placeholder="e.g. A citable resource URL"
            />
        </div>

        <div class="mb-3">
            <label for="contextType" class="form-label">Type</label>
            <i>as:</i>
            <select bind:value={contextAsType}>
            {#each asObjectTypes as option}
                <option value={option.iri}>{option.label}</option>
            {/each}
            </select>
            <i>sorg:</i>
            <select bind:value={contextSorgType}>
            {#each sorgObjectTypes as option}
                <option value={option.iri}>{option.label}</option>
            {/each}
            </select>
        </div>

        <div class="mb-3">
            <label for="contextItemId" class="form-label">Item (content resource)</label>
            <input 
                type="text" 
                class="form-control" 
                id="contextItemId" 
                bind:value={contextItemId}
                placeholder="e.g. A resource item URL"
            />
        </div>
        
        <div class="mb-3">
            <label for="contextItemMediaType" class="form-label">Media Type</label>
            <input 
                type="text" 
                class="form-control" 
                id="contextItemMediaType" 
                bind:value={contextItemMediaType}
                required={contextItemRequired}
                placeholder="e.g. A media type for the item"
            />
        </div>

        <div class="mb-3">
            <label for="contextItemType" class="form-label">Type</label>
            <i>as:</i>
            <select bind:value={contextItemAsType} required={contextItemRequired}>
            {#each asObjectTypes as option}
                <option value={option.iri}>{option.label}</option>
            {/each}
            </select>
            <i>sorg:</i>
            <select bind:value={contextItemSorgType} required={contextItemRequired}>
            {#each sorgObjectTypes as option}
                <option value={option.iri}>{option.label}</option>
            {/each}
            </select>
        </div>
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