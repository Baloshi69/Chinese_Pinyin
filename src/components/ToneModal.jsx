import React, { useRef, useState, useLayoutEffect } from 'react';
import { getTones, getPhonetic, pronunciationNotations } from '../pinyinData';

const TonePopover = ({ pinyin, phonetic, isOpen, onClose, anchorPosition }) => {
    const popoverRef = useRef(null);
    const currentAudioRef = useRef(null);
    const [style, setStyle] = useState({});
    const [placement, setPlacement] = useState('bottom');
    const [playingTone, setPlayingTone] = useState(null);
    const [loadingTone, setLoadingTone] = useState(null);

    useLayoutEffect(() => {
        if (!isOpen || !anchorPosition || !popoverRef.current) return;

        const { top, left, width: triggerWidth, height: triggerHeight } = anchorPosition;
        const popoverRect = popoverRef.current.getBoundingClientRect();
        const gap = 10;

        const spaceBelow = window.innerHeight - (top + triggerHeight);
        let newTop, newLeft, newPlacement;

        if (spaceBelow < popoverRect.height + gap && top > popoverRect.height + gap) {
            newPlacement = 'top';
            newTop = top - popoverRect.height - gap;
        } else {
            newPlacement = 'bottom';
            newTop = top + triggerHeight + gap;
        }

        newLeft = left + (triggerWidth / 2) - (popoverRect.width / 2);
        if (newLeft < 10) newLeft = 10;
        if (newLeft + popoverRect.width > window.innerWidth - 10) {
            newLeft = window.innerWidth - popoverRect.width - 10;
        }

        setStyle({ top: newTop, left: newLeft });
        setPlacement(newPlacement);
    }, [isOpen, anchorPosition]);

    if (!isOpen) return null;

    const tones = getTones(pinyin);

    // Parse pinyin into initial + final for tone-aware Urdu lookup
    const parsePinyinParts = (py) => {
        // Order by length to match longer initials first (zh, ch, sh before z, c, s)
        const sortedInitials = Object.keys(pronunciationNotations.initials).sort((a, b) => b.length - a.length);
        for (const initial of sortedInitials) {
            if (py.startsWith(initial)) {
                return { initial, final: py.slice(initial.length) };
            }
        }
        return { initial: null, final: py }; // standalone (no initial)
    };

    // Get tone-specific Urdu transliteration
    const getToneUrdu = (toneNum) => {
        const { initial, final } = parsePinyinParts(pinyin);

        // Map display finals back to internal representation
        const finalMap = { 'iu': 'iou', 'ui': 'uei', 'un': 'uen' };
        const internalFinal = finalMap[final] || final;

        if (initial) {
            return getPhonetic(initial, internalFinal, 'urdu', 'joined', toneNum);
        }
        // For standalone syllables, just return the final's Urdu
        const fData = pronunciationNotations.finals[internalFinal];
        if (toneNum === 4 && fData?.urduTone4) {
            return fData.urduTone4;
        }
        return fData?.urdu || '';
    };


    const playAudio = (toneNumber) => {
        // Stop any currently playing audio
        if (currentAudioRef.current) {
            currentAudioRef.current.pause();
            currentAudioRef.current = null;
        }

        // Convert ü to v for file naming (lü → lv, nü → nv) - audio-cmn format
        const safePinyin = pinyin.replace('ü', 'v');
        const url = `/PinyinSound/${safePinyin}${toneNumber}.mp3`;

        const audio = new Audio(url);
        currentAudioRef.current = audio;

        // Show loading state
        setLoadingTone(toneNumber);
        setPlayingTone(null);

        // Handle when audio is ready to play
        audio.oncanplaythrough = () => {
            setLoadingTone(null);
            setPlayingTone(toneNumber);
            audio.play().catch(e => {
                console.error('Audio playback error:', e);
                setPlayingTone(null);
            });
        };

        // Handle audio end
        audio.onended = () => {
            setPlayingTone(null);
            currentAudioRef.current = null;
        };

        // Handle error (missing file)
        audio.onerror = () => {
            console.warn(`Sound file not available: ${url}`);
            setLoadingTone(null);
            setPlayingTone(null);
            currentAudioRef.current = null;
        };

        // Start loading
        audio.load();
    };

    const toneLabels = ['1st', '2nd', '3rd', '4th'];

    return (
        <>
            <div className="popover-backdrop" onClick={onClose}></div>

            {/* Spotlight: Clone of the clicked cell above the blur */}
            {anchorPosition && (
                <div
                    className="spotlight-cell"
                    style={{
                        top: anchorPosition.top,
                        left: anchorPosition.left,
                        width: anchorPosition.width,
                        height: anchorPosition.height,
                    }}
                    onClick={onClose}
                >
                    <div className="pinyin-text">{pinyin}</div>
                    <div className="phonetic-text">{phonetic}</div>
                </div>
            )}

            <div className={`popover-card ${placement}`} ref={popoverRef} style={style} onClick={e => e.stopPropagation()}>
                <button className="popover-close" onClick={onClose}>×</button>

                <div className="popover-header">
                    <span className="popover-pinyin">{pinyin}</span>
                    <span className="popover-phonetic">{phonetic}</span>
                </div>

                <div className="popover-tones">
                    {tones.slice(0, 4).map((t, index) => {
                        const toneNum = index + 1;
                        const isLoading = loadingTone === toneNum;
                        const isPlaying = playingTone === toneNum;

                        return (
                            <button
                                key={index}
                                className={`tone-btn ${isPlaying ? 'playing' : ''} ${isLoading ? 'loading' : ''}`}
                                onClick={() => playAudio(toneNum)}
                                disabled={isLoading}
                            >
                                <div className="tone-info">
                                    <span className="tone-char">{t}</span>
                                    <span className="tone-urdu">{getToneUrdu(toneNum)}</span>
                                    <span className="tone-label">{toneLabels[index]}</span>
                                </div>
                                <div className="play-btn">
                                    {isLoading ? (
                                        <svg className="spinner" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <circle cx="12" cy="12" r="10" strokeOpacity="0.25" />
                                            <path d="M12 2a10 10 0 0 1 10 10" strokeLinecap="round" />
                                        </svg>
                                    ) : isPlaying ? (
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                                            <rect x="6" y="4" width="4" height="16" rx="1" />
                                            <rect x="14" y="4" width="4" height="16" rx="1" />
                                        </svg>
                                    ) : (
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M8 5v14l11-7z" />
                                        </svg>
                                    )}
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>
        </>
    );
};

export default TonePopover;
