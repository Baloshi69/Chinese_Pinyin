import React, { useState, useEffect, useRef } from 'react';
import { initials, finals, isValidSyllable, getDisplayPinyin, getPhonetic, getStandalone, pronunciationNotations, displayFinalMap } from '../pinyinData';
import TonePopover from './ToneModal';

const PinyinChart = ({ language, displayMode, onToggleMode, searchQuery = '' }) => {
    const [selectedCell, setSelectedCell] = useState(null);
    const [hoveredCell, setHoveredCell] = useState({ initial: null, final: null, rowIndex: null });
    const cellRefs = useRef({});

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

        return (
            <div
                key={`${initial}-${final}-${rowIndex}`}
                ref={(el) => { cellRefs.current[pinyin.toLowerCase()] = el; }}
                className={`cell ${isActive ? 'cell-active' : ''} ${isMatch ? 'cell-search-match' : ''} ${isRowHovered ? 'row-hover' : ''} ${isColHovered ? 'col-hover' : ''}`}
                title={`${pinyin} = ${phonetic}`}
                onClick={(e) => handleCellClick(e, pinyin, phonetic)}
                onMouseEnter={() => setHoveredCell({ initial, final, rowIndex })}
                onMouseLeave={() => setHoveredCell({ initial: null, final: null, rowIndex: null })}
            >
                <div className="pinyin-text">{pinyin}</div>
                <div className="phonetic-text">{phonetic}</div>
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

        return (
            <div
                key={`standalone-${final}-${rowIndex}`}
                ref={(el) => { cellRefs.current[standalone.toLowerCase()] = el; }}
                className={`cell standalone-cell ${isActive ? 'cell-active' : ''} ${isMatch ? 'cell-search-match' : ''} ${isRowHovered ? 'row-hover' : ''}`}
                title={`${standalone} = ${phonetic}`}
                onClick={(e) => handleCellClick(e, standalone, phonetic)}
                onMouseEnter={() => setHoveredCell({ initial: null, final, rowIndex })}
                onMouseLeave={() => setHoveredCell({ initial: null, final: null, rowIndex: null })}
            >
                <div className="pinyin-text">{standalone}</div>
                <div className="phonetic-text">{phonetic}</div>
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

                    {/* Initial Headers */}
                    {initials.map(initial => (
                        <div
                            key={initial}
                            className={`cell header-row ${hoveredCell.initial === initial ? 'header-highlight' : ''}`}
                        >
                            <div className="pinyin-text">{initial}</div>
                            <div className="phonetic-text">{pronunciationNotations.initials[initial]?.[language] || ''}</div>
                        </div>
                    ))}

                    {/* Data Rows */}
                    {finals.map((final, rowIndex) => (
                        <React.Fragment key={`row-${rowIndex}`}>
                            {/* Final Header (Column 0) */}
                            <div
                                className={`cell header-col ${hoveredCell.rowIndex === rowIndex ? 'header-highlight' : ''}`}
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
