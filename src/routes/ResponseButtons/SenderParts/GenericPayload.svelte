<script lang="ts">
    import RawNotification from "../../NotificationParts/RawNotification.svelte";
    import { listInbox, getNotification, type Notification } from "../../../inbox";
    import { defaultOptions } from "../../../store";

    export let data = `{"foo":"bar"}`;

    const inbox = $defaultOptions?.inboxUrl ?? "";

    let selectedIndex: string = "";
    let notifications: Notification[] = [];
    let loaded = false;
    let loading = false;
    let loadError: string | null = null;

    async function loadNotifications() {
        if (loaded || loading) return;
        loading = true;
        loadError = null;
        try {
            const members = await listInbox(inbox);
            notifications = await Promise.all(
                members.map(member => getNotification(inbox + member.name))
            );
            loaded = true;
        } catch (e: any) {
            loadError = e?.message ?? String(e);
        } finally {
            loading = false;
        }
    }

    function notifLabel(n: Notification, idx: number): string {
        const types = n.object?.type?.map(t => t.replace(/.*[\/#]/g, "")).join(", ") ?? "Notification";
        const from = n.object?.actor?.name ?? n.object?.actor?.id ?? "unknown";
        const to = n.object?.target?.name ?? n.object?.target?.id ?? "unknown";
        return `${idx + 1}. ${types}: ${from} → ${to}`;
    }

    $: if (selectedIndex !== "") {
        const n = notifications[Number(selectedIndex)];
        if (n) {
            try {
                data = JSON.stringify(JSON.parse(n.data), null, 2);
            } catch {
                data = n.data;
            }
        }
    }
</script>


<div class="mb-3">
    <small class="d-block text-muted">Compose a notification from scratch. The source should be a JSON document. Free text is not supported.</small>

    <div class="my-2">
        <label class="form-label" for="templatePicker">
            <small>Optionally pick an existing notification as a template:</small>
        </label>
        <select
            id="templatePicker"
            class="form-select form-select-sm"
            bind:value={selectedIndex}
            on:focus={loadNotifications}
            on:mousedown={loadNotifications}>
            <option value="">— none —</option>
            {#if loading}
                <option disabled>Loading {inbox}...</option>
            {:else if loadError}
                <option disabled>Failed to load: {loadError}</option>
            {:else}
                {#each notifications as n, i}
                    <option value={String(i)}>{notifLabel(n, i)}</option>
                {/each}
            {/if}
        </select>
    </div>

    <RawNotification bind:data={data} editable={true}/>
</div>
