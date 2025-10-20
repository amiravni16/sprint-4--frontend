import { Link, NavLink } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router'
import { useState } from 'react'
import { UploadModal } from './UploadModal'

export function InstagramSidebar() {
    const user = useSelector(storeState => storeState.userModule.user)
    const navigate = useNavigate()
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
    
    // Debug user data

    return (
        <aside className="instagram-sidebar">
            <div className="sidebar-content">
                <div className="logo-section">
                    <Link to="/" className="instagram-logo" aria-label="Instagram home">
                        <svg width="160" height="40" viewBox="0 0 160 40" fill="none">
                            {/* Camera Icon */}
                            <g transform="translate(0, 12)">
                                <path d="M8 4C6.89543 4 6 4.89543 6 6V14C6 15.1046 6.89543 16 8 16H24C25.1046 16 26 15.1046 26 14V6C26 4.89543 25.1046 4 24 4H22.5L22 2H10L9.5 4H8Z" stroke="#00CED1" strokeWidth="2" fill="none"/>
                                <circle cx="16" cy="10" r="3" stroke="#00CED1" strokeWidth="2" fill="none"/>
                                <circle cx="16" cy="10" r="1" fill="#00CED1"/>
                                <circle cx="22" cy="6" r="0.5" fill="#00CED1"/>
                                <circle cx="20" cy="6" r="0.5" fill="#00CED1"/>
                                <circle cx="18" cy="6" r="0.5" fill="#00CED1"/>
                            </g>
                            {/* PHOTOGRAPH Text */}
                            <text x="36" y="28" fontFamily="Arial, sans-serif" fontSize="14" fontWeight="600" fill="#262626" letterSpacing="1px">
                                PHOTOGRAPH
                            </text>
                        </svg>
                    </Link>
                    <Link to="/" className="instagram-logo-icon" aria-label="Instagram home">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <rect x="2" y="2" width="20" height="20" rx="5" stroke="currentColor" strokeWidth="2"/>
                            <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="2"/>
                            <circle cx="17" cy="7" r="1.5" fill="currentColor"/>
                        </svg>
                    </Link>
                </div>
                
                <nav className="sidebar-nav">
                    <NavLink to="/" className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}>
                        {({ isActive }) => (
                            <>
                                <svg className="nav-icon" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                    {isActive ? (
                                        // Filled home icon
                                        <path d="M9 21v-7h6v7h5a1 1 0 0 0 1-1V10.8l-9-6.3-9 6.3V20a1 1 0 0 0 1 1h5z" fill="currentColor"/>
                                    ) : (
                                        // Outline home icon
                                        <path d="M3 20a1 1 0 0 0 1 1h5v-7h6v7h5a1 1 0 0 0 1-1V10.8l-9-6.3-9 6.3V20z" stroke="currentColor" strokeWidth="2" fill="none" strokeLinejoin="round"/>
                                    )}
                                </svg>
                                <span>Home</span>
                            </>
                        )}
                    </NavLink>

                    <NavLink to="/search" className="nav-item">
                        <svg className="nav-icon" width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        <span>Search</span>
                    </NavLink>

                    <button 
                        className="nav-item create-btn"
                        onClick={handleCreatePost}
                    >
                        <svg className="nav-icon" width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2" fill="none"/>
                            <path d="M12 8v8M8 12h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                        </svg>
                        <span>Create</span>
                    </button>

                    <NavLink to={`/user/${user?._id || 'profile'}`} className="nav-item">
                        <div className="profile-avatar">
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
                        <span>Profile</span>
                    </NavLink>
                </nav>
            </div>
            <UploadModal 
                isOpen={isCreateModalOpen} 
                onClose={() => setIsCreateModalOpen(false)} 
            />
        </aside>
    )

    function handleCreatePost() {
        if (!user) {
            navigate('/auth/login')
            return
        }
        setIsCreateModalOpen(true)
    }
    
    // Old create post logic (kept for reference)
    function handleCreatePostOld() {
        // Create a new post using the same logic as HomePage
        const post = {
            txt: prompt('What\'s on your mind?', 'Best trip ever!'),
            imgUrl: prompt('Image URL?', 'https://picsum.photos/400/400'),
            tags: []
        }
        
        if (!post.txt || !post.imgUrl) return
        
        const tagsInput = prompt('Tags (comma separated)?', 'fun, travel')
        if (tagsInput) {
            post.tags = tagsInput.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0)
        }
        
        // Import the addPost action and call it
        import('../store/actions/post.actions').then(({ addPost }) => {
            addPost(post).then(() => {
                // Show success message
                import('../services/event-bus.service').then(({ showSuccessMsg }) => {
                    showSuccessMsg('Post created successfully! 🎉')
                })
                // Reload the page to show the new post
                window.location.reload()
            }).catch(err => {
                import('../services/event-bus.service').then(({ showErrorMsg }) => {
                    showErrorMsg('Cannot create post')
                })
            })
        })
    }
}
