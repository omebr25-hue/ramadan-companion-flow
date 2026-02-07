import { QuranPage } from '@/types/ramadan';

// Simplified Quran data - mapping pages to Juz and Surahs
export const TOTAL_PAGES = 604;
export const TOTAL_JUZ = 30;
export const PAGES_PER_JUZ = 20;
export const RAMADAN_DAYS = 30;

export const surahNames: Record<number, string> = {
  1: 'الفاتحة',
  2: 'البقرة',
  3: 'آل عمران',
  4: 'النساء',
  5: 'المائدة',
  6: 'الأنعام',
  7: 'الأعراف',
  8: 'الأنفال',
  9: 'التوبة',
  10: 'يونس',
  11: 'هود',
  12: 'يوسف',
  13: 'الرعد',
  14: 'إبراهيم',
  15: 'الحجر',
  16: 'النحل',
  17: 'الإسراء',
  18: 'الكهف',
  19: 'مريم',
  20: 'طه',
  21: 'الأنبياء',
  22: 'الحج',
  23: 'المؤمنون',
  24: 'النور',
  25: 'الفرقان',
  26: 'الشعراء',
  27: 'النمل',
  28: 'القصص',
  29: 'العنكبوت',
  30: 'الروم',
  31: 'لقمان',
  32: 'السجدة',
  33: 'الأحزاب',
  34: 'سبأ',
  35: 'فاطر',
  36: 'يس',
  37: 'الصافات',
  38: 'ص',
  39: 'الزمر',
  40: 'غافر',
  41: 'فصلت',
  42: 'الشورى',
  43: 'الزخرف',
  44: 'الدخان',
  45: 'الجاثية',
  46: 'الأحقاف',
  47: 'محمد',
  48: 'الفتح',
  49: 'الحجرات',
  50: 'ق',
  51: 'الذاريات',
  52: 'الطور',
  53: 'النجم',
  54: 'القمر',
  55: 'الرحمن',
  56: 'الواقعة',
  57: 'الحديد',
  58: 'المجادلة',
  59: 'الحشر',
  60: 'الممتحنة',
  61: 'الصف',
  62: 'الجمعة',
  63: 'المنافقون',
  64: 'التغابن',
  65: 'الطلاق',
  66: 'التحريم',
  67: 'الملك',
  68: 'القلم',
  69: 'الحاقة',
  70: 'المعارج',
  71: 'نوح',
  72: 'الجن',
  73: 'المزمل',
  74: 'المدثر',
  75: 'القيامة',
  76: 'الإنسان',
  77: 'المرسلات',
  78: 'النبأ',
  79: 'النازعات',
  80: 'عبس',
  81: 'التكوير',
  82: 'الانفطار',
  83: 'المطففين',
  84: 'الانشقاق',
  85: 'البروج',
  86: 'الطارق',
  87: 'الأعلى',
  88: 'الغاشية',
  89: 'الفجر',
  90: 'البلد',
  91: 'الشمس',
  92: 'الليل',
  93: 'الضحى',
  94: 'الشرح',
  95: 'التين',
  96: 'العلق',
  97: 'القدر',
  98: 'البينة',
  99: 'الزلزلة',
  100: 'العاديات',
  101: 'القارعة',
  102: 'التكاثر',
  103: 'العصر',
  104: 'الهمزة',
  105: 'الفيل',
  106: 'قريش',
  107: 'الماعون',
  108: 'الكوثر',
  109: 'الكافرون',
  110: 'النصر',
  111: 'المسد',
  112: 'الإخلاص',
  113: 'الفلق',
  114: 'الناس',
};

// Approximate page to surah mapping
export const getPageInfo = (pageNumber: number): QuranPage => {
  const juzNumber = Math.ceil(pageNumber / PAGES_PER_JUZ);
  
  // Simplified surah mapping based on page ranges
  let surahNumber = 1;
  if (pageNumber <= 1) surahNumber = 1;
  else if (pageNumber <= 49) surahNumber = 2;
  else if (pageNumber <= 76) surahNumber = 3;
  else if (pageNumber <= 106) surahNumber = 4;
  else if (pageNumber <= 127) surahNumber = 5;
  else if (pageNumber <= 150) surahNumber = 6;
  else if (pageNumber <= 176) surahNumber = 7;
  else if (pageNumber <= 186) surahNumber = 8;
  else if (pageNumber <= 207) surahNumber = 9;
  else if (pageNumber <= 221) surahNumber = 10;
  else if (pageNumber <= 235) surahNumber = 11;
  else if (pageNumber <= 248) surahNumber = 12;
  else if (pageNumber <= 255) surahNumber = 13;
  else if (pageNumber <= 261) surahNumber = 14;
  else if (pageNumber <= 267) surahNumber = 15;
  else if (pageNumber <= 281) surahNumber = 16;
  else if (pageNumber <= 293) surahNumber = 17;
  else if (pageNumber <= 304) surahNumber = 18;
  else if (pageNumber <= 312) surahNumber = 19;
  else if (pageNumber <= 321) surahNumber = 20;
  else if (pageNumber <= 331) surahNumber = 21;
  else if (pageNumber <= 341) surahNumber = 22;
  else if (pageNumber <= 349) surahNumber = 23;
  else if (pageNumber <= 359) surahNumber = 24;
  else if (pageNumber <= 366) surahNumber = 25;
  else if (pageNumber <= 376) surahNumber = 26;
  else if (pageNumber <= 385) surahNumber = 27;
  else if (pageNumber <= 396) surahNumber = 28;
  else if (pageNumber <= 404) surahNumber = 29;
  else if (pageNumber <= 410) surahNumber = 30;
  else if (pageNumber <= 414) surahNumber = 31;
  else if (pageNumber <= 417) surahNumber = 32;
  else if (pageNumber <= 427) surahNumber = 33;
  else if (pageNumber <= 434) surahNumber = 34;
  else if (pageNumber <= 440) surahNumber = 35;
  else if (pageNumber <= 445) surahNumber = 36;
  else if (pageNumber <= 453) surahNumber = 37;
  else if (pageNumber <= 458) surahNumber = 38;
  else if (pageNumber <= 467) surahNumber = 39;
  else if (pageNumber <= 476) surahNumber = 40;
  else if (pageNumber <= 482) surahNumber = 41;
  else if (pageNumber <= 489) surahNumber = 42;
  else if (pageNumber <= 495) surahNumber = 43;
  else if (pageNumber <= 498) surahNumber = 44;
  else if (pageNumber <= 502) surahNumber = 45;
  else if (pageNumber <= 506) surahNumber = 46;
  else if (pageNumber <= 510) surahNumber = 47;
  else if (pageNumber <= 515) surahNumber = 48;
  else if (pageNumber <= 518) surahNumber = 49;
  else if (pageNumber <= 520) surahNumber = 50;
  else if (pageNumber <= 523) surahNumber = 51;
  else if (pageNumber <= 525) surahNumber = 52;
  else if (pageNumber <= 528) surahNumber = 53;
  else if (pageNumber <= 531) surahNumber = 54;
  else if (pageNumber <= 534) surahNumber = 55;
  else if (pageNumber <= 537) surahNumber = 56;
  else if (pageNumber <= 541) surahNumber = 57;
  else if (pageNumber <= 545) surahNumber = 58;
  else if (pageNumber <= 548) surahNumber = 59;
  else if (pageNumber <= 551) surahNumber = 60;
  else if (pageNumber <= 552) surahNumber = 61;
  else if (pageNumber <= 554) surahNumber = 62;
  else if (pageNumber <= 555) surahNumber = 63;
  else if (pageNumber <= 557) surahNumber = 64;
  else if (pageNumber <= 559) surahNumber = 65;
  else if (pageNumber <= 561) surahNumber = 66;
  else if (pageNumber <= 564) surahNumber = 67;
  else if (pageNumber <= 566) surahNumber = 68;
  else if (pageNumber <= 568) surahNumber = 69;
  else if (pageNumber <= 570) surahNumber = 70;
  else if (pageNumber <= 571) surahNumber = 71;
  else if (pageNumber <= 573) surahNumber = 72;
  else if (pageNumber <= 575) surahNumber = 73;
  else if (pageNumber <= 577) surahNumber = 74;
  else if (pageNumber <= 578) surahNumber = 75;
  else if (pageNumber <= 580) surahNumber = 76;
  else if (pageNumber <= 582) surahNumber = 77;
  else if (pageNumber <= 584) surahNumber = 78;
  else if (pageNumber <= 586) surahNumber = 79;
  else if (pageNumber <= 587) surahNumber = 80;
  else if (pageNumber <= 589) surahNumber = 81;
  else if (pageNumber <= 590) surahNumber = 82;
  else if (pageNumber <= 591) surahNumber = 83;
  else if (pageNumber <= 592) surahNumber = 84;
  else if (pageNumber <= 593) surahNumber = 85;
  else if (pageNumber <= 594) surahNumber = 86;
  else if (pageNumber <= 595) surahNumber = 87;
  else if (pageNumber <= 596) surahNumber = 88;
  else if (pageNumber <= 597) surahNumber = 89;
  else if (pageNumber <= 598) surahNumber = 90;
  else if (pageNumber <= 599) surahNumber = 91;
  else if (pageNumber <= 600) surahNumber = 92;
  else if (pageNumber <= 601) surahNumber = 93;
  else if (pageNumber <= 602) surahNumber = 94;
  else if (pageNumber <= 603) surahNumber = 95;
  else surahNumber = 96;

  return {
    pageNumber,
    juzNumber,
    surahNumber,
    surahName: surahNames[surahNumber] || 'غير معروف',
  };
};

// Calculate daily wird based on settings
export const calculateDailyWird = (
  remainingDays: number,
  targetPages: number,
  readPages: number,
  energyLevel: 'low' | 'medium' | 'high' = 'medium'
): number => {
  const remainingPages = targetPages - readPages;
  let basePagesPerDay = Math.ceil(remainingPages / remainingDays);

  // Adjust based on energy level
  const adjustments = {
    low: 0.7,
    medium: 1,
    high: 1.3,
  };

  return Math.max(1, Math.round(basePagesPerDay * adjustments[energyLevel]));
};

// Get Juz name
export const getJuzName = (juzNumber: number): string => {
  const juzNames: Record<number, string> = {
    1: 'الجزء الأول',
    2: 'الجزء الثاني',
    3: 'الجزء الثالث',
    4: 'الجزء الرابع',
    5: 'الجزء الخامس',
    6: 'الجزء السادس',
    7: 'الجزء السابع',
    8: 'الجزء الثامن',
    9: 'الجزء التاسع',
    10: 'الجزء العاشر',
    11: 'الجزء الحادي عشر',
    12: 'الجزء الثاني عشر',
    13: 'الجزء الثالث عشر',
    14: 'الجزء الرابع عشر',
    15: 'الجزء الخامس عشر',
    16: 'الجزء السادس عشر',
    17: 'الجزء السابع عشر',
    18: 'الجزء الثامن عشر',
    19: 'الجزء التاسع عشر',
    20: 'الجزء العشرون',
    21: 'الجزء الحادي والعشرون',
    22: 'الجزء الثاني والعشرون',
    23: 'الجزء الثالث والعشرون',
    24: 'الجزء الرابع والعشرون',
    25: 'الجزء الخامس والعشرون',
    26: 'الجزء السادس والعشرون',
    27: 'الجزء السابع والعشرون',
    28: 'الجزء الثامن والعشرون',
    29: 'الجزء التاسع والعشرون',
    30: 'الجزء الثلاثون',
  };
  return juzNames[juzNumber] || `الجزء ${juzNumber}`;
};
