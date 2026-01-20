
// OLD LOGIC RECONSTRUCTED FROM HISTORY
// This matches the state before my recent edits

const pronunciationNotations = {
  initials: {
    b: { urdu: 'پ', urduTone4: 'بھ' },
    p: { urdu: 'پھ', urduTone4: 'پھّ' },
    m: { urdu: 'م', urduTone4: 'مھ' },
    f: { urdu: 'ف', urduTone4: 'فّ' },
    d: { urdu: 'ت', urduTone4: 'دھ' },
    t: { urdu: 'تھ', urduTone4: 'تھّ' },
    n: { urdu: 'ن', urduTone4: 'نھ' },
    l: { urdu: 'ل', urduTone4: 'لھ' },
    g: { urdu: 'ک', urduTone4: 'گھ' },
    k: { urdu: 'کھ', urduTone4: 'کھّ' },
    h: { urdu: 'خ', urduTone4: 'خّ' },
    j: { urdu: 'چ', urduTone4: 'چّ' },
    q: { urdu: 'چھ', urduTone4: 'چّھ' },
    x: { urdu: 'ش', urduTone4: 'شّ' },
    zh: { urdu: 'چ', urduTone4: 'چّ' },
    ch: { urdu: 'چھ', urduTone4: 'چّھ' },
    sh: { urdu: 'ش', urduTone4: 'شّ' },
    r: { urdu: 'ژ', urduTone4: 'ژّ' },
    z: { urdu: 'ز', urduTone4: 'زّ' },
    c: { urdu: 'تس', urduTone4: 'تّس' },
    s: { urdu: 'س', urduTone4: 'سّ' }
  },
  finals: {
    a: { urdu: 'ا', urduTone1: 'آ', urduTone3: 'اء', urduTone4: 'ا' },
    o: { urdu: 'و', urduTone1: 'وآ', urduTone3: 'وء' },
    e: { urdu: 'ہ', urduTone1: 'آہ', urduTone3: 'ہء', urduTone4: 'ہ' },
    er: { urdu: 'ر' },
    ai: { urdu: 'ائی', urduTone1: 'آئی', urduTone3: 'آئے' },
    ei: { urdu: 'ئے', urduTone1: 'آئے', urduTone3: 'ئےء' },
    ao: { urdu: 'اؤ', urduTone1: 'آؤ', urduTone3: 'اؤء' },
    ou: { urdu: 'او', urduTone1: 'آو', urduTone2: 'َو', urduTone3: 'َوء', urduTone4: 'َّو' },
    an: { urdu: 'ان', urduTone1: 'آن', urduTone3: 'anء' },
    en: { urdu: 'ن', urduTone1: 'آن', urduTone3: 'نء' },
    ang: { urdu: 'انگ', urduTone1: 'آنگ', urduTone3: 'انگء' },
    eng: { urdu: 'نگ', urduTone1: 'آنگ', urduTone3: 'نگء' },
    ong: { urdu: 'ُونگ' },
    i: { urdu: 'ی', urduTone1: 'ِی', urduTone3: 'یء', urduTone4: 'ی' },
    ia: { urdu: 'یا', urduTone1: 'ِیا' },
    iao: { urdu: 'یاؤ', urduTone1: 'ِیاؤ', urduTone3: 'یاوء' },
    ie: { urdu: 'یے', urduTone1: 'ِیے', urduTone3: 'یےء' },
    iu: { urdu: 'یو', urduTone1: 'ِیو', urduTone3: 'یوء' },
    iou: { urdu: 'یو', urduTone1: 'ِیو', urduTone3: 'یوء' },
    ian: { urdu: 'یان', urduTone1: 'ِیان', urduTone3: 'یانء' },
    in: { urdu: 'ِن', urduTone1: 'ِین', urduTone3: 'ِنء' },
    iang: { urdu: 'یانگ', urduTone1: 'ِیانگ' },
    ing: { urdu: 'ِنگ', urduTone1: 'ِینگ', urduTone3: 'ِنگء' },
    iong: { urdu: 'یونگ', urduTone1: 'ِیونگ' },
    u: { urdu: 'ُو', urduTone1: 'ُو', urduTone2: 'و', urduTone3: 'وء' },
    ua: { urdu: 'وا' },
    uai: { urdu: 'ُوَئی' },
    uan: { urdu: 'وان' },
    un: { urdu: 'ُن' },
    uen: { urdu: 'ُن' },
    uang: { urdu: 'ُوانگ' },
    ui: { urdu: 'ُوِ' },
    uei: { urdu: 'ُوِ' },
    uo: { urdu: 'ُوا' },
    ueng: { urdu: 'ونگ' },
    ü: { urdu: 'ِیُو' },
    üe: { urdu: 'ِیُوَ' },
    üan: { urdu: 'ِیُوان' },
    ün: { urdu: 'ِیُن' }
  }
};

const initials = [
  'b', 'p', 'm', 'f', 'd', 't', 'n', 'l', 'g', 'k', 'h',
  'j', 'q', 'x',
  'z', 'c', 's',
  'zh', 'ch', 'sh', 'r'
];

const finals = [
  'i', 'a', 'ai', 'an', 'ang', 'ao', 'e', 'ei', 'en', 'eng', 'er',
  'ia', 'ian', 'iang', 'iao', 'ie', 'in', 'ing', 'iong', 'iou',
  'o', 'ong', 'ou',
  'u', 'ua', 'uai', 'uan', 'uang', 'uei', 'uen', 'ueng', 'uo',
  'ü', 'üan', 'üe', 'ün'
];

function getPhoneticOld(initialChar, finalChar, lang, tone) {
  const iData = pronunciationNotations.initials[initialChar];
  const fData = pronunciationNotations.finals[finalChar];
  if (!iData || !fData) return '';

  const isTone4 = tone === 4 || tone === '4';

  if (['j', 'q', 'x'].includes(initialChar)) {
     if (finalChar === 'u') finalChar = 'ü';
     if (finalChar === 'un') finalChar = 'ün';
     if (finalChar === 'uan') finalChar = 'üan';
  }

  const finalDataToUse = pronunciationNotations.finals[finalChar] || fData;

  let initialText, finalText;

  if (lang === 'urdu') {
    if (tone === 1 || tone === '1') {
       initialText = iData.urduTone1 || iData.urdu || '';
       finalText = finalDataToUse.urduTone1 || finalDataToUse.urdu || '';
    } else if (tone === 2 || tone === '2') {
       initialText = iData.urduTone2 || iData.urdu || '';
       finalText = finalDataToUse.urduTone2 || finalDataToUse.urdu || '';
    } else if (tone === 3 || tone === '3') {
       initialText = iData.urduTone3 || iData.urdu || '';
       finalText = finalDataToUse.urduTone3 || finalDataToUse.urdu || '';
    } else if (isTone4) {
       initialText = iData.urduTone4 || iData.urdu || '';
       finalText = finalDataToUse.urduTone4 || finalDataToUse.urdu || '';
    } else {
       initialText = iData.urdu || '';
       finalText = finalDataToUse.urdu || '';
    }
  }
  return initialText + finalText;
}

const fs = require('fs');

const output = {};

initials.forEach(init => {
  finals.forEach(fin => {
     [1, 2, 3, 4].forEach(tone => {
        output[`${init}-${fin}-${tone}`] = getPhoneticOld(init, fin, 'urdu', tone);
     });
  });
});

fs.writeFileSync('src/old_pinyin_data.json', JSON.stringify(output, null, 2));
console.log('Old data generated.');
