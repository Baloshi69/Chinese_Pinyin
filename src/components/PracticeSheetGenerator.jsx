import React, { useState, useEffect, useRef } from 'react';
import { pinyin } from 'pinyin-pro';
import { pronunciationNotations } from '../pinyinData';

const PracticeSheetGenerator = () => {
    // ========== STATE ==========
    const [inputText, setInputText] = useState('');
    const [wordChips, setWordChips] = useState(['你', '好', '世', '界']); // Word mode chips
    const [sentenceChips, setSentenceChips] = useState(['我爱中国']); // Sentence mode chips
    const [mode, setMode] = useState('word'); // 'word' | 'sentence'
    const [gridType, setGridType] = useState('mi'); // 'tian' | 'mi' | 'hui' | 'jing' | 'square'
    const [boxSize, setBoxSize] = useState(70);
    const [boxesPerRow, setBoxesPerRow] = useState(10);
    const [fadeCount, setFadeCount] = useState(3);
    const [sentenceRows, setSentenceRows] = useState(3); // Rows per character in sentence mode
    const [showPinyin, setShowPinyin] = useState(true);
    const [showUrdu, setShowUrdu] = useState(true);
    const [showTranslation, setShowTranslation] = useState(false);
    const [showTracing, setShowTracing] = useState(true);
    const [strokeAnimChar, setStrokeAnimChar] = useState(null);
    const strokeAnimRef = useRef(null);

    // ========== DERIVED DATA ==========
    // For Word mode: each chip is one character
    // For Sentence mode: each chip is a sentence, extract all characters
    const characters = mode === 'word'
        ? wordChips.filter(c => /[\u4e00-\u9fff]/.test(c))
        : sentenceChips.flatMap(s => s.split('').filter(c => /[\u4e00-\u9fff]/.test(c)));

    const getPinyin = (char) => {
        try {
            return pinyin(char, { toneType: 'symbol', type: 'array' })[0] || '';
        } catch {
            return '';
        }
    };

    // Get Urdu pronunciation from pinyin
    const getUrdu = (char) => {
        try {
            const py = pinyin(char, { toneType: 'none', type: 'array' })[0] || '';
            if (!py) return '';

            // Known initials in order of length (longest first to match zh before z)
            const initials = ['zh', 'ch', 'sh', 'b', 'p', 'm', 'f', 'd', 't', 'n', 'l', 'g', 'k', 'h', 'j', 'q', 'x', 'z', 'c', 's', 'r'];

            let initial = '';
            let final = py;

            for (const init of initials) {
                if (py.startsWith(init)) {
                    initial = init;
                    final = py.slice(init.length);
                    break;
                }
            }

            // Handle standalone vowels (no initial)
            const initialUrdu = initial && pronunciationNotations.initials[initial]?.urdu || '';
            const finalUrdu = pronunciationNotations.finals[final]?.urdu || final;

            return initialUrdu + finalUrdu;
        } catch {
            return '';
        }
    };

    // Common character dictionary for translations
    const charDictionary = {
        // Common characters
        '我': 'I, me', '你': 'you', '他': 'he', '她': 'she', '它': 'it',
        '们': '(plural)', '的': "'s, of", '是': 'is, am', '不': 'not', '有': 'have',
        '在': 'at, in', '这': 'this', '那': 'that', '什': 'what', '么': '(question)',
        '好': 'good', '大': 'big', '小': 'small', '多': 'many', '少': 'few',
        '一': 'one', '二': 'two', '三': 'three', '四': 'four', '五': 'five',
        '六': 'six', '七': 'seven', '八': 'eight', '九': 'nine', '十': 'ten',
        '百': 'hundred', '千': 'thousand', '万': '10,000', '年': 'year', '月': 'month',
        '日': 'day, sun', '时': 'time, hour', '分': 'minute', '天': 'day, sky', '地': 'earth',
        '人': 'person', '中': 'middle', '国': 'country', '家': 'home', '学': 'study',
        '生': 'life, born', '老': 'old', '师': 'teacher', '朋': 'friend', '友': 'friend',
        '爱': 'love', '心': 'heart', '想': 'think', '看': 'look', '见': 'see',
        '听': 'listen', '说': 'speak', '读': 'read', '写': 'write', '吃': 'eat',
        '喝': 'drink', '走': 'walk', '来': 'come', '去': 'go', '做': 'do',
        '买': 'buy', '卖': 'sell', '给': 'give', '要': 'want', '能': 'can',
        '会': 'can, will', '可': 'may', '以': 'with', '和': 'and', '或': 'or',
        '但': 'but', '因': 'because', '为': 'for', '所': 'so', '就': 'then',
        '只': 'only', '很': 'very', '太': 'too', '最': 'most', '更': 'more',
        '还': 'still', '又': 'again', '也': 'also', '都': 'all', '每': 'every',
        '上': 'up', '下': 'down', '左': 'left', '右': 'right', '前': 'front',
        '后': 'back', '里': 'inside', '外': 'outside', '东': 'east', '西': 'west',
        '南': 'south', '北': 'north', '水': 'water', '火': 'fire', '山': 'mountain',
        '花': 'flower', '树': 'tree', '鱼': 'fish', '鸟': 'bird', '狗': 'dog',
        '猫': 'cat', '马': 'horse', '牛': 'cow', '羊': 'sheep', '猪': 'pig',
        '红': 'red', '蓝': 'blue', '绿': 'green', '黄': 'yellow', '白': 'white',
        '黑': 'black', '世': 'world', '界': 'boundary', '电': 'electric', '话': 'speech',
        '手': 'hand', '机': 'machine', '头': 'head', '眼': 'eye', '口': 'mouth',
        '耳': 'ear', '鼻': 'nose', '脸': 'face', '身': 'body', '腿': 'leg',
        '脚': 'foot', '男': 'male', '女': 'female', '孩': 'child', '子': 'child',
        '父': 'father', '母': 'mother', '哥': 'brother', '姐': 'sister', '弟': 'brother',
        '妹': 'sister', '车': 'car', '路': 'road', '门': 'door', '窗': 'window',
        '书': 'book', '本': 'book', '笔': 'pen', '纸': 'paper', '字': 'character',
        '画': 'draw', '歌': 'song', '舞': 'dance', '高': 'tall', '低': 'low',
        '长': 'long', '短': 'short', '新': 'new', '旧': 'old', '快': 'fast',
        '慢': 'slow', '早': 'early', '晚': 'late', '今': 'today', '明': 'tomorrow',
        '昨': 'yesterday', '请': 'please', '谢': 'thanks', '对': 'correct', '错': 'wrong',
        '开': 'open', '关': 'close', '起': 'rise', '床': 'bed', '睡': 'sleep',
        '觉': 'feel', '饭': 'rice', '菜': 'vegetable', '肉': 'meat', '面': 'noodle',
        '茶': 'tea', '酒': 'wine', '钱': 'money', '块': 'piece', '元': 'yuan',
    };

    // Get translation from dictionary
    const getTranslation = (char) => {
        return charDictionary[char] || '';
    };

    // ========== CHIP HANDLERS ==========
    const handleInputChange = (e) => {
        const value = e.target.value;
        if (mode === 'word') {
            // In word mode, each character becomes a chip immediately
            const newChars = value.split('').filter(c => /[\u4e00-\u9fff]/.test(c));
            if (newChars.length > 0) {
                setWordChips(prev => [...prev, ...newChars]);
                setInputText('');
            } else {
                setInputText(value);
            }
        } else {
            setInputText(value);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && mode === 'sentence' && inputText.trim()) {
            e.preventDefault();
            const chineseChars = inputText.split('').filter(c => /[\u4e00-\u9fff]/.test(c)).join('');
            if (chineseChars) {
                setSentenceChips(prev => [...prev, chineseChars]);
                setInputText('');
            }
        }
    };

    const removeWordChip = (idx) => {
        setWordChips(prev => prev.filter((_, i) => i !== idx));
    };

    const removeSentenceChip = (idx) => {
        setSentenceChips(prev => prev.filter((_, i) => i !== idx));
    };

    // ========== STROKE ANIMATION ==========
    useEffect(() => {
        if (strokeAnimChar && strokeAnimRef.current && window.HanziWriter) {
            strokeAnimRef.current.innerHTML = '';
            const writer = window.HanziWriter.create(strokeAnimRef.current, strokeAnimChar, {
                width: 200,
                height: 200,
                padding: 5,
                showOutline: true,
                strokeAnimationSpeed: 1,
                delayBetweenStrokes: 200,
            });
            writer.animateCharacter();
        }
    }, [strokeAnimChar]);

    // ========== GRID BOX COMPONENT ==========
    const GridBox = ({ char = '', type, opacity = 1, size }) => {
        const boxStyle = {
            width: size,
            height: size,
            position: 'relative',
            color: '#333',
            flexShrink: 0,
        };

        return (
            <div className={`grid-box ${type}`} style={boxStyle}>
                <svg className="grid-lines" viewBox="0 0 100 100" preserveAspectRatio="none">
                    {/* Outer border */}
                    <rect x="1" y="1" width="98" height="98" fill="none" stroke="#1a1a1a" strokeWidth="2" />

                    {/* Grid-specific guides */}
                    {(type === 'tian' || type === 'mi') && (
                        <>
                            <line x1="50" y1="0" x2="50" y2="100" stroke="#94a3b8" strokeWidth="1" strokeDasharray="6 4" />
                            <line x1="0" y1="50" x2="100" y2="50" stroke="#94a3b8" strokeWidth="1" strokeDasharray="6 4" />
                        </>
                    )}
                    {type === 'mi' && (
                        <>
                            <line x1="0" y1="0" x2="100" y2="100" stroke="#94a3b8" strokeWidth="1" strokeDasharray="6 4" />
                            <line x1="100" y1="0" x2="0" y2="100" stroke="#94a3b8" strokeWidth="1" strokeDasharray="6 4" />
                        </>
                    )}
                    {type === 'hui' && (
                        <rect x="20" y="20" width="60" height="60" fill="none" stroke="#94a3b8" strokeWidth="1" strokeDasharray="6 4" />
                    )}
                    {type === 'jing' && (
                        <>
                            <line x1="33" y1="0" x2="33" y2="100" stroke="#94a3b8" strokeWidth="1" strokeDasharray="6 4" />
                            <line x1="67" y1="0" x2="67" y2="100" stroke="#94a3b8" strokeWidth="1" strokeDasharray="6 4" />
                            <line x1="0" y1="33" x2="100" y2="33" stroke="#94a3b8" strokeWidth="1" strokeDasharray="6 4" />
                            <line x1="0" y1="67" x2="100" y2="67" stroke="#94a3b8" strokeWidth="1" strokeDasharray="6 4" />
                        </>
                    )}
                </svg>
                {char && (
                    <span
                        className="grid-char"
                        style={{
                            opacity,
                            fontSize: size * 0.7,
                        }}
                    >
                        {char}
                    </span>
                )}
            </div>
        );
    };

    // ========== WORD ROW COMPONENT ==========
    const WordRow = ({ char, pinyinText }) => {
        const totalBoxes = boxesPerRow;
        const blankBoxes = Math.max(0, totalBoxes - 1 - fadeCount);

        return (
            <div className="word-row">
                {/* Character Label with Pinyin + Urdu + Translation */}
                <div className="word-label" style={{ minWidth: boxSize + 30 }}>
                    {showPinyin && <div className="label-pinyin">{pinyinText}</div>}
                    {showUrdu && <div className="label-urdu">{getUrdu(char)}</div>}
                    {showTranslation && getTranslation(char) && (
                        <div className="label-translation">{getTranslation(char)}</div>
                    )}
                </div>

                {/* Character Boxes */}
                <div className="row-boxes">
                    {/* Master character */}
                    <GridBox char={char} type={gridType} opacity={1} size={boxSize} />

                    {/* Faded tracing boxes */}
                    {showTracing && Array.from({ length: fadeCount }).map((_, i) => {
                        const fadeOpacity = 0.5 - (i * (0.4 / fadeCount));
                        return (
                            <GridBox
                                key={`fade-${i}`}
                                char={char}
                                type={gridType}
                                opacity={Math.max(0.1, fadeOpacity)}
                                size={boxSize}
                            />
                        );
                    })}

                    {/* Blank practice boxes */}
                    {Array.from({ length: blankBoxes }).map((_, i) => (
                        <GridBox key={`blank-${i}`} type={gridType} size={boxSize} />
                    ))}
                </div>

                {/* Stroke Order Button */}
                <button
                    className="stroke-btn"
                    onClick={() => setStrokeAnimChar(char)}
                    title="View Stroke Order"
                >
                    笔
                </button>
            </div>
        );
    };

    // ========== SENTENCE MODE COMPONENT ==========
    const SentenceGrid = () => {
        // Get characters from the current sentence being displayed
        const sentenceChars = sentenceChips.flatMap(s => s.split('').filter(c => /[\u4e00-\u9fff]/.test(c)));

        return (
            <div className="sentence-container">
                {/* Show each sentence */}
                {sentenceChips.map((sentence, sentenceIdx) => {
                    const chars = sentence.split('').filter(c => /[\u4e00-\u9fff]/.test(c));

                    return (
                        <div key={sentenceIdx} className="sentence-block">
                            {/* Sentence Header - Redesigned horizontal layout */}
                            <div className="sentence-header">
                                <div className="sentence-label">Sentence {sentenceIdx + 1}</div>

                                {/* Pinyin Row */}
                                {showPinyin && (
                                    <div className="sentence-row-pinyin">
                                        {chars.map((char, idx) => (
                                            <span key={idx} className="pinyin-item">{getPinyin(char)}</span>
                                        ))}
                                    </div>
                                )}

                                {/* Characters Row - Large */}
                                <div className="sentence-row-hanzi">
                                    {chars.map((char, idx) => (
                                        <span key={idx} className="hanzi-item">{char}</span>
                                    ))}
                                </div>

                                {/* Urdu Row */}
                                {showUrdu && (
                                    <div className="sentence-row-urdu">
                                        {chars.map((char, idx) => (
                                            <span key={idx} className="urdu-item">{getUrdu(char)}</span>
                                        ))}
                                    </div>
                                )}

                                {/* Full Translation */}
                                {showTranslation && (
                                    <div className="sentence-translation">
                                        <span className="translation-label">Meaning:</span>
                                        {chars.map(c => getTranslation(c)).filter(t => t).join(' ')}
                                    </div>
                                )}

                                {/* Character-by-character breakdown */}
                                {showTranslation && (
                                    <div className="char-breakdown">
                                        {chars.map((char, idx) => (
                                            <div key={idx} className="breakdown-item">
                                                <span className="breakdown-char">{char}</span>
                                                <span className="breakdown-meaning">{getTranslation(char) || '—'}</span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Practice Rows - Copy the entire sentence */}
                            <div className="sentence-practice-rows">
                                {/* First row: Master sentence with tracing */}
                                <div className="sentence-row">
                                    {chars.map((char, idx) => (
                                        <GridBox key={idx} char={char} type={gridType} opacity={1} size={boxSize} />
                                    ))}
                                </div>

                                {/* Tracing row (faded) */}
                                {showTracing && (
                                    <div className="sentence-row tracing-row">
                                        {chars.map((char, idx) => (
                                            <GridBox key={idx} char={char} type={gridType} opacity={0.25} size={boxSize} />
                                        ))}
                                    </div>
                                )}

                                {/* Blank practice rows */}
                                {Array.from({ length: sentenceRows }).map((_, rowIdx) => (
                                    <div key={rowIdx} className="sentence-row blank-row">
                                        {chars.map((char, idx) => (
                                            <GridBox key={idx} type={gridType} size={boxSize} />
                                        ))}
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>
        );
    };

    // ========== HANDLERS ==========
    const handlePrint = () => window.print();
    const closeStrokeAnim = () => setStrokeAnimChar(null);

    // ========== RENDER ==========
    return (
        <div className="practice-sheet-v2">
            {/* ===== CONTROLS (Hidden on Print) ===== */}
            <div className="practice-controls no-print">
                <header className="practice-header">
                    <h1>Practice Sheet Creator</h1>
                    <button className="btn-print" onClick={handlePrint}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="6 9 6 2 18 2 18 9"></polyline>
                            <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path>
                            <rect x="6" y="14" width="12" height="8"></rect>
                        </svg>
                        Print
                    </button>
                </header>

                {/* Input Section */}
                <div className="control-section">
                    <label>{mode === 'word' ? 'Add Characters:' : 'Add Sentences (press Enter):'}</label>

                    {/* Chips Display */}
                    <div className="chips-container">
                        {mode === 'word' ? (
                            wordChips.map((chip, idx) => (
                                <span key={idx} className="chip word-chip">
                                    <span className="chip-pinyin">{getPinyin(chip)}</span>
                                    <span className="chip-text">{chip}</span>
                                    <button className="chip-remove" onClick={() => removeWordChip(idx)}>×</button>
                                </span>
                            ))
                        ) : (
                            sentenceChips.map((chip, idx) => (
                                <span key={idx} className="chip sentence-chip">
                                    <span className="chip-text">{chip}</span>
                                    <button className="chip-remove" onClick={() => removeSentenceChip(idx)}>×</button>
                                </span>
                            ))
                        )}
                        <input
                            type="text"
                            value={inputText}
                            onChange={handleInputChange}
                            onKeyDown={handleKeyDown}
                            placeholder={mode === 'word' ? '输入汉字...' : '输入句子后按 Enter...'}
                            className="chip-input"
                        />
                    </div>
                </div>

                {/* Settings Row */}
                <div className="settings-grid">
                    {/* Mode Toggle */}
                    <div className="setting-group">
                        <label>Mode</label>
                        <div className="toggle-group">
                            <button className={mode === 'word' ? 'active' : ''} onClick={() => setMode('word')}>Word</button>
                            <button className={mode === 'sentence' ? 'active' : ''} onClick={() => setMode('sentence')}>Sentence</button>
                        </div>
                    </div>

                    {/* Grid Style */}
                    <div className="setting-group">
                        <label>Grid Style</label>
                        <div className="toggle-group">
                            {['tian', 'mi', 'hui', 'jing', 'square'].map(g => (
                                <button key={g} className={gridType === g ? 'active' : ''} onClick={() => setGridType(g)}>
                                    {g === 'tian' ? '田' : g === 'mi' ? '米' : g === 'hui' ? '回' : g === 'jing' ? '井' : '□'}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Box Size */}
                    <div className="setting-group">
                        <label>Size: {boxSize}px</label>
                        <input type="range" min="40" max="100" value={boxSize} onChange={(e) => setBoxSize(Number(e.target.value))} />
                    </div>

                    {/* Boxes Per Row */}
                    <div className="setting-group">
                        <label>Boxes/Row: {boxesPerRow}</label>
                        <input type="range" min="5" max="15" value={boxesPerRow} onChange={(e) => setBoxesPerRow(Number(e.target.value))} />
                    </div>

                    {/* Fade Count */}
                    <div className="setting-group">
                        <label>Fade: {fadeCount}</label>
                        <input type="range" min="0" max="5" value={fadeCount} onChange={(e) => setFadeCount(Number(e.target.value))} />
                    </div>

                    {/* Sentence Rows (only for sentence mode) */}
                    {mode === 'sentence' && (
                        <div className="setting-group">
                            <label>Rows/Char: {sentenceRows}</label>
                            <input type="range" min="1" max="6" value={sentenceRows} onChange={(e) => setSentenceRows(Number(e.target.value))} />
                        </div>
                    )}

                    {/* Toggles */}
                    <div className="setting-group toggles">
                        <label>
                            <input type="checkbox" checked={showPinyin} onChange={(e) => setShowPinyin(e.target.checked)} />
                            Pinyin
                        </label>
                        <label>
                            <input type="checkbox" checked={showUrdu} onChange={(e) => setShowUrdu(e.target.checked)} />
                            اُردو
                        </label>
                        <label>
                            <input type="checkbox" checked={showTranslation} onChange={(e) => setShowTranslation(e.target.checked)} />
                            English
                        </label>
                        <label>
                            <input type="checkbox" checked={showTracing} onChange={(e) => setShowTracing(e.target.checked)} />
                            Tracing
                        </label>
                    </div>
                </div>
            </div>

            {/* ===== PREVIEW AREA ===== */}
            <div className="sheet-preview">
                <div className="print-page">
                    {characters.length > 0 ? (
                        mode === 'word' ? (
                            characters.map((char, idx) => (
                                <WordRow key={idx} char={char} pinyinText={getPinyin(char)} />
                            ))
                        ) : (
                            <SentenceGrid />
                        )
                    ) : (
                        <div className="empty-state">
                            <span className="empty-icon">📝</span>
                            <p>Type Chinese characters above to generate your practice sheet</p>
                        </div>
                    )}
                </div>
            </div>

            {/* ===== STROKE ANIMATION MODAL ===== */}
            {strokeAnimChar && (
                <div className="stroke-modal-overlay" onClick={closeStrokeAnim}>
                    <div className="stroke-modal" onClick={(e) => e.stopPropagation()}>
                        <button className="modal-close" onClick={closeStrokeAnim}>×</button>
                        <h3>Stroke Order: {strokeAnimChar}</h3>
                        <div ref={strokeAnimRef} className="stroke-stage"></div>
                        <p className="stroke-pinyin">{getPinyin(strokeAnimChar)}</p>
                    </div>
                </div>
            )}

            {/* ===== STYLES ===== */}
            <style>{`
                .practice-sheet-v2 {
                    height: 100%;
                    display: flex;
                    flex-direction: column;
                    background: linear-gradient(135deg, #f5f7fa 0%, #e4e8ed 100%);
                    font-family: 'Inter', -apple-system, sans-serif;
                }

                /* ===== CONTROLS ===== */
                .practice-controls {
                    background: white;
                    padding: 20px 24px;
                    border-bottom: 1px solid #e2e8f0;
                    box-shadow: 0 4px 20px rgba(0,0,0,0.06);
                    z-index: 10;
                }

                .practice-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 20px;
                }

                .practice-header h1 {
                    font-size: 1.5rem;
                    font-weight: 700;
                    background: linear-gradient(135deg, #1e3a5f 0%, #2563eb 100%);
                    -webkit-background-clip: text;
                    background-clip: text;
                    -webkit-text-fill-color: transparent;
                    margin: 0;
                }

                .btn-print {
                    background: linear-gradient(135deg, #1e3a5f 0%, #2563eb 100%);
                    color: white;
                    border: none;
                    padding: 10px 20px;
                    border-radius: 10px;
                    display: flex;
                    gap: 8px;
                    align-items: center;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.2s ease;
                }

                .btn-print:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 6px 20px rgba(37, 99, 235, 0.3);
                }

                .control-section {
                    margin-bottom: 16px;
                }

                .control-section label {
                    display: block;
                    font-weight: 600;
                    color: #475569;
                    margin-bottom: 6px;
                    font-size: 0.9rem;
                }

                /* ===== CHIPS INPUT ===== */
                .chips-container {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 8px;
                    padding: 10px 12px;
                    background: white;
                    border: 2px solid #e2e8f0;
                    border-radius: 10px;
                    min-height: 50px;
                    align-items: center;
                    transition: border-color 0.2s;
                }

                .chips-container:focus-within {
                    border-color: #2563eb;
                }

                .chip {
                    display: inline-flex;
                    align-items: center;
                    gap: 6px;
                    padding: 6px 10px;
                    border-radius: 8px;
                    font-weight: 500;
                    animation: chipPop 0.2s ease;
                }

                @keyframes chipPop {
                    0% { transform: scale(0.8); opacity: 0; }
                    100% { transform: scale(1); opacity: 1; }
                }

                .word-chip {
                    background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
                    border: 1px solid #93c5fd;
                    flex-direction: column;
                    padding: 4px 10px 6px;
                }

                .word-chip .chip-pinyin {
                    font-size: 0.65rem;
                    color: #dc2626;
                    font-weight: 500;
                }

                .word-chip .chip-text {
                    font-size: 1.4rem;
                    color: #1e3a5f;
                    font-family: 'KaiTi', 'Kaiti SC', serif;
                    line-height: 1;
                }

                .sentence-chip {
                    background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
                    border: 1px solid #fbbf24;
                }

                .sentence-chip .chip-text {
                    font-size: 1rem;
                    color: #92400e;
                }

                .chip-remove {
                    background: rgba(0,0,0,0.1);
                    border: none;
                    width: 18px;
                    height: 18px;
                    border-radius: 50%;
                    font-size: 1rem;
                    line-height: 1;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: #64748b;
                    transition: all 0.15s;
                }

                .chip-remove:hover {
                    background: #ef4444;
                    color: white;
                }

                .chip-input {
                    flex: 1;
                    min-width: 120px;
                    border: none;
                    outline: none;
                    font-size: 1.1rem;
                    padding: 6px 0;
                    background: transparent;
                }

                .settings-grid {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 16px;
                    align-items: flex-end;
                }

                .setting-group {
                    display: flex;
                    flex-direction: column;
                    gap: 6px;
                }

                .setting-group label {
                    font-size: 0.8rem;
                    font-weight: 600;
                    color: #64748b;
                }

                .toggle-group {
                    display: flex;
                    background: #f1f5f9;
                    border-radius: 8px;
                    padding: 3px;
                    gap: 2px;
                }

                .toggle-group button {
                    border: none;
                    padding: 6px 12px;
                    border-radius: 6px;
                    background: transparent;
                    color: #64748b;
                    cursor: pointer;
                    font-weight: 600;
                    font-size: 0.85rem;
                    transition: all 0.15s;
                }

                .toggle-group button.active {
                    background: white;
                    color: #1e3a5f;
                    box-shadow: 0 2px 6px rgba(0,0,0,0.1);
                }

                .setting-group input[type="range"] {
                    width: 100px;
                    cursor: pointer;
                }

                .setting-group.toggles {
                    flex-direction: row;
                    gap: 16px;
                }

                .setting-group.toggles label {
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    cursor: pointer;
                }

                .setting-group.toggles input[type="checkbox"] {
                    width: 16px;
                    height: 16px;
                    cursor: pointer;
                }

                /* ===== PREVIEW ===== */
                .sheet-preview {
                    flex: 1;
                    overflow: auto;
                    padding: 30px;
                    display: flex;
                    justify-content: center;
                }

                .print-page {
                    background: white;
                    width: 210mm;
                    max-width: 100%;
                    min-height: auto;
                    padding: 15mm 20mm;
                    box-shadow: 0 10px 40px rgba(0,0,0,0.1);
                    border-radius: 4px;
                    display: flex;
                    flex-direction: column;
                    gap: 10px;
                    overflow-x: hidden;
                }

                /* ===== WORD ROW ===== */
                .word-row {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    padding: 8px 0;
                    border-bottom: 1px solid #e2e8f0;
                }

                .word-label {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 2px;
                    padding: 4px 8px;
                    background: #f8fafc;
                    border-radius: 8px;
                    flex-shrink: 0;
                }

                .label-pinyin {
                    font-size: 0.85rem;
                    color: #dc2626;
                    font-weight: 500;
                }

                .label-urdu {
                    font-size: 0.9rem;
                    color: #059669;
                    font-weight: 600;
                    direction: rtl;
                    font-family: 'Noto Nastaliq Urdu', 'Jameel Noori Nastaleeq', serif;
                }

                .label-translation {
                    font-size: 0.7rem;
                    color: #2563eb;
                    font-weight: 500;
                    text-align: center;
                    max-width: 80px;
                    word-wrap: break-word;
                }

                .row-boxes {
                    display: flex;
                    gap: 2px;
                    flex-wrap: wrap;
                }

                .stroke-btn {
                    margin-left: auto;
                    background: #f1f5f9;
                    border: none;
                    width: 32px;
                    height: 32px;
                    border-radius: 8px;
                    font-size: 1rem;
                    cursor: pointer;
                    transition: all 0.15s;
                    flex-shrink: 0;
                }

                .stroke-btn:hover {
                    background: #e2e8f0;
                }

                /* ===== SENTENCE MODE ===== */
                .sentence-container {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 24px;
                }

                .sentence-block {
                    border: 2px solid #e2e8f0;
                    border-radius: 12px;
                    overflow: hidden;
                    flex: 1 1 auto;
                    min-width: 300px;
                    max-width: 100%;
                }

                .sentence-header {
                    background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
                    padding: 16px 20px;
                    border-bottom: 2px solid #f59e0b;
                }

                .sentence-label {
                    font-size: 0.75rem;
                    font-weight: 700;
                    color: #92400e;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                    margin-bottom: 8px;
                }

                .sentence-text {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 4px;
                }

                /* Horizontal Row Layout */
                .sentence-row-pinyin {
                    display: flex;
                    gap: 0;
                }

                .pinyin-item {
                    min-width: 50px;
                    text-align: center;
                    font-size: 1rem;
                    color: #dc2626;
                    font-weight: 500;
                    padding: 2px 4px;
                }

                .sentence-row-hanzi {
                    display: flex;
                    gap: 0;
                    margin: 4px 0;
                }

                .hanzi-item {
                    min-width: 50px;
                    text-align: center;
                    font-size: 2.5rem;
                    font-family: 'KaiTi', 'Kaiti SC', 'STKaiti', serif;
                    color: #1e3a5f;
                    font-weight: 600;
                }

                .sentence-row-urdu {
                    display: flex;
                    gap: 0;
                    direction: ltr;
                }

                .urdu-item {
                    min-width: 50px;
                    text-align: center;
                    font-size: 1.1rem;
                    color: #059669;
                    font-weight: 600;
                    font-family: 'Noto Nastaliq Urdu', 'Jameel Noori Nastaleeq', serif;
                }

                .sentence-translation {
                    margin-top: 16px;
                    padding: 10px 16px;
                    background: rgba(37, 99, 235, 0.1);
                    border-radius: 8px;
                    color: #2563eb;
                    font-size: 1rem;
                    font-weight: 500;
                }

                .translation-label {
                    font-weight: 700;
                    margin-right: 8px;
                    color: #1e40af;
                }

                /* Character Breakdown Table */
                .char-breakdown {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 8px;
                    margin-top: 12px;
                    padding-top: 12px;
                    border-top: 1px dashed #e2e8f0;
                }

                .breakdown-item {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    padding: 6px 12px;
                    background: rgba(255,255,255,0.7);
                    border-radius: 8px;
                    border: 1px solid #e2e8f0;
                    min-width: 60px;
                }

                .breakdown-char {
                    font-size: 1.3rem;
                    font-family: 'KaiTi', 'Kaiti SC', 'STKaiti', serif;
                    color: #1e3a5f;
                    font-weight: 600;
                }

                .breakdown-meaning {
                    font-size: 0.7rem;
                    color: #2563eb;
                    font-weight: 500;
                    text-align: center;
                }

                .sentence-char-display {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 2px;
                }

                .char-pinyin {
                    font-size: 0.75rem;
                    color: #dc2626;
                    font-weight: 500;
                }

                .char-hanzi {
                    font-size: 1.8rem;
                    font-family: 'KaiTi', 'Kaiti SC', 'STKaiti', serif;
                    color: #1e3a5f;
                    font-weight: 600;
                }

                .char-urdu {
                    font-size: 0.75rem;
                    color: #059669;
                    font-weight: 600;
                    direction: rtl;
                    font-family: 'Noto Nastaliq Urdu', 'Jameel Noori Nastaleeq', serif;
                }

                .sentence-practice-rows {
                    padding: 12px;
                    display: flex;
                    flex-direction: column;
                    gap: 4px;
                    background: #fafafa;
                    max-width: 100%;
                    overflow-x: hidden;
                }

                .sentence-row {
                    display: flex;
                    gap: 2px;
                    flex-wrap: wrap;
                    max-width: 100%;
                }

                .sentence-row.tracing-row {
                    opacity: 1;
                }

                /* Page break handling for print */
                .sentence-block {
                    page-break-inside: avoid;
                    break-inside: avoid;
                }

                .sentence-practice-rows {
                    page-break-inside: auto;
                }

                .sentence-row {
                    page-break-inside: avoid;
                    break-inside: avoid;
                }

                /* ===== GRID BOX ===== */
                .grid-box {
                    print-color-adjust: exact;
                    -webkit-print-color-adjust: exact;
                }

                .grid-lines {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    pointer-events: none;
                }

                .grid-char {
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    font-family: 'KaiTi', 'Kaiti SC', 'STKaiti', 'SimSun', serif;
                    line-height: 1;
                    color: #1a1a1a;
                    pointer-events: none;
                }

                /* ===== EMPTY STATE ===== */
                .empty-state {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    height: 300px;
                    color: #94a3b8;
                }

                .empty-icon {
                    font-size: 3rem;
                    margin-bottom: 16px;
                }

                /* ===== STROKE MODAL ===== */
                .stroke-modal-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0,0,0,0.6);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 1000;
                }

                .stroke-modal {
                    background: white;
                    border-radius: 16px;
                    padding: 24px;
                    text-align: center;
                    min-width: 280px;
                    position: relative;
                }

                .modal-close {
                    position: absolute;
                    top: 12px;
                    right: 12px;
                    background: none;
                    border: none;
                    font-size: 1.5rem;
                    cursor: pointer;
                    color: #94a3b8;
                }

                .stroke-modal h3 {
                    margin: 0 0 16px 0;
                    font-size: 1.5rem;
                    color: #1e3a5f;
                }

                .stroke-stage {
                    display: flex;
                    justify-content: center;
                    margin: 16px 0;
                }

                .stroke-pinyin {
                    color: #dc2626;
                    font-size: 1.2rem;
                    font-weight: 500;
                }

                /* ===== PRINT ===== */
                @media print {
                    @page {
                        size: A4;
                        margin: 10mm;
                    }

                    .no-print, .app-sidebar, .stroke-btn, .practice-controls {
                        display: none !important;
                    }

                    .practice-sheet-v2, .sheet-preview {
                        background: white;
                        padding: 0;
                        height: auto;
                        overflow: visible;
                    }

                    .print-page {
                        box-shadow: none;
                        width: 100%;
                        max-width: 100%;
                        padding: 0;
                        margin: 0;
                    }

                    .sentence-block {
                        page-break-inside: avoid;
                        break-inside: avoid;
                    }

                    .sentence-row {
                        page-break-inside: avoid;
                        break-inside: avoid;
                    }

                    .word-row {
                        page-break-inside: avoid;
                        break-inside: avoid;
                    }
                }
            `}</style>
        </div>
    );
};

export default PracticeSheetGenerator;
