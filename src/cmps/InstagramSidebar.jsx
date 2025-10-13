import { Link, NavLink } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router'

export function InstagramSidebar() {
    const user = useSelector(storeState => storeState.userModule.user)
    const navigate = useNavigate()
    
    // Debug user data
    console.log('Sidebar user:', user)
    console.log('Profile picture URL:', user?.imgUrl)

    return (
        <aside className="instagram-sidebar">
            <div className="sidebar-content">
                <div className="logo-section">
                    <Link to="/" className="instagram-logo">
                        Instagram
                    </Link>
                </div>
                
                <nav className="sidebar-nav">
                    <NavLink to="/" className="nav-item">
                        <svg className="nav-icon" width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" fill="currentColor"/>
                        </svg>
                        <span>Home</span>
                    </NavLink>

                    <NavLink to="/search" className="nav-item">
                        <svg className="nav-icon" width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <path d="M19 10.5A8.5 8.5 0 1 1 10.5 2a8.5 8.5 0 0 1 0 17ZM10.5 4a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13Z" fill="currentColor"/>
                            <path d="M2.5 21.5l6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                        </svg>
                        <span>Search</span>
                    </NavLink>

                    <button 
                        className="nav-item create-btn"
                        onClick={handleCreatePost}
                    >
                        <svg className="nav-icon" width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <rect x="3" y="3" width="18" height="18" stroke="currentColor" strokeWidth="1.5" fill="none"/>
                            <path d="M12 8v8M8 12h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                        </svg>
                        <span>Create</span>
                    </button>

                    <NavLink to={`/user/${user?._id || 'profile'}`} className="nav-item">
                        <div className="profile-avatar">
                            <img 
                                src="https://randomuser.me/api/portraits/men/1.jpg" 
                                alt={user?.fullname || 'User'}
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover',
                                    borderRadius: '50%',
                                    display: 'block',
                                    backgroundColor: '#f0f0f0'
                                }}
                                onError={(e) => {
                                    console.log('❌ Image failed to load:', e.target.src)
                                    e.target.style.display = 'none'
                                    e.target.nextSibling.style.display = 'flex'
                                }}
                                onLoad={(e) => {
                                    console.log('✅ Image loaded successfully:', e.target.src)
                                }}
                            />
                            <div 
                                style={{ 
                                    width: '100%', 
                                    height: '100%', 
                                    borderRadius: '50%', 
                                    backgroundColor: '#4A90E2',
                                    display: 'none',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: 'white',
                                    fontSize: '12px',
                                    fontWeight: 'bold'
                                }}
                            >
                                {user?.fullname ? user.fullname.charAt(0) : 'A'}
                            </div>
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
