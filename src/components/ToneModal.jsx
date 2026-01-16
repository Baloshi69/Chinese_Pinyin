import React, { useEffect, useRef, useState, useLayoutEffect } from 'react';
import { getTones } from '../pinyinData';

const TonePopover = ({ pinyin, phonetic, isOpen, onClose, anchorPosition }) => {
    const audioRefs = useRef({});
    const popoverRef = useRef(null);
    const [style, setStyle] = useState({});
    const [placement, setPlacement] = useState('bottom'); // top or bottom

    // Preload audio (same logic)
    useEffect(() => {
        if (!pinyin || !isOpen) return;

        const safePinyin = pinyin.replace('ü', 'v');
        const newAudioRefs = {};
        for (let i = 1; i <= 4; i++) {
            const url = `https://cdn.yoyochinese.com/audio/pychart/${safePinyin}${i}.mp3`;
            const audio = new Audio(url);
            audio.preload = 'auto';
            newAudioRefs[i] = audio;
        }
        audioRefs.current = newAudioRefs;
        return () => {
            Object.values(newAudioRefs).forEach(a => { a.pause(); a.currentTime = 0; });
        };
    }, [pinyin, isOpen]);

    // Positioning Logic with Arrow
    useLayoutEffect(() => {
        if (!isOpen || !anchorPosition || !popoverRef.current) return;

        const { top, left, width: triggerWidth, height: triggerHeight } = anchorPosition;
        const popoverRect = popoverRef.current.getBoundingClientRect();

        // Gap between target and popover
        const gap = 12;

        // Check vertical space
        const spaceBelow = window.innerHeight - (top + triggerHeight);
        const spaceAbove = top;

        let newTop, newLeft, newPlacement;

        // Prefer placing below, unless too close to bottom
        if (spaceBelow < popoverRect.height + gap && spaceAbove > popoverRect.height + gap) {
            newPlacement = 'top';
            newTop = top - popoverRect.height - gap;
        } else {
            newPlacement = 'bottom';
            newTop = top + triggerHeight + gap;
        }

        // Horizontal centering
        newLeft = left + (triggerWidth / 2) - (popoverRect.width / 2);

        // Keep within screen horizontally
        const minLeft = 10;
        const maxLeft = window.innerWidth - popoverRect.width - 10;

        // Shift if needed, but keep the arrow pointing relative to trigger
        // (We'll start simpler: just clamp the box. The arrow logic can get complex without a library)
        if (newLeft < minLeft) newLeft = minLeft;
        if (newLeft > maxLeft) newLeft = maxLeft;

        setStyle({ top: newTop, left: newLeft });
        setPlacement(newPlacement);

    }, [isOpen, anchorPosition]);

    if (!isOpen) return null;

    const tones = getTones(pinyin);

    const playAudio = (toneNumber) => {
        const audio = audioRefs.current[toneNumber];
        if (audio) {
            audio.currentTime = 0;
            audio.play().catch(e => console.error(e));
        } else {
            const safePinyin = pinyin.replace('ü', 'v');
            new Audio(`https://cdn.yoyochinese.com/audio/pychart/${safePinyin}${toneNumber}.mp3`).play();
        }
    };

    return (
        <>
            <div className="popover-backdrop" onClick={onClose}></div>

            <div
                className={`popover-card ${placement}`}
                ref={popoverRef}
                style={style}
                onClick={e => e.stopPropagation()}
            >
                {/* Close X */}
                <button className="popover-close" onClick={onClose}>&times;</button>

                <div className="popover-header">
                    <span className="popover-pinyin">{pinyin}</span>
                    <span className="popover-phonetic">{phonetic}</span>
                </div>

                <div className="popover-tones">
                    {tones.slice(0, 4).map((t, index) => (
                        <div key={index} className="tone-item" onClick={() => playAudio(index + 1)}>
                            <div className="tone-text">{t}</div>
                            <div className="play-icon">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <circle cx="12" cy="12" r="12" fill="currentColor" fillOpacity="0.2" />
                                    <path d="M9.5 8L16 12L9.5 16V8Z" fill="currentColor" />
                                </svg>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
};

export default TonePopover;
