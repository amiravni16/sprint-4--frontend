import { Link, NavLink } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router'
import { useState } from 'react'
import { UploadModal } from './UploadModal'
import { SearchModal } from './SearchModal'

export function InstagramSidebar() {
    const user = useSelector(storeState => storeState.userModule.user)
    const navigate = useNavigate()
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
    const [isSearchModalOpen, setIsSearchModalOpen] = useState(false)
    
    // Debug user data

    return (
        <>
            <aside className={`instagram-sidebar ${isSearchModalOpen ? 'compact' : ''}`}>
                <div className="sidebar-content">
                    <div className="logo-section">
                        <Link to="/" className="instagram-logo" aria-label="Instagram home">
                            <img 
                                src="/src/assets/icons/photograph-logo.svg" 
                                alt="photograph" 
                                className="logo-svg"
                            />
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
                                            fill="currentColor"
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
                                    <span>Home</span>
                                </>
                            )}
                        </NavLink>

                        <button 
                            className={`nav-item ${isSearchModalOpen ? 'active' : ''}`}
                            onClick={() => setIsSearchModalOpen(true)}
                        >
                            <svg className="nav-icon" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                            <span>Search</span>
                        </button>

                        <NavLink to="/explore" className="nav-item">
                            <svg className="nav-icon" width="24" height="24" viewBox="0 0 512 512" fill="currentColor">
                                <path d="M256,0C114.6,0,0,114.6,0,256s114.6,256,256,256s256-114.6,256-256S397.4,0,256,0z M256,472.6 c-119.6,0-216.6-97-216.6-216.6S136.4,39.4,256,39.4s216.6,97,216.6,216.6S375.6,472.6,256,472.6z M118.2,393.8l187.1-88.6 l88.6-187.1l-187.1,88.6L118.2,393.8z M285.5,285.5l-118.2,59.1l59.1-118.2L285.5,285.5z"/>
                            </svg>
                            <span>Explore</span>
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
                        <span>Profile</span>
                    </NavLink>
                    </nav>
                </div>
            </aside>
            <UploadModal 
                isOpen={isCreateModalOpen} 
                onClose={() => setIsCreateModalOpen(false)} 
            />
            <SearchModal 
                isOpen={isSearchModalOpen} 
                onClose={() => setIsSearchModalOpen(false)} 
            />
        </>
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
