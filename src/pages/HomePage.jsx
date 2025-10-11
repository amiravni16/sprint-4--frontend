import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { loadPosts, addPost } from '../store/actions/post.actions'
import { showSuccessMsg, showErrorMsg } from '../services/event-bus.service'
import { addPostMsg } from '../store/actions/post.actions'
import { PostList } from '../cmps/PostList'
import { postService } from '../services/post'
import { userService } from '../services/user'
import { login, signup } from '../store/actions/user.actions'

export function HomePage() {
    const [filterBy, setFilterBy] = useState({ txt: '', sortField: '', sortDir: '' })
    const posts = useSelector(storeState => storeState.postModule.posts)
    const user = useSelector(storeState => storeState.userModule.user)

    // Expose storage clear function to window for console access
    if (typeof window !== 'undefined') {
        window.clearInstagramStorage = () => {
            localStorage.clear()
            sessionStorage.clear()
            console.log('✅ Instagram storage cleared! Reload the page.')
        }
    }

    useEffect(() => {
        console.log('HomePage: Loading posts with filter:', filterBy)
        loadPosts(filterBy)
    }, [filterBy])

    useEffect(() => {
        console.log('HomePage: Posts loaded:', posts)
    }, [posts])

    // Auto-login for testing purposes
    useEffect(() => {
        if (!user) {
            autoLoginForTesting()
        }
    }, [])

    async function autoLoginForTesting() {
        try {
            // First, check if localStorage has valid data structure
            const usersData = localStorage.getItem('user')
            if (!usersData || usersData === 'null' || usersData === 'undefined') {
                console.log('Initializing localStorage with empty user array')
                localStorage.setItem('user', JSON.stringify([]))
            }

            // Also initialize post storage
            const postsData = localStorage.getItem('post')
            if (!postsData || postsData === 'null' || postsData === 'undefined') {
                console.log('Initializing localStorage with empty post array')
                localStorage.setItem('post', JSON.stringify([]))
            }

            // Try different test users in order
            const testUsers = [
                { username: 'admin', password: 'admin' },
                { username: 'testuser', password: '123' },
                { username: 'user1', password: 'user1' },
                { username: 'guest', password: 'guest' }
            ]

            let loginSuccess = false
            for (const testUser of testUsers) {
                try {
                    const loggedInUser = await login(testUser)
                    if (loggedInUser) {
                        showSuccessMsg(`Auto-logged in as ${testUser.username} for development! 🧪`)
                        loginSuccess = true
                        break
                    }
                } catch (err) {
                    console.log(`Failed to login as ${testUser.username}:`, err)
                }
            }

            if (!loginSuccess) {
                // Create a default test user
                try {
                    const defaultUser = {
                        username: 'admin',
                        password: 'admin',
                        fullname: 'Test Admin',
                        imgUrl: 'https://cdn.pixabay.com/photo/2020/07/01/12/58/icon-5359553_1280.png',
                        isAdmin: true
                    }
                    await signup(defaultUser)
                    showSuccessMsg('Created and logged in as admin user! 🧪')
                } catch (signupErr) {
                    console.log('Failed to create test user:', signupErr)
                    showErrorMsg('Failed to auto-login. Please use the signup page to create an account.')
                }
            }
        } catch (err) {
            console.log('Auto-login failed completely:', err)
            showErrorMsg('Auto-login failed. Please login manually.')
        }
    }

    async function onLike(postId) {
        try {
            showSuccessMsg('Post liked! ❤️')
        } catch (err) {
            showErrorMsg('Cannot like post')
        }
    }

    async function onComment(postId, commentText) {
        try {
            await addPostMsg(postId, commentText)
            showSuccessMsg('Comment added! 💬')
        } catch (err) {
            showErrorMsg('Cannot add comment')
        }
    }

    async function onCreatePost() {
        // Check if user is logged in
        if (!user) {
            showErrorMsg('Please login to create posts')
            return
        }

        const post = postService.getEmptyPost()
        post.txt = prompt('What\'s on your mind?', 'Best trip ever!')
        if (!post.txt) return
        
        post.imgUrl = prompt('Image URL?', 'https://picsum.photos/400/400')
        if (!post.imgUrl) return
        
        const tagsInput = prompt('Tags (comma separated)?', 'fun, travel')
        if (tagsInput) {
            post.tags = tagsInput.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0)
        }
        
        try {
            const savedPost = await addPost(post)
            showSuccessMsg(`Post created successfully! 🎉`)
            // Reload posts to show the new one
            loadPosts(filterBy)
        } catch (err) {
            showErrorMsg('Cannot create post')
        }
    }

    function clearStorageForDev() {
        if (confirm('Clear all localStorage data? This will delete all users and posts.')) {
            localStorage.clear()
            sessionStorage.clear()
            showSuccessMsg('Storage cleared! Refreshing page...')
            setTimeout(() => window.location.reload(), 1000)
        }
    }

    return (
        <section className="home-page">
            <div className="home-feed">
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    background: 'white',
                    padding: '16px',
                    borderRadius: '8px',
                    border: '1px solid #dbdbdb',
                    marginBottom: '24px',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                }}>
                    <h1 style={{ margin: 0, color: '#262626' }}>
                        Instagram Feed
                    </h1>
                    <div style={{ display: 'flex', gap: '8px' }}>
                        {user && (
                            <button 
                                onClick={onCreatePost}
                                style={{
                                    background: '#0095f6',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '8px',
                                    padding: '8px 16px',
                                    fontSize: '14px',
                                    fontWeight: '600',
                                    cursor: 'pointer'
                                }}
                            >
                                ➕ Create Post
                            </button>
                        )}
                        <button 
                            onClick={clearStorageForDev}
                            style={{
                                background: '#dc3545',
                                color: 'white',
                                border: 'none',
                                borderRadius: '8px',
                                padding: '8px 16px',
                                fontSize: '12px',
                                fontWeight: '600',
                                cursor: 'pointer'
                            }}
                            title="Clear localStorage and sessionStorage (Dev only)"
                        >
                            🗑️ Clear Storage
                        </button>
                    </div>
                </div>
                {posts && posts.length > 0 ? (
                    <PostList 
                        posts={posts}
                        onLike={onLike}
                        onComment={onComment}
                    />
                ) : (
                    <div style={{ 
                        textAlign: 'center', 
                        padding: '40px', 
                        background: 'white', 
                        borderRadius: '8px', 
                        border: '1px solid #dbdbdb',
                        marginBottom: '24px'
                    }}>
                        <h3>No posts yet!</h3>
                        {user ? (
                            <p>Create your first post to get started.</p>
                        ) : (
                            <div>
                                <p>Login to create posts and join the community!</p>
                                <p style={{ fontSize: '12px', color: '#8e8e8e', marginTop: '8px' }}>
                                    Development mode: Click "Test Login" for quick testing
                                </p>
                            </div>
                        )}
                        {user ? (
                            <button 
                                onClick={onCreatePost}
                                style={{
                                    background: '#0095f6',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '8px',
                                    padding: '12px 24px',
                                    fontSize: '14px',
                                    fontWeight: '600',
                                    cursor: 'pointer',
                                    marginTop: '16px'
                                }}
                            >
                                Create Post
                            </button>
                        ) : (
                            <div style={{ marginTop: '16px' }}>
                                <button 
                                    onClick={autoLoginForTesting}
                                    style={{
                                        background: '#28a745',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '8px',
                                        padding: '12px 24px',
                                        fontSize: '14px',
                                        fontWeight: '600',
                                        cursor: 'pointer',
                                        marginRight: '8px',
                                        marginBottom: '8px'
                                    }}
                                >
                                    🧪 Test Login
                                </button>
                                <button 
                                    onClick={() => window.location.href = '/auth/login'}
                                    style={{
                                        background: '#0095f6',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '8px',
                                        padding: '12px 24px',
                                        fontSize: '14px',
                                        fontWeight: '600',
                                        cursor: 'pointer',
                                        marginRight: '8px',
                                        marginBottom: '8px'
                                    }}
                                >
                                    Login
                                </button>
                                <button 
                                    onClick={() => window.location.href = '/auth/signup'}
                                    style={{
                                        background: 'transparent',
                                        color: '#0095f6',
                                        border: '1px solid #0095f6',
                                        borderRadius: '8px',
                                        padding: '12px 24px',
                                        fontSize: '14px',
                                        fontWeight: '600',
                                        cursor: 'pointer',
                                        marginBottom: '8px'
                                    }}
                                >
                                    Sign Up
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </section>
    )
}

