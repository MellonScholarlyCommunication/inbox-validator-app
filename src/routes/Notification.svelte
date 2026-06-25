<script lang="ts">
  import { link } from 'svelte-spa-router';
  import type { ComponentType } from 'svelte';
  import { onMount } from 'svelte';
  import { notificationData } from '../store';
  import { defaultOptions} from "../store";
  import { AS } from "../globals";
  import { getNotification , type Notification } from "../inbox";
  import Toggle from "./Helper/Toggle.svelte";
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
  let viewSource = false;
  let showGraph = false;
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

  let tabs : Tab[] = [];

  let activeTab : Tab | null = null;

  onMount(async () => {
      $notificationData = await getNotification(notificationUrl) as Notification;
      if ($notificationData?.object?.type?.includes(`${AS}Offer`)) {
        tabs = [
          { label: 'Validate', component: Validate , class: 'btn btn-primary' },
          { label: 'Flag', component: Flag , class: 'btn btn-danger' },
          { label: 'Accept', component: Accept , class: 'btn btn-info' },
          { label: 'Reject', component: Reject , class: 'btn btn-warning' },
          { label: 'Announce', component: Announce , class: 'btn btn-success' }
        ];
      }
      else {
        tabs = [
          { label: 'Validate', component: Validate , class: 'btn btn-primary' },
        ]; 
      }
  });
</script>

<nav class="navbar">
    <a href="/" use:link class="btn btn-light text-decoration-none">&lt; BACK TO INBOX</a>
</nav>

{#if $notificationData} 
    <div class="card-body">
      {#if $notificationData.object?.id}
        <h3>Notification {$notificationData.object?.id}</h3>
      {:else}
        <h3>Invalid Notification</h3>
      {/if}
      <h6>{inbox}{params.name}</h6>
      <div class="view-controls">
        <Toggle bind:enabled={viewSource}/>
        <button class="btn btn-outline-dark graph-btn" on:click={() => showGraph = !showGraph}>
          <svg class="rdf-icon" viewBox="0 0 24 24" aria-hidden="true">
            <line x1="12" y1="5" x2="5" y2="18"/>
            <line x1="12" y1="5" x2="19" y2="18"/>
            <line x1="5" y1="18" x2="19" y2="18"/>
            <circle cx="12" cy="5" r="3"/>
            <circle cx="5" cy="18" r="3"/>
            <circle cx="19" cy="18" r="3"/>
          </svg>
          {showGraph ? 'Hide graph' : 'View graph'}
        </button>
      </div>
      {#if showGraph}
        <GraphNotification data={$notificationData.data}/>
      {:else if viewSource}
        <RawNotification data={$notificationData.data}/>
      {:else}
        <ParsedNotification object={$notificationData.object}/>
      {/if}

      <div class="tab-container">
        <nav>
            {#each tabs as tab}
            <button 
              class={tab.class}
              class:active={activeTab === tab} 
              on:click={() => activeTab = tab}
            >
            {tab.label}
            </button> 
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

  .view-controls {
    display: flex;
    align-items: center;
    gap: 16px;
    margin-bottom: 8px;
  }

  .rdf-icon {
    width: 1.1em;
    height: 1.1em;
    margin-right: 6px;
    vertical-align: -0.15em;
    fill: currentColor;
    stroke: currentColor;
    stroke-width: 1.5;
  }

  /* Keep the graph button from flipping colours on hover/focus/active */
  .graph-btn:hover,
  .graph-btn:focus,
  .graph-btn:active {
    color: var(--bs-btn-color);
    background-color: transparent;
    border-color: var(--bs-btn-border-color);
    box-shadow: none;
  }

</style>