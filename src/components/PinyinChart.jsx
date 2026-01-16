import React, { useState } from 'react';
import { initials, finals, isValidSyllable, getDisplayPinyin, getPhonetic, pronunciationNotations } from '../pinyinData';
import TonePopover from './ToneModal'; // Using the same file, logic changed

const PinyinChart = ({ language }) => {
    const [selectedCell, setSelectedCell] = useState(null); // { pinyin, phonetic, anchorPosition }
    const [hoveredCell, setHoveredCell] = useState({ initial: null, final: null });

    const handleCellClick = (e, pinyin, phonetic) => {
        const rect = e.currentTarget.getBoundingClientRect();
        setSelectedCell({
            pinyin,
            phonetic,
            anchorPosition: rect
        });
    };

    // Helper to render a cell
    const renderCell = (initial, final) => {
        const valid = isValidSyllable(initial, final);

        // Highlight check logic
        const isRowHovered = hoveredCell.final === final;
        const isColHovered = hoveredCell.initial === initial;

        // Even empty cells should trigger the crosshair highlight to feel responsive
        // But invalid cells are currently "empty-cell" div. Let's make them interactive for hover if desired, 
        // or just keep them transparent. User asked for "when it hover a cell".
        // Usually, empty cells in a chart might still be hoverable for grid tracking.
        // Let's attach hover listeners to empty cells too? 
        // Logic: if validity check fails, we return an empty div. We should probably wrap it to allow mouse events.

        if (!valid) {
            return (
                <div
                    key={`${initial}-${final}`}
                    className={`cell empty-cell ${isRowHovered ? 'row-hover' : ''} ${isColHovered ? 'col-hover' : ''}`}
                    onMouseEnter={() => setHoveredCell({ initial, final })}
                    onMouseLeave={() => setHoveredCell({ initial: null, final: null })}
                >
                    {/* Empty */}
                </div>
            );
        }

        const pinyin = getDisplayPinyin(initial, final);
        const phonetic = getPhonetic(initial, final, language);

        // Check active selection
        const isActive = selectedCell?.pinyin === pinyin;

        return (
            <div
                key={`${initial}-${final}`}
                className={`cell ${isActive ? 'cell-active' : ''} ${isRowHovered ? 'row-hover' : ''} ${isColHovered ? 'col-hover' : ''}`}
                title={`${pinyin} = ${phonetic}`}
                onClick={(e) => handleCellClick(e, pinyin, phonetic)}
                onMouseEnter={() => setHoveredCell({ initial, final })}
                onMouseLeave={() => setHoveredCell({ initial: null, final: null })}
            >
                <div className="pinyin-text">{pinyin}</div>
                <div className="phonetic-text">{phonetic}</div>
            </div>
        );
    };

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
                <div className="pinyin-grid">
                    {/* Top Left Corner */}
                    <div className="cell corner-cell">
                        {/* Empty */}
                    </div>

                    {/* Header Row (Initials) */}
                    {initials.map(initial => (
                        <div
                            key={initial}
                            className={`cell header-row ${hoveredCell.initial === initial ? 'header-highlight' : ''}`}
                        >
                            <div className="pinyin-text">{initial}</div>
                            <div className="phonetic-text">{pronunciationNotations.initials[initial][language]}</div>
                        </div>
                    ))}

                    {/* Rows (Finals) */}
                    {finals.map(final => (
                        <React.Fragment key={final}>
                            {/* Header Column (Final) */}
                            <div
                                className={`cell header-col ${hoveredCell.final === final ? 'header-highlight' : ''}`}
                            >
                                <div className="pinyin-text">-{final}</div>
                                <div className="phonetic-text">{pronunciationNotations.finals[final][language]}</div>
                            </div>

                            {/* Data Cells (Iterate through Initials for this Final row) */}
                            {initials.map(initial => renderCell(initial, final))}

                        </React.Fragment>
                    ))}
                </div>
            </div>
        </>
    );
};

export default PinyinChart;
