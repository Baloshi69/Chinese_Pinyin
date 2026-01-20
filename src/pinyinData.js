// Exact match of Yoyo Chinese Pinyin Chart structure

// Initials (columns) - No y/w, Yoyo shows them in standalone column
export const initials = [
  'b', 'p', 'm', 'f', 'd', 't', 'n', 'l', 'g', 'k', 'h',
  'j', 'q', 'x',
  'z', 'c', 's',       // z, c, s BEFORE zh, ch, sh
  'zh', 'ch', 'sh', 'r'
];

// Finals (rows) - Exact Yoyo order
export const finals = [
  // Row 1: Special 'i' for z/c/s/zh/ch/sh/r (zi, ci, si, zhi, chi, shi, ri)
  'i',
  // a group
  'a', 'ai', 'an', 'ang', 'ao',
  // e group
  'e', 'ei', 'en', 'eng', 'er',
  // i group (normal)
  'i', 'ia', 'ian', 'iang', 'iao', 'ie', 'in', 'ing', 'iong', 'iou',
  // o group
  'o', 'ong', 'ou',
  // u group
  'u', 'ua', 'uai', 'uan', 'uang', 'uei', 'uen', 'ueng', 'uo',
  // ü group
  'ü', 'üan', 'üe', 'ün'
];

// Standalone finals (column 2 in Yoyo) - finals without initials
export const standaloneFinals = {
  'i': null,  // First 'i' row has no standalone
  'a': 'a', 'ai': 'ai', 'an': 'an', 'ang': 'ang', 'ao': 'ao',
  'e': 'e', 'ei': 'ei', 'en': 'en', 'eng': 'eng', 'er': 'er',
  // i group standalone uses y-
  'ia': 'ya', 'ian': 'yan', 'iang': 'yang', 'iao': 'yao', 'ie': 'ye',
  'in': 'yin', 'ing': 'ying', 'iong': 'yong', 'iou': 'you',
  // o group
  'o': 'o', 'ong': null, 'ou': 'ou',
  // u group standalone uses w-
  'u': 'wu', 'ua': 'wa', 'uai': 'wai', 'uan': 'wan', 'uang': 'wang',
  'uei': 'wei', 'uen': 'wen', 'ueng': 'weng', 'uo': 'wo',
  // ü group standalone uses yu-
  'ü': 'yu', 'üan': 'yuan', 'üe': 'yue', 'ün': 'yun'
};

// Map for display: iou->iu, uei->ui, uen->un for combined forms
export const displayFinalMap = {
  'iou': 'iu',
  'uei': 'ui',
  'uen': 'un'
};

// ============================================================================
// "TRUE SOUND" PHONETIC ALIGNMENT SYSTEM
// Based on IPA-driven Mandarin-to-Urdu transliteration research
// Corrects Anglocentric errors in standard Pinyin mappings
// ============================================================================

// ============================================================================
// TONAL MAPPING KEY (Punjabi/Urdu Synthesis Model)
// - Initials: Pinyin 'b' = [p] (voiceless) → پ (Pe) for exact sound
// - Tone 4 (Falling): Uses بھ (Bhe) which triggers falling-tone [p] in Punjabi
// - Tones 1, 2, 3: Standard پ (Pe), optionally Maddah (پآ) for Tone 1 high onset
// ============================================================================

export const pronunciationNotations = {
  initials: {
    // === STOP CONSONANTS (Tonal Mapping System) ===
    // Pinyin 'b' is voiceless [p]. Using پ for standard tones, بھ for Tone 4 (falling)
    b: {
      urdu: 'پ',           // Standard (Tones 1, 2, 3)
      urduTone4: 'بھ',     // Tone 4 (Falling) - Punjabi tonal mechanism
      ipa: '[p]',
      note: 'Voiceless unaspirated p. Tone 4 uses بھ for falling tone.'
    },
    // Pinyin 'p' (Aspirated p) -> Urdu 'پھ', Tone 4 uses Tashdid for falling emphasis
    p: {
      urdu: 'پھ',           // Standard (Tones 1, 2, 3) - Aspirated
      urduTone4: 'پھّ',     // Tone 4 (Falling) - Tashdid on he for heavy emphasis
      ipa: '[pʰ]',
      note: 'Aspirated p. Tone 4 uses Tashdid (ّ) for falling tone emphasis.'
    },

    // Pinyin 'd' (Unaspirated t) -> Urdu 'ت' (Convention) - UPDATED: Uses 'ت' + 'دھ' for T4
    d: {
      urdu: 'ت',
      urduTone4: 'دھ',     // Tone 4: Voiceless Falling (Punjabi mechanism)
      ipa: '[t]',
      note: 'Unaspirated t. Tone 4 uses دھ (Falling Tone).'
    },
    // Pinyin 't' (Aspirated t) -> Urdu 'تھ'
    t: {
      urdu: 'تھ',
      urduTone4: 'تھّ',    // Tone 4: Tashdid (Intensity)
      ipa: '[tʰ]',
      note: 'Aspirated t. Tone 4 uses Tashdid (ّ) for falling tone intensity.'
    },

    // Pinyin 'g' (Unaspirated k) -> Urdu 'ک' (Convention) - UPDATED: Uses 'ک' + 'گھ' for T4
    g: {
      urdu: 'ک',
      urduTone4: 'گھ',     // Tone 4: Voiceless Falling (Punjabi mechanism)
      ipa: '[k]',
      note: 'Unaspirated k. Tone 4 uses گھ (Falling Tone).'
    },
    // Pinyin 'k' (Aspirated k) -> Urdu 'کھ'
    k: {
      urdu: 'کھ',
      urduTone4: 'کھّ',    // Tone 4: Tashdid (Intensity)
      ipa: '[kʰ]',
      note: 'Aspirated k. Tone 4 uses Tashdid (ّ) for falling tone intensity.'
    },

    // === OTHER CONSONANTS ===
    m: {
      urdu: 'م',
      urduTone4: 'مھ',     // Tone 4: Murmured Nasal (falling tone)
      ipa: '[m]',
      note: 'Tone 4 uses مھ to trigger tonal drop.'
    },
    m: {
      urdu: 'م',
      urduTone4: 'مھ',     // Tone 4: Murmured Nasal (falling tone)
      ipa: '[m]',
      note: 'Tone 4 uses مھ to trigger tonal drop.'
    },
    f: {
      urdu: 'ف',
      urduTone4: 'فّ',     // Tone 4: Tashdid (Intensity)
      ipa: '[f]',
      note: 'Tone 4 uses Tashdid (ّ) for intensity.'
    },
    n: {
      urdu: 'ن',
      urduTone4: 'نھ',     // Tone 4: Murmured Nasal (Falling Tone)
      ipa: '[n]',
      note: 'Tone 4 uses نھ to trigger tonal drop.'
    },
    l: {
      urdu: 'ل',
      urduTone4: 'لھ',     // Tone 4: Murmured Resonant (Falling Tone)
      ipa: '[l]',
      note: 'Tone 4 uses sound of lھ (Murmured Lateral) to trigger falling tone.'
    },
    h: {
      urdu: 'خ',
      urduTone4: 'خّ',     // Tone 4: Tashdid (Intensity)
      ipa: '[x]',
      note: 'Voiceless Velar Fricative. Tone 4 uses Tashdid (ّ) on initial for intensity.'
    },

    // === PALATALS ===
    // === PALATALS ===
    j: {
      urdu: 'چ',
      urduTone4: 'چّ',     // Tone 4: Tashdid (Intensity)
      ipa: '[tɕ]',
      note: 'Palatal Unaspirated. Tone 4 uses Tashdid (ّ) on initial.'
    },
    q: {
      urdu: 'چھ',
      urduTone4: 'چّھ',    // Tone 4: Tashdid on first part (Intensity)
      ipa: '[tɕʰ]',
      note: 'Palatal Aspirated. Tone 4 uses Tashdid (ّ) on the Che part.'
    },
    x: {
      urdu: 'ش',
      urduTone4: 'شّ',     // Tone 4: Tashdid (Intensity)
      ipa: '[ɕ]',
      note: 'Palatal Fricative. Tone 4 uses Tashdid (ّ) on initial.'
    },

    // === RETROFLEX / DENTAL ===
    zh: {
      urdu: 'چ',
      urduTone4: 'چّ',     // Tone 4: Tashdid (Intensity)
      ipa: '[ʈʂ]',
      note: 'Retroflex Unaspirated. Tone 4 uses Tashdid (ّ).'
    },
    ch: {
      urdu: 'چھ',
      urduTone4: 'چّھ',    // Tone 4: Tashdid on first part (Intensity)
      ipa: '[ʈʂʰ]',
      note: 'Retroflex Aspirated. Tone 4 uses Tashdid (ّ) on Che.'
    },
    sh: {
      urdu: 'ش',
      urduTone4: 'شّ',     // Tone 4: Tashdid (Intensity)
      ipa: '[ʂ]',
      note: 'Retroflex Fricative. Tone 4 uses Tashdid (ّ).'
    },
    r: {
      urdu: 'ژ',
      urduTone4: 'ژّ',     // Tone 4: Tashdid (Intensity)
      ipa: '[ʐ]',
      note: 'Retroflex Voiced Fricative. Tone 4 uses Tashdid (ّ).'
    },
    z: {
      urdu: 'ز',
      urduTone4: 'زّ',     // Tone 4: Tashdid (Intensity)
      ipa: '[ts]',
      note: 'Affricate. Tone 4 uses Tashdid (ّ).'
    },
    c: {
      urdu: 'تس',
      urduTone4: 'تّس',    // Tone 4: Tashdid on Te (Intensity)
      ipa: '[tsʰ]',
      note: 'Aspirated Affricate. Tone 4 uses Tashdid (ّ) on Te.'
    },
    s: {
      urdu: 'س',
      urduTone4: 'سّ',     // Tone 4: Tashdid (Intensity)
      ipa: '[s]',
      note: 'Sibilant. Tone 4 uses Tashdid (ّ).'
    }
  },
  finals: {
    // ============================================================================
    // COMPLETE B SYLLABLE FINALS (from NotebookLLM Research)
    // Standard uses پ, Tone 4 uses بھ prefix for falling tone marker
    // ============================================================================

    // === A GROUP ===
    a: {
      urdu: 'آ',           // Maddah (Universal)
      note: 'Madda for a sound.',
      standalone: {
        urdu: 'آ'
      }
    },
    ia: {
      urdu: 'یا', urduTone1: 'ِیا', note: 'ia',
      standalone: { urdu: 'یا' }
    },
    ua: {
      urdu: 'وا', note: 'ua',
      standalone: { urdu: 'وا' }
    },

    // === O GROUP ===
    o: {
      urdu: 'و',           // Standard
      urduTone1: 'وآ',     // Tone 1: Long (پھوآ / موا)
      urduTone3: 'وء',     // Tone 3: Creaky (پھوء)
      note: 'Ends with Wao. Bo is pronounced [puɔ].',
      standalone: {
        urdu: 'آو',
        urduTone1: 'آو',
        urduTone3: 'آوء',
        urduTone4: 'او'
      }
    },
    uo: {
      urdu: 'ُوا', note: 'uo',
      standalone: { urdu: 'وو' }
    },
    ou: {
      urdu: 'او',          // Standard
      urduTone1: 'آو',     // Tone 1: Long (پھآو)
      urduTone2: 'َو',     // Tone 2: Zabar (پھَو)
      urduTone3: 'َوء',    // Tone 3: Zabar + Hamza (پھَوء)
      urduTone4: 'َّو',    // Tone 4: Tashdid + Zabar (پھَّو) - Override standard final? Request says 'پھَّو' for pou4
      urduWithZabar: 'َو',
      note: 'Uses Alif + Wao for ou. Pou uses Zabar to distinguish from po.',
      standalone: {
        urdu: 'آو',
        urduTone1: 'آو',
        urduTone3: 'آوء',
        urduTone4: 'اَو'
      }
    },
    iou: {
      urdu: 'یو',          // Standard
      urduTone1: 'ِیو',    // Tone 1: With Zer
      urduTone3: 'یوء',    // Tone 3: With Hamza
      note: 'iu'
    },
    ao: {
      urdu: 'اؤ',          // Standard
      urduTone1: 'آؤ',     // Tone 1: Maddah (پھآؤ)
      urduTone3: 'اؤء',    // Tone 3: Hamza (پھاؤء)
      note: 'Uses Alif + Wao for ao diphthong.',
      standalone: {
        urdu: 'آؤ',
        urduTone1: 'آؤ',
        urduTone3: 'آؤء',
        urduTone4: 'آّؤ'
      }
    },
    iao: {
      urdu: 'یاؤ',         // Standard
      urduTone1: 'ِیاؤ',   // Tone 1: With Zer (پھِیاؤ)
      urduTone3: 'یاوء',   // Tone 3: With Hamza (پھیاوء)
      note: 'Ye + Alif + Wao for iao.'
    },

    // === E GROUP ===
    er: {
      urdu: 'ر',
      note: 'er',
      standalone: {
        urdu: 'آر',        // Standard/Tone 2
        urduTone1: 'آر',   // ēr -> آر
        urduTone3: 'آرء',  // ěr -> آرء
        urduTone4: 'عَر'   // èr -> عَر or آّر
      }
    },
    e: {
      urdu: 'َ',           // Zabar (Universal)
      note: 'Zabar for e (schwa).',
      standalone: {
        urdu: 'اے'
      }
    },
    ie: {
      urdu: 'یے',          // Standard
      urduTone1: 'ِیے',    // Tone 1: With Zer (پھِیے)
      urduTone3: 'یےء',    // Tone 3: With Hamza (پھیےء)
      note: 'Uses Ye + Bari Ye for ie.',
      standalone: { urdu: 'یے' } // ye
    },
    ue: { urdu: 'ِیُوَ', note: 'ue' },
    ei: {
      urdu: 'ئے',          // Standard
      urduTone1: 'آئے',    // Tone 1: Maddah (پھآئے)
      urduTone3: 'ئےء',    // Tone 3: Hamza (پھئےء)
      note: 'Mapped as پئے in Urdu Pinyin Table 3.',
      standalone: {
        urdu: 'ائے',
        urduTone1: 'ائے',
        urduTone3: 'ائےء',
        urduTone4: 'اّئے'
      }
    },
    uei: { urdu: 'ُوِ', note: 'ui' },

    // === I GROUP ===
    i: {
      urdu: 'ِ',           // Zair (Universal)
      note: 'Zair for i.',
      standalone: {
        urdu: 'اِی'
      }
    },
    ai: {
      urdu: 'ائی',         // Standard
      urduTone1: 'آئی',    // Tone 1: Maddah (پھآئی)
      urduTone3: 'آئے',    // Tone 3: (پھآئے) - As per user request for pǎi
      note: 'Uses Hamza + Ye for the diphthong ai.',
      standalone: {
        urdu: 'آئی',
        urduTone1: 'آئی',
        urduTone3: 'آئیء',
        urduTone4: 'آئے'
      }
    },
    uai: { urdu: 'ُوَئی', note: 'uai' },

    // === U / Ü GROUP ===
    u: {
      urdu: 'ُ',          // Pesh (Universal)
      note: 'Pesh for u.',
      standalone: {
        urdu: 'اُو'
      }
    },
    ü: {
      urdu: 'ُ', note: 'ü (Pesh)', // Simplification per research.md 5.2
      standalone: { urdu: 'اُو' }
    },

    // === NASALS - AN GROUP ===
    an: {
      urdu: 'َنْ',          // Zabar + Noon + Jazam
      note: 'Zabar + Noon + Jazam.',
      standalone: {
        urdu: 'آن'
      }
    },
    ian: {
      urdu: 'یان',         // Standard
      urduTone1: 'ِیان',   // Tone 1: With Zer (پھِیان)
      urduTone3: 'یانء',   // Tone 3: Hamza (پھیانء)
      note: 'Ye + Alif + Noon for ian.',
      // ian standalone is 'yan' (یَن or similar? User didn't specify, skipping for now unless 'ya'+'n' derived)
    },
    uan: { urdu: 'وان', note: 'uan' },
    üan: { urdu: 'ِیُوان', note: 'üan' },
    üe: { urdu: 'ِیُوَ', note: 'üe' },

    // === NASALS - EN GROUP ===
    en: {
      urdu: 'َنْ',           // Zabar + Noon + Jazam
      note: 'Zabar + Noon + Jazam.',
      standalone: {
        urdu: 'اَن'
      }
    },
    in: {
      urdu: 'ِنْ',          // Zair + Noon + Jazam
      note: 'Zair + Noon + Jazam.'
    },
    uen: { urdu: 'ُنْ', note: 'un (Pesh + Noon + Jazam)' },
    ün: { urdu: 'ُنْ', note: 'ün (Pesh + Noon + Jazam)' },

    // === NASALS - ANG GROUP ===
    ang: {
      urdu: 'َاں',         // Zabar + Alif + Noon Ghunnah
      note: 'Zabar + Alif + Noon Ghunnah.',
      standalone: {
        urdu: 'آں'
      }
    },
    iang: { urdu: 'یانگ', urduTone1: 'ِیانگ', note: 'iang' },
    uang: { urdu: 'ُوانگ', note: 'uang' },

    // === NASALS - ENG GROUP ===
    eng: {
      urdu: 'َں',          // Zabar + Noon Ghunnah
      note: 'Zabar + Noon Ghunnah.',
      standalone: {
        urdu: 'اَں'
      }
    },
    ing: {
      urdu: 'ِں',         // Zair + Noon Ghunnah
      note: 'Zair + Noon Ghunnah.'
    },
    ueng: { urdu: 'ونگ', note: 'ueng' },

    ong: { urdu: 'ُوں', note: 'ong (Pesh + Wao + Noon Ghunnah)' },
    iong: { urdu: 'یونگ', urduTone1: 'ِیونگ', note: 'iong' }
  }
};

// Valid Pinyin Combinations - Extracted from Yoyo table
const validCombinations = [
  // Special i row (z/c/s/zh/ch/sh/r + i)
  'zi', 'ci', 'si', 'zhi', 'chi', 'shi', 'ri',

  // a row
  'a', 'ba', 'pa', 'ma', 'fa', 'da', 'ta', 'na', 'la', 'ga', 'ka', 'ha', 'za', 'ca', 'sa', 'zha', 'cha', 'sha',

  // ai row
  'ai', 'bai', 'pai', 'mai', 'dai', 'tai', 'nai', 'lai', 'gai', 'kai', 'hai', 'zai', 'cai', 'sai', 'zhai', 'chai', 'shai',

  // an row
  'an', 'ban', 'pan', 'man', 'fan', 'dan', 'tan', 'nan', 'lan', 'gan', 'kan', 'han', 'zan', 'can', 'san', 'zhan', 'chan', 'shan', 'ran',

  // ang row
  'ang', 'bang', 'pang', 'mang', 'fang', 'dang', 'tang', 'nang', 'lang', 'gang', 'kang', 'hang', 'zang', 'cang', 'sang', 'zhang', 'chang', 'shang', 'rang',

  // ao row
  'ao', 'bao', 'pao', 'mao', 'dao', 'tao', 'nao', 'lao', 'gao', 'kao', 'hao', 'zao', 'cao', 'sao', 'zhao', 'chao', 'shao', 'rao',

  // e row
  'e', 'me', 'de', 'te', 'ne', 'le', 'ge', 'ke', 'he', 'ze', 'ce', 'se', 'zhe', 'che', 'she', 're',

  // ei row
  'ei', 'bei', 'pei', 'mei', 'fei', 'dei', 'nei', 'lei', 'gei', 'hei', 'zei', 'zhei', 'shei',

  // en row
  'en', 'ben', 'pen', 'men', 'fen', 'nen', 'gen', 'ken', 'hen', 'zen', 'cen', 'sen', 'zhen', 'chen', 'shen', 'ren',

  // eng row
  'eng', 'beng', 'peng', 'meng', 'feng', 'deng', 'teng', 'neng', 'leng', 'geng', 'keng', 'heng', 'zeng', 'ceng', 'seng', 'zheng', 'cheng', 'sheng', 'reng',

  // er row
  'er',

  // i row (normal)
  'yi', 'bi', 'pi', 'mi', 'di', 'ti', 'ni', 'li', 'ji', 'qi', 'xi',

  // ia row
  'ya', 'dia', 'lia', 'jia', 'qia', 'xia',

  // ian row
  'yan', 'bian', 'pian', 'mian', 'dian', 'tian', 'nian', 'lian', 'jian', 'qian', 'xian',

  // iang row
  'yang', 'niang', 'liang', 'jiang', 'qiang', 'xiang',

  // iao row
  'yao', 'biao', 'piao', 'miao', 'diao', 'tiao', 'niao', 'liao', 'jiao', 'qiao', 'xiao',

  // ie row
  'ye', 'bie', 'pie', 'mie', 'die', 'tie', 'nie', 'lie', 'jie', 'qie', 'xie',

  // in row
  'yin', 'bin', 'pin', 'min', 'nin', 'lin', 'jin', 'qin', 'xin',

  // ing row
  'ying', 'bing', 'ping', 'ming', 'ding', 'ting', 'ning', 'ling', 'jing', 'qing', 'xing',

  // iong row
  'yong', 'jiong', 'qiong', 'xiong',

  // iou row (displayed as iu)
  'you', 'miu', 'diu', 'niu', 'liu', 'jiu', 'qiu', 'xiu',

  // o row
  'o', 'bo', 'po', 'mo', 'fo',

  // ong row
  'dong', 'tong', 'nong', 'long', 'gong', 'kong', 'hong', 'zong', 'cong', 'song', 'zhong', 'chong', 'rong',

  // ou row
  'ou', 'pou', 'mou', 'fou', 'dou', 'tou', 'lou', 'gou', 'kou', 'hou', 'zou', 'cou', 'sou', 'zhou', 'chou', 'shou', 'rou',

  // u row
  'wu', 'bu', 'pu', 'mu', 'fu', 'du', 'tu', 'nu', 'lu', 'gu', 'ku', 'hu', 'zu', 'cu', 'su', 'zhu', 'chu', 'shu', 'ru',

  // ua row
  'wa', 'gua', 'kua', 'hua', 'zhua', 'shua',

  // uai row
  'wai', 'guai', 'kuai', 'huai', 'zhuai', 'chuai', 'shuai',

  // uan row
  'wan', 'duan', 'tuan', 'nuan', 'luan', 'guan', 'kuan', 'huan', 'zuan', 'cuan', 'suan', 'zhuan', 'chuan', 'shuan', 'ruan',

  // uang row
  'wang', 'guang', 'kuang', 'huang', 'zhuang', 'chuang', 'shuang',

  // uei row (displayed as ui)
  'wei', 'dui', 'tui', 'gui', 'kui', 'hui', 'zui', 'cui', 'sui', 'zhui', 'chui', 'shui', 'rui',

  // uen row (displayed as un)
  'wen', 'dun', 'tun', 'lun', 'gun', 'kun', 'hun', 'zun', 'cun', 'sun', 'zhun', 'chun', 'shun', 'run',

  // ueng row
  'weng',

  // uo row
  'wo', 'duo', 'tuo', 'nuo', 'luo', 'guo', 'kuo', 'huo', 'zuo', 'cuo', 'suo', 'zhuo', 'chuo', 'shuo', 'ruo',

  // ü row
  'yu', 'nü', 'lü', 'ju', 'qu', 'xu',

  // üan row
  'yuan', 'juan', 'quan', 'xuan',

  // üe row
  'yue', 'nüe', 'lüe', 'jue', 'que', 'xue',

  // ün row
  'yun', 'jun', 'qun', 'xun'
];

export function getPhonetic(initialChar, finalChar, lang, displayMode = 'joined', tone = null) {
  const iData = pronunciationNotations.initials[initialChar];
  const fData = pronunciationNotations.finals[finalChar];

  if (!iData || !fData) return '';

  // For Urdu with Tone 4, use the special tonal mapping (بھ prefix instead of پ)
  const isTone4 = tone === 4 || tone === '4';

  // J/Q/X Vowel Shift Logic: u -> ü, un -> ün, uan -> üan
  if (initialChar === 'j' || initialChar === 'q' || initialChar === 'x') {
    if (finalChar === 'u') finalChar = 'ü';
    if (finalChar === 'un') finalChar = 'ün';
    if (finalChar === 'uan') finalChar = 'üan';
    // ue is already distinct from e, but just in case of mapping overlap
  }

  // Re-fetch final data if finalChar changed
  const fDataRevised = pronunciationNotations.finals[finalChar];
  const finalDataToUse = fDataRevised || fData;

  let initialText, finalText;


  if (lang === 'urdu') {
    if (tone === 1 || tone === '1') {
      // Exception: F, D, T, N, L, G, K, or H initial with en/eng uses short vowels for Tone 1
      // Exception: F, D, T, N, L, G, K, H, Z, C, or S initial with en/eng uses short vowels for Tone 1
      // Exception: F, D, T, N, L, G, K, H, Z, C, S, Zh, Ch, Sh, or R initial with en/eng uses short vowels for Tone 1
      if ((initialChar === 'f' || initialChar === 'd' || initialChar === 't' || initialChar === 'n' || initialChar === 'l' || initialChar === 'g' || initialChar === 'k' || initialChar === 'h' || initialChar === 'z' || initialChar === 'c' || initialChar === 's' || initialChar === 'zh' || initialChar === 'ch' || initialChar === 'sh' || initialChar === 'r') && (finalChar === 'en' || finalChar === 'eng')) {
        initialText = iData.urduTone1 || iData.urdu || '';
        // Uses short vowels: فَن, تَنگ, تھَن, نَن, لَن, کَن, کھَن, خَن (consistent short vowel pattern)
        // Uses short vowels: فَن, تَنگ, تھَن, نَن, لَن, کَن, کھَن, خَن, زَن, تسَن, سَن, چَن, چھَن, شَن, ژَن (consistent pattern)
        finalText = finalDataToUse.urdu === 'نگ' ? 'َنگ' : (finalDataToUse.urdu === 'ن' ? 'َن' : finalDataToUse.urduTone1 || finalDataToUse.urdu);
        // Note: The logic above simplifies to specifically handling en/eng for these initials, 
        // relying on the manual check. Standardizing to use the hardcoded short vowel forms for robusteness:
        finalText = finalChar === 'en' ? 'َن' : 'َنگ';
      } else if ((initialChar === 'd' || initialChar === 't' || initialChar === 'n' || initialChar === 'l' || initialChar === 'g' || initialChar === 'k' || initialChar === 'h' || initialChar === 'z' || initialChar === 'c' || initialChar === 's' || initialChar === 'zh' || initialChar === 'ch' || initialChar === 'sh' || initialChar === 'r') && finalChar === 'ou') {
        // Exception: D/T/N/L/G/K/H/Z/C/S/Zh/Ch/Sh/R initial with ou uses Zabar+Wao
        initialText = iData.urduTone1 || iData.urdu || '';
        finalText = 'َو';
      } else if ((initialChar === 'n' || initialChar === 'l') && (finalChar === 'ue' || finalChar === 'üe')) {
        // Exception: N/L initial with ue/üe uses special mapping (nüē/lüē -> نِیُوَ / لِیُوَ)
        initialText = iData.urduTone1 || iData.urdu || '';
        finalText = 'ِیُوَ';
      } else {
        initialText = iData.urduTone1 || iData.urdu || '';
        finalText = fData.urduTone1 || fData.urdu || '';
      }
    } else if (tone === 2 || tone === '2') {
      initialText = iData.urduTone2 || iData.urdu || '';
      finalText = fData.urduTone2 || fData.urdu || '';
    } else if (tone === 3 || tone === '3') {
      initialText = iData.urduTone3 || iData.urdu || '';
      finalText = fData.urduTone3 || fData.urdu || '';
    } else if (isTone4) {
      initialText = iData.urduTone4 || iData.urdu || '';
      finalText = fData.urduTone4 || fData.urdu || '';
    } else {
      initialText = iData.urdu || '';
      finalText = fData.urdu || '';
    }
  }

  // Floating Diacritic Fix for Separated Mode (Chart UI)
  if (displayMode === 'separated') {
    // Check if final text starts with a diacritic (Zabar, Zer, Pesh, etc.)
    // Common Urdu diacritics: \u064B-\u0652 (Fathatan, Dammatan, Kasratan, Fatha/Zabar, Damma/Pesh, Kasra/Zer, Shadda, Sukun)
    const diacriticRegex = /^[\u064B-\u0652]/;

    // If it starts with a diacritic, prepend a Tatweel (ـ)
    let safeFinalText = finalText;
    if (diacriticRegex.test(finalText)) {
      safeFinalText = 'ـ' + finalText;
    }

    return `${initialText} + ${safeFinalText}`;
  }

  // Apical Vowel Override for Z, C, S, Zh, Ch, Sh, R with final 'i' (Buzzy i)
  // This logic is applied AFTER tone logic as a final override for this specific combination
  if (lang === 'urdu' && (initialChar === 'z' || initialChar === 'c' || initialChar === 's' || initialChar === 'zh' || initialChar === 'ch' || initialChar === 'sh' || initialChar === 'r') && finalChar === 'i') {
    // Re-assign initialText based on tone logic preserved above (e.g. Tone 4 uses tashdid form)
    // Override final text to Zer (ِ) or Zer+Hamza for Tone 3
    if (tone === 3 || tone === '3') {
      finalText = 'ِء';
    } else {
      finalText = 'ِ';
    }
    // Note: Initial text already handles Tashdid for Tone 4 via the standard block above if configured in initial data
  }

  if (displayMode === 'separated') {
    return `${initialText} + ${finalText}`;
  }

  // Default: joined
  return `${initialText}${finalText}`;
}

export function getTones(pinyin) {
  const vowels = ['a', 'o', 'e', 'i', 'u', 'ü', 'v'];
  const toneMarks = {
    a: ['ā', 'á', 'ǎ', 'à', 'a'],
    o: ['ō', 'ó', 'ǒ', 'ò', 'o'],
    e: ['ē', 'é', 'ě', 'è', 'e'],
    i: ['ī', 'í', 'ǐ', 'ì', 'i'],
    u: ['ū', 'ú', 'ǔ', 'ù', 'u'],
    ü: ['ǖ', 'ǘ', 'ǚ', 'ǜ', 'ü'],
    v: ['ǖ', 'ǘ', 'ǚ', 'ǜ', 'ü']
  };

  let mainVowelChar = '';
  let mainVowelIndex = -1;

  if (pinyin.includes('a')) {
    mainVowelChar = 'a';
    mainVowelIndex = pinyin.indexOf('a');
  } else if (pinyin.includes('e')) {
    mainVowelChar = 'e';
    mainVowelIndex = pinyin.indexOf('e');
  } else if (pinyin.includes('ou')) {
    mainVowelChar = 'o';
    mainVowelIndex = pinyin.indexOf('o');
  } else {
    for (let i = pinyin.length - 1; i >= 0; i--) {
      if (vowels.includes(pinyin[i])) {
        mainVowelChar = pinyin[i];
        mainVowelIndex = i;
        break;
      }
    }
  }

  if (mainVowelIndex === -1) return [pinyin, pinyin, pinyin, pinyin, pinyin];

  const tones = [];
  const marks = toneMarks[mainVowelChar];

  for (let i = 0; i < 4; i++) {
    const pre = pinyin.substring(0, mainVowelIndex);
    const post = pinyin.substring(mainVowelIndex + 1);
    tones.push(pre + marks[i] + post);
  }
  tones.push(pinyin); // Neutral

  return tones;
}

// Check if a specific initial+final combination is valid
export function isValidSyllable(initial, final, rowIndex = -1) {
  // Handle special first 'i' row (only z/c/s/zh/ch/sh/r)
  if (rowIndex === 0 && final === 'i') {
    const specialInitials = ['z', 'c', 's', 'zh', 'ch', 'sh', 'r'];
    if (!specialInitials.includes(initial)) return false;
    return validCombinations.includes(initial + 'i');
  }

  // Normal i row (rowIndex 11 in Yoyo, but we handle by checking)
  if (final === 'i' && rowIndex > 0) {
    // Normal 'i' combines with b,p,m,d,t,n,l,j,q,x
    const normalIInitials = ['b', 'p', 'm', 'd', 't', 'n', 'l', 'j', 'q', 'x'];
    if (!normalIInitials.includes(initial)) return false;
  }

  // Construct pinyin
  let pinyin = initial + final;

  // Apply display rules for lookup
  // iou -> iu, uei -> ui, uen -> un
  if (final === 'iou') pinyin = initial + 'iu';
  if (final === 'uei') pinyin = initial + 'ui';
  if (final === 'uen') pinyin = initial + 'un';

  // j/q/x + ü -> ju/qu/xu (ü dots removed)
  if (['j', 'q', 'x'].includes(initial) && final === 'ü') pinyin = initial + 'u';
  if (['j', 'q', 'x'].includes(initial) && final === 'üe') pinyin = initial + 'ue';
  if (['j', 'q', 'x'].includes(initial) && final === 'üan') pinyin = initial + 'uan';
  if (['j', 'q', 'x'].includes(initial) && final === 'ün') pinyin = initial + 'un';

  return validCombinations.includes(pinyin);
}

// Get display pinyin (applies spelling rules)
export function getDisplayPinyin(initial, final) {
  let pinyin = initial + final;

  // Display transformations
  if (final === 'iou') return initial + 'iu';
  if (final === 'uei') return initial + 'ui';
  if (final === 'uen') return initial + 'un';

  // j/q/x + ü rules
  if (['j', 'q', 'x'].includes(initial)) {
    if (final === 'ü') return initial + 'u';
    if (final === 'üe') return initial + 'ue';
    if (final === 'üan') return initial + 'uan';
    if (final === 'ün') return initial + 'un';
  }

  return pinyin;
}

// Get standalone form of a final (no initial)
export function getStandalone(final) {
  return standaloneFinals[final] || null;
}
