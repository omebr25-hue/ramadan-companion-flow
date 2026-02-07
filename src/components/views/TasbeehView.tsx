import { TasbeehCard } from '@/components/TasbeehCard';
import { useTasbeeh } from '@/hooks/useTasbeeh';

export function TasbeehView() {
  const { totalCounts } = useTasbeeh();

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center">
        <h2 className="text-xl font-bold text-foreground mb-2">المسبحة الرقمية</h2>
        <p className="text-sm text-muted-foreground">سبّح الله في كل وقت</p>
      </div>

      <TasbeehCard />

      {/* Statistics */}
      <div className="glass-card p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4 text-center">إحصائياتك</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-secondary/50 rounded-xl p-4 text-center">
            <p className="text-3xl font-bold text-primary">{totalCounts}</p>
            <p className="text-sm text-muted-foreground">إجمالي التسبيحات</p>
          </div>
          <div className="bg-secondary/50 rounded-xl p-4 text-center">
            <p className="text-3xl font-bold text-accent">{Math.floor(totalCounts / 100)}</p>
            <p className="text-sm text-muted-foreground">مئات مكتملة</p>
          </div>
        </div>
      </div>

      {/* Quick Dhikrs */}
      <div className="glass-card p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">أذكار سريعة</h3>
        <div className="space-y-3">
          {[
            { text: 'سُبْحَانَ اللهِ وَبِحَمْدِهِ سُبْحَانَ اللهِ الْعَظِيمِ', reward: 'ثقيلتان في الميزان' },
            { text: 'لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللهِ', reward: 'كنز من كنوز الجنة' },
            { text: 'سُبْحَانَ اللهِ وَبِحَمْدِهِ ١٠٠ مرة', reward: 'تُحط خطاياه' },
          ].map((item, index) => (
            <div key={index} className="bg-secondary/50 rounded-xl p-4">
              <p className="font-arabic text-foreground mb-2">{item.text}</p>
              <p className="text-xs text-accent">✨ {item.reward}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
