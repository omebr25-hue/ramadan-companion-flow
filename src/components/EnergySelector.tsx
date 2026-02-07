import { Battery, BatteryMedium, BatteryFull } from 'lucide-react';
import { useQuranWird } from '@/hooks/useQuranWird';
import { EnergyLevel } from '@/types/ramadan';

const energyLevels: { level: EnergyLevel; label: string; icon: typeof Battery; color: string }[] = [
  { level: 'low', label: 'منخفضة', icon: Battery, color: 'text-orange-400' },
  { level: 'medium', label: 'متوسطة', icon: BatteryMedium, color: 'text-primary' },
  { level: 'high', label: 'عالية', icon: BatteryFull, color: 'text-accent' },
];

export function EnergySelector() {
  const { settings, updateEnergyLevel } = useQuranWird();

  return (
    <div className="glass-card p-4 animate-fade-in">
      <p className="text-sm text-muted-foreground mb-3 text-center">كيف حالتك اليوم؟</p>
      <div className="flex justify-center gap-3">
        {energyLevels.map(({ level, label, icon: Icon, color }) => (
          <button
            key={level}
            onClick={() => updateEnergyLevel(level)}
            className={`
              flex flex-col items-center p-3 rounded-xl transition-all
              ${settings.energyLevel === level 
                ? 'bg-secondary border-2 border-primary/50 scale-105' 
                : 'bg-secondary/30 hover:bg-secondary border-2 border-transparent'
              }
            `}
          >
            <Icon className={`w-6 h-6 mb-1 ${color}`} />
            <span className={`text-xs ${settings.energyLevel === level ? 'text-foreground' : 'text-muted-foreground'}`}>
              {label}
            </span>
          </button>
        ))}
      </div>
      {settings.energyLevel === 'low' && (
        <p className="text-xs text-center text-muted-foreground mt-3">
          💚 لا بأس، سيتم تخفيف ورد اليوم
        </p>
      )}
    </div>
  );
}
