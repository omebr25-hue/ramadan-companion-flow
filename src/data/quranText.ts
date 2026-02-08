// بيانات القرآن الكريم الكاملة
// ملاحظة: هذا ملف مبسط يحتوي على بيانات تمثيلية - في التطبيق الحقيقي يجب استخدام API أو ملف كامل

export interface Surah {
  number: number;
  name: string;
  englishName: string;
  ayahCount: number;
  revelationType: 'مكية' | 'مدنية';
  startPage: number;
  endPage: number;
}

export interface Ayah {
  number: number;
  surahNumber: number;
  text: string;
  juz: number;
  page: number;
}

export interface QuranPageData {
  pageNumber: number;
  juzNumber: number;
  surahName: string;
  surahNumber: number;
  ayahs: string[];
  bismillah?: boolean;
}

// قائمة السور الكاملة
export const surahs: Surah[] = [
  { number: 1, name: 'الفاتحة', englishName: 'Al-Fatihah', ayahCount: 7, revelationType: 'مكية', startPage: 1, endPage: 1 },
  { number: 2, name: 'البقرة', englishName: 'Al-Baqarah', ayahCount: 286, revelationType: 'مدنية', startPage: 2, endPage: 49 },
  { number: 3, name: 'آل عمران', englishName: 'Ali \'Imran', ayahCount: 200, revelationType: 'مدنية', startPage: 50, endPage: 76 },
  { number: 4, name: 'النساء', englishName: 'An-Nisa', ayahCount: 176, revelationType: 'مدنية', startPage: 77, endPage: 106 },
  { number: 5, name: 'المائدة', englishName: 'Al-Ma\'idah', ayahCount: 120, revelationType: 'مدنية', startPage: 106, endPage: 127 },
  { number: 6, name: 'الأنعام', englishName: 'Al-An\'am', ayahCount: 165, revelationType: 'مكية', startPage: 128, endPage: 150 },
  { number: 7, name: 'الأعراف', englishName: 'Al-A\'raf', ayahCount: 206, revelationType: 'مكية', startPage: 151, endPage: 176 },
  { number: 8, name: 'الأنفال', englishName: 'Al-Anfal', ayahCount: 75, revelationType: 'مدنية', startPage: 177, endPage: 186 },
  { number: 9, name: 'التوبة', englishName: 'At-Tawbah', ayahCount: 129, revelationType: 'مدنية', startPage: 187, endPage: 207 },
  { number: 10, name: 'يونس', englishName: 'Yunus', ayahCount: 109, revelationType: 'مكية', startPage: 208, endPage: 221 },
  { number: 11, name: 'هود', englishName: 'Hud', ayahCount: 123, revelationType: 'مكية', startPage: 221, endPage: 235 },
  { number: 12, name: 'يوسف', englishName: 'Yusuf', ayahCount: 111, revelationType: 'مكية', startPage: 235, endPage: 248 },
  { number: 13, name: 'الرعد', englishName: 'Ar-Ra\'d', ayahCount: 43, revelationType: 'مدنية', startPage: 249, endPage: 255 },
  { number: 14, name: 'إبراهيم', englishName: 'Ibrahim', ayahCount: 52, revelationType: 'مكية', startPage: 255, endPage: 261 },
  { number: 15, name: 'الحجر', englishName: 'Al-Hijr', ayahCount: 99, revelationType: 'مكية', startPage: 262, endPage: 267 },
  { number: 16, name: 'النحل', englishName: 'An-Nahl', ayahCount: 128, revelationType: 'مكية', startPage: 267, endPage: 281 },
  { number: 17, name: 'الإسراء', englishName: 'Al-Isra', ayahCount: 111, revelationType: 'مكية', startPage: 282, endPage: 293 },
  { number: 18, name: 'الكهف', englishName: 'Al-Kahf', ayahCount: 110, revelationType: 'مكية', startPage: 293, endPage: 304 },
  { number: 19, name: 'مريم', englishName: 'Maryam', ayahCount: 98, revelationType: 'مكية', startPage: 305, endPage: 312 },
  { number: 20, name: 'طه', englishName: 'Ta-Ha', ayahCount: 135, revelationType: 'مكية', startPage: 312, endPage: 321 },
  { number: 21, name: 'الأنبياء', englishName: 'Al-Anbiya', ayahCount: 112, revelationType: 'مكية', startPage: 322, endPage: 331 },
  { number: 22, name: 'الحج', englishName: 'Al-Hajj', ayahCount: 78, revelationType: 'مدنية', startPage: 332, endPage: 341 },
  { number: 23, name: 'المؤمنون', englishName: 'Al-Mu\'minun', ayahCount: 118, revelationType: 'مكية', startPage: 342, endPage: 349 },
  { number: 24, name: 'النور', englishName: 'An-Nur', ayahCount: 64, revelationType: 'مدنية', startPage: 350, endPage: 359 },
  { number: 25, name: 'الفرقان', englishName: 'Al-Furqan', ayahCount: 77, revelationType: 'مكية', startPage: 359, endPage: 366 },
  { number: 26, name: 'الشعراء', englishName: 'Ash-Shu\'ara', ayahCount: 227, revelationType: 'مكية', startPage: 367, endPage: 376 },
  { number: 27, name: 'النمل', englishName: 'An-Naml', ayahCount: 93, revelationType: 'مكية', startPage: 377, endPage: 385 },
  { number: 28, name: 'القصص', englishName: 'Al-Qasas', ayahCount: 88, revelationType: 'مكية', startPage: 385, endPage: 396 },
  { number: 29, name: 'العنكبوت', englishName: 'Al-Ankabut', ayahCount: 69, revelationType: 'مكية', startPage: 396, endPage: 404 },
  { number: 30, name: 'الروم', englishName: 'Ar-Rum', ayahCount: 60, revelationType: 'مكية', startPage: 404, endPage: 410 },
  { number: 31, name: 'لقمان', englishName: 'Luqman', ayahCount: 34, revelationType: 'مكية', startPage: 411, endPage: 414 },
  { number: 32, name: 'السجدة', englishName: 'As-Sajdah', ayahCount: 30, revelationType: 'مكية', startPage: 415, endPage: 417 },
  { number: 33, name: 'الأحزاب', englishName: 'Al-Ahzab', ayahCount: 73, revelationType: 'مدنية', startPage: 418, endPage: 427 },
  { number: 34, name: 'سبأ', englishName: 'Saba', ayahCount: 54, revelationType: 'مكية', startPage: 428, endPage: 434 },
  { number: 35, name: 'فاطر', englishName: 'Fatir', ayahCount: 45, revelationType: 'مكية', startPage: 434, endPage: 440 },
  { number: 36, name: 'يس', englishName: 'Ya-Sin', ayahCount: 83, revelationType: 'مكية', startPage: 440, endPage: 445 },
  { number: 37, name: 'الصافات', englishName: 'As-Saffat', ayahCount: 182, revelationType: 'مكية', startPage: 446, endPage: 452 },
  { number: 38, name: 'ص', englishName: 'Sad', ayahCount: 88, revelationType: 'مكية', startPage: 453, endPage: 458 },
  { number: 39, name: 'الزمر', englishName: 'Az-Zumar', ayahCount: 75, revelationType: 'مكية', startPage: 458, endPage: 467 },
  { number: 40, name: 'غافر', englishName: 'Ghafir', ayahCount: 85, revelationType: 'مكية', startPage: 467, endPage: 476 },
  { number: 41, name: 'فصلت', englishName: 'Fussilat', ayahCount: 54, revelationType: 'مكية', startPage: 477, endPage: 482 },
  { number: 42, name: 'الشورى', englishName: 'Ash-Shura', ayahCount: 53, revelationType: 'مكية', startPage: 483, endPage: 489 },
  { number: 43, name: 'الزخرف', englishName: 'Az-Zukhruf', ayahCount: 89, revelationType: 'مكية', startPage: 489, endPage: 495 },
  { number: 44, name: 'الدخان', englishName: 'Ad-Dukhan', ayahCount: 59, revelationType: 'مكية', startPage: 496, endPage: 498 },
  { number: 45, name: 'الجاثية', englishName: 'Al-Jathiyah', ayahCount: 37, revelationType: 'مكية', startPage: 499, endPage: 502 },
  { number: 46, name: 'الأحقاف', englishName: 'Al-Ahqaf', ayahCount: 35, revelationType: 'مكية', startPage: 502, endPage: 506 },
  { number: 47, name: 'محمد', englishName: 'Muhammad', ayahCount: 38, revelationType: 'مدنية', startPage: 507, endPage: 510 },
  { number: 48, name: 'الفتح', englishName: 'Al-Fath', ayahCount: 29, revelationType: 'مدنية', startPage: 511, endPage: 515 },
  { number: 49, name: 'الحجرات', englishName: 'Al-Hujurat', ayahCount: 18, revelationType: 'مدنية', startPage: 515, endPage: 517 },
  { number: 50, name: 'ق', englishName: 'Qaf', ayahCount: 45, revelationType: 'مكية', startPage: 518, endPage: 520 },
  { number: 51, name: 'الذاريات', englishName: 'Adh-Dhariyat', ayahCount: 60, revelationType: 'مكية', startPage: 520, endPage: 523 },
  { number: 52, name: 'الطور', englishName: 'At-Tur', ayahCount: 49, revelationType: 'مكية', startPage: 523, endPage: 525 },
  { number: 53, name: 'النجم', englishName: 'An-Najm', ayahCount: 62, revelationType: 'مكية', startPage: 526, endPage: 528 },
  { number: 54, name: 'القمر', englishName: 'Al-Qamar', ayahCount: 55, revelationType: 'مكية', startPage: 528, endPage: 531 },
  { number: 55, name: 'الرحمن', englishName: 'Ar-Rahman', ayahCount: 78, revelationType: 'مدنية', startPage: 531, endPage: 534 },
  { number: 56, name: 'الواقعة', englishName: 'Al-Waqi\'ah', ayahCount: 96, revelationType: 'مكية', startPage: 534, endPage: 537 },
  { number: 57, name: 'الحديد', englishName: 'Al-Hadid', ayahCount: 29, revelationType: 'مدنية', startPage: 537, endPage: 541 },
  { number: 58, name: 'المجادلة', englishName: 'Al-Mujadilah', ayahCount: 22, revelationType: 'مدنية', startPage: 542, endPage: 545 },
  { number: 59, name: 'الحشر', englishName: 'Al-Hashr', ayahCount: 24, revelationType: 'مدنية', startPage: 545, endPage: 548 },
  { number: 60, name: 'الممتحنة', englishName: 'Al-Mumtahanah', ayahCount: 13, revelationType: 'مدنية', startPage: 549, endPage: 551 },
  { number: 61, name: 'الصف', englishName: 'As-Saf', ayahCount: 14, revelationType: 'مدنية', startPage: 551, endPage: 552 },
  { number: 62, name: 'الجمعة', englishName: 'Al-Jumu\'ah', ayahCount: 11, revelationType: 'مدنية', startPage: 553, endPage: 554 },
  { number: 63, name: 'المنافقون', englishName: 'Al-Munafiqun', ayahCount: 11, revelationType: 'مدنية', startPage: 554, endPage: 555 },
  { number: 64, name: 'التغابن', englishName: 'At-Taghabun', ayahCount: 18, revelationType: 'مدنية', startPage: 556, endPage: 557 },
  { number: 65, name: 'الطلاق', englishName: 'At-Talaq', ayahCount: 12, revelationType: 'مدنية', startPage: 558, endPage: 559 },
  { number: 66, name: 'التحريم', englishName: 'At-Tahrim', ayahCount: 12, revelationType: 'مدنية', startPage: 560, endPage: 561 },
  { number: 67, name: 'الملك', englishName: 'Al-Mulk', ayahCount: 30, revelationType: 'مكية', startPage: 562, endPage: 564 },
  { number: 68, name: 'القلم', englishName: 'Al-Qalam', ayahCount: 52, revelationType: 'مكية', startPage: 564, endPage: 566 },
  { number: 69, name: 'الحاقة', englishName: 'Al-Haqqah', ayahCount: 52, revelationType: 'مكية', startPage: 566, endPage: 568 },
  { number: 70, name: 'المعارج', englishName: 'Al-Ma\'arij', ayahCount: 44, revelationType: 'مكية', startPage: 568, endPage: 570 },
  { number: 71, name: 'نوح', englishName: 'Nuh', ayahCount: 28, revelationType: 'مكية', startPage: 570, endPage: 571 },
  { number: 72, name: 'الجن', englishName: 'Al-Jinn', ayahCount: 28, revelationType: 'مكية', startPage: 572, endPage: 573 },
  { number: 73, name: 'المزمل', englishName: 'Al-Muzzammil', ayahCount: 20, revelationType: 'مكية', startPage: 574, endPage: 575 },
  { number: 74, name: 'المدثر', englishName: 'Al-Muddaththir', ayahCount: 56, revelationType: 'مكية', startPage: 575, endPage: 577 },
  { number: 75, name: 'القيامة', englishName: 'Al-Qiyamah', ayahCount: 40, revelationType: 'مكية', startPage: 577, endPage: 578 },
  { number: 76, name: 'الإنسان', englishName: 'Al-Insan', ayahCount: 31, revelationType: 'مدنية', startPage: 578, endPage: 580 },
  { number: 77, name: 'المرسلات', englishName: 'Al-Mursalat', ayahCount: 50, revelationType: 'مكية', startPage: 580, endPage: 581 },
  { number: 78, name: 'النبأ', englishName: 'An-Naba', ayahCount: 40, revelationType: 'مكية', startPage: 582, endPage: 583 },
  { number: 79, name: 'النازعات', englishName: 'An-Nazi\'at', ayahCount: 46, revelationType: 'مكية', startPage: 583, endPage: 584 },
  { number: 80, name: 'عبس', englishName: 'Abasa', ayahCount: 42, revelationType: 'مكية', startPage: 585, endPage: 586 },
  { number: 81, name: 'التكوير', englishName: 'At-Takwir', ayahCount: 29, revelationType: 'مكية', startPage: 586, endPage: 586 },
  { number: 82, name: 'الانفطار', englishName: 'Al-Infitar', ayahCount: 19, revelationType: 'مكية', startPage: 587, endPage: 587 },
  { number: 83, name: 'المطففين', englishName: 'Al-Mutaffifin', ayahCount: 36, revelationType: 'مكية', startPage: 587, endPage: 589 },
  { number: 84, name: 'الانشقاق', englishName: 'Al-Inshiqaq', ayahCount: 25, revelationType: 'مكية', startPage: 589, endPage: 589 },
  { number: 85, name: 'البروج', englishName: 'Al-Buruj', ayahCount: 22, revelationType: 'مكية', startPage: 590, endPage: 590 },
  { number: 86, name: 'الطارق', englishName: 'At-Tariq', ayahCount: 17, revelationType: 'مكية', startPage: 591, endPage: 591 },
  { number: 87, name: 'الأعلى', englishName: 'Al-A\'la', ayahCount: 19, revelationType: 'مكية', startPage: 591, endPage: 592 },
  { number: 88, name: 'الغاشية', englishName: 'Al-Ghashiyah', ayahCount: 26, revelationType: 'مكية', startPage: 592, endPage: 593 },
  { number: 89, name: 'الفجر', englishName: 'Al-Fajr', ayahCount: 30, revelationType: 'مكية', startPage: 593, endPage: 594 },
  { number: 90, name: 'البلد', englishName: 'Al-Balad', ayahCount: 20, revelationType: 'مكية', startPage: 594, endPage: 595 },
  { number: 91, name: 'الشمس', englishName: 'Ash-Shams', ayahCount: 15, revelationType: 'مكية', startPage: 595, endPage: 595 },
  { number: 92, name: 'الليل', englishName: 'Al-Layl', ayahCount: 21, revelationType: 'مكية', startPage: 595, endPage: 596 },
  { number: 93, name: 'الضحى', englishName: 'Ad-Duhaa', ayahCount: 11, revelationType: 'مكية', startPage: 596, endPage: 596 },
  { number: 94, name: 'الشرح', englishName: 'Ash-Sharh', ayahCount: 8, revelationType: 'مكية', startPage: 596, endPage: 597 },
  { number: 95, name: 'التين', englishName: 'At-Tin', ayahCount: 8, revelationType: 'مكية', startPage: 597, endPage: 597 },
  { number: 96, name: 'العلق', englishName: 'Al-Alaq', ayahCount: 19, revelationType: 'مكية', startPage: 597, endPage: 598 },
  { number: 97, name: 'القدر', englishName: 'Al-Qadr', ayahCount: 5, revelationType: 'مكية', startPage: 598, endPage: 598 },
  { number: 98, name: 'البينة', englishName: 'Al-Bayyinah', ayahCount: 8, revelationType: 'مدنية', startPage: 598, endPage: 599 },
  { number: 99, name: 'الزلزلة', englishName: 'Az-Zalzalah', ayahCount: 8, revelationType: 'مدنية', startPage: 599, endPage: 599 },
  { number: 100, name: 'العاديات', englishName: 'Al-Adiyat', ayahCount: 11, revelationType: 'مكية', startPage: 599, endPage: 600 },
  { number: 101, name: 'القارعة', englishName: 'Al-Qari\'ah', ayahCount: 11, revelationType: 'مكية', startPage: 600, endPage: 600 },
  { number: 102, name: 'التكاثر', englishName: 'At-Takathur', ayahCount: 8, revelationType: 'مكية', startPage: 600, endPage: 600 },
  { number: 103, name: 'العصر', englishName: 'Al-Asr', ayahCount: 3, revelationType: 'مكية', startPage: 601, endPage: 601 },
  { number: 104, name: 'الهمزة', englishName: 'Al-Humazah', ayahCount: 9, revelationType: 'مكية', startPage: 601, endPage: 601 },
  { number: 105, name: 'الفيل', englishName: 'Al-Fil', ayahCount: 5, revelationType: 'مكية', startPage: 601, endPage: 601 },
  { number: 106, name: 'قريش', englishName: 'Quraysh', ayahCount: 4, revelationType: 'مكية', startPage: 602, endPage: 602 },
  { number: 107, name: 'الماعون', englishName: 'Al-Ma\'un', ayahCount: 7, revelationType: 'مكية', startPage: 602, endPage: 602 },
  { number: 108, name: 'الكوثر', englishName: 'Al-Kawthar', ayahCount: 3, revelationType: 'مكية', startPage: 602, endPage: 602 },
  { number: 109, name: 'الكافرون', englishName: 'Al-Kafirun', ayahCount: 6, revelationType: 'مكية', startPage: 603, endPage: 603 },
  { number: 110, name: 'النصر', englishName: 'An-Nasr', ayahCount: 3, revelationType: 'مدنية', startPage: 603, endPage: 603 },
  { number: 111, name: 'المسد', englishName: 'Al-Masad', ayahCount: 5, revelationType: 'مكية', startPage: 603, endPage: 603 },
  { number: 112, name: 'الإخلاص', englishName: 'Al-Ikhlas', ayahCount: 4, revelationType: 'مكية', startPage: 604, endPage: 604 },
  { number: 113, name: 'الفلق', englishName: 'Al-Falaq', ayahCount: 5, revelationType: 'مكية', startPage: 604, endPage: 604 },
  { number: 114, name: 'الناس', englishName: 'An-Nas', ayahCount: 6, revelationType: 'مكية', startPage: 604, endPage: 604 },
];

// بيانات بعض السور المختارة للعرض
export const surahTexts: Record<number, string[]> = {
  1: [
    'بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ',
    'ٱلْحَمْدُ لِلَّهِ رَبِّ ٱلْعَٰلَمِينَ',
    'ٱلرَّحْمَٰنِ ٱلرَّحِيمِ',
    'مَٰلِكِ يَوْمِ ٱلدِّينِ',
    'إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ',
    'ٱهْدِنَا ٱلصِّرَٰطَ ٱلْمُسْتَقِيمَ',
    'صِرَٰطَ ٱلَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ ٱلْمَغْضُوبِ عَلَيْهِمْ وَلَا ٱلضَّآلِّينَ',
  ],
  112: [
    'بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ',
    'قُلْ هُوَ ٱللَّهُ أَحَدٌ',
    'ٱللَّهُ ٱلصَّمَدُ',
    'لَمْ يَلِدْ وَلَمْ يُولَدْ',
    'وَلَمْ يَكُن لَّهُۥ كُفُوًا أَحَدٌۢ',
  ],
  113: [
    'بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ',
    'قُلْ أَعُوذُ بِرَبِّ ٱلْفَلَقِ',
    'مِن شَرِّ مَا خَلَقَ',
    'وَمِن شَرِّ غَاسِقٍ إِذَا وَقَبَ',
    'وَمِن شَرِّ ٱلنَّفَّٰثَٰتِ فِى ٱلْعُقَدِ',
    'وَمِن شَرِّ حَاسِدٍ إِذَا حَسَدَ',
  ],
  114: [
    'بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ',
    'قُلْ أَعُوذُ بِرَبِّ ٱلنَّاسِ',
    'مَلِكِ ٱلنَّاسِ',
    'إِلَٰهِ ٱلنَّاسِ',
    'مِن شَرِّ ٱلْوَسْوَاسِ ٱلْخَنَّاسِ',
    'ٱلَّذِى يُوَسْوِسُ فِى صُدُورِ ٱلنَّاسِ',
    'مِنَ ٱلْجِنَّةِ وَٱلنَّاسِ',
  ],
  36: [ // سورة يس
    'بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ',
    'يسٓ',
    'وَٱلْقُرْءَانِ ٱلْحَكِيمِ',
    'إِنَّكَ لَمِنَ ٱلْمُرْسَلِينَ',
    'عَلَىٰ صِرَٰطٍ مُّسْتَقِيمٍ',
    'تَنزِيلَ ٱلْعَزِيزِ ٱلرَّحِيمِ',
  ],
  67: [ // سورة الملك
    'بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ',
    'تَبَٰرَكَ ٱلَّذِى بِيَدِهِ ٱلْمُلْكُ وَهُوَ عَلَىٰ كُلِّ شَىْءٍ قَدِيرٌ',
    'ٱلَّذِى خَلَقَ ٱلْمَوْتَ وَٱلْحَيَوٰةَ لِيَبْلُوَكُمْ أَيُّكُمْ أَحْسَنُ عَمَلًا ۚ وَهُوَ ٱلْعَزِيزُ ٱلْغَفُورُ',
    'ٱلَّذِى خَلَقَ سَبْعَ سَمَٰوَٰتٍ طِبَاقًا ۖ مَّا تَرَىٰ فِى خَلْقِ ٱلرَّحْمَٰنِ مِن تَفَٰوُتٍ ۖ فَٱرْجِعِ ٱلْبَصَرَ هَلْ تَرَىٰ مِن فُطُورٍ',
  ],
  55: [ // سورة الرحمن
    'بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ',
    'ٱلرَّحْمَٰنُ',
    'عَلَّمَ ٱلْقُرْءَانَ',
    'خَلَقَ ٱلْإِنسَٰنَ',
    'عَلَّمَهُ ٱلْبَيَانَ',
    'ٱلشَّمْسُ وَٱلْقَمَرُ بِحُسْبَانٍ',
    'وَٱلنَّجْمُ وَٱلشَّجَرُ يَسْجُدَانِ',
  ],
  2: [ // بداية سورة البقرة
    'الٓمٓ',
    'ذَٰلِكَ ٱلْكِتَٰبُ لَا رَيْبَ ۛ فِيهِ ۛ هُدًى لِّلْمُتَّقِينَ',
    'ٱلَّذِينَ يُؤْمِنُونَ بِٱلْغَيْبِ وَيُقِيمُونَ ٱلصَّلَوٰةَ وَمِمَّا رَزَقْنَٰهُمْ يُنفِقُونَ',
    'وَٱلَّذِينَ يُؤْمِنُونَ بِمَآ أُنزِلَ إِلَيْكَ وَمَآ أُنزِلَ مِن قَبْلِكَ وَبِٱلْءَاخِرَةِ هُمْ يُوقِنُونَ',
    'أُو۟لَٰٓئِكَ عَلَىٰ هُدًى مِّن رَّبِّهِمْ ۖ وَأُو۟لَٰٓئِكَ هُمُ ٱلْمُفْلِحُونَ',
  ],
  18: [ // بداية سورة الكهف
    'بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ',
    'ٱلْحَمْدُ لِلَّهِ ٱلَّذِىٓ أَنزَلَ عَلَىٰ عَبْدِهِ ٱلْكِتَٰبَ وَلَمْ يَجْعَل لَّهُۥ عِوَجَا ۜ',
    'قَيِّمًا لِّيُنذِرَ بَأْسًا شَدِيدًا مِّن لَّدُنْهُ وَيُبَشِّرَ ٱلْمُؤْمِنِينَ ٱلَّذِينَ يَعْمَلُونَ ٱلصَّٰلِحَٰتِ أَنَّ لَهُمْ أَجْرًا حَسَنًا',
    'مَّٰكِثِينَ فِيهِ أَبَدًا',
    'وَيُنذِرَ ٱلَّذِينَ قَالُوا۟ ٱتَّخَذَ ٱللَّهُ وَلَدًا',
  ],
};

// الحصول على معلومات السورة من رقم الصفحة
export const getSurahFromPage = (pageNumber: number): Surah | undefined => {
  return surahs.find(s => pageNumber >= s.startPage && pageNumber <= s.endPage);
};

// الحصول على السور في صفحة معينة
export const getSurahsInPage = (pageNumber: number): Surah[] => {
  return surahs.filter(s => 
    (s.startPage <= pageNumber && s.endPage >= pageNumber) ||
    (s.startPage === pageNumber)
  );
};

// الحصول على رقم الجزء من الصفحة
export const getJuzFromPage = (pageNumber: number): number => {
  return Math.ceil(pageNumber / 20);
};

// البسملة
export const BISMILLAH = 'بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ';

// أسماء الأجزاء
export const juzNames: Record<number, string> = {
  1: 'آلم',
  2: 'سيقول',
  3: 'تلك الرسل',
  4: 'لن تنالوا',
  5: 'والمحصنات',
  6: 'لا يحب الله',
  7: 'وإذا سمعوا',
  8: 'ولو أننا',
  9: 'قال الملأ',
  10: 'واعلموا',
  11: 'يعتذرون',
  12: 'وما من دابة',
  13: 'وما أبرئ',
  14: 'ربما',
  15: 'سبحان الذي',
  16: 'قال ألم',
  17: 'اقترب للناس',
  18: 'قد أفلح',
  19: 'وقال الذين',
  20: 'أمن خلق',
  21: 'اتل ما أوحي',
  22: 'ومن يقنت',
  23: 'وما لي',
  24: 'فمن أظلم',
  25: 'إليه يرد',
  26: 'حم',
  27: 'قال فما خطبكم',
  28: 'قد سمع الله',
  29: 'تبارك الذي',
  30: 'عم يتساءلون',
};
