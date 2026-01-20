import React, { useState, useMemo } from 'react';
import { initials, finals, getPhonetic, getDisplayPinyin, isValidSyllable } from '../pinyinData';
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
