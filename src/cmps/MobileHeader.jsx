import { Link } from 'react-router-dom'

export function MobileHeader() {
    return (
        <header className="mobile-header">
            <div className="mobile-header-content">
                <Link to="/" className="mobile-logo">
                    <img 
                        src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png" 
                        alt="Instagram" 
                        style={{ height: '29px' }}
                    />
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
