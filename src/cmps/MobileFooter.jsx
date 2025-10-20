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
                <NavLink to="/" className="mobile-nav-item">
                    <svg className="nav-icon" width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path d="M9 21v-7h6v7h5a1 1 0 0 0 1-1V10.8l-9-6.3-9 6.3V20a1 1 0 0 0 1 1h5z" fill="currentColor"/>
                    </svg>
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
                            src={user?.imgUrl || 'https://i.pravatar.cc/24?img=1'} 
                            alt="Profile"
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
