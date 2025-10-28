import { NavLink, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useState } from 'react'
import { UploadModal } from './UploadModal'

export function MobileFooter() {
    const user = useSelector(storeState => storeState.userModule.user)
    const navigate = useNavigate()
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
    
    function handleCreateClick(e) {
        e.preventDefault()
        if (!user) {
            navigate('/auth/login')
            return
        }
        setIsCreateModalOpen(true)
    }

    return (
        <footer className="mobile-footer">
            <nav className="mobile-nav">
                <NavLink to="/" className="mobile-nav-item" end>
                    <svg
                        className="nav-icon home-icon"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                    >
                        <path
                            className="home-fill"
                            d="M4 10L12 3L20 10L20 20H15V16C15 15.2044 14.6839 14.4413 14.1213 13.8787C13.5587 13.3161 12.7957 13 12 13C11.2044 13 10.4413 13.3161 9.87868 13.8787C9.31607 14.4413 9 15.2043 9 16V20H4L4 10Z"
                        />
                        <path
                            className="home-stroke"
                            d="M3.99999 10L12 3L20 10L20 20H15V16C15 15.2044 14.6839 14.4413 14.1213 13.8787C13.5587 13.3161 12.7956 13 12 13C11.2043 13 10.4413 13.3161 9.87868 13.8787C9.31607 14.4413 9 15.2043 9 16V20H4L3.99999 10Z"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            fill="none"
                        />
                    </svg>
                </NavLink>

                <NavLink to="/explore" className="mobile-nav-item">
                    {({ isActive }) => (
                        <img
                            className="nav-icon"
                            src={isActive ? '/compas-onclick.svg' : '/compass.svg'}
                            alt="Explore"
                            width="24"
                            height="24"
                            style={{
                                transform: isActive ? 'none' : 'rotate(180deg)'
                            }}
                        />
                    )}
                </NavLink>

                <button onClick={handleCreateClick} className="mobile-nav-item">
                    <svg className="nav-icon" width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2"/>
                        <path d="M12 8v8M8 12h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                </button>

                <NavLink to={`/user/${user?._id || 'profile'}`} className="mobile-nav-item">
                    <div className="mobile-profile-avatar">
                        <img 
                            src={user?.imgUrl || '/img/amir-avni.jpg.jpg'} 
                            alt="Profile"
                            onError={(e) => {
                                e.target.src = '/img/amir-avni.jpg.jpg';
                            }}
                            style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                                borderRadius: '50%',
                                display: 'block'
                            }}
                        />
                    </div>
                </NavLink>
            </nav>
            <UploadModal 
                isOpen={isCreateModalOpen} 
                onClose={() => setIsCreateModalOpen(false)} 
            />
        </footer>
    )
}
