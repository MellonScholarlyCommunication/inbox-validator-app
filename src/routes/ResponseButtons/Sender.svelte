<script lang="ts">
    import { notificationData, defaultActor, defaultOrigin } from '../../store';
    import { get } from 'svelte/store'; // Import store getter
    import { 
        type Notification, 
        genUUID,
        sendNotification } from '../../inbox';
    import { createEventDispatcher } from 'svelte';
    import whooshUrl from '../../assets/woosh.mp3';
   
    export let notificationType = 'Accept';

    const AS = 'https://www.w3.org/ns/activitystreams#';
    const COAR_NOTIFY = 'http://coar-notify.net/specification/vocabulary/';

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
    let addedNotificationType: string;

    if (notification.object?.type?.includes(`${COAR_NOTIFY}ReviewAction`)) {
        addedNotificationType = 'coar-notify:ReviewAction';
    }
    else if (notification.object?.type?.includes(`${COAR_NOTIFY}EndorsementAction`)) {
        addedNotificationType = 'coar-notify:EndorsementAction';
    }

    const announceTypes : Category[] = [
        { iri: '', label: 'GenericAction' },
        { iri: `coar-notify:EndorsementAction`, label: 'EndorsementAction' },
        { iri: `coar-notify:RelationshipAction`, label: 'RelationshipAction' },
        { iri: `coar-notify:ReviewAction`, label: 'ReviewAction' },
    ];

    // Possible AS object type
    let asObjectType: string = "as:Page";

    const asObjecTypes : Category[] = [
        { iri: 'as:Activity', label: 'Activity' },
        { iri: 'as:Application', label: 'Application' },
        { iri: 'as:Article', label: 'Article' },
        { iri: 'as:Audio', label: 'Audio' },
        { iri: 'as:Collection', label: 'Collection' },
        { iri: 'as:CollectionPage', label: 'CollectionPage' },
        { iri: 'as:Relationship', label: 'Relationship' },
        { iri: 'as:Document', label: 'Document' },
        { iri: 'as:Event', label: 'Event' },
        { iri: 'as:Group', label: 'Group' },
        { iri: 'as:Image', label: 'Image' },
        { iri: 'as:IntransitiveActivity', label: 'IntransitiveActivity' },
        { iri: 'as:Note', label: 'Note' },
        { iri: 'as:Object', label: 'Object' },
        { iri: 'as:OrderedCollection', label: 'OrderedCollection' },
        { iri: 'as:OrderedCollectionPage', label: 'OrderedCollectionPage' },
        { iri: 'as:Organization', label: 'Organization' },
        { iri: 'as:Page', label: 'Page' },
        { iri: 'as:Person', label: 'Person' },
        { iri: 'as:Place', label: 'Place' },
        { iri: 'as:Profile', label: 'Profile' },
        { iri: 'as:Question', label: 'Question' },
        { iri: 'as:Service', label: 'Service' },
        { iri: 'as:Tombstone', label: 'Tombstone' },
        { iri: 'as:Video', label: 'Video' },
    ];

    // Possible sorg object type
    let sorgObjectType = 'sorg:WebPage';

    const sorgObjecTypes : Category[] = [
        { iri: 'sorg:AmpStory', label: 'AmpStory' },
        { iri: 'sorg:ArchiveComponent', label: 'ArchiveComponent' },
        { iri: 'sorg:Article', label: 'Article' },
        { iri: 'sorg:Atlas', label: 'Atlas' },
        { iri: 'sorg:Blog', label: 'Blog' },
        { iri: 'sorg:Book', label: 'Book' },
        { iri: 'sorg:Certification', label: 'Certification' },
        { iri: 'sorg:Chapter', label: 'Chapter' },
        { iri: 'sorg:Claim', label: 'Claim' },
        { iri: 'sorg:Clip', label: 'Clip' },
        { iri: 'sorg:Code', label: 'Code' },
        { iri: 'sorg:Collection', label: 'Collection' },
        { iri: 'sorg:ComicStory', label: 'ComicStory' },
        { iri: 'sorg:Comment', label: 'Comment' },
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
        { iri: 'sorg:Game', label: 'Game' },
        { iri: 'sorg:Guide', label: 'Guide' },
        { iri: 'sorg:HowTo', label: 'HowTo' },
        { iri: 'sorg:HowToDirection', label: 'HowToDirection' },
        { iri: 'sorg:HowToSection', label: 'HowToSection' },
        { iri: 'sorg:HowToStep', label: 'HowToStep' },
        { iri: 'sorg:HowToTip', label: 'HowToTip' },
        { iri: 'sorg:HyperToc', label: 'HyperToc' },
        { iri: 'sorg:HyperTocEntry', label: 'HyperTocEntry' },
        { iri: 'sorg:LearningResource', label: 'LearningResource' },
        { iri: 'sorg:Legislation', label: 'Legislation' },
        { iri: 'sorg:Manuscript', label: 'Manuscript' },
        { iri: 'sorg:Map', label: 'Map' },
        { iri: 'sorg:MathSolver', label: 'MathSolver' },
        { iri: 'sorg:Menu', label: 'Menu' },
        { iri: 'sorg:MenuSection', label: 'MenuSection' },
        { iri: 'sorg:Message', label: 'Message' },
        { iri: 'sorg:Movie', label: 'Movie' },
        { iri: 'sorg:MusicComposition', label: 'MusicComposition' },
        { iri: 'sorg:MusicPlaylist', label: 'MusicPlaylist' },
        { iri: 'sorg:MusicRecording', label: 'MusicRecording' },
        { iri: 'sorg:Painting', label: 'Painting' },
        { iri: 'sorg:Photograph', label: 'Photograph' },
        { iri: 'sorg:Play', label: 'Play' },
        { iri: 'sorg:Poster', label: 'Poster' },
        { iri: 'sorg:PublicationIssue', label: 'PublicationIssue' },
        { iri: 'sorg:PublicationVolume', label: 'PublicationVolume' },
        { iri: 'sorg:Quotation', label: 'Quotation' },
        { iri: 'sorg:Review', label: 'Review' },
        { iri: 'sorg:Sculpture', label: 'Sculpture' },
        { iri: 'sorg:Season', label: 'Season' },
        { iri: 'sorg:SheetMusic', label: 'SheetMusic' },
        { iri: 'sorg:ShortStory', label: 'ShortStory' },
        { iri: 'sorg:SoftwareApplication', label: 'SoftwareApplication' },
        { iri: 'sorg:SoftwareSourceCode', label: 'SoftwareSourceCode' },
        { iri: 'sorg:SpecialAnnouncement', label: 'SpecialAnnouncement' },
        { iri: 'sorg:Statement', label: 'Statement' },
        { iri: 'sorg:TVSeason', label: 'TVSeason' },
        { iri: 'sorg:TVSeries', label: 'TVSeries' },
        { iri: 'sorg:Thesis', label: 'Thesis' },
        { iri: 'sorg:VisualArtwork', label: 'VisualArtwork' },
        { iri: 'sorg:WebContent', label: 'WebContent' },
        { iri: 'sorg:WebPage', label: 'WebPage' },
        { iri: 'sorg:WebPageElement', label: 'WebPageElement' },
        { iri: 'sorg:Website', label: 'Website' },
    ];

    // Possible object:id
    let objectId : string = "";

    // Possible ietf:cite-as
    let ietfCiteAs : string = "";

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

        if (notificationType === 'Announce') {
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
                bind:value={objectId}
                placeholder="e.g. An internet resource URL"
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
                placeholder="e.g. An internet resource URL"
                required
            />
        </div>
        {/if}
        <div class="mb-3">
            <label for="notifAsObjectType" class="form-label">Type</label>
            <i>as:</i>
            <select bind:value={asObjectType}>
            {#each asObjecTypes as option}
                <option value={option.iri}>{option.label}</option>
            {/each}
            </select>
            <i>sorg:</i>
            <select bind:value={sorgObjectType}>
            {#each sorgObjecTypes as option}
                <option value={option.iri}>{option.label}</option>
            {/each}
            </select>
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