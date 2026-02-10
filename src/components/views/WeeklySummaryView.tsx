import { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, BookOpen, Sparkles, Heart, Award } from 'lucide-react';
import { useAccountability } from '@/hooks/useAccountability';
import { useQuranWird } from '@/hooks/useQuranWird';
import { useTasbeeh } from '@/hooks/useTasbeeh';

export function WeeklySummaryView() {
  const { getRecord, calculateDailyScore } = useAccountability();
  const { completedPages } = useQuranWird();
  const { totalCounts } = useTasbeeh();

  const weekData = useMemo(() => {
    const days = [];
    const today = new Date();
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      const score = calculateDailyScore(dateStr);
      const record = getRecord(dateStr);
      const prayerCount = Object.values(record.prayers).filter(p => p.prayed).length;
      days.push({
        day: date.toLocaleDateString('ar-SA', { weekday: 'short' }),
        score,
        prayers: prayerCount,
        quran: record.quran.pagesRead,
      });
    }
    return days;
  }, [calculateDailyScore, getRecord]);

  const avgScore = Math.round(weekData.reduce((sum, d) => sum + d.score, 0) / 7);
  const totalPrayers = weekData.reduce((sum, d) => sum + d.prayers, 0);
  const totalQuranPages = weekData.reduce((sum, d) => sum + d.quran, 0);

  const pieData = [
    { name: 'صلوات', value: totalPrayers, color: 'hsl(var(--primary))' },
    { name: 'قرآن', value: totalQuranPages || 1, color: 'hsl(var(--accent))' },
    { name: 'تسبيح', value: Math.min(totalCounts, 500) || 1, color: 'hsl(45, 93%, 58%)' },
  ];

  const getMotivationalMessage = () => {
    if (avgScore >= 80) return { text: 'ما شاء الله! أداؤك ممتاز هذا الأسبوع 🌟', icon: '🏆' };
    if (avgScore >= 60) return { text: 'أحسنت! استمر في التقدم وزِد من همتك 💪', icon: '⭐' };
    if (avgScore >= 40) return { text: 'لا بأس، كل خطوة صغيرة تقربك من الله 🌱', icon: '🌿' };
    return { text: 'لا تيأس من رحمة الله، ابدأ من جديد بنيّة صادقة 💚', icon: '🤲' };
  };

  const motivation = getMotivationalMessage();

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center">
        <h2 className="text-xl font-bold text-foreground mb-1">الملخص الأسبوعي</h2>
        <p className="text-sm text-muted-foreground">تقرير أدائك لآخر ٧ أيام</p>
      </div>

      {/* Motivational Banner */}
      <div className="glass-card p-5 text-center border border-primary/20">
        <span className="text-3xl mb-2 block">{motivation.icon}</span>
        <p className="text-foreground font-medium">{motivation.text}</p>
      </div>

      {/* Average Score */}
      <div className="glass-card p-6 text-center">
        <p className="text-sm text-muted-foreground mb-2">متوسط الأداء</p>
        <div className={`text-6xl font-bold ${
          avgScore >= 80 ? 'text-accent' : avgScore >= 60 ? 'text-primary' : 'text-muted-foreground'
        }`}>
          {avgScore}
        </div>
        <p className="text-sm text-muted-foreground">من ١٠٠</p>
        <div className="progress-bar mt-3">
          <div className="progress-fill" style={{ width: `${avgScore}%` }} />
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-3">
        <div className="glass-card p-4 text-center">
          <BookOpen className="w-5 h-5 text-accent mx-auto mb-2" />
          <p className="text-2xl font-bold text-foreground">{totalQuranPages}</p>
          <p className="text-xs text-muted-foreground">صفحة قرآن</p>
        </div>
        <div className="glass-card p-4 text-center">
          <Sparkles className="w-5 h-5 text-primary mx-auto mb-2" />
          <p className="text-2xl font-bold text-foreground">{totalCounts}</p>
          <p className="text-xs text-muted-foreground">تسبيحة</p>
        </div>
        <div className="glass-card p-4 text-center">
          <Heart className="w-5 h-5 text-accent mx-auto mb-2" />
          <p className="text-2xl font-bold text-foreground">{totalPrayers}</p>
          <p className="text-xs text-muted-foreground">صلاة</p>
        </div>
      </div>

      {/* Daily Scores Chart */}
      <div className="glass-card p-4">
        <h3 className="text-sm font-semibold text-foreground mb-4 text-center">الأداء اليومي</h3>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={weekData}>
              <XAxis dataKey="day" tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
              <YAxis hide domain={[0, 100]} />
              <Bar dataKey="score" radius={[6, 6, 0, 0]} fill="hsl(var(--primary))" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Distribution Pie */}
      <div className="glass-card p-4">
        <h3 className="text-sm font-semibold text-foreground mb-4 text-center">توزيع العبادات</h3>
        <div className="h-48 flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={70}
                dataKey="value"
                paddingAngle={3}
              >
                {pieData.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="flex justify-center gap-4 mt-2">
          {pieData.map((item, i) => (
            <div key={i} className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
              <span className="text-xs text-muted-foreground">{item.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Quran Progress */}
      <div className="glass-card p-4">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm text-muted-foreground">تقدم الختمة</span>
          <span className="text-sm font-bold text-primary">{Math.round((completedPages.length / 604) * 100)}%</span>
        </div>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${(completedPages.length / 604) * 100}%` }} />
        </div>
        <p className="text-xs text-muted-foreground text-center mt-2">
          {completedPages.length} من ٦٠٤ صفحة
        </p>
      </div>

      {/* Encouragement */}
      <div className="glass-card p-5 text-center bg-accent/5 border border-accent/20">
        <Award className="w-8 h-8 text-accent mx-auto mb-2" />
        <p className="text-foreground font-medium mb-1">نصيحة الأسبوع</p>
        <p className="text-sm text-muted-foreground">
          "من قرأ حرفاً من كتاب الله فله به حسنة، والحسنة بعشر أمثالها"
        </p>
        <p className="text-xs text-muted-foreground mt-1">رواه الترمذي - صحيح</p>
      </div>
    </div>
  );
}