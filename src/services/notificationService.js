// Web Push Notification service
export const requestNotificationPermission = async () => {
  if (!('Notification' in window)) return 'unsupported';
  if (Notification.permission === 'granted') return 'granted';
  if (Notification.permission === 'denied') return 'denied';
  const permission = await Notification.requestPermission();
  return permission;
};

export const sendNotification = (title, options = {}) => {
  if (Notification.permission !== 'granted') return;
  const notification = new Notification(title, {
    icon: '/favicon.svg',
    badge: '/favicon.svg',
    ...options,
  });
  notification.onclick = () => {
    window.focus();
    notification.close();
  };
  return notification;
};

export const isNotificationSupported = () => 'Notification' in window;
export const getNotificationPermission = () => Notification.permission;
