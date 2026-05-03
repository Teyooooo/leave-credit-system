import { writable } from 'svelte/store';

export const pushSubscription = writable<PushSubscription | null>(null);
export const pushSupported = writable(false);

export async function registerServiceWorker() {
  if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
    pushSupported.set(false);
    return null;
  }

  pushSupported.set(true);

  const registration = await navigator.serviceWorker.register('/sw.js');
  await navigator.serviceWorker.ready;
  return registration;
}

export async function subscribeToPush(
  registration: ServiceWorkerRegistration,
  vapidPublicKey: string
) {
  const existing = await registration.pushManager.getSubscription();
  if (existing) {
    pushSubscription.set(existing);
    return existing;
  }

  try {
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(vapidPublicKey),
    });

    pushSubscription.set(subscription);
    return subscription;
  } catch (err: any) {
    console.error('Push subscribe error full:', err);
    throw err;
  }
}

export async function unsubscribeFromPush() {
  const reg = await navigator.serviceWorker.ready;
  const sub = await reg.pushManager.getSubscription();
  if (sub) {
    await sub.unsubscribe();
    pushSubscription.set(null);
  }
}

function urlBase64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = atob(base64);
  return Uint8Array.from([...rawData].map((c) => c.charCodeAt(0)));
}