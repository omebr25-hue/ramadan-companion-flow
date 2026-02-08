import { useState } from 'react';
import {
  Settings,
  Moon,
  Sun,
  Bell,
  BellOff,
  MapPin,
  Type,
  Download,
  Upload,
  RotateCcw,
  ChevronLeft,
  Clock,
  BookOpen,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { useSettings } from '@/hooks/useSettings';
import { useNotifications } from '@/hooks/useNotifications';
import { toast } from '@/hooks/use-toast';

export function SettingsView() {
  const { settings, updateSettings, updateNotifications, resetSettings, applyTheme } = useSettings();
  const { permission, requestPermission, isSupported } = useNotifications();
  const [activeSection, setActiveSection] = useState<string | null>(null);

  const handleThemeChange = (theme: 'dark' | 'light') => {
    updateSettings({ theme });
    setTimeout(applyTheme, 0);
  };

  const handleExport = () => {
    const data = {
      settings,
      quranProgress: localStorage.getItem('quran-completed-pages'),
      adhkarProgress: localStorage.getItem('adhkar-progress'),
      worshipTracker: localStorage.getItem('worship-tracker'),
      accountability: localStorage.getItem('accountability-records'),
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ramadan-companion-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    
    toast({
      title: 'تم التصدير',
      description: 'تم تصدير البيانات بنجاح',
    });
  };

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const data = JSON.parse(event.target?.result as string);
          if (data.settings) updateSettings(data.settings);
          if (data.quranProgress) localStorage.setItem('quran-completed-pages', data.quranProgress);
          if (data.adhkarProgress) localStorage.setItem('adhkar-progress', data.adhkarProgress);
          if (data.worshipTracker) localStorage.setItem('worship-tracker', data.worshipTracker);
          if (data.accountability) localStorage.setItem('accountability-records', data.accountability);
          
          toast({
            title: 'تم الاستيراد',
            description: 'تم استيراد البيانات بنجاح',
          });
          window.location.reload();
        } catch (error) {
          toast({
            title: 'خطأ',
            description: 'فشل استيراد الملف',
            variant: 'destructive',
          });
        }
      };
      reader.readAsText(file);
    };
    input.click();
  };

  const handleReset = () => {
    if (confirm('هل أنت متأكد من إعادة ضبط جميع الإعدادات؟')) {
      resetSettings();
      toast({
        title: 'تم إعادة الضبط',
        description: 'تم إعادة الإعدادات إلى القيم الافتراضية',
      });
    }
  };

  const sections = [
    {
      id: 'appearance',
      title: 'المظهر',
      icon: settings.theme === 'dark' ? Moon : Sun,
      description: 'الثيم وحجم الخط',
    },
    {
      id: 'notifications',
      title: 'التنبيهات',
      icon: settings.notifications.enabled ? Bell : BellOff,
      description: 'تذكيرات الصلاة والأذكار',
    },
    {
      id: 'location',
      title: 'الموقع',
      icon: MapPin,
      description: 'إعدادات أوقات الصلاة',
    },
    {
      id: 'quran',
      title: 'القرآن الكريم',
      icon: BookOpen,
      description: 'إعدادات القراءة والعرض',
    },
    {
      id: 'data',
      title: 'البيانات',
      icon: Download,
      description: 'تصدير واستيراد البيانات',
    },
  ];

  if (activeSection) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => setActiveSection(null)}>
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <h2 className="text-xl font-bold text-foreground">
            {sections.find(s => s.id === activeSection)?.title}
          </h2>
        </div>

        {activeSection === 'appearance' && (
          <div className="glass-card p-6 space-y-6">
            <div>
              <Label className="text-foreground mb-4 block">المظهر</Label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => handleThemeChange('dark')}
                  className={`p-4 rounded-xl flex flex-col items-center gap-2 transition-all ${
                    settings.theme === 'dark'
                      ? 'bg-primary/20 border-2 border-primary'
                      : 'bg-secondary/50 border-2 border-transparent'
                  }`}
                >
                  <Moon className="w-8 h-8" />
                  <span className="text-sm">داكن</span>
                </button>
                <button
                  onClick={() => handleThemeChange('light')}
                  className={`p-4 rounded-xl flex flex-col items-center gap-2 transition-all ${
                    settings.theme === 'light'
                      ? 'bg-primary/20 border-2 border-primary'
                      : 'bg-secondary/50 border-2 border-transparent'
                  }`}
                >
                  <Sun className="w-8 h-8" />
                  <span className="text-sm">فاتح</span>
                </button>
              </div>
            </div>

            <div>
              <Label className="text-foreground mb-4 block">حجم الخط</Label>
              <div className="grid grid-cols-4 gap-2">
                {(['small', 'medium', 'large', 'xlarge'] as const).map((size) => (
                  <button
                    key={size}
                    onClick={() => updateSettings({ fontSize: size })}
                    className={`p-3 rounded-xl text-center transition-all ${
                      settings.fontSize === size
                        ? 'bg-primary/20 border-2 border-primary'
                        : 'bg-secondary/50 border-2 border-transparent'
                    }`}
                  >
                    <Type className={`mx-auto ${
                      size === 'small' ? 'w-4 h-4' :
                      size === 'medium' ? 'w-5 h-5' :
                      size === 'large' ? 'w-6 h-6' : 'w-7 h-7'
                    }`} />
                    <span className="text-xs mt-1 block">
                      {size === 'small' ? 'صغير' :
                       size === 'medium' ? 'متوسط' :
                       size === 'large' ? 'كبير' : 'كبير جداً'}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className="p-4 bg-secondary/30 rounded-xl">
              <p className="font-quran text-center" style={{ fontSize: settings.fontSize === 'small' ? '1.25rem' : settings.fontSize === 'medium' ? '1.5rem' : settings.fontSize === 'large' ? '2rem' : '2.5rem' }}>
                بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
              </p>
              <p className="text-xs text-muted-foreground text-center mt-2">معاينة حجم الخط</p>
            </div>
          </div>
        )}

        {activeSection === 'notifications' && (
          <div className="glass-card p-6 space-y-6">
            <div className="flex items-center justify-between">
              <Label className="text-foreground">تفعيل التنبيهات</Label>
              <Switch
                checked={settings.notifications.enabled}
                onCheckedChange={(enabled) => updateNotifications({ enabled })}
              />
            </div>

            {!isSupported && (
              <p className="text-sm text-destructive">المتصفح لا يدعم الإشعارات</p>
            )}

            {isSupported && permission !== 'granted' && (
              <Button onClick={requestPermission} className="w-full">
                السماح بالإشعارات
              </Button>
            )}

            {settings.notifications.enabled && (
              <>
                <div className="border-t border-border pt-4">
                  <h4 className="font-medium text-foreground mb-4">تنبيهات الصلاة</h4>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label>تنبيه أوقات الصلاة</Label>
                      <Switch
                        checked={settings.notifications.prayerTimes}
                        onCheckedChange={(prayerTimes) => updateNotifications({ prayerTimes })}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label>التذكير قبل الأذان (دقائق)</Label>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground w-8 text-center">
                          {settings.notifications.prayerReminder}
                        </span>
                        <Slider
                          value={[settings.notifications.prayerReminder]}
                          onValueChange={([value]) => updateNotifications({ prayerReminder: value })}
                          min={0}
                          max={30}
                          step={5}
                          className="w-24"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-t border-border pt-4">
                  <h4 className="font-medium text-foreground mb-4">تنبيهات الأذكار</h4>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>أذكار الصباح</Label>
                        <p className="text-xs text-muted-foreground">{settings.notifications.morningAdhkarTime}</p>
                      </div>
                      <Switch
                        checked={settings.notifications.morningAdhkar}
                        onCheckedChange={(morningAdhkar) => updateNotifications({ morningAdhkar })}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>أذكار المساء</Label>
                        <p className="text-xs text-muted-foreground">{settings.notifications.eveningAdhkarTime}</p>
                      </div>
                      <Switch
                        checked={settings.notifications.eveningAdhkar}
                        onCheckedChange={(eveningAdhkar) => updateNotifications({ eveningAdhkar })}
                      />
                    </div>
                  </div>
                </div>

                <div className="border-t border-border pt-4">
                  <h4 className="font-medium text-foreground mb-4">تنبيهات الإفطار والسحور</h4>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label>تذكير الإفطار</Label>
                      <Switch
                        checked={settings.notifications.iftarReminder}
                        onCheckedChange={(iftarReminder) => updateNotifications({ iftarReminder })}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label>تذكير السحور</Label>
                      <Switch
                        checked={settings.notifications.suhoorReminder}
                        onCheckedChange={(suhoorReminder) => updateNotifications({ suhoorReminder })}
                      />
                    </div>
                  </div>
                </div>

                <div className="border-t border-border pt-4">
                  <h4 className="font-medium text-foreground mb-4">وضع عدم الإزعاج</h4>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label>تفعيل وضع عدم الإزعاج</Label>
                      <Switch
                        checked={settings.notifications.doNotDisturb}
                        onCheckedChange={(doNotDisturb) => updateNotifications({ doNotDisturb })}
                      />
                    </div>
                    {settings.notifications.doNotDisturb && (
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex-1">
                          <Label className="text-xs">من</Label>
                          <input
                            type="time"
                            value={settings.notifications.doNotDisturbStart}
                            onChange={(e) => updateNotifications({ doNotDisturbStart: e.target.value })}
                            className="w-full bg-secondary/50 rounded-lg p-2 text-foreground"
                          />
                        </div>
                        <div className="flex-1">
                          <Label className="text-xs">إلى</Label>
                          <input
                            type="time"
                            value={settings.notifications.doNotDisturbEnd}
                            onChange={(e) => updateNotifications({ doNotDisturbEnd: e.target.value })}
                            className="w-full bg-secondary/50 rounded-lg p-2 text-foreground"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {activeSection === 'location' && (
          <div className="glass-card p-6 space-y-6">
            <div>
              <Label className="text-foreground mb-2 block">المدينة</Label>
              <input
                type="text"
                value={settings.city}
                onChange={(e) => updateSettings({ city: e.target.value })}
                className="w-full bg-secondary/50 rounded-xl p-3 text-foreground"
                placeholder="أدخل اسم المدينة"
              />
            </div>

            <div>
              <Label className="text-foreground mb-2 block">الدولة</Label>
              <input
                type="text"
                value={settings.country}
                onChange={(e) => updateSettings({ country: e.target.value })}
                className="w-full bg-secondary/50 rounded-xl p-3 text-foreground"
                placeholder="أدخل اسم الدولة"
              />
            </div>

            <div>
              <Label className="text-foreground mb-2 block">طريقة الحساب</Label>
              <select
                value={settings.calculationMethod}
                onChange={(e) => updateSettings({ calculationMethod: e.target.value })}
                className="w-full bg-secondary/50 rounded-xl p-3 text-foreground"
              >
                <option value="UmmAlQura">أم القرى</option>
                <option value="Egyptian">الهيئة المصرية</option>
                <option value="Karachi">جامعة كراتشي</option>
                <option value="ISNA">الجمعية الإسلامية لأمريكا الشمالية</option>
                <option value="MWL">رابطة العالم الإسلامي</option>
              </select>
            </div>

            <div className="p-4 bg-accent/10 rounded-xl">
              <p className="text-sm text-muted-foreground">
                <Clock className="w-4 h-4 inline ml-1" />
                سيتم حساب أوقات الصلاة بناءً على موقعك المحدد
              </p>
            </div>
          </div>
        )}

        {activeSection === 'quran' && (
          <div className="glass-card p-6 space-y-6">
            <div>
              <Label className="text-foreground mb-4 block">طريقة العرض</Label>
              <div className="grid grid-cols-3 gap-2">
                {(['page', 'surah', 'ayah'] as const).map((mode) => (
                  <button
                    key={mode}
                    onClick={() => updateSettings({ quran: { ...settings.quran, displayMode: mode } })}
                    className={`p-3 rounded-xl text-center transition-all ${
                      settings.quran.displayMode === mode
                        ? 'bg-primary/20 border-2 border-primary'
                        : 'bg-secondary/50 border-2 border-transparent'
                    }`}
                  >
                    <span className="text-sm">
                      {mode === 'page' ? 'صفحة' : mode === 'surah' ? 'سورة' : 'آية'}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <Label className="text-foreground">إظهار الترجمة</Label>
              <Switch
                checked={settings.quran.showTranslation}
                onCheckedChange={(showTranslation) =>
                  updateSettings({ quran: { ...settings.quran, showTranslation } })
                }
              />
            </div>
          </div>
        )}

        {activeSection === 'data' && (
          <div className="glass-card p-6 space-y-4">
            <Button onClick={handleExport} className="w-full" variant="outline">
              <Download className="w-5 h-5 ml-2" />
              تصدير البيانات
            </Button>

            <Button onClick={handleImport} className="w-full" variant="outline">
              <Upload className="w-5 h-5 ml-2" />
              استيراد البيانات
            </Button>

            <Button onClick={handleReset} className="w-full" variant="destructive">
              <RotateCcw className="w-5 h-5 ml-2" />
              إعادة ضبط الإعدادات
            </Button>

            <div className="p-4 bg-destructive/10 rounded-xl">
              <p className="text-sm text-destructive">
                تحذير: إعادة الضبط ستحذف جميع الإعدادات المخصصة
              </p>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center py-4">
        <Settings className="w-12 h-12 mx-auto text-primary mb-2" />
        <h2 className="text-xl font-bold text-foreground">الإعدادات</h2>
        <p className="text-sm text-muted-foreground">تخصيص تجربتك</p>
      </div>

      <div className="space-y-3">
        {sections.map((section) => {
          const Icon = section.icon;
          return (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className="w-full glass-card p-4 flex items-center gap-4 hover:bg-secondary/50 transition-all"
            >
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                <Icon className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1 text-right">
                <p className="font-medium text-foreground">{section.title}</p>
                <p className="text-xs text-muted-foreground">{section.description}</p>
              </div>
              <ChevronLeft className="w-5 h-5 text-muted-foreground" />
            </button>
          );
        })}
      </div>

      <div className="text-center pt-4">
        <p className="text-xs text-muted-foreground">المرافق الرمضاني الذكي</p>
        <p className="text-xs text-muted-foreground">الإصدار 1.0.0</p>
      </div>
    </div>
  );
}
