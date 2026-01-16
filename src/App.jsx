import React, { useState, useEffect } from 'react';
import PinyinChart from './components/PinyinChart';
import LanguageSelector from './components/LanguageSelector';


function App() {
  const [language, setLanguage] = useState('urdu');
  const [displayMode, setDisplayMode] = useState('joined'); // 'joined' | 'separated'
  const [searchQuery, setSearchQuery] = useState('');

  // Attempt to fix "hover not working until click" by ensuring window has focus
  useEffect(() => {
    window.focus();
  }, []);

  return (
    <>
      <header>
        <h1>Pinyin Chart</h1>
        <div className="header-controls">
          <div className="search-box">
            <svg className="search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <path d="M21 21l-4.35-4.35" />
            </svg>
            <input
              type="text"
              placeholder="Search pinyin..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value.toLowerCase())}
              className="search-input"
            />
            {searchQuery && (
              <button className="search-clear" onClick={() => setSearchQuery('')}>×</button>
            )}
          </div>
          <LanguageSelector currentLang={language} onLanguageChange={setLanguage} />
        </div>
      </header>

      <main className={`lang-${language}`}>
        <PinyinChart
          language={language}
          displayMode={displayMode}
          onToggleMode={() => setDisplayMode(prev => prev === 'joined' ? 'separated' : 'joined')}
          searchQuery={searchQuery}
        />
      </main>
    </>
  );
}

export default App;
