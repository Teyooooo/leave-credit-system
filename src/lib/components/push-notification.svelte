<script lang="ts">
  import {
    registerServiceWorker,
    subscribeToPush,
    unsubscribeFromPush,
    pushSubscription,
    pushSupported,
  } from '$lib/store/pushStore';
  import { onMount } from 'svelte';
  import { PUBLIC_VAPID_KEY } from '$env/static/public';
	import { Button } from '$lib/components/ui/button';
	import type { EmployeeData } from '$lib/types/data';

  let registration: ServiceWorkerRegistration | null = null;

  let { employee, userIsSubscription } : { employee: EmployeeData; userIsSubscription: boolean } = $props();


  onMount(async () => {
    registration = await registerServiceWorker();
    if (registration) {
      const existing = await registration.pushManager.getSubscription();
      if (existing) pushSubscription.set(existing);
    }
  });

  async function handleSubscribe() {
    if (!registration) return;

    const permission = await Notification.requestPermission();
    console.log({permission})
    if (permission !== 'granted') return;

    console.log({registration, PUBLIC_VAPID_KEY})
    const sub = await subscribeToPush(registration, PUBLIC_VAPID_KEY);
    console.log({sub})

    await fetch('../api/push-notification/subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        subscription: sub,
        userUuid: employee.uuid,
      }),
    });
  }

  async function handleUnsubscribe() {
    const reg = await navigator.serviceWorker.ready;
    const sub = await reg.pushManager.getSubscription();

    if (sub) {
      await fetch('../api/push-notification/unsubscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userUuid: employee.uuid }),
      });
      await unsubscribeFromPush();
    }
  }
</script>

<div>

  {#if !$pushSupported}
  <p>Push notifications not supported in this browser.</p>
  {:else if !$pushSubscription || !userIsSubscription}
  <Button onclick={handleSubscribe}>Enable Notifications</Button>
  {:else}
  <Button onclick={handleUnsubscribe}>Disable Notifications</Button>
  {/if}
</div>