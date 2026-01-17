import React, { useState, useEffect } from 'react';
import PinyinChart from './components/PinyinChart';

import Sidebar from './components/Sidebar';


function App() {
  const [displayMode, setDisplayMode] = useState('separated'); // Default to separated
  const [searchQuery, setSearchQuery] = useState('');

  // Attempt to fix "hover not working until click" by ensuring window has focus
  useEffect(() => {
    window.focus();
  }, []);

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-content">
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
          </div>
        </header>

        <main className="lang-urdu">
          <PinyinChart
            language="urdu"
            displayMode={displayMode}
            onToggleMode={() => setDisplayMode(prev => prev === 'joined' ? 'separated' : 'joined')}
            searchQuery={searchQuery}
          />
        </main>
      </div>
    </div>
  );
}

export default App;
