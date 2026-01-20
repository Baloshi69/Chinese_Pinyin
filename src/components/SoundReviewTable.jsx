import React, { useState, useMemo } from 'react';
import { initials, finals, getPhonetic, getDisplayPinyin, isValidSyllable, getStandalone, pronunciationNotations } from '../pinyinData';
import oldData from '../old_pinyin_data.json';

const SoundReviewTable = () => {
    const [filter, setFilter] = useState('');
    const [diffOnly, setDiffOnly] = useState(true);
    // Load initial state from localStorage if available
    const [userChoices, setUserChoices] = useState(() => {
        try {
            const saved = localStorage.getItem('soundReviewChoices');
            return saved ? JSON.parse(saved) : {};
        } catch (e) {
            console.error('Failed to load choices', e);
            return {};
        }
    });

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 500;

    // Save to localStorage on change
    React.useEffect(() => {
        try {
            localStorage.setItem('soundReviewChoices', JSON.stringify(userChoices));
        } catch (e) {
            console.error('Failed to save choices', e);
        }
    }, [userChoices]);

    const rows = useMemo(() => {
        const allRows = [];

        // 1. Add Standalone Finals (Column 1)
        finals.forEach(fin => {
            // Check if final has a standalone form (e.g., 'a' -> 'a', 'i' -> null for row 1)
            // We use getStandalone helper from pinyinData but need to check if it returns valid string
            // Actually, getStandalone returns null if not valid.
            // But we need to know the 'old' key format.
            // In generate_old_data.cjs, we iterated initials only?
            // Wait, generate_old_data.cjs looped: initials.forEach... finals.forEach.
            // It missed standalone finals too!
            // So 'oldData' likely doesn't have keys for standalone finals (e.g. "null-a-1").
            // We will use 'N/A' for oldVal for standalone finals if missing.

            // To be safe and match user request "include only finals like we have first colum",
            // we manually check if this final row has a standalone representation in the chart.
            // We can use a dummy initial 'null' or empty string for the key?
            // Let's use a specific prefix for key: "standalone-final-tone"

            // In pinyinData.js, 'standaloneFinals' object maps final -> standalone pinyin
            // We can import that? No, not exported directly? Yes, getStandalone uses it.
            // Let's assume we can get it via import or just rely on the chart logic logic:
            // Chart logic: if (getStandalone(final)) ...

            const standalonePinyin = getStandalone(fin);
            if (standalonePinyin) {
                 [1, 2, 3, 4].forEach(tone => {
                    const key = `standalone-${fin}-${tone}`;
                    const displayPinyin = standalonePinyin + tone;

                    // For phonetic of standalone:
                    // Use logic from Chart: pronunciationNotations.finals[fin].urdu
                    // But we need tone logic?
                    // Standalone finals also have tone variants?
                    // pinyinData.js finals structure:
                    // a: { urdu: 'آ', urduTone1: 'آ', ... }
                    // Yes, they have tone overrides.
                    // However, we don't have a helper to get standalone phonetic with tone.
                    // I will replicate the logic simply here:
                    const fData = pronunciationNotations.finals[fin];
                    let newVal = '';
                    if (tone === 1) newVal = fData.urduTone1 || fData.urdu;
                    else if (tone === 2) newVal = fData.urduTone2 || fData.urdu;
                    else if (tone === 3) newVal = fData.urduTone3 || fData.urdu;
                    else if (tone === 4) newVal = fData.urduTone4 || fData.urdu;
                    else newVal = fData.urdu;

                    // Apply display mode (tatweel if needed, though usually joined)
                    // We stick to 'joined' mode for review.

                    const oldVal = oldData[key] || 'N/A';

                    if (!diffOnly || newVal !== oldVal) {
                        allRows.push({
                            key,
                            pinyin: displayPinyin,
                            init: null,
                            fin,
                            tone,
                            oldVal,
                            newVal
                        });
                    }
                 });
            }
        });

        // 2. Add Initials * Finals
        initials.forEach(init => {
            finals.forEach(fin => {
                const rowIndex = finals.indexOf(fin);
                if (isValidSyllable(init, fin, rowIndex)) {
                    [1, 2, 3, 4].forEach(tone => {
                        const key = `${init}-${fin}-${tone}`;
                        const displayPinyin = getDisplayPinyin(init, fin) + tone;
                        const newVal = getPhonetic(init, fin, 'urdu', 'joined', tone);
                        const oldVal = oldData[key] || 'N/A';

                        if (!diffOnly || newVal !== oldVal) {
                            allRows.push({
                                key,
                                pinyin: displayPinyin,
                                init,
                                fin,
                                tone,
                                oldVal,
                                newVal
                            });
                        }
                    });
                }
            });
        });
        return allRows;
    }, [diffOnly]);

    const filteredRows = rows.filter(r => r.pinyin.includes(filter));

    // Pagination Logic
    const totalPages = Math.ceil(filteredRows.length / itemsPerPage);
    const currentRows = filteredRows.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
    const reviewedCount = Object.keys(userChoices).length;

    const handleActionChange = (key, action) => {
        setUserChoices(prev => ({
            ...prev,
            [key]: { ...prev[key], action }
        }));
    };

    const handleCustomChange = (key, val) => {
        setUserChoices(prev => ({
            ...prev,
            [key]: { ...prev[key], customVal: val, action: 'custom' }
        }));
    };

    const playSound = (pinyin, tone) => {
        const safePinyin = pinyin.replace(/[0-9]/g, '').replace('ü', 'v');
        const url = `/PinyinSound/${safePinyin}${tone}.mp3`;
        new Audio(url).play().catch(e => console.error(e));
    };

    const exportData = () => {
        const changes = {};
        Object.entries(userChoices).forEach(([key, val]) => {
            if (val.action !== 'new') {
                changes[key] = val;
            }
        });
        const json = JSON.stringify(changes, null, 2);

        console.log('--- EXPORT DATA START ---');
        console.log(json);
        console.log('--- EXPORT DATA END ---');

        navigator.clipboard.writeText(json).then(() => {
            alert('JSON copied to clipboard! Paste it in the chat.');
        }).catch(() => {
            alert('Failed to copy. Please check the console output.');
        });
    };

    return (
        <div style={{ padding: 20, height: '100vh', overflow: 'auto' }}>
            <h1>Sound Review</h1>

            <div style={{ background: '#f0f0f0', padding: 10, marginBottom: 20, borderRadius: 5 }}>
                <strong>Tone Legend:</strong>
                <span style={{ marginLeft: 15 }}>Tone 1 (ā): High Level</span>
                <span style={{ marginLeft: 15 }}>Tone 2 (á): Rising</span>
                <span style={{ marginLeft: 15 }}>Tone 3 (ǎ): Dipping</span>
                <span style={{ marginLeft: 15 }}>Tone 4 (à): Falling</span>
            </div>

            <div style={{ marginBottom: 20, display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
                <input
                    placeholder="Filter Pinyin..."
                    value={filter}
                    onChange={e => { setFilter(e.target.value); setCurrentPage(1); }}
                    style={{ padding: 5 }}
                />
                <label>
                    <input
                        type="checkbox"
                        checked={diffOnly}
                        onChange={e => { setDiffOnly(e.target.checked); setCurrentPage(1); }}
                    /> Show Differences Only
                </label>
                <button onClick={exportData} style={{ padding: '5px 15px', background: 'green', color: 'white', cursor: 'pointer' }}>
                    Copy Changes to Clipboard
                </button>
                <div style={{ marginLeft: 'auto', fontWeight: 'bold' }}>
                    Reviewed: {reviewedCount} / {filteredRows.length}
                </div>
            </div>

            <div style={{ marginBottom: 10, display: 'flex', gap: 5, alignItems: 'center' }}>
                <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(p => p - 1)}
                    style={{ padding: '5px 10px' }}
                >
                    Prev
                </button>
                <span>Page {currentPage} of {totalPages || 1}</span>
                <button
                    disabled={currentPage === totalPages || totalPages === 0}
                    onClick={() => setCurrentPage(p => p + 1)}
                    style={{ padding: '5px 10px' }}
                >
                    Next
                </button>
                <span style={{ marginLeft: 10, fontSize: '0.9em', color: '#666' }}>
                    (Showing {currentRows.length} items)
                </span>
            </div>

            <table border="1" cellPadding="5" style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                    <tr style={{ background: '#eee' }}>
                        <th>#</th>
                        <th>Pinyin</th>
                        <th>Play</th>
                        <th>Old Urdu</th>
                        <th>New Urdu (Proposed)</th>
                        <th>Action</th>
                        <th>Custom Value</th>
                    </tr>
                </thead>
                <tbody>
                    {currentRows.map((row, idx) => {
                        const globalIndex = (currentPage - 1) * itemsPerPage + idx + 1;
                        const choice = userChoices[row.key] || { action: 'new', customVal: '' };
                        const isDiff = row.oldVal !== row.newVal;
                        return (
                            <tr key={row.key} style={{ background: isDiff ? '#fff' : '#f9f9f9' }}>
                                <td style={{ color: '#888', fontSize: '0.8em' }}>{globalIndex}</td>
                                <td>{row.pinyin}</td>
                                <td>
                                    <button onClick={() => playSound(row.pinyin, row.tone)}>▶</button>
                                </td>
                                <td style={{ color: 'red' }}>{row.oldVal}</td>
                                <td style={{ color: 'green', fontWeight: 'bold' }}>{row.newVal}</td>
                                <td>
                                    <select
                                        value={choice.action}
                                        onChange={e => handleActionChange(row.key, e.target.value)}
                                    >
                                        <option value="new">Keep New</option>
                                        <option value="old">Revert to Old</option>
                                        <option value="custom">Custom</option>
                                    </select>
                                </td>
                                <td>
                                    <input
                                        disabled={choice.action !== 'custom'}
                                        value={choice.customVal}
                                        onChange={e => handleCustomChange(row.key, e.target.value)}
                                        style={{ width: '100%' }}
                                    />
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};

export default SoundReviewTable;
