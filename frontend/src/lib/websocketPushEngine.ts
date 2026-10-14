export type PushProvider = 'pusher' | 'soketi' | 'webpush';

export interface WebSocketPushConfig {
  provider: PushProvider;
  pusherKey: string;
  pusherSecret?: string;
  pusherCluster: string;
  pusherAppId?: string;
  enableSessionBookedPush: boolean;
  enableChatMessagePush: boolean;
  enableLessonNotesPush: boolean;
  enablePayoutPush: boolean;
}

export const getSavedPushConfig = (): WebSocketPushConfig => {
  try {
    const saved = localStorage.getItem('akademi_push_config');
    if (saved) return JSON.parse(saved);
  } catch (e) {}
  return {
    provider: 'pusher',
    pusherKey: 'AKADEMI_PUSHER_KEY_2026',
    pusherSecret: 'AKADEMI_PUSHER_SECRET_SECURE',
    pusherCluster: 'eu',
    pusherAppId: '1892345',
    enableSessionBookedPush: true,
    enableChatMessagePush: true,
    enableLessonNotesPush: true,
    enablePayoutPush: true
  };
};

export const savePushConfig = (config: WebSocketPushConfig) => {
  localStorage.setItem('akademi_push_config', JSON.stringify(config));
  window.dispatchEvent(new Event('storage'));
};

export const requestWebPushPermission = async (): Promise<'granted' | 'denied' | 'default'> => {
  if (typeof window !== 'undefined' && 'Notification' in window) {
    try {
      const permission = await Notification.requestPermission();
      localStorage.setItem('akademi_push_permission', permission);
      return permission;
    } catch (e) {
      console.warn('Web Push Permission Request Error:', e);
    }
  }
  return 'denied';
};

export const getWebPushPermissionState = (): 'granted' | 'denied' | 'default' => {
  if (typeof window !== 'undefined' && 'Notification' in window) {
    return Notification.permission;
  }
  return 'denied';
};

export const sendNativePushNotification = (title: string, body: string, icon = '/images/hero-student.jpg', url = '/dashboard/notifications') => {
  if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
    try {
      const notif = new Notification(title, {
        body,
        icon,
        badge: '/images/hero-student.jpg',
        tag: `akademi-${Date.now()}`
      });

      notif.onclick = () => {
        window.focus();
        window.location.href = url;
      };
    } catch (e) {
      console.warn('Native Push Notification Error:', e);
    }
  }
};

export interface AppNotification {
  id: string;
  title: string;
  desc: string;
  time: string;
  read: boolean;
  type: 'session' | 'payment' | 'message' | 'course';
  link?: string;
}

export const appendAppNotification = (notif: Omit<AppNotification, 'id' | 'time' | 'read'>) => {
  try {
    const saved = localStorage.getItem('akademi_user_notifications');
    const list: AppNotification[] = saved ? JSON.parse(saved) : [];
    
    const newEntry: AppNotification = {
      ...notif,
      id: `notif-${Date.now()}`,
      time: 'Just now',
      read: false
    };

    const updated = [newEntry, ...list];
    localStorage.setItem('akademi_user_notifications', JSON.stringify(updated));
    window.dispatchEvent(new Event('storage'));

    // Trigger Native Push Notification Banner if permissions are granted
    sendNativePushNotification(notif.title, notif.desc, '/images/hero-student.jpg', notif.link || '/dashboard/notifications');
  } catch (e) {
    console.error('Error appending notification:', e);
  }
};

export const dispatchSessionBookedPush = (tutorName: string, subject: string, dateDisplay: string, amount: string) => {
  const config = getSavedPushConfig();
  if (!config.enableSessionBookedPush) return;

  appendAppNotification({
    title: `🎉 Session Booked with ${tutorName}`,
    desc: `Your ${subject} session (${dateDisplay}) is confirmed. Total: ${amount}.`,
    type: 'session',
    link: '/dashboard/sessions'
  });
};

export const dispatchChatMessagePush = (senderName: string, textSnippet: string) => {
  const config = getSavedPushConfig();
  if (!config.enableChatMessagePush) return;

  appendAppNotification({
    title: `💬 New Message from ${senderName}`,
    desc: textSnippet.length > 70 ? `${textSnippet.slice(0, 70)}...` : textSnippet,
    type: 'message',
    link: `/dashboard/messages?recipient=${encodeURIComponent(senderName)}`
  });
};

export const dispatchLessonNotesPush = (tutorName: string, topic: string) => {
  const config = getSavedPushConfig();
  if (!config.enableLessonNotesPush) return;

  appendAppNotification({
    title: `📚 Lesson Notes Uploaded by ${tutorName}`,
    desc: `New summary formulas and study pack materials uploaded for ${topic}.`,
    type: 'course',
    link: '/dashboard/sessions'
  });
};

export const dispatchPayoutPush = (amount: string, status: string) => {
  const config = getSavedPushConfig();
  if (!config.enablePayoutPush) return;

  appendAppNotification({
    title: `💳 Payout Withdrawal ${status}`,
    desc: `Your tutor withdrawal of ${amount} has been ${status.toLowerCase()} by platform admin.`,
    type: 'payment',
    link: '/dashboard/billing'
  });
};
