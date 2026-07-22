import { type Agent } from "./inbox";

export const INBOX_URL = import.meta.env.VITE_INBOX_URL ?? '/inbox/';
export const VALIDATOR_URL = import.meta.env.VITE_VALIDATOR_URL ?? '/validate';
export const RELAY_URL = import.meta.env.VITE_RELAY_URL ?? '';
export const THIS_ACTOR : Agent = {
    id: "http://generic.service.org",
    type: "https://www.w3.org/ns/activitystreams#Person",
    name: "My Lovely Service",
    inbox: undefined
};
export const THIS_ORIGIN : any = {
    "id": "https://github.com/MellonScholarlyCommunication/inbox-validator-app",
    "name": "INBOX VIEWER",
    "type": "https://www.w3.org/ns/activitystreams#Service",
    "inbox": INBOX_URL
};
export const THIS_OPTIONS : any = {
    "inboxUrl": INBOX_URL,
    "validatorUrl": VALIDATOR_URL,
    "preferredTargetInbox": null,
    "relayUrl": RELAY_URL,
    "relayToken": null
};
export const LD_CACHE : Record<string,any> = {
  "https://www.w3.org/ns/activitystreams": {
    "@context": {
      "@vocab": "_:",
      "xsd": "http://www.w3.org/2001/XMLSchema#",
      "as": "https://www.w3.org/ns/activitystreams#",
      "ldp": "http://www.w3.org/ns/ldp#",
      "vcard": "http://www.w3.org/2006/vcard/ns#",
      "id": "@id",
      "type": "@type",
      "Accept": "as:Accept",
      "Activity": "as:Activity",
      "IntransitiveActivity": "as:IntransitiveActivity",
      "Add": "as:Add",
      "Announce": "as:Announce",
      "Application": "as:Application",
      "Arrive": "as:Arrive",
      "Article": "as:Article",
      "Audio": "as:Audio",
      "Block": "as:Block",
      "Collection": "as:Collection",
      "CollectionPage": "as:CollectionPage",
      "Relationship": "as:Relationship",
      "Create": "as:Create",
      "Delete": "as:Delete",
      "Dislike": "as:Dislike",
      "Document": "as:Document",
      "Event": "as:Event",
      "Follow": "as:Follow",
      "Flag": "as:Flag",
      "Group": "as:Group",
      "Ignore": "as:Ignore",
      "Image": "as:Image",
      "Invite": "as:Invite",
      "Join": "as:Join",
      "Leave": "as:Leave",
      "Like": "as:Like",
      "Link": "as:Link",
      "Mention": "as:Mention",
      "Note": "as:Note",
      "Object": "as:Object",
      "Offer": "as:Offer",
      "OrderedCollection": "as:OrderedCollection",
      "OrderedCollectionPage": "as:OrderedCollectionPage",
      "Organization": "as:Organization",
      "Page": "as:Page",
      "Person": "as:Person",
      "Place": "as:Place",
      "Profile": "as:Profile",
      "Question": "as:Question",
      "Reject": "as:Reject",
      "Remove": "as:Remove",
      "Service": "as:Service",
      "TentativeAccept": "as:TentativeAccept",
      "TentativeReject": "as:TentativeReject",
      "Tombstone": "as:Tombstone",
      "Undo": "as:Undo",
      "Update": "as:Update",
      "Video": "as:Video",
      "View": "as:View",
      "Listen": "as:Listen",
      "Read": "as:Read",
      "Move": "as:Move",
      "Travel": "as:Travel",
      "IsFollowing": "as:IsFollowing",
      "IsFollowedBy": "as:IsFollowedBy",
      "IsContact": "as:IsContact",
      "IsMember": "as:IsMember",
      "subject": {
        "@id": "as:subject",
        "@type": "@id"
      },
      "relationship": {
        "@id": "as:relationship",
        "@type": "@id"
      },
      "actor": {
        "@id": "as:actor",
        "@type": "@id"
      },
      "attributedTo": {
        "@id": "as:attributedTo",
        "@type": "@id"
      },
      "attachment": {
        "@id": "as:attachment",
        "@type": "@id"
      },
      "bcc": {
        "@id": "as:bcc",
        "@type": "@id"
      },
      "bto": {
        "@id": "as:bto",
        "@type": "@id"
      },
      "cc": {
        "@id": "as:cc",
        "@type": "@id"
      },
      "context": {
        "@id": "as:context",
        "@type": "@id"
      },
      "current": {
        "@id": "as:current",
        "@type": "@id"
      },
      "first": {
        "@id": "as:first",
        "@type": "@id"
      },
      "generator": {
        "@id": "as:generator",
        "@type": "@id"
      },
      "icon": {
        "@id": "as:icon",
        "@type": "@id"
      },
      "image": {
        "@id": "as:image",
        "@type": "@id"
      },
      "inReplyTo": {
        "@id": "as:inReplyTo",
        "@type": "@id"
      },
      "items": {
        "@id": "as:items",
        "@type": "@id"
      },
      "instrument": {
        "@id": "as:instrument",
        "@type": "@id"
      },
      "orderedItems": {
        "@id": "as:items",
        "@type": "@id",
        "@container": "@list"
      },
      "last": {
        "@id": "as:last",
        "@type": "@id"
      },
      "location": {
        "@id": "as:location",
        "@type": "@id"
      },
      "next": {
        "@id": "as:next",
        "@type": "@id"
      },
      "object": {
        "@id": "as:object",
        "@type": "@id"
      },
      "oneOf": {
        "@id": "as:oneOf",
        "@type": "@id"
      },
      "anyOf": {
        "@id": "as:anyOf",
        "@type": "@id"
      },
      "closed": {
        "@id": "as:closed",
        "@type": "xsd:dateTime"
      },
      "origin": {
        "@id": "as:origin",
        "@type": "@id"
      },
      "accuracy": {
        "@id": "as:accuracy",
        "@type": "xsd:float"
      },
      "prev": {
        "@id": "as:prev",
        "@type": "@id"
      },
      "preview": {
        "@id": "as:preview",
        "@type": "@id"
      },
      "replies": {
        "@id": "as:replies",
        "@type": "@id"
      },
      "result": {
        "@id": "as:result",
        "@type": "@id"
      },
      "audience": {
        "@id": "as:audience",
        "@type": "@id"
      },
      "partOf": {
        "@id": "as:partOf",
        "@type": "@id"
      },
      "tag": {
        "@id": "as:tag",
        "@type": "@id"
      },
      "target": {
        "@id": "as:target",
        "@type": "@id"
      },
      "to": {
        "@id": "as:to",
        "@type": "@id"
      },
      "url": {
        "@id": "as:url",
        "@type": "@id"
      },
      "altitude": {
        "@id": "as:altitude",
        "@type": "xsd:float"
      },
      "content": "as:content",
      "contentMap": {
        "@id": "as:content",
        "@container": "@language"
      },
      "name": "as:name",
      "nameMap": {
        "@id": "as:name",
        "@container": "@language"
      },
      "duration": {
        "@id": "as:duration",
        "@type": "xsd:duration"
      },
      "endTime": {
        "@id": "as:endTime",
        "@type": "xsd:dateTime"
      },
      "height": {
        "@id": "as:height",
        "@type": "xsd:nonNegativeInteger"
      },
      "href": {
        "@id": "as:href",
        "@type": "@id"
      },
      "hreflang": "as:hreflang",
      "latitude": {
        "@id": "as:latitude",
        "@type": "xsd:float"
      },
      "longitude": {
        "@id": "as:longitude",
        "@type": "xsd:float"
      },
      "mediaType": "as:mediaType",
      "published": {
        "@id": "as:published",
        "@type": "xsd:dateTime"
      },
      "radius": {
        "@id": "as:radius",
        "@type": "xsd:float"
      },
      "rel": "as:rel",
      "startIndex": {
        "@id": "as:startIndex",
        "@type": "xsd:nonNegativeInteger"
      },
      "startTime": {
        "@id": "as:startTime",
        "@type": "xsd:dateTime"
      },
      "summary": "as:summary",
      "summaryMap": {
        "@id": "as:summary",
        "@container": "@language"
      },
      "totalItems": {
        "@id": "as:totalItems",
        "@type": "xsd:nonNegativeInteger"
      },
      "units": "as:units",
      "updated": {
        "@id": "as:updated",
        "@type": "xsd:dateTime"
      },
      "width": {
        "@id": "as:width",
        "@type": "xsd:nonNegativeInteger"
      },
      "describes": {
        "@id": "as:describes",
        "@type": "@id"
      },
      "formerType": {
        "@id": "as:formerType",
        "@type": "@id"
      },
      "deleted": {
        "@id": "as:deleted",
        "@type": "xsd:dateTime"
      },
      "inbox": {
        "@id": "ldp:inbox",
        "@type": "@id"
      },
      "outbox": {
        "@id": "as:outbox",
        "@type": "@id"
      },
      "following": {
        "@id": "as:following",
        "@type": "@id"
      },
      "followers": {
        "@id": "as:followers",
        "@type": "@id"
      },
      "streams": {
        "@id": "as:streams",
        "@type": "@id"
      },
      "preferredUsername": "as:preferredUsername",
      "endpoints": {
        "@id": "as:endpoints",
        "@type": "@id"
      },
      "uploadMedia": {
        "@id": "as:uploadMedia",
        "@type": "@id"
      },
      "proxyUrl": {
        "@id": "as:proxyUrl",
        "@type": "@id"
      },
      "liked": {
        "@id": "as:liked",
        "@type": "@id"
      },
      "oauthAuthorizationEndpoint": {
        "@id": "as:oauthAuthorizationEndpoint",
        "@type": "@id"
      },
      "oauthTokenEndpoint": {
        "@id": "as:oauthTokenEndpoint",
        "@type": "@id"
      },
      "provideClientKey": {
        "@id": "as:provideClientKey",
        "@type": "@id"
      },
      "signClientKey": {
        "@id": "as:signClientKey",
        "@type": "@id"
      },
      "sharedInbox": {
        "@id": "as:sharedInbox",
        "@type": "@id"
      },
      "Public": {
        "@id": "as:Public",
        "@type": "@id"
      },
      "source": "as:source",
      "likes": {
        "@id": "as:likes",
        "@type": "@id"
      },
      "shares": {
        "@id": "as:shares",
        "@type": "@id"
      },
      "alsoKnownAs": {
        "@id": "as:alsoKnownAs",
        "@type": "@id"
      }
    }
  },
  "http://www.w3.org/ns/ldp": {
	  "@context": {
		  "ldp": "http://www.w3.org/ns/ldp#",
		  "id": "@id",
		  "type": "@type",
		  "Container": "ldp:Container",
		  "BasicContainer": "ldp:BasicContainer",
		  "DirectContainer": "ldp:DirectContainer",
		  "IndirectContainer": "ldp:IndirectContainer",
		  "hasMemberRelation": {"@id": "ldp:hasMemberRelation", "@type":"@id"},
		  "isMemberOfRelation": {"@id": "ldp:isMemberOfRelation", "@type":"@id"},
		  "membershipResource": {"@id": "ldp:membershipResource", "@type":"@id"},
		  "insertedContentRelation": {"@id": "ldp:insertedContentRelation", "@type":"@id"},
		  "contains": {"@id": "ldp:contains", "@type":"@id"},
		  "member": {"@id": "ldp:member", "@type":"@id"},
		  "constrainedBy": {"@id": "ldp:constrainedBy", "@type":"@id"},

		  "Resource": "ldp:Resource",
		  "RDFSource": "ldp:RDFSource",
		  "NonRDFSource": "ldp:NonRDFSource",

		  "MemberSubject": "ldp:MemberSubject",
		  "PreferContainment": "ldp:PreferContainment",
		  "PreferMembership": "ldp:PreferMembership",
		  "PreferMinimalContainer": "ldp:PreferMinimalContainer",

		  "PageSortCriterion": "ldp:PageSortCriterion",
		  "pageSortCriteria": {"@id": "ldp:pageSortCriteria", "@type":"@id", "@container": "@list"},
		  "pageSortPredicate": {"@id": "ldp:pageSortPredicate", "@type":"@id"},
		  "pageSortOrder": {"@id": "ldp:pageSortOrder", "@type":"@id"},
		  "pageSortCollation": {"@id": "ldp:pageSortCollation", "@type":"@id"},
		  "Ascending": "ldp:Ascending",
		  "Descending": "ldp:Descending",

		  "Page": "ldp:Page",
		  "pageSequence": {"@id": "ldp:pageSequence", "@type":"@id"},

		  "inbox": { "@id": "ldp:inbox", "@type": "@id" }
	  }
  },
  "https://coar-notify.net": {
    "@context": {
      "@vocab": "http://coar-notify.net/specification/vocabulary/",
      "ietf": "http://www.iana.org/assignments/relation/",
      "coar-notify": "http://coar-notify.net/specification/vocabulary/",
      "sorg": "http://schema.org/",
      "ReviewAction": "coar-notify:ReviewAction",
      "EndorsementAction": "coar-notify:EndorsementAction",
      "IngestAction": "coar-notify:IngestAction",
      "RelationshipAction": "coar-notify:RelationshipAction",
      "UnprocessableNotification": "coar-notify:UnprocessableNotification",
      "as:subject": {
        "@type": "@id"
      },
      "as:object": {
        "@type": "@id"
      },
      "as:relationship": {
        "@type": "@id"
      },
      "ietf:cite-as": {
        "@type": "@id"
      }
    }
  }
};

export const AS    = 'https://www.w3.org/ns/activitystreams#';
export const LDP   = 'http://www.w3.org/ns/ldp#';
export const POSIX = 'http://www.w3.org/ns/posix/stat#';
export const IANA  = 'http://www.w3.org/ns/iana/media-types/';
export const IETF  = 'http://www.iana.org/assignments/relation/';
export const COAR_NOTIFY = 'http://coar-notify.net/specification/vocabulary/';
export const SORG = 'http://schema.org/';

export interface Category {
  iri: string;
  label: string;
};

export const announceTypes : Category[] = [
  { iri: '', label: 'GenericAction' },
  { iri: `coar-notify:EndorsementAction`, label: 'EndorsementAction' },
  { iri: `coar-notify:RelationshipAction`, label: 'RelationshipAction' },
  { iri: `coar-notify:ReviewAction`, label: 'ReviewAction' },
];

export const offerTypes : Category[] = [
  { iri: `coar-notify:EndorsementAction`, label: 'EndorsementAction' },
  { iri: `coar-notify:ReviewAction`, label: 'ReviewAction' },
];

export const asObjectTypes : Category[] = [
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

export const sorgObjectTypes : Category[] = [
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