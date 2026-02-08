import { useState, useEffect, useCallback } from 'react';
import {
  ChevronRight,
  ChevronLeft,
  Bookmark,
  BookmarkCheck,
  Settings2,
  Type,
  Moon,
  Sun,
  List,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { surahs, surahTexts, getSurahFromPage, getJuzFromPage, juzNames } from '@/data/quranText';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useSettings } from '@/hooks/useSettings';

interface QuranReaderProps {
  initialPage?: number;
  onClose?: () => void;
  onPageRead?: (page: number) => void;
}

export function QuranReader({ initialPage = 1, onClose, onPageRead }: QuranReaderProps) {
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [bookmarks, setBookmarks] = useLocalStorage<number[]>('quran-bookmarks', []);
  const [lastReadPage, setLastReadPage] = useLocalStorage<number>('quran-last-read', 1);
  const [showSettings, setShowSettings] = useState(false);
  const [showSurahList, setShowSurahList] = useState(false);
  const { settings, updateSettings, getQuranFontSize } = useSettings();
  
  const surah = getSurahFromPage(currentPage);
  const juz = getJuzFromPage(currentPage);
  const isBookmarked = bookmarks.includes(currentPage);

  // حفظ آخر صفحة مقروءة
  useEffect(() => {
    setLastReadPage(currentPage);
    onPageRead?.(currentPage);
  }, [currentPage, setLastReadPage, onPageRead]);

  // التنقل بالسحب
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isRightSwipe = distance < -minSwipeDistance;
    const isLeftSwipe = distance > minSwipeDistance;

    if (isRightSwipe && currentPage < 604) {
      setCurrentPage(p => p + 1);
    }
    if (isLeftSwipe && currentPage > 1) {
      setCurrentPage(p => p - 1);
    }
  };

  const toggleBookmark = () => {
    if (isBookmarked) {
      setBookmarks(bookmarks.filter(p => p !== currentPage));
    } else {
      setBookmarks([...bookmarks, currentPage]);
    }
  };

  const goToSurah = (surahNumber: number) => {
    const surahData = surahs.find(s => s.number === surahNumber);
    if (surahData) {
      setCurrentPage(surahData.startPage);
      setShowSurahList(false);
    }
  };

  // الحصول على نص الصفحة
  const getPageText = () => {
    // في التطبيق الحقيقي، هنا سيتم جلب النص من ملف البيانات الكامل
    // حاليًا نعرض نصوصًا تمثيلية
    if (surah && surahTexts[surah.number]) {
      return surahTexts[surah.number];
    }
    return null;
  };

  const pageText = getPageText();

  if (showSurahList) {
    return (
      <div className="fixed inset-0 z-50 bg-background">
        <div className="h-full flex flex-col">
          <div className="p-4 border-b border-border flex items-center justify-between">
            <Button variant="ghost" size="icon" onClick={() => setShowSurahList(false)}>
              <X className="w-5 h-5" />
            </Button>
            <h2 className="text-lg font-bold text-foreground">فهرس السور</h2>
            <div className="w-10" />
          </div>
          
          <div className="flex-1 overflow-y-auto p-4">
            <div className="space-y-2">
              {surahs.map((s) => (
                <button
                  key={s.number}
                  onClick={() => goToSurah(s.number)}
                  className={`w-full p-4 rounded-xl flex items-center justify-between transition-all ${
                    surah?.number === s.number
                      ? 'bg-primary/20 border border-primary/50'
                      : 'bg-secondary/30 hover:bg-secondary/50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                      {s.number}
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-foreground">{s.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {s.revelationType} • {s.ayahCount} آية
                      </p>
                    </div>
                  </div>
                  <div className="text-left">
                    <p className="text-sm text-muted-foreground">صفحة {s.startPage}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (showSettings) {
    return (
      <div className="glass-card p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-foreground">إعدادات القراءة</h3>
          <Button variant="ghost" size="icon" onClick={() => setShowSettings(false)}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div>
          <label className="text-sm text-muted-foreground mb-4 block">حجم الخط</label>
          <div className="grid grid-cols-4 gap-2">
            {(['small', 'medium', 'large', 'xlarge'] as const).map((size) => (
              <button
                key={size}
                onClick={() => updateSettings({ fontSize: size })}
                className={`p-3 rounded-xl flex flex-col items-center gap-2 transition-all ${
                  settings.fontSize === size
                    ? 'bg-primary/20 border-2 border-primary'
                    : 'bg-secondary/50 border-2 border-transparent'
                }`}
              >
                <Type className={`${
                  size === 'small' ? 'w-4 h-4' :
                  size === 'medium' ? 'w-5 h-5' :
                  size === 'large' ? 'w-6 h-6' : 'w-7 h-7'
                }`} />
                <span className="text-xs">
                  {size === 'small' ? 'صغير' :
                   size === 'medium' ? 'متوسط' :
                   size === 'large' ? 'كبير' : 'كبير جداً'}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="p-4 bg-secondary/30 rounded-xl">
          <p className="font-quran text-center" style={{ fontSize: getQuranFontSize() }}>
            بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
          </p>
        </div>

        {bookmarks.length > 0 && (
          <div>
            <label className="text-sm text-muted-foreground mb-3 block">العلامات المرجعية</label>
            <div className="flex flex-wrap gap-2">
              {bookmarks.map((page) => (
                <button
                  key={page}
                  onClick={() => {
                    setCurrentPage(page);
                    setShowSettings(false);
                  }}
                  className="px-3 py-2 bg-primary/20 rounded-lg text-sm text-foreground"
                >
                  صفحة {page}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="glass-card p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={() => setShowSurahList(true)}>
              <List className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => setShowSettings(true)}>
              <Settings2 className="w-5 h-5" />
            </Button>
          </div>
          <div className="text-center flex-1">
            <p className="font-bold text-foreground">{surah?.name}</p>
            <p className="text-xs text-muted-foreground">
              {juzNames[juz]} • صفحة {currentPage}
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleBookmark}
            className={isBookmarked ? 'text-primary' : 'text-muted-foreground'}
          >
            {isBookmarked ? <BookmarkCheck className="w-5 h-5" /> : <Bookmark className="w-5 h-5" />}
          </Button>
        </div>

        {/* Progress */}
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${(currentPage / 604) * 100}%` }} />
        </div>
      </div>

      {/* Quran Text */}
      <div
        className="glass-card p-6 min-h-[400px] flex flex-col"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        {pageText ? (
          <div className="flex-1 flex flex-col justify-center">
            <div className="space-y-4 text-center">
              {pageText.map((ayah, index) => (
                <p
                  key={index}
                  className="font-quran leading-loose text-foreground"
                  style={{ fontSize: getQuranFontSize() }}
                >
                  {ayah}
                  {index > 0 && (
                    <span className="text-primary mx-1">﴿{index}﴾</span>
                  )}
                </p>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <p className="font-quran text-3xl text-muted-foreground mb-4">﴾ ﴿</p>
              <p className="text-muted-foreground">صفحة {currentPage}</p>
              <p className="text-sm text-muted-foreground">{surah?.name}</p>
              <p className="text-xs text-muted-foreground mt-2">
                اسحب يميناً أو يساراً للتنقل
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="glass-card p-4">
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCurrentPage(p => Math.min(604, p + 1))}
            disabled={currentPage >= 604}
          >
            <ChevronRight className="w-6 h-6" />
          </Button>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(lastReadPage)}
            >
              آخر قراءة ({lastReadPage})
            </Button>
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage <= 1}
          >
            <ChevronLeft className="w-6 h-6" />
          </Button>
        </div>

        {/* Page input */}
        <div className="flex items-center justify-center gap-2 mt-4">
          <span className="text-sm text-muted-foreground">الانتقال إلى صفحة:</span>
          <input
            type="number"
            min="1"
            max="604"
            value={currentPage}
            onChange={(e) => {
              const page = parseInt(e.target.value);
              if (page >= 1 && page <= 604) {
                setCurrentPage(page);
              }
            }}
            className="w-16 bg-secondary/50 rounded-lg p-2 text-center text-foreground"
          />
        </div>
      </div>
    </div>
  );
}
