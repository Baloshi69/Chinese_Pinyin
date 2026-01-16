import React, { useState } from 'react';
import PinyinChart from './components/PinyinChart';
import LanguageSelector from './components/LanguageSelector';

function App() {
  const [language, setLanguage] = useState('urdu');

  return (
    <>
      <header>
        <h1>Pinyin Chart</h1>
        <LanguageSelector currentLang={language} onLanguageChange={setLanguage} />
      </header>

      <main className={`lang-${language}`}>
        <PinyinChart language={language} />
      </main>
    </>
  );
}

export default App;
