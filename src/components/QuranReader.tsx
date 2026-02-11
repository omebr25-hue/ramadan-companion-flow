import { useState, useEffect, useCallback } from 'react';
import {
  ChevronRight,
  ChevronLeft,
  Bookmark,
  BookmarkCheck,
  Settings2,
  Type,
  List,
  X,
  Loader2,
  WifiOff,
  Search,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useQuranApi } from '@/hooks/useQuranApi';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useSettings } from '@/hooks/useSettings';

interface QuranReaderProps {
  initialPage?: number;
  onClose?: () => void;
  onPageRead?: (page: number) => void;
}

type BrowseMode = 'page' | 'surah' | 'juz';

export function QuranReader({ initialPage = 1, onClose, onPageRead }: QuranReaderProps) {
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [bookmarks, setBookmarks] = useLocalStorage<number[]>('quran-bookmarks', []);
  const [lastReadPage, setLastReadPage] = useLocalStorage<number>('quran-last-read', 1);
  const [showSettings, setShowSettings] = useState(false);
  const [showSurahList, setShowSurahList] = useState(false);
  const [browseMode, setBrowseMode] = useState<BrowseMode>('page');
  const [surahSearch, setSurahSearch] = useState('');
  const [surahViewData, setSurahViewData] = useState<any>(null);
  const [surahViewNumber, setSurahViewNumber] = useState<number | null>(null);
  const { settings, updateSettings, getQuranFontSize } = useSettings();
  
  const { 
    fetchPage, fetchSurah, prefetchPages, loading, error, 
    surahs, getSurahFromPage, getJuzFromPage, juzNames,
    getCachedPageCount 
  } = useQuranApi();

  const [pageData, setPageData] = useState<any>(null);
  
  const surah = getSurahFromPage(currentPage);
  const juz = getJuzFromPage(currentPage);
  const isBookmarked = bookmarks.includes(currentPage);

  // Load page data
  useEffect(() => {
    if (browseMode === 'surah' && surahViewNumber) return;
    let cancelled = false;
    fetchPage(currentPage).then(data => {
      if (!cancelled) setPageData(data);
    });
    return () => { cancelled = true; };
  }, [currentPage, fetchPage, browseMode, surahViewNumber]);

  // Save last read + prefetch
  useEffect(() => {
    setLastReadPage(currentPage);
    onPageRead?.(currentPage);
    prefetchPages(currentPage);
  }, [currentPage, setLastReadPage, onPageRead, prefetchPages]);

  // Swipe navigation
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };
  const onTouchMove = (e: React.TouchEvent) => setTouchEnd(e.targetTouches[0].clientX);
  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    if (distance < -minSwipeDistance && currentPage < 604) setCurrentPage(p => p + 1);
    if (distance > minSwipeDistance && currentPage > 1) setCurrentPage(p => p - 1);
  };

  const toggleBookmark = () => {
    setBookmarks(isBookmarked ? bookmarks.filter(p => p !== currentPage) : [...bookmarks, currentPage]);
  };

  const goToSurah = async (surahNumber: number) => {
    if (browseMode === 'surah') {
      setSurahViewNumber(surahNumber);
      const data = await fetchSurah(surahNumber);
      setSurahViewData(data);
      setShowSurahList(false);
    } else {
      const s = surahs.find(s => s.number === surahNumber);
      if (s) {
        setCurrentPage(s.startPage);
        setShowSurahList(false);
      }
    }
  };

  const goToJuz = (juzNumber: number) => {
    const page = (juzNumber - 1) * 20 + 1;
    setCurrentPage(Math.min(page, 604));
    setShowSurahList(false);
  };

  const filteredSurahs = surahs.filter(s => 
    s.name.includes(surahSearch) || 
    s.englishName.toLowerCase().includes(surahSearch.toLowerCase()) ||
    s.number.toString() === surahSearch
  );

  // Surah List / Juz List
  if (showSurahList) {
    return (
      <div className="fixed inset-0 z-50 bg-background">
        <div className="h-full flex flex-col">
          <div className="p-4 border-b border-border">
            <div className="flex items-center justify-between mb-3">
              <Button variant="ghost" size="icon" onClick={() => setShowSurahList(false)}>
                <X className="w-5 h-5" />
              </Button>
              <h2 className="text-lg font-bold text-foreground">
                {browseMode === 'juz' ? 'فهرس الأجزاء' : 'فهرس السور'}
              </h2>
              <div className="w-10" />
            </div>

            {/* Browse mode tabs */}
            <div className="flex gap-2 mb-3">
              {[
                { mode: 'page' as BrowseMode, label: 'صفحات' },
                { mode: 'surah' as BrowseMode, label: 'سور' },
                { mode: 'juz' as BrowseMode, label: 'أجزاء' },
              ].map(({ mode, label }) => (
                <button
                  key={mode}
                  onClick={() => setBrowseMode(mode)}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                    browseMode === mode
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-secondary/50 text-muted-foreground'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            {/* Search */}
            {browseMode !== 'juz' && (
              <div className="relative">
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="ابحث عن سورة..."
                  value={surahSearch}
                  onChange={(e) => setSurahSearch(e.target.value)}
                  className="w-full bg-secondary/50 rounded-lg py-2 pr-10 pl-4 text-foreground placeholder:text-muted-foreground text-sm"
                />
              </div>
            )}
          </div>
          
          <div className="flex-1 overflow-y-auto p-4">
            {browseMode === 'juz' ? (
              <div className="space-y-2">
                {Object.entries(juzNames).map(([num, name]) => {
                  const juzNum = parseInt(num);
                  const startPage = (juzNum - 1) * 20 + 1;
                  return (
                    <button
                      key={num}
                      onClick={() => goToJuz(juzNum)}
                      className={`w-full p-4 rounded-xl flex items-center justify-between transition-all ${
                        juz === juzNum
                          ? 'bg-primary/20 border border-primary/50'
                          : 'bg-secondary/30 hover:bg-secondary/50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                          {juzNum}
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-foreground">الجزء {juzNum}</p>
                          <p className="text-xs text-muted-foreground">{name}</p>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">صفحة {startPage}</p>
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="space-y-2">
                {filteredSurahs.map((s) => (
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
                      <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-sm">
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
                      <p className="text-xs text-muted-foreground">{s.endPage - s.startPage + 1} صفحات</p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Settings
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

        <div>
          <label className="text-sm text-muted-foreground mb-3 block">وضع التصفح</label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { mode: 'page' as BrowseMode, label: 'بالصفحة' },
              { mode: 'surah' as BrowseMode, label: 'بالسورة' },
              { mode: 'juz' as BrowseMode, label: 'بالجزء' },
            ].map(({ mode, label }) => (
              <button
                key={mode}
                onClick={() => {
                  setBrowseMode(mode);
                  setSurahViewNumber(null);
                  setSurahViewData(null);
                }}
                className={`p-3 rounded-xl text-sm font-medium transition-all ${
                  browseMode === mode
                    ? 'bg-primary/20 border-2 border-primary'
                    : 'bg-secondary/50 border-2 border-transparent'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="p-4 bg-secondary/30 rounded-xl">
          <p className="font-quran text-center" style={{ fontSize: getQuranFontSize() }}>
            بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
          </p>
        </div>

        <div className="bg-secondary/30 rounded-xl p-4">
          <p className="text-sm text-muted-foreground">
            📥 صفحات محفوظة: {getCachedPageCount()} / 604
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            الصفحات تُحفظ تلقائياً للقراءة بدون إنترنت
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

  // Surah full view mode
  if (browseMode === 'surah' && surahViewData && surahViewNumber) {
    const viewSurah = surahs.find(s => s.number === surahViewNumber);
    return (
      <div className="space-y-4">
        <div className="glass-card p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" onClick={() => setShowSurahList(true)}>
                <List className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => setShowSettings(true)}>
                <Settings2 className="w-5 h-5" />
              </Button>
            </div>
            <div className="text-center flex-1">
              <p className="font-bold text-foreground">{viewSurah?.name}</p>
              <p className="text-xs text-muted-foreground">
                {viewSurah?.revelationType} • {viewSurah?.ayahCount} آية
              </p>
            </div>
            <div className="flex gap-1">
              <Button
                variant="ghost" size="icon"
                disabled={surahViewNumber <= 1}
                onClick={() => goToSurah(surahViewNumber - 1)}
              >
                <ChevronRight className="w-5 h-5" />
              </Button>
              <Button
                variant="ghost" size="icon"
                disabled={surahViewNumber >= 114}
                onClick={() => goToSurah(surahViewNumber + 1)}
              >
                <ChevronLeft className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>

        <div className="glass-card p-6" onTouchStart={onTouchStart} onTouchMove={onTouchMove} onTouchEnd={onTouchEnd}>
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="space-y-2 text-center">
              {viewSurah?.number !== 9 && (
                <p className="font-quran text-primary mb-6" style={{ fontSize: getQuranFontSize() }}>
                  بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
                </p>
              )}
              {surahViewData.ayahs.map((ayah: any, index: number) => (
                <span
                  key={index}
                  className="font-quran leading-[2.5] text-foreground inline"
                  style={{ fontSize: getQuranFontSize() }}
                >
                  {ayah.text}
                  <span className="text-primary mx-1 text-sm">﴿{ayah.numberInSurah}﴾</span>
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  // Page view (default)
  const displayAyahs = pageData?.ayahs || [];

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
              الجزء {juz} - {juzNames[juz]} • صفحة {currentPage}
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
        {loading ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <Loader2 className="w-10 h-10 animate-spin text-primary mx-auto mb-4" />
              <p className="text-muted-foreground">جارٍ تحميل الصفحة...</p>
            </div>
          </div>
        ) : error && displayAyahs.length === 0 ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <WifiOff className="w-10 h-10 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground mb-2">لا يوجد اتصال بالإنترنت</p>
              <p className="text-xs text-muted-foreground">هذه الصفحة لم تُحمّل بعد</p>
              <Button variant="outline" className="mt-4" onClick={() => fetchPage(currentPage)}>
                إعادة المحاولة
              </Button>
            </div>
          </div>
        ) : displayAyahs.length > 0 ? (
          <div className="flex-1 flex flex-col justify-center">
            <div className="text-center space-y-1">
              {/* Group ayahs by surah to show bismillah */}
              {(() => {
                let lastSurah = 0;
                return displayAyahs.map((ayah: any, index: number) => {
                  const showBismillah = ayah.surahNumber !== lastSurah && ayah.numberInSurah === 1 && ayah.surahNumber !== 1 && ayah.surahNumber !== 9;
                  const showSurahName = ayah.surahNumber !== lastSurah && ayah.numberInSurah === 1;
                  lastSurah = ayah.surahNumber;
                  return (
                    <span key={index}>
                      {showSurahName && (
                        <div className="py-3 my-3 border-y border-primary/20">
                          <p className="text-primary font-bold text-lg">
                            سورة {surahs.find(s => s.number === ayah.surahNumber)?.name}
                          </p>
                        </div>
                      )}
                      {showBismillah && (
                        <p className="font-quran text-primary my-3" style={{ fontSize: getQuranFontSize() }}>
                          بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
                        </p>
                      )}
                      <span
                        className="font-quran leading-[2.5] text-foreground inline"
                        style={{ fontSize: getQuranFontSize() }}
                      >
                        {ayah.text}
                        <span className="text-primary mx-1 text-sm">﴿{ayah.numberInSurah}﴾</span>
                      </span>
                    </span>
                  );
                });
              })()}
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <p className="font-quran text-3xl text-muted-foreground mb-4">﴾ ﴿</p>
              <p className="text-muted-foreground">صفحة {currentPage}</p>
              <p className="text-sm text-muted-foreground">{surah?.name}</p>
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="glass-card p-4">
        <div className="flex items-center justify-between">
          <Button
            variant="ghost" size="icon"
            onClick={() => setCurrentPage(p => Math.min(604, p + 1))}
            disabled={currentPage >= 604}
          >
            <ChevronRight className="w-6 h-6" />
          </Button>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => setCurrentPage(lastReadPage)}>
              آخر قراءة ({lastReadPage})
            </Button>
          </div>
          <Button
            variant="ghost" size="icon"
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage <= 1}
          >
            <ChevronLeft className="w-6 h-6" />
          </Button>
        </div>

        <div className="flex items-center justify-center gap-2 mt-4">
          <span className="text-sm text-muted-foreground">صفحة:</span>
          <input
            type="number"
            min="1"
            max="604"
            value={currentPage}
            onChange={(e) => {
              const page = parseInt(e.target.value);
              if (page >= 1 && page <= 604) setCurrentPage(page);
            }}
            className="w-16 bg-secondary/50 rounded-lg p-2 text-center text-foreground"
          />
        </div>
      </div>
    </div>
  );
}
