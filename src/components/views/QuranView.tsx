import { useState } from 'react';
import { ChevronRight, ChevronLeft, Check, BookOpen, Settings2, BookMarked } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useQuranWird } from '@/hooks/useQuranWird';
import { getJuzName } from '@/data/quran';
import { QuranReader } from '@/components/QuranReader';

export function QuranView() {
  const { 
    todayWird, 
    settings,
    setSettings,
    currentPage, 
    markPageAsRead,
    markWirdAsComplete,
    getProgress,
    getPageInfo,
    completedPages 
  } = useQuranWird();
  
  const [viewPage, setViewPage] = useState(todayWird.currentPage);
  const [showSettings, setShowSettings] = useState(false);
  const [showReader, setShowReader] = useState(false);
  
  const pageInfo = getPageInfo(viewPage);
  const progress = getProgress();
  const isPageRead = completedPages.includes(viewPage);

  if (showReader) {
    return (
      <div className="animate-fade-in">
        <div className="mb-4">
          <Button variant="ghost" onClick={() => setShowReader(false)}>
            ← العودة للورد
          </Button>
        </div>
        <QuranReader 
          initialPage={viewPage} 
          onPageRead={(page) => markPageAsRead(page)}
        />
      </div>
    );
  }

  if (showSettings) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-foreground">إعدادات الورد</h2>
          <Button variant="ghost" onClick={() => setShowSettings(false)}>
            رجوع
          </Button>
        </div>

        <div className="glass-card p-6 space-y-6">
          <div>
            <p className="text-sm text-muted-foreground mb-3">نوع الورد</p>
            <div className="grid grid-cols-2 gap-3">
              {[
                { type: 'khatma', label: 'ختمة كاملة', desc: '٦٠٤ صفحة' },
                { type: 'juz', label: 'عدد أجزاء', desc: 'حدد العدد' },
                { type: 'pages', label: 'صفحات يومية', desc: 'حدد العدد' },
                { type: 'custom', label: 'مخصص', desc: 'تحكم كامل' },
              ].map(({ type, label, desc }) => (
                <button
                  key={type}
                  onClick={() => setSettings(prev => ({ ...prev, type: type as any }))}
                  className={`
                    p-4 rounded-xl text-right transition-all
                    ${settings.type === type 
                      ? 'bg-primary/20 border-2 border-primary/50' 
                      : 'bg-secondary/50 border-2 border-transparent'
                    }
                  `}
                >
                  <p className="font-medium text-foreground">{label}</p>
                  <p className="text-xs text-muted-foreground">{desc}</p>
                </button>
              ))}
            </div>
          </div>

          {settings.type === 'pages' && (
            <div>
              <p className="text-sm text-muted-foreground mb-3">عدد الصفحات اليومية</p>
              <div className="flex items-center gap-4">
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={() => setSettings(prev => ({ ...prev, dailyPages: Math.max(1, prev.dailyPages - 5) }))}
                >
                  -5
                </Button>
                <span className="text-3xl font-bold text-foreground flex-1 text-center">
                  {settings.dailyPages}
                </span>
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={() => setSettings(prev => ({ ...prev, dailyPages: prev.dailyPages + 5 }))}
                >
                  +5
                </Button>
              </div>
            </div>
          )}

          {settings.type === 'juz' && (
            <div>
              <p className="text-sm text-muted-foreground mb-3">عدد الأجزاء المستهدفة</p>
              <div className="flex items-center gap-4">
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={() => setSettings(prev => ({ ...prev, targetJuz: Math.max(1, prev.targetJuz - 1) }))}
                >
                  -1
                </Button>
                <span className="text-3xl font-bold text-foreground flex-1 text-center">
                  {settings.targetJuz}
                </span>
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={() => setSettings(prev => ({ ...prev, targetJuz: Math.min(30, prev.targetJuz + 1) }))}
                >
                  +1
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-foreground">ورد القرآن</h2>
          <p className="text-sm text-muted-foreground">
            {todayWird.totalPages} صفحة اليوم
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" size="icon" onClick={() => setShowReader(true)}>
            <BookMarked className="w-5 h-5" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => setShowSettings(true)}>
            <Settings2 className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Overall Progress */}
      <div className="glass-card p-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-muted-foreground">التقدم الكلي</span>
          <span className="text-sm font-medium text-primary">{progress.percentage}%</span>
        </div>
        <div className="progress-bar">
          <div 
            className="progress-fill"
            style={{ width: `${progress.percentage}%` }}
          />
        </div>
        <p className="text-xs text-muted-foreground text-center mt-2">
          {progress.read} من {progress.total} صفحة
        </p>
      </div>

      {/* Today's Range */}
      <div className="glass-card p-6">
        <div className="flex items-center gap-3 mb-4">
          <BookOpen className="w-6 h-6 text-accent" />
          <div>
            <p className="font-medium text-foreground">ورد اليوم</p>
            <p className="text-sm text-muted-foreground">
              من صفحة {todayWird.startPage} إلى {todayWird.endPage}
            </p>
          </div>
        </div>

        <div className="flex justify-between items-center mb-4">
          <span className="text-sm text-muted-foreground">
            {todayWird.readPages} / {todayWird.totalPages} صفحة
          </span>
          {todayWird.isCompleted ? (
            <span className="text-accent text-sm font-medium flex items-center gap-1">
              <Check className="w-4 h-4" />
              مكتمل
            </span>
          ) : (
            <Button 
              size="sm"
              onClick={markWirdAsComplete}
              className="bg-accent hover:bg-accent/90"
            >
              إتمام الورد
            </Button>
          )}
        </div>

        <div className="progress-bar">
          <div 
            className="progress-fill"
            style={{ width: `${(todayWird.readPages / todayWird.totalPages) * 100}%` }}
          />
        </div>
      </div>

      {/* Open Reader Button */}
      <Button 
        onClick={() => setShowReader(true)}
        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-6"
      >
        <BookOpen className="w-5 h-5 ml-2" />
        فتح المصحف
      </Button>

      {/* Page Viewer */}
      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-6">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => setViewPage(p => Math.min(604, p + 1))}
            disabled={viewPage >= 604}
          >
            <ChevronRight className="w-6 h-6" />
          </Button>
          
          <div className="text-center flex-1">
            <p className="text-3xl font-bold text-foreground mb-1">{viewPage}</p>
            <p className="text-sm text-accent">{pageInfo.surahName}</p>
            <p className="text-xs text-muted-foreground">{getJuzName(pageInfo.juzNumber)}</p>
          </div>
          
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => setViewPage(p => Math.max(1, p - 1))}
            disabled={viewPage <= 1}
          >
            <ChevronLeft className="w-6 h-6" />
          </Button>
        </div>

        {/* Mark as Read */}
        <div className="flex gap-3">
          <Button
            onClick={() => markPageAsRead(viewPage)}
            disabled={isPageRead}
            className={`flex-1 ${isPageRead ? 'bg-accent/20' : 'bg-accent hover:bg-accent/90'}`}
          >
            {isPageRead ? (
              <>
                <Check className="w-5 h-5 ml-2" />
                تمت القراءة
              </>
            ) : (
              'تمت قراءة هذه الصفحة'
            )}
          </Button>
        </div>
      </div>

      {/* Quick Jump */}
      <div className="glass-card p-4">
        <p className="text-sm text-muted-foreground mb-3 text-center">انتقال سريع</p>
        <div className="flex gap-2 justify-center flex-wrap">
          {[1, 100, 200, 300, 400, 500, 604].map((page) => (
            <Button
              key={page}
              variant="outline"
              size="sm"
              onClick={() => setViewPage(page)}
              className={viewPage === page ? 'border-primary' : ''}
            >
              {page}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
