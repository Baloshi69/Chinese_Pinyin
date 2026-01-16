import React, { useState, useEffect, useRef } from 'react';
import { initials, finals, isValidSyllable, getDisplayPinyin, getPhonetic, getStandalone, pronunciationNotations, displayFinalMap } from '../pinyinData';
import TonePopover from './ToneModal';

const PinyinChart = ({ language, displayMode, onToggleMode, searchQuery = '' }) => {
    const [selectedCell, setSelectedCell] = useState(null);
    const [hoveredCell, setHoveredCell] = useState({ initial: null, final: null, rowIndex: null });
    const cellRefs = useRef({});

    // Header playback state
    const [headerPlayback, setHeaderPlayback] = useState(null); // { type: 'initial'|'final', value: string, anchorRect: DOMRect }
    const [isPlayingSequence, setIsPlayingSequence] = useState(false);
    const [currentlyPlayingPinyin, setCurrentlyPlayingPinyin] = useState(null);
    const [currentlyPlayingTone, setCurrentlyPlayingTone] = useState(null); // 1, 2, 3, or 4
    const audioQueueRef = useRef([]);
    const currentAudioRef = useRef(null);

    // Auto-scroll to searched cell
    useEffect(() => {
        if (searchQuery && searchQuery.length >= 1) {
            const matchedRef = cellRefs.current[searchQuery.toLowerCase()];
            if (matchedRef) {
                matchedRef.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
            }
        }
    }, [searchQuery]);

    const handleCellClick = (e, pinyin, phonetic) => {
        const rect = e.currentTarget.getBoundingClientRect();
        setSelectedCell({
            pinyin,
            phonetic,
            anchorPosition: rect
        });
    };

    // Handle header click - show tone selector
    const handleHeaderClick = (e, type, value) => {
        if (isPlayingSequence) {
            stopSequence();
            return;
        }
        const rect = e.currentTarget.getBoundingClientRect();
        setHeaderPlayback({ type, value, anchorRect: rect });
    };

    // Get all valid syllables for an initial (column)
    const getSyllablesForInitial = (initial) => {
        const syllables = [];
        finals.forEach((final, rowIndex) => {
            if (isValidSyllable(initial, final, rowIndex)) {
                const pinyin = getDisplayPinyin(initial, final);
                syllables.push(pinyin);
            }
        });
        return syllables;
    };

    // Get all valid syllables for a final (row)
    const getSyllablesForFinal = (final, rowIndex) => {
        const syllables = [];
        // Add standalone first if it exists
        const standalone = getStandalone(final);
        if (standalone) {
            syllables.push(standalone);
        }
        // Add all initials
        initials.forEach(initial => {
            if (isValidSyllable(initial, final, rowIndex)) {
                const pinyin = getDisplayPinyin(initial, final);
                syllables.push(pinyin);
            }
        });
        return syllables;
    };

    // Play sequence of audio files - all 4 tones per cell
    const playSequence = async (syllables) => {
        setIsPlayingSequence(true);
        setHeaderPlayback(null);

        // Build queue: each syllable gets 4 tones
        const queue = [];
        syllables.forEach(pinyin => {
            [1, 2, 3, 4].forEach(tone => {
                queue.push({ pinyin, tone });
            });
        });
        audioQueueRef.current = queue;

        const playNext = () => {
            if (audioQueueRef.current.length === 0) {
                setIsPlayingSequence(false);
                setCurrentlyPlayingPinyin(null);
                setCurrentlyPlayingTone(null);
                return;
            }

            const { pinyin, tone } = audioQueueRef.current.shift();
            setCurrentlyPlayingPinyin(pinyin);
            setCurrentlyPlayingTone(tone);

            // Scroll to the cell when starting tone 1
            if (tone === 1) {
                const cellRef = cellRefs.current[pinyin.toLowerCase()];
                if (cellRef) {
                    cellRef.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
                }
            }

            const safePinyin = pinyin.replace('ü', 'v');
            const url = `/Mandarin_sounds/cmn-${safePinyin}${tone}.mp3`;

            const audio = new Audio(url);
            currentAudioRef.current = audio;

            audio.onended = () => {
                // Shorter delay between tones of same cell, longer between cells
                const nextItem = audioQueueRef.current[0];
                const delay = nextItem && nextItem.pinyin === pinyin ? 200 : 400;
                setTimeout(playNext, delay);
            };

            audio.onerror = () => {
                setTimeout(playNext, 50); // Skip quickly on error
            };

            audio.play().catch(() => {
                setTimeout(playNext, 50);
            });
        };

        playNext();
    };

    // Stop playing sequence
    const stopSequence = () => {
        audioQueueRef.current = [];
        if (currentAudioRef.current) {
            currentAudioRef.current.pause();
            currentAudioRef.current = null;
        }
        setIsPlayingSequence(false);
        setCurrentlyPlayingPinyin(null);
        setCurrentlyPlayingTone(null);
    };

    // Handle play all for header
    const handlePlayAll = () => {
        if (!headerPlayback) return;

        let syllables = [];
        if (headerPlayback.type === 'initial') {
            syllables = getSyllablesForInitial(headerPlayback.value);
        } else if (headerPlayback.type === 'final') {
            const rowIndex = finals.indexOf(headerPlayback.value);
            syllables = getSyllablesForFinal(headerPlayback.value, rowIndex);
        }

        if (syllables.length > 0) {
            playSequence(syllables);
        } else {
            setHeaderPlayback(null);
        }
    };

    // Check if this pinyin matches search query
    const isSearchMatch = (pinyin) => {
        if (!searchQuery || searchQuery.length < 1) return false;
        return pinyin.toLowerCase() === searchQuery.toLowerCase();
    };

    // Helper to render a data cell
    const renderCell = (initial, final, rowIndex) => {
        const valid = isValidSyllable(initial, final, rowIndex);

        const isRowHovered = hoveredCell.rowIndex === rowIndex;
        const isColHovered = hoveredCell.initial === initial;

        if (!valid) {
            return (
                <div
                    key={`${initial}-${final}-${rowIndex}`}
                    className={`cell empty-cell ${isRowHovered ? 'row-hover' : ''} ${isColHovered ? 'col-hover' : ''}`}
                    onMouseEnter={() => setHoveredCell({ initial, final, rowIndex })}
                    onMouseLeave={() => setHoveredCell({ initial: null, final: null, rowIndex: null })}
                />
            );
        }

        const pinyin = getDisplayPinyin(initial, final);
        const phonetic = getPhonetic(initial, final, language, displayMode);
        const isActive = selectedCell?.pinyin === pinyin;
        const isMatch = isSearchMatch(pinyin);
        const isPlaying = currentlyPlayingPinyin === pinyin;

        return (
            <div
                key={`${initial}-${final}-${rowIndex}`}
                ref={(el) => { cellRefs.current[pinyin.toLowerCase()] = el; }}
                className={`cell ${isActive ? 'cell-active' : ''} ${isMatch ? 'cell-search-match' : ''} ${isPlaying ? 'cell-playing' : ''} ${isRowHovered ? 'row-hover' : ''} ${isColHovered ? 'col-hover' : ''}`}
                title={`${pinyin} = ${phonetic}`}
                onClick={(e) => handleCellClick(e, pinyin, phonetic)}
                onMouseEnter={() => setHoveredCell({ initial, final, rowIndex })}
                onMouseLeave={() => setHoveredCell({ initial: null, final: null, rowIndex: null })}
            >
                <div className="pinyin-text">{pinyin}</div>
                <div className="phonetic-text">{phonetic}</div>
                {isPlaying && currentlyPlayingTone && (
                    <div className="tone-badge">{currentlyPlayingTone}</div>
                )}
            </div>
        );
    };

    // Render standalone cell (column 2)
    const renderStandaloneCell = (final, rowIndex) => {
        const standalone = getStandalone(final);
        const isRowHovered = hoveredCell.rowIndex === rowIndex;

        // Special first 'i' row has no standalone
        if (standalone === null || standalone === undefined) {
            return (
                <div
                    key={`standalone-${final}-${rowIndex}`}
                    className={`cell empty-cell ${isRowHovered ? 'row-hover' : ''}`}
                    onMouseEnter={() => setHoveredCell({ initial: null, final, rowIndex })}
                    onMouseLeave={() => setHoveredCell({ initial: null, final: null, rowIndex: null })}
                />
            );
        }

        // Get phonetic for standalone (no initial)
        const phonetic = pronunciationNotations.finals[final]?.[language] || '';
        const isActive = selectedCell?.pinyin === standalone;
        const isMatch = isSearchMatch(standalone);
        const isPlaying = currentlyPlayingPinyin === standalone;

        return (
            <div
                key={`standalone-${final}-${rowIndex}`}
                ref={(el) => { cellRefs.current[standalone.toLowerCase()] = el; }}
                className={`cell standalone-cell ${isActive ? 'cell-active' : ''} ${isMatch ? 'cell-search-match' : ''} ${isPlaying ? 'cell-playing' : ''} ${isRowHovered ? 'row-hover' : ''}`}
                title={`${standalone} = ${phonetic}`}
                onClick={(e) => handleCellClick(e, standalone, phonetic)}
                onMouseEnter={() => setHoveredCell({ initial: null, final, rowIndex })}
                onMouseLeave={() => setHoveredCell({ initial: null, final: null, rowIndex: null })}
            >
                <div className="pinyin-text">{standalone}</div>
                <div className="phonetic-text">{phonetic}</div>
                {isPlaying && currentlyPlayingTone && (
                    <div className="tone-badge">{currentlyPlayingTone}</div>
                )}
            </div>
        );
    };

    // Get display name for final header
    const getDisplayFinal = (final) => {
        return displayFinalMap[final] || final;
    };

    // Grid columns: corner + standalone + initials.length
    const gridColumns = 2 + initials.length;

    return (
        <>
            <TonePopover
                isOpen={!!selectedCell}
                onClose={() => setSelectedCell(null)}
                pinyin={selectedCell?.pinyin || ''}
                phonetic={selectedCell?.phonetic || ''}
                anchorPosition={selectedCell?.anchorPosition}
            />

            {/* Header Play Popup */}
            {headerPlayback && (
                <>
                    <div className="popover-backdrop" onClick={() => setHeaderPlayback(null)}></div>
                    <div
                        className="header-tone-selector"
                        style={{
                            top: headerPlayback.anchorRect.bottom + 10,
                            left: headerPlayback.anchorRect.left + (headerPlayback.anchorRect.width / 2) - 80,
                        }}
                    >
                        <div className="header-tone-title">
                            Play "{headerPlayback.type === 'initial' ? headerPlayback.value : '-' + getDisplayFinal(headerPlayback.value)}"
                        </div>
                        <button className="header-play-all-btn" onClick={handlePlayAll}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M8 5v14l11-7z" />
                            </svg>
                            Play All Tones
                        </button>
                    </div>
                </>
            )}

            {/* Stop button when playing */}
            {isPlayingSequence && (
                <button className="stop-sequence-btn" onClick={stopSequence}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <rect x="6" y="6" width="12" height="12" rx="2" />
                    </svg>
                    Stop
                </button>
            )}

            <div className="chart-container">
                <div className="pinyin-grid" style={{ gridTemplateColumns: `repeat(${gridColumns}, 1fr)` }}>
                    {/* Row 0: Header Row */}
                    {/* Corner Cell - Toggle */}
                    <div
                        className="cell corner-cell corner-toggle"
                        onClick={onToggleMode}
                        title={`Click to ${displayMode === 'joined' ? 'Split' : 'Join'} Characters`}
                    >
                        {displayMode === 'joined' ? (
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M8 12h8" strokeDasharray="2 2" />
                                <path d="M4 12h2" />
                                <path d="M18 12h2" />
                                <line x1="12" y1="9" x2="12" y2="15" />
                            </svg>
                        ) : (
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M7 12h10" />
                                <path d="M7 12l-2 0" strokeLinecap="round" />
                                <path d="M17 12l2 0" strokeLinecap="round" />
                                <path d="M10 12a2 2 0 0 1 2-2h0a2 2 0 0 1 2 2v0a2 2 0 0 1-2 2h0a2 2 0 0 1-2-2z" />
                            </svg>
                        )}
                    </div>

                    {/* Empty cell for standalone column header */}
                    <div className="cell header-row header-standalone">
                        <div className="pinyin-text"></div>
                    </div>

                    {/* Initial Headers (clickable for column playback) */}
                    {initials.map(initial => (
                        <div
                            key={initial}
                            className={`cell header-row header-clickable ${hoveredCell.initial === initial ? 'header-highlight' : ''}`}
                            onClick={(e) => handleHeaderClick(e, 'initial', initial)}
                            title={`Click to play all "${initial}" sounds`}
                        >
                            <div className="pinyin-text">{initial}</div>
                            <div className="phonetic-text">{pronunciationNotations.initials[initial]?.[language] || ''}</div>
                        </div>
                    ))}

                    {/* Data Rows */}
                    {finals.map((final, rowIndex) => (
                        <React.Fragment key={`row-${rowIndex}`}>
                            {/* Final Header (clickable for row playback) */}
                            <div
                                className={`cell header-col header-clickable ${hoveredCell.rowIndex === rowIndex ? 'header-highlight' : ''}`}
                                onClick={(e) => handleHeaderClick(e, 'final', final)}
                                title={`Click to play all "-${getDisplayFinal(final)}" sounds`}
                            >
                                <div className="pinyin-text">-{getDisplayFinal(final)}</div>
                                <div className="phonetic-text">{pronunciationNotations.finals[final]?.[language] || ''}</div>
                            </div>

                            {/* Standalone Cell (Column 1) */}
                            {renderStandaloneCell(final, rowIndex)}

                            {/* Data Cells */}
                            {initials.map(initial => renderCell(initial, final, rowIndex))}
                        </React.Fragment>
                    ))}
                </div>
            </div>
        </>
    );
};

export default PinyinChart;
