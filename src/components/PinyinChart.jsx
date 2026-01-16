import React, { useState } from 'react';
import { initials, finals, isValidSyllable, getDisplayPinyin, getPhonetic, pronunciationNotations } from '../pinyinData';
import TonePopover from './ToneModal'; // Using the same file, logic changed

const PinyinChart = ({ language }) => {
    const [selectedCell, setSelectedCell] = useState(null); // { pinyin, phonetic, anchorPosition }

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

        if (!valid) {
            return (
                <div key={`${initial}-${final}`} className="cell empty-cell">
                    {/* Empty */}
                </div>
            );
        }

        const pinyin = getDisplayPinyin(initial, final);
        const phonetic = getPhonetic(initial, final, language);

        // Check if this cell is currently selected for active styling
        const isActive = selectedCell?.pinyin === pinyin;

        return (
            <div
                key={`${initial}-${final}`}
                className={`cell ${isActive ? 'cell-active' : ''}`}
                title={`${pinyin} = ${phonetic}`}
                onClick={(e) => handleCellClick(e, pinyin, phonetic)}
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
                        Final \ Init
                    </div>

                    {/* Header Row (Initials) */}
                    {initials.map(initial => (
                        <div key={initial} className="cell header-row">
                            <div className="pinyin-text">{initial}</div>
                            <div className="phonetic-text">{pronunciationNotations.initials[initial][language]}</div>
                        </div>
                    ))}

                    {/* Rows (Finals) */}
                    {finals.map(final => (
                        <React.Fragment key={final}>
                            {/* Header Column (Final) */}
                            <div className="cell header-col">
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
