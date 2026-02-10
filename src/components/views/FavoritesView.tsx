import { useState } from 'react';
import { Plus, X, Heart, BookOpen, Trash2, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLocalStorage } from '@/hooks/useLocalStorage';

interface PersonalDua {
  id: string;
  text: string;
  category: string;
  createdAt: string;
}

interface FavoriteVerse {
  id: string;
  text: string;
  surah: string;
  ayahNumber: number;
  note?: string;
}

const duaCategories = ['شخصي', 'عائلي', 'صحة', 'رزق', 'علم', 'آخرة'];

export function FavoritesView() {
  const [personalDuas, setPersonalDuas] = useLocalStorage<PersonalDua[]>('personal-duas', []);
  const [favoriteVerses, setFavoriteVerses] = useLocalStorage<FavoriteVerse[]>('favorite-verses', []);
  const [activeTab, setActiveTab] = useState<'duas' | 'verses' | 'wishlist'>('duas');
  const [showAddDua, setShowAddDua] = useState(false);
  const [newDuaText, setNewDuaText] = useState('');
  const [newDuaCategory, setNewDuaCategory] = useState('شخصي');
  const [wishlist, setWishlist] = useLocalStorage<string[]>('ramadan-wishlist', []);
  const [newWish, setNewWish] = useState('');

  const addDua = () => {
    if (!newDuaText.trim()) return;
    const dua: PersonalDua = {
      id: Date.now().toString(),
      text: newDuaText.trim(),
      category: newDuaCategory,
      createdAt: new Date().toISOString(),
    };
    setPersonalDuas(prev => [dua, ...prev]);
    setNewDuaText('');
    setShowAddDua(false);
  };

  const deleteDua = (id: string) => {
    setPersonalDuas(prev => prev.filter(d => d.id !== id));
  };

  const deleteVerse = (id: string) => {
    setFavoriteVerses(prev => prev.filter(v => v.id !== id));
  };

  const addWish = () => {
    if (!newWish.trim()) return;
    setWishlist(prev => [...prev, newWish.trim()]);
    setNewWish('');
  };

  const removeWish = (index: number) => {
    setWishlist(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center">
        <h2 className="text-xl font-bold text-foreground mb-1">المفضلة والأدعية</h2>
        <p className="text-sm text-muted-foreground">أدعيتك الخاصة وآياتك المفضلة</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        {[
          { id: 'duas' as const, label: 'أدعيتي', icon: Heart },
          { id: 'verses' as const, label: 'آيات مفضلة', icon: BookOpen },
          { id: 'wishlist' as const, label: 'أمنياتي', icon: '🌟' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 p-3 rounded-xl text-sm font-medium transition-all flex items-center justify-center gap-2 ${
              activeTab === tab.id
                ? 'bg-primary text-primary-foreground'
                : 'bg-secondary/50 text-muted-foreground'
            }`}
          >
            {typeof tab.icon === 'string' ? (
              <span>{tab.icon}</span>
            ) : (
              <tab.icon className="w-4 h-4" />
            )}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Personal Duas */}
      {activeTab === 'duas' && (
        <div className="space-y-4">
          <Button
            onClick={() => setShowAddDua(!showAddDua)}
            className="w-full bg-accent/20 text-accent hover:bg-accent/30"
            variant="ghost"
          >
            <Plus className="w-4 h-4 ml-2" />
            إضافة دعاء جديد
          </Button>

          {showAddDua && (
            <div className="glass-card p-4 space-y-4">
              <textarea
                value={newDuaText}
                onChange={(e) => setNewDuaText(e.target.value)}
                placeholder="اكتب دعاءك هنا..."
                className="w-full bg-secondary/50 rounded-xl p-3 text-foreground min-h-[100px] text-sm border-none outline-none focus:ring-2 focus:ring-primary/50"
                dir="rtl"
              />
              <div className="flex gap-2 flex-wrap">
                {duaCategories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setNewDuaCategory(cat)}
                    className={`px-3 py-1.5 rounded-lg text-xs transition-all ${
                      newDuaCategory === cat
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-secondary/50 text-muted-foreground'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
              <div className="flex gap-2">
                <Button onClick={addDua} className="flex-1 bg-accent hover:bg-accent/90">
                  حفظ الدعاء
                </Button>
                <Button variant="ghost" onClick={() => setShowAddDua(false)}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}

          {personalDuas.length === 0 ? (
            <div className="glass-card p-8 text-center">
              <Heart className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
              <p className="text-muted-foreground">لم تضف أدعية بعد</p>
              <p className="text-xs text-muted-foreground mt-1">أضف أدعيتك الشخصية لتذكّرها دائماً</p>
            </div>
          ) : (
            <div className="space-y-3">
              {personalDuas.map((dua) => (
                <div key={dua.id} className="glass-card p-4">
                  <div className="flex items-start justify-between mb-2">
                    <span className="text-xs px-2 py-1 bg-primary/20 text-primary rounded-lg">
                      {dua.category}
                    </span>
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => deleteDua(dua.id)}>
                      <Trash2 className="w-3.5 h-3.5 text-muted-foreground" />
                    </Button>
                  </div>
                  <p className="font-arabic text-foreground leading-relaxed">{dua.text}</p>
                </div>
              ))}
            </div>
          )}

          {/* Pre-made Duas */}
          <div className="glass-card p-4">
            <h3 className="text-sm font-semibold text-foreground mb-3">أدعية مأثورة</h3>
            <div className="space-y-3">
              {[
                { text: 'رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ', source: 'البقرة: ٢٠١' },
                { text: 'رَبِّ اشْرَحْ لِي صَدْرِي وَيَسِّرْ لِي أَمْرِي', source: 'طه: ٢٥-٢٦' },
                { text: 'رَبَّنَا لَا تُزِغْ قُلُوبَنَا بَعْدَ إِذْ هَدَيْتَنَا وَهَبْ لَنَا مِن لَّدُنكَ رَحْمَةً', source: 'آل عمران: ٨' },
              ].map((dua, i) => (
                <div key={i} className="bg-secondary/30 rounded-xl p-3">
                  <p className="font-quran text-foreground text-sm leading-relaxed">{dua.text}</p>
                  <p className="text-xs text-muted-foreground mt-1">{dua.source}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Favorite Verses */}
      {activeTab === 'verses' && (
        <div className="space-y-4">
          {favoriteVerses.length === 0 ? (
            <div className="glass-card p-8 text-center">
              <BookOpen className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
              <p className="text-muted-foreground">لم تحفظ آيات مفضلة بعد</p>
              <p className="text-xs text-muted-foreground mt-1">يمكنك حفظ آياتك المفضلة من القارئ</p>
            </div>
          ) : (
            <div className="space-y-3">
              {favoriteVerses.map((verse) => (
                <div key={verse.id} className="glass-card p-4">
                  <p className="font-quran text-foreground text-lg leading-relaxed mb-2">
                    ﴿ {verse.text} ﴾
                  </p>
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-muted-foreground">{verse.surah} - آية {verse.ayahNumber}</p>
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => deleteVerse(verse.id)}>
                      <Trash2 className="w-3.5 h-3.5 text-muted-foreground" />
                    </Button>
                  </div>
                  {verse.note && (
                    <p className="text-xs text-accent mt-2 bg-accent/10 p-2 rounded-lg">{verse.note}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Ramadan Wishlist */}
      {activeTab === 'wishlist' && (
        <div className="space-y-4">
          <div className="glass-card p-4">
            <p className="text-sm text-muted-foreground mb-3 text-center">
              🌟 قائمة أمنياتك الرمضانية
            </p>
            <div className="flex gap-2">
              <input
                type="text"
                value={newWish}
                onChange={(e) => setNewWish(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addWish()}
                placeholder="أضف أمنية أو هدف..."
                className="flex-1 bg-secondary/50 rounded-xl p-3 text-foreground text-sm border-none outline-none focus:ring-2 focus:ring-primary/50"
                dir="rtl"
              />
              <Button onClick={addWish} size="icon" className="bg-accent hover:bg-accent/90">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {wishlist.length === 0 ? (
            <div className="glass-card p-8 text-center">
              <span className="text-4xl block mb-3">🌙</span>
              <p className="text-muted-foreground">أضف أهدافك وأمنياتك لرمضان</p>
              <p className="text-xs text-muted-foreground mt-1">مثال: ختم القرآن، قيام كل ليلة...</p>
            </div>
          ) : (
            <div className="space-y-2">
              {wishlist.map((wish, index) => (
                <div key={index} className="glass-card p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-lg">🌟</span>
                    <p className="text-foreground text-sm">{wish}</p>
                  </div>
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => removeWish(index)}>
                    <X className="w-3.5 h-3.5 text-muted-foreground" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}