import { Link } from 'react-router-dom'

export function MobileHeader() {
    return (
        <header className="mobile-header">
            <div className="mobile-header-content">
                <Link to="/" className="mobile-logo">
                    <svg width="140" height="32" viewBox="0 0 140 32" fill="none">
                        {/* Camera Icon */}
                        <g transform="translate(0, 10)">
                            <path d="M8 4C6.89543 4 6 4.89543 6 6V14C6 15.1046 6.89543 16 8 16H24C25.1046 16 26 15.1046 26 14V6C26 4.89543 25.1046 4 24 4H22.5L22 2H10L9.5 4H8Z" stroke="#00CED1" strokeWidth="2" fill="none"/>
                            <circle cx="16" cy="10" r="3" stroke="#00CED1" strokeWidth="2" fill="none"/>
                            <circle cx="16" cy="10" r="1" fill="#00CED1"/>
                            <circle cx="22" cy="6" r="0.5" fill="#00CED1"/>
                            <circle cx="20" cy="6" r="0.5" fill="#00CED1"/>
                            <circle cx="18" cy="6" r="0.5" fill="#00CED1"/>
                        </g>
                        {/* PHOTOGRAPH Text */}
                        <text x="32" y="22" fontFamily="Arial, sans-serif" fontSize="12" fontWeight="600" fill="#262626" letterSpacing="1px">
                            PHOTOGRAPH
                        </text>
                    </svg>
                </Link>
                
                <div className="mobile-search">
                    <div className="search-input">
                        <svg className="search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none">
                            <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        <span className="search-placeholder">Search</span>
                    </div>
                </div>
                
                <button className="mobile-notifications">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" stroke="currentColor" strokeWidth="2" fill="none"/>
                    </svg>
                </button>
            </div>
        </header>
    )
}
