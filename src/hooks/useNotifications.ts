import { useState, useEffect, useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { useSettings } from './useSettings';
import { toast } from '@/hooks/use-toast';

export interface ScheduledNotification {
  id: string;
  title: string;
  body: string;
  time: string;
  type: 'prayer' | 'adhkar' | 'quran' | 'iftar' | 'suhoor' | 'custom';
  enabled: boolean;
  repeat: 'daily' | 'once' | 'custom';
}

export function useNotifications() {
  const { settings } = useSettings();
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [scheduledNotifications, setScheduledNotifications] = useLocalStorage<ScheduledNotification[]>(
    'scheduled-notifications',
    []
  );

  // التحقق من صلاحيات الإشعارات
  useEffect(() => {
    if ('Notification' in window) {
      setPermission(Notification.permission);
    }
  }, []);

  // طلب صلاحية الإشعارات
  const requestPermission = useCallback(async () => {
    if (!('Notification' in window)) {
      toast({
        title: 'غير مدعوم',
        description: 'المتصفح لا يدعم الإشعارات',
        variant: 'destructive',
      });
      return false;
    }

    try {
      const result = await Notification.requestPermission();
      setPermission(result);
      
      if (result === 'granted') {
        toast({
          title: 'تم التفعيل',
          description: 'تم تفعيل الإشعارات بنجاح',
        });
        return true;
      } else {
        toast({
          title: 'تم الرفض',
          description: 'لم يتم السماح بالإشعارات',
          variant: 'destructive',
        });
        return false;
      }
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      return false;
    }
  }, []);

  // إرسال إشعار فوري
  const sendNotification = useCallback((title: string, body: string, icon?: string) => {
    if (permission !== 'granted') {
      console.log('Notifications not permitted');
      return;
    }

    // التحقق من وضع عدم الإزعاج
    if (settings.notifications.doNotDisturb) {
      const now = new Date();
      const currentTime = now.getHours() * 60 + now.getMinutes();
      const [startHour, startMin] = settings.notifications.doNotDisturbStart.split(':').map(Number);
      const [endHour, endMin] = settings.notifications.doNotDisturbEnd.split(':').map(Number);
      const startTime = startHour * 60 + startMin;
      const endTime = endHour * 60 + endMin;

      if (startTime > endTime) {
        // يمتد عبر منتصف الليل
        if (currentTime >= startTime || currentTime < endTime) {
          console.log('Do not disturb mode active');
          return;
        }
      } else {
        if (currentTime >= startTime && currentTime < endTime) {
          console.log('Do not disturb mode active');
          return;
        }
      }
    }

    try {
      new Notification(title, {
        body,
        icon: icon || '/favicon.ico',
        badge: '/favicon.ico',
        dir: 'rtl',
        lang: 'ar',
      });
    } catch (error) {
      console.error('Error sending notification:', error);
    }
  }, [permission, settings.notifications]);

  // جدولة إشعار
  const scheduleNotification = useCallback((notification: Omit<ScheduledNotification, 'id'>) => {
    const newNotification: ScheduledNotification = {
      ...notification,
      id: Date.now().toString(),
    };
    setScheduledNotifications(prev => [...prev, newNotification]);
    return newNotification.id;
  }, [setScheduledNotifications]);

  // إلغاء إشعار مجدول
  const cancelNotification = useCallback((id: string) => {
    setScheduledNotifications(prev => prev.filter(n => n.id !== id));
  }, [setScheduledNotifications]);

  // تبديل حالة الإشعار
  const toggleNotification = useCallback((id: string) => {
    setScheduledNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, enabled: !n.enabled } : n))
    );
  }, [setScheduledNotifications]);

  // التحقق من الإشعارات المجدولة
  useEffect(() => {
    if (!settings.notifications.enabled || permission !== 'granted') return;

    const checkInterval = setInterval(() => {
      const now = new Date();
      const currentTime = now.toTimeString().slice(0, 5);

      scheduledNotifications
        .filter(n => n.enabled && n.time === currentTime)
        .forEach(n => {
          sendNotification(n.title, n.body);
        });
    }, 60000); // كل دقيقة

    return () => clearInterval(checkInterval);
  }, [scheduledNotifications, settings.notifications.enabled, permission, sendNotification]);

  // إشعارات مسبقة التحديد
  const prayerNotifications = [
    { name: 'الفجر', arabicTime: 'صلاة الفجر' },
    { name: 'الظهر', arabicTime: 'صلاة الظهر' },
    { name: 'العصر', arabicTime: 'صلاة العصر' },
    { name: 'المغرب', arabicTime: 'صلاة المغرب' },
    { name: 'العشاء', arabicTime: 'صلاة العشاء' },
  ];

  return {
    permission,
    requestPermission,
    sendNotification,
    scheduleNotification,
    cancelNotification,
    toggleNotification,
    scheduledNotifications,
    prayerNotifications,
    isSupported: 'Notification' in window,
  };
}
