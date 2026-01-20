import React, { useState, useMemo } from 'react';
import { initials, finals, getPhonetic, getDisplayPinyin, isValidSyllable } from '../pinyinData';
import oldData from '../old_pinyin_data.json';

const SoundReviewTable = () => {
    const [filter, setFilter] = useState('');
    const [diffOnly, setDiffOnly] = useState(true);
    const [userChoices, setUserChoices] = useState({});

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
        console.log('--- EXPORT DATA START ---');
        console.log(JSON.stringify(changes, null, 2));
        console.log('--- EXPORT DATA END ---');
        alert('Check Console for JSON export!');
    };

    return (
        <div style={{ padding: 20, height: '100vh', overflow: 'auto' }}>
            <h1>Sound Review</h1>
            <div style={{ marginBottom: 20, display: 'flex', gap: 10 }}>
                <input
                    placeholder="Filter Pinyin..."
                    value={filter}
                    onChange={e => setFilter(e.target.value)}
                    style={{ padding: 5 }}
                />
                <label>
                    <input
                        type="checkbox"
                        checked={diffOnly}
                        onChange={e => setDiffOnly(e.target.checked)}
                    /> Show Differences Only
                </label>
                <button onClick={exportData} style={{ padding: '5px 15px', background: 'green', color: 'white' }}>
                    Export Changes to Console
                </button>
            </div>

            <table border="1" cellPadding="5" style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                    <tr style={{ background: '#eee' }}>
                        <th>Pinyin</th>
                        <th>Play</th>
                        <th>Old Urdu</th>
                        <th>New Urdu (Proposed)</th>
                        <th>Action</th>
                        <th>Custom Value</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredRows.slice(0, 500).map(row => {
                        const choice = userChoices[row.key] || { action: 'new', customVal: '' };
                        const isDiff = row.oldVal !== row.newVal;
                        return (
                            <tr key={row.key} style={{ background: isDiff ? '#fff' : '#f9f9f9' }}>
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
            {filteredRows.length > 500 && <div style={{ padding: 10, fontStyle: 'italic' }}>Showing first 500 rows...</div>}
        </div>
    );
};

export default SoundReviewTable;
