import { useState } from 'react';
import {
  CheckCircle2,
  Circle,
  Clock,
  Building,
  BookOpen,
  Heart,
  HandHeart,
  Utensils,
  Moon,
  Sun,
  Star,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  PenLine,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAccountability, DailyAccountability } from '@/hooks/useAccountability';

type Section = 'prayers' | 'sunnah' | 'quran' | 'adhkar' | 'fasting' | 'character' | 'charity' | 'notes';

export function AccountabilityView() {
  const {
    getTodayRecord,
    getRecord,
    updatePrayer,
    updateSunnah,
    updateQuran,
    updateAdhkar,
    updateFasting,
    updateCharacter,
    updateCharity,
    updateRecord,
    addGratitude,
    addDua,
    calculateDailyScore,
  } = useAccountability();

  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [activeSection, setActiveSection] = useState<Section>('prayers');
  const [newGratitude, setNewGratitude] = useState('');
  const [newDua, setNewDua] = useState('');

  const record = getRecord(selectedDate);
  const score = calculateDailyScore(selectedDate);

  const navigateDate = (direction: 'prev' | 'next') => {
    const date = new Date(selectedDate);
    date.setDate(date.getDate() + (direction === 'next' ? 1 : -1));
    const newDate = date.toISOString().split('T')[0];
    if (new Date(newDate) <= new Date()) {
      setSelectedDate(newDate);
    }
  };

  const prayers = [
    { id: 'fajr' as const, name: 'الفجر', icon: Moon },
    { id: 'dhuhr' as const, name: 'الظهر', icon: Sun },
    { id: 'asr' as const, name: 'العصر', icon: Sun },
    { id: 'maghrib' as const, name: 'المغرب', icon: Moon },
    { id: 'isha' as const, name: 'العشاء', icon: Moon },
  ];

  const sunnahPrayers = [
    { id: 'fajrSunnah' as const, name: 'سنة الفجر', count: 2 },
    { id: 'dhuhrBefore' as const, name: 'سنة الظهر القبلية', count: 4 },
    { id: 'dhuhrAfter' as const, name: 'سنة الظهر البعدية', count: 2 },
    { id: 'maghribAfter' as const, name: 'سنة المغرب', count: 2 },
    { id: 'ishaAfter' as const, name: 'سنة العشاء', count: 2 },
    { id: 'witr' as const, name: 'الوتر', count: 3 },
    { id: 'tahajjud' as const, name: 'قيام الليل', count: 0 },
    { id: 'duha' as const, name: 'صلاة الضحى', count: 2 },
  ];

  const characterTraits = [
    { id: 'controlledAnger' as const, name: 'تحكمت بغضبي', icon: '😌' },
    { id: 'avoidedBackbiting' as const, name: 'تجنبت الغيبة', icon: '🤐' },
    { id: 'wasPatient' as const, name: 'كنت صبوراً', icon: '🙏' },
    { id: 'wasKind' as const, name: 'كنت لطيفاً', icon: '💝' },
    { id: 'helpedOthers' as const, name: 'ساعدت غيري', icon: '🤝' },
  ];

  const sections: { id: Section; name: string; icon: any }[] = [
    { id: 'prayers', name: 'الصلوات', icon: Clock },
    { id: 'sunnah', name: 'النوافل', icon: Star },
    { id: 'quran', name: 'القرآن', icon: BookOpen },
    { id: 'adhkar', name: 'الأذكار', icon: Sparkles },
    { id: 'fasting', name: 'الصيام', icon: Utensils },
    { id: 'character', name: 'الأخلاق', icon: Heart },
    { id: 'charity', name: 'الصدقة', icon: HandHeart },
    { id: 'notes', name: 'الملاحظات', icon: PenLine },
  ];

  const getScoreColor = () => {
    if (score >= 80) return 'text-accent';
    if (score >= 60) return 'text-primary';
    if (score >= 40) return 'text-yellow-500';
    return 'text-destructive';
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('ar-SA', { weekday: 'long', day: 'numeric', month: 'long' });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header with Date */}
      <div className="glass-card p-4">
        <div className="flex items-center justify-between mb-4">
          <Button variant="ghost" size="icon" onClick={() => navigateDate('next')}>
            <ChevronRight className="w-5 h-5" />
          </Button>
          <div className="text-center">
            <p className="text-sm text-muted-foreground">محاسبة اليوم</p>
            <p className="font-medium text-foreground">{formatDate(selectedDate)}</p>
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigateDate('prev')}
            disabled={selectedDate === new Date().toISOString().split('T')[0]}
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>
        </div>

        {/* Score */}
        <div className="text-center py-4">
          <div className={`text-5xl font-bold ${getScoreColor()}`}>{score}</div>
          <p className="text-sm text-muted-foreground">من 100</p>
        </div>

        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${score}%` }} />
        </div>
      </div>

      {/* Section Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {sections.map((section) => {
          const Icon = section.icon;
          return (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`flex-shrink-0 px-4 py-2 rounded-xl flex items-center gap-2 transition-all ${
                activeSection === section.id
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary/50 text-muted-foreground'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="text-sm">{section.name}</span>
            </button>
          );
        })}
      </div>

      {/* Prayers Section */}
      {activeSection === 'prayers' && (
        <div className="glass-card p-4 space-y-4">
          <h3 className="font-bold text-foreground">الصلوات الخمس</h3>
          {prayers.map((prayer) => {
            const Icon = prayer.icon;
            const prayerData = record.prayers[prayer.id];
            return (
              <div key={prayer.id} className="bg-secondary/30 rounded-xl p-4">
                <div className="flex items-center gap-3 mb-3">
                  <Icon className="w-5 h-5 text-primary" />
                  <span className="font-medium text-foreground">{prayer.name}</span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => updatePrayer(selectedDate, prayer.id, 'prayed', !prayerData.prayed)}
                    className={`flex-1 p-2 rounded-lg flex items-center justify-center gap-2 transition-all ${
                      prayerData.prayed ? 'bg-accent/20 text-accent' : 'bg-secondary/50 text-muted-foreground'
                    }`}
                  >
                    {prayerData.prayed ? <CheckCircle2 className="w-4 h-4" /> : <Circle className="w-4 h-4" />}
                    <span className="text-xs">صليت</span>
                  </button>
                  <button
                    onClick={() => updatePrayer(selectedDate, prayer.id, 'onTime', !prayerData.onTime)}
                    className={`flex-1 p-2 rounded-lg flex items-center justify-center gap-2 transition-all ${
                      prayerData.onTime ? 'bg-primary/20 text-primary' : 'bg-secondary/50 text-muted-foreground'
                    }`}
                  >
                    <Clock className="w-4 h-4" />
                    <span className="text-xs">في وقتها</span>
                  </button>
                  <button
                    onClick={() => updatePrayer(selectedDate, prayer.id, 'inMosque', !prayerData.inMosque)}
                    className={`flex-1 p-2 rounded-lg flex items-center justify-center gap-2 transition-all ${
                      prayerData.inMosque ? 'bg-emerald/20 text-emerald' : 'bg-secondary/50 text-muted-foreground'
                    }`}
                  >
                    <Building className="w-4 h-4" />
                    <span className="text-xs">جماعة</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Sunnah Section */}
      {activeSection === 'sunnah' && (
        <div className="glass-card p-4 space-y-3">
          <h3 className="font-bold text-foreground">النوافل والسنن</h3>
          {sunnahPrayers.map((sunnah) => (
            <button
              key={sunnah.id}
              onClick={() => updateSunnah(selectedDate, sunnah.id, !record.sunnah[sunnah.id])}
              className={`w-full p-4 rounded-xl flex items-center justify-between transition-all ${
                record.sunnah[sunnah.id] ? 'bg-accent/20' : 'bg-secondary/30'
              }`}
            >
              <div className="flex items-center gap-3">
                {record.sunnah[sunnah.id] ? (
                  <CheckCircle2 className="w-5 h-5 text-accent" />
                ) : (
                  <Circle className="w-5 h-5 text-muted-foreground" />
                )}
                <span className="text-foreground">{sunnah.name}</span>
              </div>
              {sunnah.count > 0 && (
                <span className="text-xs text-muted-foreground">{sunnah.count} ركعات</span>
              )}
            </button>
          ))}
        </div>
      )}

      {/* Quran Section */}
      {activeSection === 'quran' && (
        <div className="glass-card p-4 space-y-4">
          <h3 className="font-bold text-foreground">القرآن الكريم</h3>
          
          <button
            onClick={() => updateQuran(selectedDate, { readToday: !record.quran.readToday })}
            className={`w-full p-4 rounded-xl flex items-center gap-3 transition-all ${
              record.quran.readToday ? 'bg-accent/20' : 'bg-secondary/30'
            }`}
          >
            {record.quran.readToday ? (
              <CheckCircle2 className="w-5 h-5 text-accent" />
            ) : (
              <Circle className="w-5 h-5 text-muted-foreground" />
            )}
            <span className="text-foreground">قرأت القرآن اليوم</span>
          </button>

          <div className="bg-secondary/30 rounded-xl p-4">
            <label className="text-sm text-muted-foreground block mb-2">عدد الصفحات المقروءة</label>
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="icon"
                onClick={() => updateQuran(selectedDate, { pagesRead: Math.max(0, record.quran.pagesRead - 1) })}
              >
                -
              </Button>
              <span className="text-2xl font-bold text-foreground flex-1 text-center">
                {record.quran.pagesRead}
              </span>
              <Button
                variant="outline"
                size="icon"
                onClick={() => updateQuran(selectedDate, { pagesRead: record.quran.pagesRead + 1 })}
              >
                +
              </Button>
            </div>
          </div>

          <button
            onClick={() => updateQuran(selectedDate, { completedWird: !record.quran.completedWird })}
            className={`w-full p-4 rounded-xl flex items-center gap-3 transition-all ${
              record.quran.completedWird ? 'bg-primary/20' : 'bg-secondary/30'
            }`}
          >
            {record.quran.completedWird ? (
              <CheckCircle2 className="w-5 h-5 text-primary" />
            ) : (
              <Circle className="w-5 h-5 text-muted-foreground" />
            )}
            <span className="text-foreground">أتممت الورد اليومي</span>
          </button>

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => updateQuran(selectedDate, { memorization: !record.quran.memorization })}
              className={`p-3 rounded-xl flex items-center gap-2 transition-all ${
                record.quran.memorization ? 'bg-emerald/20' : 'bg-secondary/30'
              }`}
            >
              {record.quran.memorization ? (
                <CheckCircle2 className="w-4 h-4 text-emerald" />
              ) : (
                <Circle className="w-4 h-4 text-muted-foreground" />
              )}
              <span className="text-sm text-foreground">حفظ</span>
            </button>
            <button
              onClick={() => updateQuran(selectedDate, { revision: !record.quran.revision })}
              className={`p-3 rounded-xl flex items-center gap-2 transition-all ${
                record.quran.revision ? 'bg-emerald/20' : 'bg-secondary/30'
              }`}
            >
              {record.quran.revision ? (
                <CheckCircle2 className="w-4 h-4 text-emerald" />
              ) : (
                <Circle className="w-4 h-4 text-muted-foreground" />
              )}
              <span className="text-sm text-foreground">مراجعة</span>
            </button>
          </div>
        </div>
      )}

      {/* Adhkar Section */}
      {activeSection === 'adhkar' && (
        <div className="glass-card p-4 space-y-3">
          <h3 className="font-bold text-foreground">الأذكار</h3>
          {[
            { id: 'morning' as const, name: 'أذكار الصباح', icon: Sun },
            { id: 'evening' as const, name: 'أذكار المساء', icon: Moon },
            { id: 'afterPrayer' as const, name: 'أذكار بعد الصلاة', icon: Sparkles },
            { id: 'sleep' as const, name: 'أذكار النوم', icon: Moon },
          ].map((adhkar) => {
            const Icon = adhkar.icon;
            return (
              <button
                key={adhkar.id}
                onClick={() => updateAdhkar(selectedDate, adhkar.id, !record.adhkar[adhkar.id])}
                className={`w-full p-4 rounded-xl flex items-center gap-3 transition-all ${
                  record.adhkar[adhkar.id] ? 'bg-accent/20' : 'bg-secondary/30'
                }`}
              >
                {record.adhkar[adhkar.id] ? (
                  <CheckCircle2 className="w-5 h-5 text-accent" />
                ) : (
                  <Icon className="w-5 h-5 text-muted-foreground" />
                )}
                <span className="text-foreground">{adhkar.name}</span>
              </button>
            );
          })}
        </div>
      )}

      {/* Fasting Section */}
      {activeSection === 'fasting' && (
        <div className="glass-card p-4 space-y-3">
          <h3 className="font-bold text-foreground">الصيام</h3>
          {[
            { id: 'fasted', name: 'صمت اليوم' },
            { id: 'suhoor', name: 'تسحرت' },
            { id: 'iftar', name: 'أفطرت في الوقت' },
            { id: 'avoidedHaram', name: 'تجنبت المحرمات' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => updateFasting(selectedDate, { [item.id]: !record.fasting[item.id as keyof typeof record.fasting] })}
              className={`w-full p-4 rounded-xl flex items-center gap-3 transition-all ${
                record.fasting[item.id as keyof typeof record.fasting] ? 'bg-accent/20' : 'bg-secondary/30'
              }`}
            >
              {record.fasting[item.id as keyof typeof record.fasting] ? (
                <CheckCircle2 className="w-5 h-5 text-accent" />
              ) : (
                <Circle className="w-5 h-5 text-muted-foreground" />
              )}
              <span className="text-foreground">{item.name}</span>
            </button>
          ))}
        </div>
      )}

      {/* Character Section */}
      {activeSection === 'character' && (
        <div className="glass-card p-4 space-y-3">
          <h3 className="font-bold text-foreground">الأخلاق والسلوك</h3>
          {characterTraits.map((trait) => (
            <button
              key={trait.id}
              onClick={() => updateCharacter(selectedDate, trait.id, !record.character[trait.id])}
              className={`w-full p-4 rounded-xl flex items-center gap-3 transition-all ${
                record.character[trait.id] ? 'bg-accent/20' : 'bg-secondary/30'
              }`}
            >
              <span className="text-2xl">{trait.icon}</span>
              <span className="text-foreground flex-1 text-right">{trait.name}</span>
              {record.character[trait.id] && <CheckCircle2 className="w-5 h-5 text-accent" />}
            </button>
          ))}
        </div>
      )}

      {/* Charity Section */}
      {activeSection === 'charity' && (
        <div className="glass-card p-4 space-y-4">
          <h3 className="font-bold text-foreground">الصدقة</h3>
          <button
            onClick={() => updateCharity(selectedDate, { gaveSadaqah: !record.charity.gaveSadaqah })}
            className={`w-full p-4 rounded-xl flex items-center gap-3 transition-all ${
              record.charity.gaveSadaqah ? 'bg-accent/20' : 'bg-secondary/30'
            }`}
          >
            {record.charity.gaveSadaqah ? (
              <CheckCircle2 className="w-5 h-5 text-accent" />
            ) : (
              <HandHeart className="w-5 h-5 text-muted-foreground" />
            )}
            <span className="text-foreground">تصدقت اليوم</span>
          </button>

          {record.charity.gaveSadaqah && (
            <div className="bg-secondary/30 rounded-xl p-4">
              <label className="text-sm text-muted-foreground block mb-2">نوع الصدقة (اختياري)</label>
              <input
                type="text"
                value={record.charity.type || ''}
                onChange={(e) => updateCharity(selectedDate, { type: e.target.value })}
                className="w-full bg-secondary/50 rounded-lg p-3 text-foreground"
                placeholder="مثال: مال، طعام، ملابس..."
              />
            </div>
          )}
        </div>
      )}

      {/* Notes Section */}
      {activeSection === 'notes' && (
        <div className="glass-card p-4 space-y-4">
          <h3 className="font-bold text-foreground">ملاحظات اليوم</h3>
          
          <div>
            <label className="text-sm text-muted-foreground block mb-2">ملاحظاتي</label>
            <textarea
              value={record.notes}
              onChange={(e) => updateRecord(selectedDate, { notes: e.target.value })}
              className="w-full bg-secondary/30 rounded-xl p-3 text-foreground min-h-[100px]"
              placeholder="اكتب ملاحظاتك هنا..."
            />
          </div>

          <div>
            <label className="text-sm text-muted-foreground block mb-2">ما أشكر الله عليه اليوم</label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={newGratitude}
                onChange={(e) => setNewGratitude(e.target.value)}
                className="flex-1 bg-secondary/30 rounded-xl p-3 text-foreground"
                placeholder="أضف نعمة..."
              />
              <Button
                onClick={() => {
                  if (newGratitude.trim()) {
                    addGratitude(selectedDate, newGratitude.trim());
                    setNewGratitude('');
                  }
                }}
                className="bg-accent"
              >
                أضف
              </Button>
            </div>
            <div className="space-y-2">
              {record.gratitude.map((item, index) => (
                <div key={index} className="bg-accent/10 rounded-lg p-2 text-sm text-foreground">
                  ✨ {item}
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="text-sm text-muted-foreground block mb-2">أدعيتي اليوم</label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={newDua}
                onChange={(e) => setNewDua(e.target.value)}
                className="flex-1 bg-secondary/30 rounded-xl p-3 text-foreground"
                placeholder="أضف دعاء..."
              />
              <Button
                onClick={() => {
                  if (newDua.trim()) {
                    addDua(selectedDate, newDua.trim());
                    setNewDua('');
                  }
                }}
                className="bg-primary"
              >
                أضف
              </Button>
            </div>
            <div className="space-y-2">
              {record.dua.map((item, index) => (
                <div key={index} className="bg-primary/10 rounded-lg p-2 text-sm text-foreground">
                  🤲 {item}
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="text-sm text-muted-foreground block mb-2">تقييم اليوم</label>
            <div className="flex justify-between gap-2">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((rating) => (
                <button
                  key={rating}
                  onClick={() => updateRecord(selectedDate, { selfRating: rating })}
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs transition-all ${
                    record.selfRating >= rating
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-secondary/50 text-muted-foreground'
                  }`}
                >
                  {rating}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
