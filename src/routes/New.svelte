<script lang="ts">
    import { link } from 'svelte-spa-router';
    import type { ComponentType } from 'svelte';
    import { notificationData } from '../store';
    import Announce from './ResponseButtons/Announce.svelte';
    import Offer from './ResponseButtons/Offer.svelte';
    import { getNewNotification , type Notification } from "../inbox";
    import { onMount } from 'svelte';

    let showToast = false;
    let toastMessage = "";

    interface Tab {
        label: string;
        component: ComponentType; 
        class: string;
    }

    const tabs : Tab[] = [
      { label: 'Offer', component: Offer, class: 'btn btn-success' },
      { label: 'Announce', component: Announce , class: 'btn btn-success' }
    ];

    let activeTab : Tab | null = null;

    onMount(async () => {
      $notificationData = await getNewNotification() as Notification;
    });
</script>

<h3>New Notification</h3>

<nav class="navbar">
    <a href="/" use:link class="btn btn-light text-decoration-none">&lt; BACK TO INBOX</a>
</nav>

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