export const initials = [
  'b', 'p', 'm', 'f', 'd', 't', 'n', 'l', 'g', 'k', 'h',
  'j', 'q', 'x', 'zh', 'ch', 'sh', 'r', 'z', 'c', 's',
  'y', 'w'
];

export const finals = [
  // Simple finals
  'a', 'o', 'e',
  // Compounds starting with 'a', 'e', 'o'
  'ai', 'ei', 'ao', 'ou', 'an', 'en', 'ang', 'eng', 'ong', 'er',
  // 'i' group
  'i', 'ia', 'iao', 'ie', 'iu', 'ian', 'in', 'iang', 'ing', 'iong',
  // 'u' group
  'u', 'ua', 'uo', 'uai', 'ui', 'uan', 'un', 'uang', 'ueng',
  // 'ü' group
  'ü', 'üe', 'üan', 'ün'
];

export const pronunciationNotations = {
  initials: {
    b: { urdu: 'ب', arabic: 'ب', note: 'Unaspirated' },
    p: { urdu: 'پ', arabic: 'ب + هـ', note: 'Aspirated (puff of air)' },
    m: { urdu: 'م', arabic: 'م' },
    f: { urdu: 'ف', arabic: 'ف' },
    d: { urdu: 'د', arabic: 'د', note: 'Unaspirated' },
    t: { urdu: 'ت', arabic: 'ت + هـ', note: 'Aspirated' },
    n: { urdu: 'ن', arabic: 'ن' },
    l: { urdu: 'ل', arabic: 'ل' },
    g: { urdu: 'ک', arabic: 'ك', note: 'Unaspirated' },
    k: { urdu: 'کھ', arabic: 'ك + هـ', note: 'Aspirated' },
    h: { urdu: 'ہ', arabic: 'خ / هـ', note: 'Rough h' },
    j: { urdu: 'ج', arabic: 'ج', note: 'Tongue tip behind lower teeth' },
    q: { urdu: 'چھ', arabic: 'ت + ش', note: 'Aspirated ch' },
    x: { urdu: 'ش', arabic: 'ش', note: 'Light sh, tongue low' },
    zh: { urdu: 'ج', arabic: 'ج', note: 'Retroflex (tongue curled back)' },
    ch: { urdu: 'چھ', arabic: 'ت + ش', note: 'Retroflex + Aspirated' },
    sh: { urdu: 'ش', arabic: 'ش', note: 'Retroflex' },
    r: { urdu: 'ر', arabic: 'ر', note: 'Retroflex voiced' },
    z: { urdu: 'ز', arabic: 'د + ز', note: 'Like "ds" in kids' },
    c: { urdu: 'ت+س', arabic: 'ت + س', note: 'Like "ts" in cats (aspirated)' },
    s: { urdu: 'س', arabic: 'س' },
    y: { urdu: 'ی', arabic: 'ي' },
    w: { urdu: 'و', arabic: 'و' }
  },
  finals: {
    a: { urdu: 'آ', arabic: 'ا' },
    o: { urdu: 'و', arabic: 'و' },
    e: { urdu: 'اَ', arabic: 'ـَـ' },
    ai: { urdu: 'آئی', arabic: 'أي' },
    ei: { urdu: 'اے', arabic: 'أي' },
    ao: { urdu: 'آؤ', arabic: 'أو' },
    ou: { urdu: 'او', arabic: 'أو' },
    an: { urdu: 'ان', arabic: 'ان' },
    en: { urdu: 'ن', arabic: 'ن' },
    ang: { urdu: 'نگ', arabic: 'نغ' },
    eng: { urdu: 'نگ', arabic: 'نغ' },
    ong: { urdu: 'ونگ', arabic: 'ونغ' },
    er: { urdu: 'ار', arabic: 'أر' },

    // i group
    i: { urdu: 'ی', arabic: 'ي', note: 'Buzz after z,c,s,zh,ch,sh,r' },
    ia: { urdu: 'یا', arabic: 'يا' },
    iao: { urdu: 'یاؤ', arabic: 'ياو' },
    ie: { urdu: 'یے', arabic: 'يي' },
    iu: { urdu: 'یو', arabic: 'ي+أو', note: 'Sound: iou' },
    ian: { urdu: 'ین', arabic: 'يان' },
    in: { urdu: 'ین', arabic: 'ين' },
    iang: { urdu: 'ینِگ', arabic: 'يانغ' },
    ing: { urdu: 'ِنگ', arabic: 'ينغ' },
    iong: { urdu: 'یونگ', arabic: 'يونغ' },

    // u group
    u: { urdu: 'و', arabic: 'و' },
    ua: { urdu: 'وا', arabic: 'وا' },
    uo: { urdu: 'وو', arabic: 'وو' },
    uai: { urdu: 'وائی', arabic: 'واي' },
    ui: { urdu: 'وے', arabic: 'وے', note: 'Sound: uei' },
    uan: { urdu: 'وان', arabic: 'وان' },
    un: { urdu: 'وُن', arabic: 'ون', note: 'Sound: uen' },
    uang: { urdu: 'وانگ', arabic: 'وانغ' },
    ueng: { urdu: 'ونگ', arabic: 'ونغ' },

    // ü group
    ü: { urdu: 'ُی', arabic: 'ي + و', note: 'French U, lips curled' },
    üe: { urdu: 'ُیے', arabic: 'ي+و+ي' },
    üan: { urdu: 'ُیان', arabic: 'يوان' },
    ün: { urdu: 'ُین', arabic: 'يون' }
  }
};

// Valid Pinyin Combinations (Approximation for demo)
// In a real app, this list should be exhaustive. 
// I'll generate a reasonable set based on standard charts.
const validCombinations = [
  // b
  'ba', 'bo', 'bai', 'bei', 'bao', 'ban', 'ben', 'bang', 'beng', 'bi', 'bie', 'biao', 'bian', 'bin', 'bing', 'bu',
  // p
  'pa', 'po', 'pai', 'pei', 'pao', 'pou', 'pan', 'pen', 'pang', 'peng', 'pi', 'pie', 'piao', 'pian', 'pin', 'ping', 'pu',
  // m
  'ma', 'mo', 'me', 'mai', 'mei', 'mao', 'mou', 'man', 'men', 'mang', 'meng', 'mi', 'mie', 'miao', 'miu', 'mian', 'min', 'ming', 'mu',
  // f
  'fa', 'fo', 'fei', 'fou', 'fan', 'fen', 'fang', 'feng', 'fu',
  // d
  'da', 'de', 'dai', 'dei', 'dao', 'dou', 'dan', 'den', 'dang', 'deng', 'di', 'die', 'diao', 'diu', 'dian', 'ding', 'du', 'duo', 'dui', 'duan', 'dun', 'dong',
  // t
  'ta', 'te', 'tai', 'tei', 'tao', 'tou', 'tan', 'tang', 'teng', 'ti', 'tie', 'tiao', 'tian', 'ting', 'tu', 'tuo', 'tui', 'tuan', 'tun', 'tong',
  // n
  'na', 'ne', 'nai', 'nei', 'nao', 'nou', 'nan', 'nen', 'nang', 'neng', 'ni', 'nie', 'niao', 'niu', 'nian', 'nin', 'ning', 'nu', 'nuo', 'nuan', 'nü', 'nüe', 'nong',
  // l
  'la', 'le', 'lai', 'lei', 'lao', 'lou', 'lan', 'lang', 'leng', 'li', 'lie', 'liao', 'liu', 'lian', 'lin', 'ling', 'lu', 'mou', 'luo', 'luan', 'lun', 'lü', 'lüe', 'long',
  // g
  'ga', 'ge', 'gai', 'gei', 'gao', 'gou', 'gan', 'gen', 'gang', 'geng', 'gu', 'guo', 'gua', 'guai', 'gui', 'guan', 'gun', 'guang', 'gong',
  // k
  'ka', 'ke', 'kai', 'kei', 'kao', 'kou', 'kan', 'ken', 'kang', 'keng', 'ku', 'kuo', 'kua', 'kuai', 'kui', 'kuan', 'kun', 'kuang', 'kong',
  // h
  'ha', 'he', 'hai', 'hei', 'hao', 'hou', 'han', 'hen', 'hang', 'heng', 'hu', 'huo', 'hua', 'huai', 'hui', 'huan', 'hun', 'huang', 'hong',
  // j
  'ji', 'jia', 'jie', 'jiao', 'jiu', 'jian', 'jin', 'jiang', 'jing', 'ju', 'jue', 'juan', 'jun', 'jiong',
  // q
  'qi', 'qia', 'qie', 'qiao', 'qiu', 'qian', 'qin', 'qiang', 'qing', 'qu', 'que', 'quan', 'qun', 'qiong',
  // x
  'xi', 'xia', 'xie', 'xiao', 'xiu', 'xian', 'xin', 'xiang', 'xing', 'xu', 'xue', 'xuan', 'xun', 'xiong',
  // zh
  'zha', 'zhe', 'zhi', 'zhai', 'zhei', 'zhao', 'zhou', 'zhan', 'zhen', 'zhang', 'zheng', 'zhu', 'zhuo', 'zhua', 'zhuai', 'zhui', 'zhuan', 'zhun', 'zhuang', 'zhong',
  // ch
  'cha', 'che', 'chi', 'chai', 'chao', 'chou', 'chan', 'chen', 'chang', 'cheng', 'chu', 'chuo', 'chua', 'chuai', 'chui', 'chuan', 'chun', 'chuang', 'chong',
  // sh
  'sha', 'she', 'shi', 'shai', 'shei', 'shao', 'shou', 'shan', 'shen', 'shang', 'sheng', 'shu', 'shuo', 'shua', 'shuai', 'shui', 'shuan', 'shun', 'shuang',
  // r
  're', 'ri', 'rao', 'rou', 'ran', 'ren', 'rang', 'reng', 'ru', 'ruo', 'rui', 'ruan', 'run', 'rong',
  // z
  'za', 'ze', 'zi', 'zai', 'zei', 'zao', 'zou', 'zan', 'zen', 'zang', 'zeng', 'zu', 'zuo', 'zui', 'zuan', 'zun', 'zong',
  // c
  'ca', 'ce', 'ci', 'cai', 'cao', 'cou', 'can', 'cen', 'cang', 'ceng', 'cu', 'cuo', 'cui', 'cuan', 'cun', 'cong',
  // s
  'sa', 'se', 'si', 'sai', 'sao', 'sou', 'san', 'sen', 'sang', 'seng', 'su', 'suo', 'sui', 'suan', 'sun', 'song',
  // y
  'ya', 'yo', 'ye', 'yi', 'yao', 'you', 'yan', 'yin', 'yang', 'ying', 'yu', 'yue', 'yuan', 'yun', 'yong',
  // w
  'wa', 'wo', 'wai', 'wei', 'wan', 'wen', 'wang', 'weng', 'wu'
];

export function getPhonetic(initialChar, finalChar, lang) {
  const iData = pronunciationNotations.initials[initialChar];
  const fData = pronunciationNotations.finals[finalChar];

  if (!iData || !fData) return '';

  const initialText = iData[lang] || '';
  const finalText = fData[lang] || '';

  // Basic concatenation (Right-to-Left languages usually concatenate simply, but spacing might be needed)
  // For display purposes, we might separate them with a + or space for clarity, 
  // or join them if valid Urdu/Arabic. For learners, separated is often clearer.
  return `${initialText} + ${finalText}`;
}

export function getTones(pinyin) {
  // Simple mapping for vowel tone marks
  // Priority: a, o, e, i, u, ü
  const vowels = ['a', 'o', 'e', 'i', 'u', 'ü', 'v'];

  // Find the main vowel to mark
  // Rules: 
  // 1. If 'a' or 'e' exists, mark it.
  // 2. If 'ou' exists, mark 'o'.
  // 3. Otherwise mark the last vowel.

  const toneMarks = {
    a: ['ā', 'á', 'ǎ', 'à', 'a'],
    o: ['ō', 'ó', 'ǒ', 'ò', 'o'],
    e: ['ē', 'é', 'ě', 'è', 'e'],
    i: ['ī', 'í', 'ǐ', 'ì', 'i'],
    u: ['ū', 'ú', 'ǔ', 'ù', 'u'],
    ü: ['ǖ', 'ǘ', 'ǚ', 'ǜ', 'ü'],
    v: ['ǖ', 'ǘ', 'ǚ', 'ǜ', 'ü'] // v is often used for ü in typing
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
    // Find last vowel
    for (let i = pinyin.length - 1; i >= 0; i--) {
      if (vowels.includes(pinyin[i])) {
        mainVowelChar = pinyin[i];
        mainVowelIndex = i;
        break;
      }
    }
  }

  if (mainVowelIndex === -1) return [pinyin, pinyin, pinyin, pinyin, pinyin]; // Fallback

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

export function isValidSyllable(initial, final) {
  // Construct pinyin to check against validCombinations
  let pinyin = initial + final;

  // Adjust for special rules in construction vs standard pinyin
  // e.g. j + ü -> ju
  if (['j', 'q', 'x', 'y'].includes(initial) && final === 'ü') pinyin = initial + 'u';
  if (['j', 'q', 'x', 'y'].includes(initial) && final === 'üe') pinyin = initial + 'ue';
  if (['j', 'q', 'x', 'y'].includes(initial) && final === 'ün') pinyin = initial + 'un';

  // i/u/ü standalone handling if initial is empty? (In our chart, rows are initials, so this doesn't apply directly for the grid, 
  // but y/w handle the 'no initial' cases usually)

  return validCombinations.includes(pinyin);
}

export function getDisplayPinyin(initial, final) {
  let pinyin = initial + final;
  if (['j', 'q', 'x', 'y'].includes(initial)) {
    if (final === 'ü') return initial + 'u';
    if (final === 'üe') return initial + 'ue';
    if (final === 'ün') return initial + 'un';
  }
  return pinyin;
}
