import { useState, useEffect, useCallback, useRef } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { useSettings } from './useSettings';
import { usePrayerTimes } from './usePrayerTimes';
import { useAppMode } from './useAppMode';
import { toast } from '@/hooks/use-toast';

export interface ScheduledNotification {
  id: string;
  title: string;
  body: string;
  time: string;
  type: 'prayer' | 'adhkar' | 'quran' | 'iftar' | 'suhoor' | 'custom' | 'motivational';
  enabled: boolean;
  repeat: 'daily' | 'once' | 'custom';
}

// رسائل تحفيزية رمضانية
const ramadanMotivations = [
  { title: '🌙 رمضان كريم', body: 'اللهم بلغنا ليلة القدر، أكثر من الدعاء والاستغفار في هذا الشهر الفضيل' },
  { title: '📿 وقت التسبيح', body: 'سبحان الله وبحمده سبحان الله العظيم — كلمتان خفيفتان على اللسان ثقيلتان في الميزان' },
  { title: '📖 ورد القرآن', body: 'هل قرأت وردك اليوم؟ شهر رمضان الذي أنزل فيه القرآن' },
  { title: '🤲 ساعة إجابة', body: 'لا تنسَ الدعاء قبل الإفطار، فللصائم عند فطره دعوة لا تُرد' },
  { title: '💪 صبراً جميلاً', body: 'أنت في شهر الصبر والمغفرة، واصل اجتهادك والأجر عظيم' },
  { title: '🕌 قيام الليل', body: 'من قام رمضان إيماناً واحتساباً غُفر له ما تقدم من ذنبه' },
  { title: '🌟 أذكار المساء', body: 'حان وقت أذكار المساء، حصّن نفسك بذكر الله' },
  { title: '☀️ أذكار الصباح', body: 'صباح الخير! لا تنسَ أذكار الصباح — أصبحنا وأصبح الملك لله' },
  { title: '❤️ صدقة اليوم', body: 'تصدّق ولو بالقليل، الصدقة تطفئ غضب الرب وتدفع ميتة السوء' },
  { title: '🌙 العشر الأواخر', body: 'اجتهد في العشر الأواخر، فيها ليلة خير من ألف شهر' },
];

// رسائل تحفيزية عامة (بعد رمضان/شوال)
const islamicMotivations = [
  { title: '🌅 صباح الخير', body: 'أصبحنا وأصبح الملك لله، لا تنسَ أذكار الصباح' },
  { title: '📿 ذكر الله', body: 'ألا بذكر الله تطمئن القلوب — سبّح الله في كل حين' },
  { title: '📖 القرآن الكريم', body: 'اقرأ ولو آية واحدة، فالقرآن يشفع لصاحبه يوم القيامة' },
  { title: '🤲 لا تنسَ الدعاء', body: 'ادعوني أستجب لكم — ارفع يديك بالدعاء' },
  { title: '🕌 حافظ على صلاتك', body: 'إن الصلاة كانت على المؤمنين كتاباً موقوتاً' },
  { title: '💡 صيام النوافل', body: 'صيام ست من شوال كصيام الدهر، لا تفوّت الأجر!' },
  { title: '🎉 عيد مبارك', body: 'تقبل الله منا ومنكم، لا تنسَ صلة الأرحام والفرحة بالعيد' },
  { title: '⭐ الإحسان', body: 'إن الله يحب المحسنين — أحسن في عملك وعبادتك' },
  { title: '🌙 أذكار المساء', body: 'أمسينا وأمسى الملك لله — حصّن نفسك بأذكار المساء' },
  { title: '💪 الاستمرارية', body: 'أحب الأعمال إلى الله أدومها وإن قلّ — واصل عباداتك بعد رمضان' },
];

// رسائل عند فتح التطبيق
const ramadanOpenMessages = [
  'رمضان كريم! 🌙 اللهم أعنّا على الصيام والقيام',
  'مرحباً بك في شهر الرحمة والمغفرة 💫',
  'هل قرأت وردك اليوم؟ 📖 هيا نبدأ!',
  'أحسنت بفتح التطبيق! كل ذكر لله هو خطوة نحو الجنة 🤲',
  'اللهم بلّغنا ليلة القدر 🌟',
];

const islamicOpenMessages = [
  'السلام عليكم ورحمة الله 🌅',
  'مرحباً بك في رفيق المسلم 💫 لا تنسَ ذكر الله',
  'أحسنت! كل يوم فرصة جديدة للعبادة 🤲',
  'هل صلّيت اليوم؟ 🕌 حافظ على صلواتك',
  'تقبل الله طاعاتكم ⭐',
];

function isDndActive(settings: any): boolean {
  if (!settings.notifications.doNotDisturb) return false;
  const now = new Date();
  const currentTime = now.getHours() * 60 + now.getMinutes();
  const [startHour, startMin] = settings.notifications.doNotDisturbStart.split(':').map(Number);
  const [endHour, endMin] = settings.notifications.doNotDisturbEnd.split(':').map(Number);
  const startTime = startHour * 60 + startMin;
  const endTime = endHour * 60 + endMin;

  if (startTime > endTime) {
    return currentTime >= startTime || currentTime < endTime;
  }
  return currentTime >= startTime && currentTime < endTime;
}

export function useNotifications() {
  const { settings } = useSettings();
  const { prayerTimes } = usePrayerTimes();
  const { mode } = useAppMode();
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [scheduledNotifications, setScheduledNotifications] = useLocalStorage<ScheduledNotification[]>(
    'scheduled-notifications', []
  );
  const [lastOpenToast, setLastOpenToast] = useLocalStorage<string>('last-open-toast', '');
  const sentTimesRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    if ('Notification' in window) {
      setPermission(Notification.permission);
    }
  }, []);

  const requestPermission = useCallback(async () => {
    if (!('Notification' in window)) {
      toast({ title: 'غير مدعوم', description: 'المتصفح لا يدعم الإشعارات', variant: 'destructive' });
      return false;
    }
    try {
      const result = await Notification.requestPermission();
      setPermission(result);
      if (result === 'granted') {
        toast({ title: 'تم التفعيل ✅', description: 'تم تفعيل الإشعارات بنجاح' });
        return true;
      }
      toast({ title: 'تم الرفض', description: 'لم يتم السماح بالإشعارات', variant: 'destructive' });
      return false;
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      return false;
    }
  }, []);

  const sendNotification = useCallback((title: string, body: string, icon?: string) => {
    if (permission !== 'granted') return;
    if (isDndActive(settings)) return;

    try {
      new Notification(title, {
        body, icon: icon || '/favicon.ico', badge: '/favicon.ico', dir: 'rtl', lang: 'ar',
      });
    } catch (error) {
      console.error('Error sending notification:', error);
    }
  }, [permission, settings]);

  const showInAppToast = useCallback((title: string, body: string) => {
    toast({ title, description: body });
  }, []);

  // إشعار تحفيزي عند فتح التطبيق
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    if (lastOpenToast === today) return;

    const messages = mode === 'ramadan' ? ramadanOpenMessages : islamicOpenMessages;
    const msg = messages[Math.floor(Math.random() * messages.length)];

    setTimeout(() => {
      showInAppToast('رفيق المسلم', msg);
      setLastOpenToast(today);
    }, 1500);
  }, [lastOpenToast, mode, showInAppToast, setLastOpenToast]);

  // مراقبة أوقات الصلوات وإرسال إشعارات
  useEffect(() => {
    if (!settings.notifications.enabled || !settings.notifications.prayerTimes || !prayerTimes) return;

    const prayerNames: Record<string, string> = {
      fajr: 'الفجر', dhuhr: 'الظهر', asr: 'العصر', maghrib: 'المغرب', isha: 'العشاء',
    };

    const prayerMotivations: Record<string, string[]> = {
      fajr: [
        'صلاة الفجر نور يوم جديد 🌅',
        'من صلى الفجر في جماعة فكأنما قام الليل كله',
        'بكّر إلى صلاة الفجر وابدأ يومك بالنور',
      ],
      dhuhr: [
        'حان وقت صلاة الظهر 🕌',
        'لا تؤخر صلاتك، فالصلاة خير من النوم والراحة',
      ],
      asr: [
        'صلاة العصر — الصلاة الوسطى 🌤️',
        'حافظوا على الصلوات والصلاة الوسطى',
      ],
      maghrib: mode === 'ramadan'
        ? ['حان وقت الإفطار! 🤲 اللهم لك صمت وعلى رزقك أفطرت', 'ذهب الظمأ وابتلت العروق وثبت الأجر إن شاء الله']
        : ['حان وقت صلاة المغرب 🌅', 'لا تنسَ صلاة المغرب'],
      isha: [
        'حان وقت صلاة العشاء 🌙',
        mode === 'ramadan' ? 'صلاة العشاء والتراويح — اللهم تقبل منا' : 'حافظ على صلاة العشاء',
      ],
    };

    const checkInterval = setInterval(() => {
      const now = new Date();
      const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
      const reminderMin = settings.notifications.prayerReminder;

      for (const [key, name] of Object.entries(prayerNames)) {
        const prayerTime = prayerTimes[key as keyof typeof prayerTimes];
        if (!prayerTime) continue;

        const sentKey = `${key}-${now.toISOString().split('T')[0]}`;

        // إشعار عند وقت الأذان
        if (prayerTime === currentTime && !sentTimesRef.current.has(sentKey)) {
          const motivations = prayerMotivations[key] || [`حان وقت صلاة ${name}`];
          const msg = motivations[Math.floor(Math.random() * motivations.length)];
          sendNotification(`🕌 حان وقت ${name}`, msg);
          showInAppToast(`🕌 حان وقت ${name}`, msg);
          sentTimesRef.current.add(sentKey);
        }

        // تذكير قبل الأذان
        if (reminderMin > 0) {
          const [ph, pm] = prayerTime.split(':').map(Number);
          const reminderMinutes = ph * 60 + pm - reminderMin;
          const rH = Math.floor(reminderMinutes / 60);
          const rM = reminderMinutes % 60;
          const reminderTime = `${String(rH).padStart(2, '0')}:${String(rM).padStart(2, '0')}`;
          const reminderKey = `reminder-${key}-${now.toISOString().split('T')[0]}`;

          if (reminderTime === currentTime && !sentTimesRef.current.has(reminderKey)) {
            sendNotification(`⏰ تذكير: ${name} بعد ${reminderMin} دقيقة`, `استعد لصلاة ${name}`);
            sentTimesRef.current.add(reminderKey);
          }
        }
      }
    }, 30000); // كل 30 ثانية

    return () => clearInterval(checkInterval);
  }, [settings.notifications, prayerTimes, mode, sendNotification, showInAppToast]);

  // إشعارات أذكار الصباح والمساء
  useEffect(() => {
    if (!settings.notifications.enabled) return;

    const checkInterval = setInterval(() => {
      const now = new Date();
      const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
      const dateKey = now.toISOString().split('T')[0];

      if (settings.notifications.morningAdhkar && currentTime === settings.notifications.morningAdhkarTime) {
        const key = `morning-adhkar-${dateKey}`;
        if (!sentTimesRef.current.has(key)) {
          sendNotification('☀️ أذكار الصباح', 'حان وقت أذكار الصباح — أصبحنا وأصبح الملك لله');
          showInAppToast('☀️ أذكار الصباح', 'حان وقت تحصين يومك بأذكار الصباح');
          sentTimesRef.current.add(key);
        }
      }

      if (settings.notifications.eveningAdhkar && currentTime === settings.notifications.eveningAdhkarTime) {
        const key = `evening-adhkar-${dateKey}`;
        if (!sentTimesRef.current.has(key)) {
          sendNotification('🌙 أذكار المساء', 'حان وقت أذكار المساء — أمسينا وأمسى الملك لله');
          showInAppToast('🌙 أذكار المساء', 'حصّن نفسك بأذكار المساء');
          sentTimesRef.current.add(key);
        }
      }

      if (settings.notifications.quranWird && currentTime === settings.notifications.quranWirdTime) {
        const key = `quran-wird-${dateKey}`;
        if (!sentTimesRef.current.has(key)) {
          const msg = mode === 'ramadan'
            ? 'شهر رمضان الذي أنزل فيه القرآن — اقرأ وردك اليوم'
            : 'اقرأ ولو آية — فالقرآن يشفع لصاحبه يوم القيامة';
          sendNotification('📖 ورد القرآن', msg);
          showInAppToast('📖 ورد القرآن', msg);
          sentTimesRef.current.add(key);
        }
      }
    }, 30000);

    return () => clearInterval(checkInterval);
  }, [settings.notifications, mode, sendNotification, showInAppToast]);

  // إشعار تحفيزي عشوائي كل 3 ساعات
  useEffect(() => {
    if (!settings.notifications.enabled) return;

    const motivationalInterval = setInterval(() => {
      const now = new Date();
      const hour = now.getHours();
      // فقط بين 6 صباحاً و11 مساءً
      if (hour < 6 || hour > 23) return;
      if (isDndActive(settings)) return;

      // 20% احتمال كل 3 ساعات
      if (Math.random() > 0.2) return;

      const messages = mode === 'ramadan' ? ramadanMotivations : islamicMotivations;
      const msg = messages[Math.floor(Math.random() * messages.length)];
      sendNotification(msg.title, msg.body);
    }, 3 * 60 * 60 * 1000); // كل 3 ساعات

    return () => clearInterval(motivationalInterval);
  }, [settings.notifications.enabled, mode, sendNotification, settings]);

  const scheduleNotification = useCallback((notification: Omit<ScheduledNotification, 'id'>) => {
    const newNotification: ScheduledNotification = { ...notification, id: Date.now().toString() };
    setScheduledNotifications(prev => [...prev, newNotification]);
    return newNotification.id;
  }, [setScheduledNotifications]);

  const cancelNotification = useCallback((id: string) => {
    setScheduledNotifications(prev => prev.filter(n => n.id !== id));
  }, [setScheduledNotifications]);

  const toggleNotification = useCallback((id: string) => {
    setScheduledNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, enabled: !n.enabled } : n))
    );
  }, [setScheduledNotifications]);

  // Legacy scheduled notifications check
  useEffect(() => {
    if (!settings.notifications.enabled || permission !== 'granted') return;
    const checkInterval = setInterval(() => {
      const now = new Date();
      const currentTime = now.toTimeString().slice(0, 5);
      scheduledNotifications.filter(n => n.enabled && n.time === currentTime).forEach(n => {
        sendNotification(n.title, n.body);
      });
    }, 60000);
    return () => clearInterval(checkInterval);
  }, [scheduledNotifications, settings.notifications.enabled, permission, sendNotification]);

  return {
    permission,
    requestPermission,
    sendNotification,
    showInAppToast,
    scheduleNotification,
    cancelNotification,
    toggleNotification,
    scheduledNotifications,
    isSupported: 'Notification' in window,
    mode,
  };
}
