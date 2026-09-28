<script lang="ts">
  import { link } from 'svelte-spa-router';
  import type { ComponentType } from 'svelte';
  import { onMount } from 'svelte';
  import { notificationData } from '../store';
  import { defaultOptions} from "../store";
  import { AS } from "../globals";
  import { getNotification , type Notification } from "../inbox";
  import ParsedNotification from './NotificationParts/ParsedNotification.svelte';
  import RawNotification from './NotificationParts/RawNotification.svelte';
  import GraphNotification from './NotificationParts/GraphNotification.svelte';
  import Validate from './ResponseButtons/Validate.svelte';
  import Accept from './ResponseButtons/Accept.svelte';
  import Reject from './ResponseButtons/Reject.svelte';
  import Flag from './ResponseButtons/Flag.svelte';
  import Announce from './ResponseButtons/Announce.svelte';

  export let params: { name?: string } = {};

  let showToast = false;
  let toastMessage = "";
  type View = 'details' | 'source' | 'graph';
  const views : { id: View, label: string }[] = [
    { id: 'details', label: 'Details' },
    { id: 'source', label: 'Source' },
    { id: 'graph', label: 'Graph' }
  ];
  let view : View = 'details';
  let inbox : string;
  let notificationUrl : string;
  
  if (defaultOptions) {
    inbox = $defaultOptions.inboxUrl;
    notificationUrl = inbox + params.name;
  }

  interface Tab {
      label: string;
      component: ComponentType; 
      class: string;
  }

  interface TabGroup {
      label: string;
      tabs: Tab[];
  }

  const validateTab : Tab = { label: 'Validate', component: Validate , class: 'btn btn-primary' };
  let replyGroups : TabGroup[] = [];
  let activityType : string | undefined;

  let activeTab : Tab | null = null;

  onMount(async () => {
      $notificationData = await getNotification(notificationUrl) as Notification;
      activityType = $notificationData?.object?.type?.find(t => t.startsWith(AS))?.replace(AS, "");
      if ($notificationData?.object?.type?.includes(`${AS}Offer`)) {
        replyGroups = [
          { label: 'Decide', tabs: [
            { label: 'Accept', component: Accept , class: 'btn btn-info' },
            { label: 'Reject', component: Reject , class: 'btn btn-warning' }
          ]},
          { label: 'Report', tabs: [
            { label: 'Flag', component: Flag , class: 'btn btn-danger' }
          ]},
          { label: 'Inform', tabs: [
            { label: 'Announce', component: Announce , class: 'btn btn-success' }
          ]}
        ];
      }
  });
</script>

<nav class="navbar">
    <a href="/inbox" use:link class="btn btn-light text-decoration-none">&lt; BACK TO INBOX</a>
</nav>

{#if $notificationData} 
    <div class="card-body">
      {#if $notificationData.object?.id}
        <h3>
          Notification {$notificationData.object?.id}
          {#if replyGroups.length}
            <span class="badge rounded-pill text-bg-warning fs-6 align-middle">Awaiting reply</span>
          {:else}
            <span class="badge rounded-pill text-bg-light border fs-6 align-middle">No reply needed</span>
          {/if}
        </h3>
      {:else}
        <h3>Invalid Notification</h3>
      {/if}
      <div class="view-controls">
        <h6 class="mb-0">
          <a href={notificationUrl} target="_blank" rel="noopener noreferrer" class="link-secondary">{notificationUrl}</a>
        </h6>
        <div class="btn-group btn-group-sm" role="group" aria-label="View as">
          {#each views as v}
            <button
              type="button"
              class="btn btn-outline-secondary"
              class:active={view === v.id}
              aria-pressed={view === v.id}
              on:click={() => view = v.id}
            >{v.label}</button>
          {/each}
        </div>
      </div>
      {#if view === 'graph'}
        <GraphNotification data={$notificationData.data}/>
      {:else if view === 'source'}
        <RawNotification data={$notificationData.data}/>
      {:else}
        <ParsedNotification object={$notificationData.object}/>
      {/if}

      <div class="tab-container">
        <nav>
            <div class="action-group">
              <span class="group-label">Check</span>
              <button
                class={validateTab.class}
                class:active={activeTab === validateTab}
                on:click={() => activeTab = validateTab}
              >
              {validateTab.label}
              </button>
            </div>
            {#each replyGroups as group}
            <div class="vr"></div>
            <div class="action-group">
              <span class="group-label">{group.label}</span>
              {#each group.tabs as tab}
              <button
                class={tab.class}
                class:active={activeTab === tab}
                on:click={() => activeTab = tab}
              >
              {tab.label}
              </button>
              {/each}
            </div>
            {:else}
            <div class="vr"></div>
            <div class="action-group">
              <span class="group-label">Reply</span>
              <span class="text-secondary fst-italic">
                {activityType ?? 'This notification'} is informational, no reply expected
              </span>
            </div>
            {/each}
        </nav>
      </div>
    </div>
    <hr>

    <div class="card-body">
      {#if activeTab}
        <svelte:component 
          this={activeTab.component} 
          on:changeTab={ (e) => { 
              activeTab = null;
              showToast = true;
              toastMessage = e.detail;
              setTimeout(() => { showToast = false;}, 3000);
          }}
          />
      {/if}
    </div>
{/if}

{#if showToast}
  <div class="toast-container position-fixed bottom-0 end-0 p-3">
    <div class="toast show align-items-center text-white bg-success border-0" role="alert">
      <div class="d-flex">
        <div class="toast-body">
          {toastMessage}
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

<style>
  .error {
    color: #dc3545;          /* Bootstrap's danger red */
    background-color: #f8d7da;
    border: 1px solid #f5c2c7;
    border-radius: 0.375rem;
    padding: 0.75rem 1rem;
    margin-top: 1rem;
  }

  nav {
    display: flex;       /* Lined up in a row */
    gap: 12px;           /* The magic spacing property */
    margin-bottom: 5px;  /* Space between buttons and the content div */
  }

  .action-group {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .group-label {
    font-size: 0.75rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: var(--bs-secondary-color);
  }

  .view-controls {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 8px;
    margin-bottom: 12px;
  }

</style>