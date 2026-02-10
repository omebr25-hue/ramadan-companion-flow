import { useState, useEffect } from 'react';
import { X, Moon, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLocalStorage } from '@/hooks/useLocalStorage';

interface DailyMessage {
  ayah: string;
  surah: string;
  message: string;
  dua: string;
}

const dailyMessages: DailyMessage[] = [
  {
    ayah: 'شَهْرُ رَمَضَانَ الَّذِي أُنزِلَ فِيهِ الْقُرْآنُ هُدًى لِّلنَّاسِ',
    surah: 'البقرة: ١٨٥',
    message: 'أنت في شهر الرحمة والمغفرة، اجعل كل لحظة فيه عبادة',
    dua: 'اللهم بلّغنا رمضان وأعنّا فيه على الصيام والقيام',
  },
  {
    ayah: 'وَإِذَا سَأَلَكَ عِبَادِي عَنِّي فَإِنِّي قَرِيبٌ أُجِيبُ دَعْوَةَ الدَّاعِ إِذَا دَعَانِ',
    surah: 'البقرة: ١٨٦',
    message: 'الله قريب منك، لا تتردد في الدعاء فأبواب السماء مفتوحة',
    dua: 'اللهم إنك عفو تحب العفو فاعف عنا',
  },
  {
    ayah: 'إِنَّ اللَّهَ مَعَ الصَّابِرِينَ',
    surah: 'البقرة: ١٥٣',
    message: 'الصبر مفتاح الفرج، وأنت أقوى مما تظن بإذن الله',
    dua: 'اللهم ارزقنا الصبر وحسن الختام',
  },
  {
    ayah: 'فَاذْكُرُونِي أَذْكُرْكُمْ وَاشْكُرُوا لِي وَلَا تَكْفُرُونِ',
    surah: 'البقرة: ١٥٢',
    message: 'ذكر الله يملأ قلبك سكينة، أكثر منه اليوم',
    dua: 'اللهم اجعلنا من الذاكرين الشاكرين',
  },
  {
    ayah: 'وَمَن يَتَّقِ اللَّهَ يَجْعَل لَّهُ مَخْرَجًا وَيَرْزُقْهُ مِنْ حَيْثُ لَا يَحْتَسِبُ',
    surah: 'الطلاق: ٢-٣',
    message: 'التقوى هي مفتاح كل خير، واصل واثبت',
    dua: 'اللهم ارزقنا التقوى وزيّن قلوبنا بالإيمان',
  },
  {
    ayah: 'أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ',
    surah: 'الرعد: ٢٨',
    message: 'إذا ضاق صدرك فالجأ إلى ذكر الله',
    dua: 'اللهم اجعل القرآن ربيع قلوبنا ونور صدورنا',
  },
  {
    ayah: 'وَلَسَوْفَ يُعْطِيكَ رَبُّكَ فَتَرْضَىٰ',
    surah: 'الضحى: ٥',
    message: 'ثق بوعد الله، فإن الفرج قريب والخير قادم',
    dua: 'اللهم أعطنا خير ما تعطي عبادك الصالحين',
  },
  {
    ayah: 'إِنَّ مَعَ الْعُسْرِ يُسْرًا',
    surah: 'الشرح: ٦',
    message: 'بعد كل صعوبة يأتي الفرج، فلا تيأس',
    dua: 'اللهم يسّر أمورنا واشرح صدورنا',
  },
  {
    ayah: 'وَهُوَ مَعَكُمْ أَيْنَ مَا كُنتُمْ',
    surah: 'الحديد: ٤',
    message: 'الله معك في كل خطوة، فلا تخف ولا تحزن',
    dua: 'اللهم لا تكلنا إلى أنفسنا طرفة عين',
  },
  {
    ayah: 'ادْعُونِي أَسْتَجِبْ لَكُمْ',
    surah: 'غافر: ٦٠',
    message: 'دعاؤك لن يضيع، فارفع يديك وادعُ بما شئت',
    dua: 'اللهم تقبل دعاءنا واغفر لنا',
  },
  {
    ayah: 'وَتُوبُوا إِلَى اللَّهِ جَمِيعًا أَيُّهَ الْمُؤْمِنُونَ لَعَلَّكُمْ تُفْلِحُونَ',
    surah: 'النور: ٣١',
    message: 'باب التوبة مفتوح دائماً، عُد إلى الله بقلب صادق',
    dua: 'اللهم تب علينا إنك أنت التواب الرحيم',
  },
  {
    ayah: 'رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ',
    surah: 'البقرة: ٢٠١',
    message: 'هذا الدعاء الجامع كان أكثر دعاء النبي ﷺ',
    dua: 'ربنا آتنا في الدنيا حسنة وفي الآخرة حسنة وقنا عذاب النار',
  },
  {
    ayah: 'قُلْ يَا عِبَادِيَ الَّذِينَ أَسْرَفُوا عَلَىٰ أَنفُسِهِمْ لَا تَقْنَطُوا مِن رَّحْمَةِ اللَّهِ',
    surah: 'الزمر: ٥٣',
    message: 'مهما كانت ذنوبك، فرحمة الله أوسع',
    dua: 'اللهم اغفر لنا ما قدمنا وما أخرنا',
  },
  {
    ayah: 'وَنَحْنُ أَقْرَبُ إِلَيْهِ مِنْ حَبْلِ الْوَرِيدِ',
    surah: 'ق: ١٦',
    message: 'الله أقرب إليك من كل شيء، ناجِه بقلبك',
    dua: 'اللهم قرّبنا إليك بما تحب وترضى',
  },
  {
    ayah: 'يَا أَيُّهَا الَّذِينَ آمَنُوا اسْتَعِينُوا بِالصَّبْرِ وَالصَّلَاةِ',
    surah: 'البقرة: ١٥٣',
    message: 'الصلاة هي ملجأك، وبها تتجدد طاقتك',
    dua: 'اللهم أعنا على ذكرك وشكرك وحسن عبادتك',
  },
  {
    ayah: 'وَمَن يَتَوَكَّلْ عَلَى اللَّهِ فَهُوَ حَسْبُهُ',
    surah: 'الطلاق: ٣',
    message: 'توكل على الله وأحسن الظن به، فهو كافيك',
    dua: 'حسبنا الله ونعم الوكيل',
  },
  {
    ayah: 'فَإِنَّ ذِكْرَى تَنفَعُ الْمُؤْمِنِينَ',
    surah: 'الذاريات: ٥٥',
    message: 'التذكير يحيي القلب، ذكّر نفسك وغيرك بالله',
    dua: 'اللهم اجعلنا هداة مهتدين',
  },
  {
    ayah: 'وَلَا تَيْأَسُوا مِن رَّوْحِ اللَّهِ',
    surah: 'يوسف: ٨٧',
    message: 'الأمل في الله لا ينقطع أبداً',
    dua: 'اللهم لا تقطع رجاءنا فيك',
  },
  {
    ayah: 'إِنَّ اللَّهَ لَا يُضِيعُ أَجْرَ الْمُحْسِنِينَ',
    surah: 'التوبة: ١٢٠',
    message: 'كل عمل صالح محفوظ عند الله، لن يضيع منك شيء',
    dua: 'اللهم تقبل منا إنك أنت السميع العليم',
  },
  {
    ayah: 'وَقُل رَّبِّ زِدْنِي عِلْمًا',
    surah: 'طه: ١١٤',
    message: 'اطلب العلم النافع واجعل القرآن دليلك',
    dua: 'اللهم علّمنا ما ينفعنا وانفعنا بما علّمتنا',
  },
  {
    ayah: 'وَرَحْمَتِي وَسِعَتْ كُلَّ شَيْءٍ',
    surah: 'الأعراف: ١٥٦',
    message: 'رحمة الله تسع كل شيء، فلا تستصغر ذنبك عن مغفرته',
    dua: 'اللهم اكتبنا من أهل رحمتك',
  },
  {
    ayah: 'وَلَقَدْ يَسَّرْنَا الْقُرْآنَ لِلذِّكْرِ فَهَلْ مِن مُّدَّكِرٍ',
    surah: 'القمر: ١٧',
    message: 'القرآن ميسّر لك، افتحه واقرأ ولو آية واحدة',
    dua: 'اللهم اجعل القرآن حجة لنا لا علينا',
  },
  {
    ayah: 'وَاللَّهُ يُحِبُّ الْمُحْسِنِينَ',
    surah: 'آل عمران: ١٣٤',
    message: 'أحسن في عملك وعبادتك، فالله يحب الإحسان',
    dua: 'اللهم ارزقنا الإحسان في العبادة والمعاملة',
  },
  {
    ayah: 'فَفِرُّوا إِلَى اللَّهِ إِنِّي لَكُم مِّنْهُ نَذِيرٌ مُّبِينٌ',
    surah: 'الذاريات: ٥٠',
    message: 'الفرار إلى الله هو أعظم نجاة',
    dua: 'اللهم اجعلنا من الفارّين إليك',
  },
  {
    ayah: 'وَبَشِّرِ الصَّابِرِينَ',
    surah: 'البقرة: ١٥٥',
    message: 'البشرى للصابرين، وأنت منهم إن شاء الله',
    dua: 'اللهم اجعلنا من الصابرين المحتسبين',
  },
  {
    ayah: 'إِنَّ صَلَاتِي وَنُسُكِي وَمَحْيَايَ وَمَمَاتِي لِلَّهِ رَبِّ الْعَالَمِينَ',
    surah: 'الأنعام: ١٦٢',
    message: 'اجعل نيتك لله في كل عمل',
    dua: 'اللهم اجعل أعمالنا كلها خالصة لوجهك الكريم',
  },
  {
    ayah: 'وَتَعَاوَنُوا عَلَى الْبِرِّ وَالتَّقْوَىٰ',
    surah: 'المائدة: ٢',
    message: 'ساعد غيرك على الخير، فالتعاون عبادة',
    dua: 'اللهم اجعلنا مفاتيح للخير مغاليق للشر',
  },
  {
    ayah: 'يَا أَيُّهَا الَّذِينَ آمَنُوا كُتِبَ عَلَيْكُمُ الصِّيَامُ كَمَا كُتِبَ عَلَى الَّذِينَ مِن قَبْلِكُمْ لَعَلَّكُمْ تَتَّقُونَ',
    surah: 'البقرة: ١٨٣',
    message: 'الصيام طريقك للتقوى، فاغتنم كل لحظة',
    dua: 'اللهم اجعل صيامنا مقبولاً عندك',
  },
  {
    ayah: 'إِنَّا أَنزَلْنَاهُ فِي لَيْلَةِ الْقَدْرِ',
    surah: 'القدر: ١',
    message: 'ليلة القدر خير من ألف شهر، اجتهد في طلبها',
    dua: 'اللهم بلّغنا ليلة القدر واجعلنا من عتقائك فيها',
  },
  {
    ayah: 'رَبِّ اشْرَحْ لِي صَدْرِي وَيَسِّرْ لِي أَمْرِي',
    surah: 'طه: ٢٥-٢٦',
    message: 'ادعُ الله بهذا الدعاء الجميل في كل أمورك',
    dua: 'رب اشرح لي صدري ويسّر لي أمري واحلل عقدة من لساني',
  },
];

const getRamadanDay = (): number => {
  // Simplified - in production use Hijri calendar
  const now = new Date();
  const ramadanStart = new Date(2025, 2, 1); // Approximate Ramadan 2025 start
  const diff = Math.floor((now.getTime() - ramadanStart.getTime()) / (1000 * 60 * 60 * 24));
  return Math.max(1, Math.min(30, diff + 1));
};

export function DailyWelcome() {
  const today = new Date().toISOString().split('T')[0];
  const [lastShown, setLastShown] = useLocalStorage<string>('daily-welcome-last', '');
  const [visible, setVisible] = useState(false);
  const [dailyIntention, setDailyIntention] = useLocalStorage<string>(`intention-${today}`, '');
  const [intentionInput, setIntentionInput] = useState(dailyIntention);

  const ramadanDay = getRamadanDay();
  const todayMessage = dailyMessages[(ramadanDay - 1) % dailyMessages.length];

  useEffect(() => {
    if (lastShown !== today) {
      setVisible(true);
    }
  }, [lastShown, today]);

  const dismiss = () => {
    setLastShown(today);
    if (intentionInput.trim()) {
      setDailyIntention(intentionInput.trim());
    }
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background/95 backdrop-blur-xl animate-fade-in">
      <div className="max-w-md w-full mx-4 space-y-6">
        {/* Moon & Day Counter */}
        <div className="text-center">
          <div className="relative inline-block mb-4">
            <Moon className="w-16 h-16 text-primary animate-pulse-glow" />
            <Sparkles className="w-6 h-6 text-accent absolute -top-1 -right-2 animate-float" />
          </div>
          <p className="text-muted-foreground text-sm">اليوم</p>
          <h1 className="text-5xl font-bold gradient-text mb-1">{ramadanDay}</h1>
          <p className="text-muted-foreground">من رمضان ١٤٤٦</p>
        </div>

        {/* Greeting */}
        <div className="glass-card p-6 text-center">
          <p className="text-xl font-bold text-primary mb-2">السلام عليكم ورحمة الله 🌙</p>
          <p className="text-muted-foreground text-sm">{todayMessage.message}</p>
        </div>

        {/* Ayah */}
        <div className="glass-card p-6 text-center border border-primary/20">
          <p className="font-quran text-lg text-foreground leading-relaxed mb-3">
            ﴿ {todayMessage.ayah} ﴾
          </p>
          <p className="text-xs text-muted-foreground">سورة {todayMessage.surah}</p>
        </div>

        {/* Dua */}
        <div className="glass-card p-4 text-center bg-accent/5 border border-accent/20">
          <p className="text-xs text-muted-foreground mb-1">🤲 دعاء اليوم</p>
          <p className="font-arabic text-foreground text-sm">{todayMessage.dua}</p>
        </div>

        {/* Daily Intention */}
        <div className="glass-card p-4">
          <label className="text-sm text-muted-foreground block mb-2 text-center">
            ✨ نيّة اليوم
          </label>
          <input
            type="text"
            value={intentionInput}
            onChange={(e) => setIntentionInput(e.target.value)}
            placeholder="مثال: أختم جزءاً كاملاً اليوم..."
            className="w-full bg-secondary/50 rounded-xl p-3 text-foreground text-center text-sm placeholder:text-muted-foreground/50 border-none outline-none focus:ring-2 focus:ring-primary/50"
            dir="rtl"
          />
        </div>

        {/* Dismiss Button */}
        <Button
          onClick={dismiss}
          className="w-full bg-gradient-to-l from-primary to-accent text-primary-foreground py-6 text-lg"
        >
          بسم الله، نبدأ يومنا 🌟
        </Button>
      </div>
    </div>
  );
}