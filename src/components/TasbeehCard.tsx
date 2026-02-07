import { useState } from 'react';
import { RotateCcw, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTasbeeh } from '@/hooks/useTasbeeh';

export function TasbeehCard() {
  const { 
    session, 
    savedDhikrs, 
    defaultTargets,
    startSession, 
    increment, 
    reset, 
    endSession,
    isComplete 
  } = useTasbeeh();

  const [showSelector, setShowSelector] = useState(false);
  const [selectedTarget, setSelectedTarget] = useState(33);

  if (!session && !showSelector) {
    return (
      <div className="glass-card p-6 animate-fade-in">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-foreground">المسبحة الرقمية</h2>
        </div>
        
        <div className="text-center py-8">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
            <span className="text-4xl">📿</span>
          </div>
          <p className="text-muted-foreground mb-4">ابدأ التسبيح</p>
          <Button 
            onClick={() => setShowSelector(true)}
            className="bg-gradient-to-l from-primary to-gold-dim"
          >
            اختر الذكر
          </Button>
        </div>
      </div>
    );
  }

  if (showSelector) {
    return (
      <div className="glass-card p-6 animate-fade-in">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-foreground">اختر الذكر</h2>
          <Button variant="ghost" size="icon" onClick={() => setShowSelector(false)}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Target Selection */}
        <div className="mb-6">
          <p className="text-sm text-muted-foreground mb-3">العدد المستهدف</p>
          <div className="flex gap-2">
            {defaultTargets.map((target) => (
              <button
                key={target}
                onClick={() => setSelectedTarget(target)}
                className={`
                  flex-1 py-3 rounded-xl font-medium transition-all
                  ${selectedTarget === target 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-secondary/50 text-foreground hover:bg-secondary'
                  }
                `}
              >
                {target}
              </button>
            ))}
          </div>
        </div>

        {/* Dhikr Selection */}
        <div className="space-y-2 max-h-60 overflow-y-auto scrollbar-hide">
          {savedDhikrs.map((dhikr, index) => (
            <button
              key={index}
              onClick={() => {
                startSession(dhikr, selectedTarget);
                setShowSelector(false);
              }}
              className="w-full p-4 text-right bg-secondary/50 hover:bg-secondary rounded-xl transition-all text-foreground font-arabic"
            >
              {dhikr}
            </button>
          ))}
        </div>
      </div>
    );
  }

  // Active Session
  const progress = (session!.count / session!.target) * 100;

  return (
    <div className="glass-card p-6 animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-foreground">المسبحة</h2>
        <div className="flex gap-2">
          <Button variant="ghost" size="icon" onClick={reset}>
            <RotateCcw className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={endSession}>
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Current Dhikr */}
      <div className="text-center mb-6">
        <p className="text-xl font-arabic text-foreground mb-2">{session!.dhikr}</p>
      </div>

      {/* Counter */}
      <button 
        onClick={increment}
        className={`
          relative w-full aspect-square max-w-[200px] mx-auto mb-6 rounded-full 
          flex items-center justify-center transition-all active:scale-95
          ${isComplete 
            ? 'bg-gradient-to-br from-accent to-emerald-dim animate-pulse-glow' 
            : 'bg-gradient-to-br from-primary to-gold-dim'
          }
        `}
      >
        {/* Circular Progress */}
        <svg className="absolute inset-0 w-full h-full -rotate-90">
          <circle
            cx="50%"
            cy="50%"
            r="48%"
            fill="none"
            stroke="hsl(var(--background))"
            strokeWidth="4"
            opacity="0.3"
          />
          <circle
            cx="50%"
            cy="50%"
            r="48%"
            fill="none"
            stroke="hsl(var(--foreground))"
            strokeWidth="4"
            strokeDasharray={`${progress * 3.02} 302`}
            strokeLinecap="round"
            opacity="0.5"
          />
        </svg>
        
        <div className="text-center">
          <span className="text-5xl font-bold text-primary-foreground">
            {session!.count}
          </span>
          <p className="text-sm text-primary-foreground/80">
            / {session!.target}
          </p>
        </div>
      </button>

      {isComplete && (
        <div className="text-center p-3 bg-accent/20 rounded-xl border border-accent/30">
          <p className="text-accent font-medium">🎉 أحسنت! أتممت الذكر</p>
        </div>
      )}

      {/* Beads Visualization */}
      <div className="flex flex-wrap justify-center gap-1 mt-4">
        {Array.from({ length: Math.min(session!.target, 33) }).map((_, i) => (
          <div
            key={i}
            className={`
              w-3 h-3 rounded-full transition-all duration-200
              ${i < (session!.count % 33 || (session!.count > 0 && session!.count % 33 === 0 ? 33 : 0))
                ? 'bg-primary scale-110' 
                : 'bg-secondary'
              }
            `}
          />
        ))}
      </div>
    </div>
  );
}
