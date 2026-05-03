self.addEventListener('push', (event) => {
  const data = event.data?.json() ?? {};

  event.waitUntil(
    self.registration.showNotification(data.title ?? 'Notification', {
      body: data.body ?? '',
      icon: data.icon ?? '/src/lib/assets/leave_credit_system_logo.png',
      badge: data.badge ?? '/src/lib/assets/leave_credit_system_logo.png',
      data: data.url ? { url: data.url } : undefined,
    })
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  if (event.notification.data?.url) {
    event.waitUntil(clients.openWindow(event.notification.data.url));
  }
});