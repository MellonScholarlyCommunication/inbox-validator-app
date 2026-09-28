/// <reference types="svelte" />
/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_INBOX_URL?: string;
    readonly VITE_VALIDATOR_URL?: string;
    readonly VITE_RELAY_URL?: string;
    readonly VITE_MAX_NOTIFICATION_AGE?: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}
