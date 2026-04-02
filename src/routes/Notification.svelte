<script lang="ts">
    import type { ComponentType } from 'svelte';
    import { onMount } from 'svelte';
    import { notificationData } from '../store';
    import { INBOX_URL } from "../globals";
	  import { getNotification , type Notification } from "../inbox";
    import Toggle from "./Helper/Toggle.svelte";
    import ParsedNotification from './NotificationParts/ParsedNotification.svelte';
    import RawNotification from './NotificationParts/RawNotification.svelte';
    import Validate from './ResponseButtons/Validate.svelte';
    import Accept from './ResponseButtons/Accept.svelte';
    import Reject from './ResponseButtons/Reject.svelte';
    import Announce from './ResponseButtons/Announce.svelte';

    export let params: { name?: string } = {};

    let showToast = false;
    let toastMessage = "";
    let viewSource = false;
    let inbox = INBOX_URL;
    let notificationUrl = inbox + params.name;

    interface Tab {
        label: string;
        component: ComponentType; 
        class: string;
    }

    const tabs : Tab[] = [
        { label: 'Validate', component: Validate , class: 'btn btn-primary' },
        { label: 'Accept', component: Accept , class: 'btn btn-info' },
        { label: 'Reject', component: Reject , class: 'btn btn-warning' },
        { label: 'Announce', component: Announce , class: 'btn btn-success' }
    ];

    let activeTab : Tab | null = null;

    onMount(async () => {
        $notificationData = await getNotification(notificationUrl) as Notification;
    });
</script>

<nav class="navbar">
    <a href="/" class="btn btn-light text-decoration-none">INBOX</a>
</nav>

{#if $notificationData} 
    <div class="card-body">
      <h3>Notification {$notificationData.object?.id}</h3>
      <h6>{inbox}{params.name}</h6>
      <Toggle bind:enabled={viewSource}/>
      {#if viewSource}
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

</style>