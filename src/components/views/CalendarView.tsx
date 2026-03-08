import { useState } from 'react';
import { ChevronRight, ChevronLeft, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';

const hijriMonths = [
  'محرم', 'صفر', 'ربيع الأول', 'ربيع الآخر', 'جمادى الأولى', 'جمادى الآخرة',
  'رجب', 'شعبان', 'رمضان', 'شوال', 'ذو القعدة', 'ذو الحجة',
];

const weekDays = ['أحد', 'إثنين', 'ثلاثاء', 'أربعاء', 'خميس', 'جمعة', 'سبت'];

const gregorianMonths = [
  'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
  'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر',
];

// المناسبات الإسلامية بالتاريخ الهجري (شهر، يوم)
interface IslamicEvent {
  name: string;
  emoji: string;
  color: string;
}

const islamicEvents: Record<string, IslamicEvent> = {
  // محرم
  '1-1': { name: 'رأس السنة الهجرية', emoji: '🌙', color: 'text-primary' },
  '1-10': { name: 'يوم عاشوراء', emoji: '📿', color: 'text-accent' },
  // ربيع الأول
  '3-12': { name: 'المولد النبوي الشريف', emoji: '🕌', color: 'text-primary' },
  // رجب
  '7-27': { name: 'ليلة الإسراء والمعراج', emoji: '✨', color: 'text-primary' },
  // شعبان
  '8-15': { name: 'ليلة النصف من شعبان', emoji: '🌕', color: 'text-accent' },
  // رمضان
  '9-1': { name: 'أول رمضان', emoji: '🌙', color: 'text-primary' },
  '9-17': { name: 'غزوة بدر الكبرى', emoji: '⚔️', color: 'text-foreground' },
  '9-21': { name: 'ليلة القدر (محتملة)', emoji: '🌟', color: 'text-accent' },
  '9-23': { name: 'ليلة القدر (محتملة)', emoji: '🌟', color: 'text-accent' },
  '9-25': { name: 'ليلة القدر (محتملة)', emoji: '🌟', color: 'text-accent' },
  '9-27': { name: 'ليلة القدر (محتملة)', emoji: '🌟', color: 'text-accent' },
  '9-29': { name: 'ليلة القدر (محتملة)', emoji: '🌟', color: 'text-accent' },
  // شوال
  '10-1': { name: 'عيد الفطر المبارك', emoji: '🎉', color: 'text-primary' },
  '10-2': { name: 'ثاني أيام عيد الفطر', emoji: '🎉', color: 'text-primary' },
  '10-3': { name: 'ثالث أيام عيد الفطر', emoji: '🎉', color: 'text-primary' },
  // ذو الحجة
  '12-8': { name: 'يوم التروية', emoji: '🕋', color: 'text-foreground' },
  '12-9': { name: 'يوم عرفة', emoji: '🤲', color: 'text-accent' },
  '12-10': { name: 'عيد الأضحى المبارك', emoji: '🐑', color: 'text-primary' },
  '12-11': { name: 'ثاني أيام التشريق', emoji: '🐑', color: 'text-primary' },
  '12-12': { name: 'ثالث أيام التشريق', emoji: '🐑', color: 'text-primary' },
  '12-13': { name: 'رابع أيام التشريق', emoji: '🐑', color: 'text-primary' },
};

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}

function toHijri(date: Date): { day: number; month: number; year: number } {
  const jd = Math.floor((date.getTime() / 86400000) + 2440587.5);
  const l = jd - 1948440 + 10632;
  const n = Math.floor((l - 1) / 10631);
  const lRem = l - 10631 * n + 354;
  const j = Math.floor((10985 - lRem) / 5316) * Math.floor((50 * lRem) / 17719) + Math.floor(lRem / 5670) * Math.floor((43 * lRem) / 15238);
  const lFinal = lRem - Math.floor((30 - j) / 15) * Math.floor((17719 * j) / 50) - Math.floor(j / 16) * Math.floor((15238 * j) / 43) + 29;
  const month = Math.floor((24 * lFinal) / 709);
  const day = lFinal - Math.floor((709 * month) / 24);
  const year = 30 * n + j - 30;
  return { day, month, year };
}

function getEventForHijri(hijriMonth: number, hijriDay: number): IslamicEvent | null {
  const key = `${hijriMonth}-${hijriDay}`;
  return islamicEvents[key] || null;
}

export function CalendarView() {
  const today = new Date();
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [selectedDate, setSelectedDate] = useState<Date | null>(today);

  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const firstDay = getFirstDayOfMonth(currentYear, currentMonth);

  const prevMonth = () => {
    if (currentMonth === 0) { setCurrentMonth(11); setCurrentYear(y => y - 1); }
    else setCurrentMonth(m => m - 1);
  };

  const nextMonth = () => {
    if (currentMonth === 11) { setCurrentMonth(0); setCurrentYear(y => y + 1); }
    else setCurrentMonth(m => m + 1);
  };

  const goToToday = () => {
    setCurrentYear(today.getFullYear());
    setCurrentMonth(today.getMonth());
    setSelectedDate(today);
  };

  const selectedHijri = selectedDate ? toHijri(selectedDate) : null;
  const selectedEvent = selectedHijri ? getEventForHijri(selectedHijri.month, selectedHijri.day) : null;
  const todayHijri = toHijri(today);

  const isToday = (day: number) =>
    day === today.getDate() && currentMonth === today.getMonth() && currentYear === today.getFullYear();

  const isSelected = (day: number) =>
    selectedDate && day === selectedDate.getDate() && currentMonth === selectedDate.getMonth() && currentYear === selectedDate.getFullYear();

  // Collect events for this month
  const monthEvents: { day: number; event: IslamicEvent; hijri: { day: number; month: number; year: number } }[] = [];
  for (let d = 1; d <= daysInMonth; d++) {
    const date = new Date(currentYear, currentMonth, d);
    const h = toHijri(date);
    const ev = getEventForHijri(h.month, h.day);
    if (ev) monthEvents.push({ day: d, event: ev, hijri: h });
  }

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="text-center">
        <h2 className="text-xl font-bold text-foreground mb-1">التقويم</h2>
        <p className="text-sm text-muted-foreground">
          {todayHijri.day} {hijriMonths[todayHijri.month - 1]} {todayHijri.year} هـ
        </p>
      </div>

      {/* Month Navigation */}
      <div className="glass-card p-4">
        <div className="flex items-center justify-between mb-4">
          <button onClick={nextMonth} className="p-2 rounded-xl hover:bg-secondary/50 transition-all">
            <ChevronRight className="w-5 h-5 text-foreground" />
          </button>
          <div className="text-center">
            <h3 className="text-lg font-bold text-foreground">
              {gregorianMonths[currentMonth]} {currentYear}
            </h3>
          </div>
          <button onClick={prevMonth} className="p-2 rounded-xl hover:bg-secondary/50 transition-all">
            <ChevronLeft className="w-5 h-5 text-foreground" />
          </button>
        </div>

        {/* Weekday Headers */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {weekDays.map((day) => (
            <div key={day} className="text-center text-xs font-medium text-muted-foreground py-1">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1">
          {Array.from({ length: firstDay }).map((_, i) => (
            <div key={`empty-${i}`} />
          ))}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1;
            const date = new Date(currentYear, currentMonth, day);
            const hijri = toHijri(date);
            const isTodayDay = isToday(day);
            const isSelectedDay = isSelected(day);
            const event = getEventForHijri(hijri.month, hijri.day);

            return (
              <button
                key={day}
                onClick={() => setSelectedDate(date)}
                className={`
                  relative flex flex-col items-center justify-center p-1 rounded-xl transition-all text-center min-h-[48px]
                  ${isSelectedDay
                    ? 'bg-primary text-primary-foreground ring-2 ring-primary/50'
                    : isTodayDay
                      ? 'bg-accent/20 text-accent border border-accent/30'
                      : event
                        ? 'bg-primary/10 border border-primary/20'
                        : 'hover:bg-secondary/50 text-foreground'
                  }
                `}
              >
                <span className="text-sm font-medium leading-none">{day}</span>
                <span className={`text-[8px] leading-none mt-0.5 ${isSelectedDay ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
                  {hijri.day}
                </span>
                {event && (
                  <span className="absolute -top-0.5 -right-0.5 text-[8px]">{event.emoji}</span>
                )}
              </button>
            );
          })}
        </div>

        <Button variant="ghost" size="sm" onClick={goToToday} className="w-full mt-3 text-xs text-primary">
          اليوم
        </Button>
      </div>

      {/* Selected Date Details */}
      {selectedHijri && selectedDate && (
        <div className="glass-card p-4 space-y-3">
          <h3 className="text-base font-semibold text-foreground text-center">تفاصيل التاريخ</h3>
          
          {selectedEvent && (
            <div className="bg-primary/10 rounded-xl p-3 text-center border border-primary/20">
              <span className="text-2xl mb-1 block">{selectedEvent.emoji}</span>
              <p className={`text-sm font-bold ${selectedEvent.color}`}>{selectedEvent.name}</p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-secondary/50 rounded-xl p-3 text-center">
              <p className="text-[10px] text-muted-foreground mb-1">ميلادي</p>
              <p className="text-sm font-bold text-foreground">
                {selectedDate.getDate()} {gregorianMonths[selectedDate.getMonth()]}
              </p>
              <p className="text-xs text-muted-foreground">{selectedDate.getFullYear()}</p>
            </div>
            <div className="bg-primary/10 rounded-xl p-3 text-center border border-primary/20">
              <p className="text-[10px] text-muted-foreground mb-1">هجري</p>
              <p className="text-sm font-bold text-primary">
                {selectedHijri.day} {hijriMonths[selectedHijri.month - 1]}
              </p>
              <p className="text-xs text-muted-foreground">{selectedHijri.year} هـ</p>
            </div>
          </div>
          <div className="bg-secondary/50 rounded-xl p-3 text-center">
            <p className="text-[10px] text-muted-foreground mb-1">اليوم</p>
            <p className="text-sm font-medium text-foreground">
              {weekDays[selectedDate.getDay()]}
            </p>
          </div>
        </div>
      )}

      {/* Events This Month */}
      {monthEvents.length > 0 && (
        <div className="glass-card p-4">
          <h3 className="text-base font-semibold text-foreground mb-3 flex items-center gap-2">
            <Star className="w-4 h-4 text-primary" />
            مناسبات هذا الشهر
          </h3>
          <div className="space-y-2">
            {monthEvents.map((item, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedDate(new Date(currentYear, currentMonth, item.day))}
                className="w-full flex items-center gap-3 p-3 bg-secondary/50 rounded-xl hover:bg-secondary transition-all text-right"
              >
                <span className="text-xl">{item.event.emoji}</span>
                <div className="flex-1">
                  <p className={`text-sm font-medium ${item.event.color}`}>{item.event.name}</p>
                  <p className="text-[10px] text-muted-foreground">
                    {item.day} {gregorianMonths[currentMonth]} — {item.hijri.day} {hijriMonths[item.hijri.month - 1]}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
