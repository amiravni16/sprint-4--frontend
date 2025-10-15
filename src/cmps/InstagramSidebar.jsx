import { Link, NavLink } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router'

export function InstagramSidebar() {
    const user = useSelector(storeState => storeState.userModule.user)
    const navigate = useNavigate()
    
    // Debug user data

    return (
        <aside className="instagram-sidebar">
            <div className="sidebar-content">
                <div className="logo-section">
                    <Link to="/" className="instagram-logo" aria-label="Instagram home">
                        <img src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png" alt="Instagram" style={{height: '32px', display: 'block'}} />
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
        </aside>
    )

    function handleCreatePost() {
        if (!user) {
            navigate('/auth/login')
            return
        }
        
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
