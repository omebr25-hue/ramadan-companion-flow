import { useState, useEffect } from 'react';
import { Utensils, Moon } from 'lucide-react';

interface TimeRemaining {
  hours: number;
  minutes: number;
  seconds: number;
}

// Mock times - in production, use actual prayer times
const IFTAR_TIME = '18:20';
const SUHOOR_TIME = '04:30';

export function CountdownCard() {
  const [timeToIftar, setTimeToIftar] = useState<TimeRemaining | null>(null);
  const [timeToSuhoor, setTimeToSuhoor] = useState<TimeRemaining | null>(null);
  const [isAfterIftar, setIsAfterIftar] = useState(false);

  useEffect(() => {
    const calculateTime = () => {
      const now = new Date();
      const currentMinutes = now.getHours() * 60 + now.getMinutes();
      
      const [iftarH, iftarM] = IFTAR_TIME.split(':').map(Number);
      const iftarMinutes = iftarH * 60 + iftarM;
      
      const [suhoorH, suhoorM] = SUHOOR_TIME.split(':').map(Number);
      const suhoorMinutes = suhoorH * 60 + suhoorM;

      // Check if after iftar
      if (currentMinutes >= iftarMinutes) {
        setIsAfterIftar(true);
        // Calculate time to suhoor (next day if needed)
        const minutesToSuhoor = (24 * 60 - currentMinutes) + suhoorMinutes;
        setTimeToSuhoor({
          hours: Math.floor(minutesToSuhoor / 60),
          minutes: minutesToSuhoor % 60,
          seconds: 60 - now.getSeconds(),
        });
        setTimeToIftar(null);
      } else if (currentMinutes < suhoorMinutes) {
        setIsAfterIftar(true);
        // Before suhoor
        const minutesToSuhoor = suhoorMinutes - currentMinutes;
        setTimeToSuhoor({
          hours: Math.floor(minutesToSuhoor / 60),
          minutes: minutesToSuhoor % 60,
          seconds: 60 - now.getSeconds(),
        });
        setTimeToIftar(null);
      } else {
        setIsAfterIftar(false);
        // Fasting - calculate time to iftar
        const minutesToIftar = iftarMinutes - currentMinutes;
        setTimeToIftar({
          hours: Math.floor(minutesToIftar / 60),
          minutes: minutesToIftar % 60,
          seconds: 60 - now.getSeconds(),
        });
        setTimeToSuhoor(null);
      }
    };

    calculateTime();
    const timer = setInterval(calculateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  const timeRemaining = isAfterIftar ? timeToSuhoor : timeToIftar;
  const label = isAfterIftar ? 'السحور' : 'الإفطار';
  const Icon = isAfterIftar ? Moon : Utensils;

  if (!timeRemaining) return null;

  return (
    <div className="glass-card p-6 animate-fade-in overflow-hidden relative">
      {/* Decorative gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
      
      <div className="relative">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 rounded-full bg-primary/20">
            <Icon className="w-6 h-6 text-primary" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">موعد {label}</p>
            <p className="text-lg font-semibold text-foreground">
              {isAfterIftar ? SUHOOR_TIME : IFTAR_TIME}
            </p>
          </div>
        </div>

        <div className="text-center py-4">
          <p className="text-sm text-muted-foreground mb-3">الوقت المتبقي</p>
          <div className="flex items-center justify-center gap-4">
            <TimeUnit value={timeRemaining.hours} label="ساعة" />
            <span className="text-3xl text-primary font-bold animate-pulse">:</span>
            <TimeUnit value={timeRemaining.minutes} label="دقيقة" />
            <span className="text-3xl text-primary font-bold animate-pulse">:</span>
            <TimeUnit value={timeRemaining.seconds} label="ثانية" />
          </div>
        </div>

        {!isAfterIftar && (
          <div className="mt-4 p-3 bg-accent/10 rounded-lg border border-accent/20">
            <p className="text-center text-sm text-accent">
              🤲 اللهم إني أسألك الجنة وما قرب إليها من قول أو عمل
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function TimeUnit({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <span className="text-4xl font-bold text-foreground font-mono min-w-[3rem]">
        {value.toString().padStart(2, '0')}
      </span>
      <span className="text-xs text-muted-foreground mt-1">{label}</span>
    </div>
  );
}
