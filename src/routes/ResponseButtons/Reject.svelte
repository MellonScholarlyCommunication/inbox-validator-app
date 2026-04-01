<script lang="ts">
    import Sender from "./Sender.svelte";
    import { createEventDispatcher } from 'svelte';
    const dispatch = createEventDispatcher();
</script>

<Sender 
    notificationType="Reject"
    on:changeTab={ (e) => { 
        dispatch('changeTab',e.detail);
    }}
/>