import { useState, useEffect } from 'react';
import {
  requestNotificationPermission,
  sendNotification,
  isNotificationSupported,
  getNotificationPermission,
} from '../services/notificationService';

export const useNotifications = () => {
  const [permission, setPermission] = useState(
    isNotificationSupported() ? getNotificationPermission() : 'unsupported'
  );

  useEffect(() => {
    if (isNotificationSupported()) {
      setPermission(getNotificationPermission());
    }
  }, []);

  const requestPermission = async () => {
    const result = await requestNotificationPermission();
    setPermission(result);
    return result;
  };

  const notify = (title, options) => {
    sendNotification(title, options);
  };

  return { permission, requestPermission, notify };
};
