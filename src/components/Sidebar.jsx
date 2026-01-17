import React, { useState } from 'react';

const Sidebar = () => {
    const [isCollapsed, setIsCollapsed] = useState(true); // Default to collapsed (Icons only)

    const handleExpand = () => {
        if (isCollapsed) setIsCollapsed(false);
    };

    return (
        <aside className={`app-sidebar ${isCollapsed ? 'collapsed' : ''}`}>
            <div className="sidebar-content">
                <div className="sidebar-header">
                    <div className="sidebar-logo">拼</div>
                    <span className="sidebar-title">Pinyin Chart</span>
                </div>

                <nav className="sidebar-nav">
                    <button className="nav-item active" title="Chart" onClick={handleExpand}>
                        <div className="nav-icon">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <rect x="3" y="3" width="7" height="7"></rect>
                                <rect x="14" y="3" width="7" height="7"></rect>
                                <rect x="14" y="14" width="7" height="7"></rect>
                                <rect x="3" y="14" width="7" height="7"></rect>
                            </svg>
                        </div>
                        <span className="nav-text">Chart</span>
                    </button>
                    <button className="nav-item" title="Info" onClick={handleExpand}>
                        <div className="nav-icon">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <circle cx="12" cy="12" r="10"></circle>
                                <line x1="12" y1="16" x2="12" y2="12"></line>
                                <line x1="12" y1="8" x2="12.01" y2="8"></line>
                            </svg>
                        </div>
                        <span className="nav-text">Info</span>
                    </button>
                </nav>
            </div>

            <button
                className="sidebar-toggle"
                onClick={() => setIsCollapsed(!isCollapsed)}
                title={isCollapsed ? "Expand" : "Collapse"}
            >
                <div className="toggle-handle"></div>
                <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    style={{ transform: isCollapsed ? 'rotate(0deg)' : 'rotate(180deg)', transition: 'transform 0.3s' }}
                >
                    <path d="M15 18l-6-6 6-6" />
                </svg>
            </button>
        </aside>
    );
};

export default Sidebar;
