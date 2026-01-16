import React from 'react';

const LanguageSelector = ({ currentLang, onLanguageChange }) => {
    return (
        <div className="language-selector">
            <button
                className={`lang-btn ${currentLang === 'urdu' ? 'active' : ''}`}
                onClick={() => onLanguageChange('urdu')}
            >
                Urdu
            </button>
            <button
                className={`lang-btn ${currentLang === 'arabic' ? 'active' : ''}`}
                onClick={() => onLanguageChange('arabic')}
            >
                Arabic
            </button>
        </div>
    );
};

export default LanguageSelector;
