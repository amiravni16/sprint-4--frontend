import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { loadPosts, addPost } from '../store/actions/post.actions'
import { showSuccessMsg, showErrorMsg } from '../services/event-bus.service'
import { addPostMsg } from '../store/actions/post.actions'
import { PostList } from '../cmps/PostList'
import { postService } from '../services/post'
import { userService } from '../services/user'
import { login, signup } from '../store/actions/user.actions'
import { store } from '../store/store'

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
            
            // Simple storage clear function for development
            window.clearStorage = () => {
                localStorage.clear()
                sessionStorage.clear()
                console.log('🗑️ Storage cleared! Reloading...')
                setTimeout(() => window.location.reload(), 500)
            }
            
            // Force clean admin user creation
            window.forceCleanAdmin = async () => {
                try {
                    const { userService } = await import('../services/user')
                    const all = await userService.getUsers()
                    const duplicates = all.filter(u => u.username === 'amir.avni')
                    console.log('🔍 Found duplicate admin users:', duplicates.length)
                    
                    // Remove all duplicates
                    for (const user of duplicates) {
                        try {
                            await userService.remove(user._id)
                            console.log('🗑️ Removed:', user._id)
                        } catch (e) {
                            console.log('⚠️ Could not remove:', user._id)
                        }
                    }
                    
                    // Force recreate admin
                    localStorage.removeItem('user')
                    console.log('🔄 Forcing admin recreation...')
                    window.location.reload()
                } catch (err) {
                    console.error('Error cleaning admin:', err)
                }
            }
            
        }

    useEffect(() => {
        loadPosts(filterBy)
    }, [filterBy])

    // Auto-login for testing purposes
    useEffect(() => {
        if (!user) {
            autoLoginForTesting()
        }
    }, [user])
    

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
                { username: 'amir.avni', password: 'admin' },
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
                        username: 'amir.avni',
                        password: 'admin',
                        fullname: 'Amir Avni',
                        imgUrl: 'https://i.pravatar.cc/150?img=1',
                        isAdmin: true
                    }
                    const savedUser = await signup(defaultUser)
                    console.log('✅ Created user:', savedUser)
                    console.log('Profile picture URL:', savedUser.imgUrl)
                    showSuccessMsg('Created and logged in as amir.avni! 🧪')
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


    return (
        <div className="instagram-home">
            <div className="feed-container">
                {posts && posts.length > 0 ? (
                    <PostList 
                        posts={posts}
                        onLike={onLike}
                        onComment={onComment}
                    />
                ) : (
                    <div className="empty-feed">
                        <div className="empty-feed-content">
                            <h2>Welcome to Instagram</h2>
                            {user ? (
                                <div>
                                    <p>Share photos and videos with friends and family.</p>
                                    <button 
                                        onClick={onCreatePost}
                                        className="create-post-btn"
                                    >
                                        Create your first post
                                    </button>
                                </div>
                            ) : (
                            <div>
                                <p>Sign up to see photos and videos from your friends.</p>
                                <div className="auth-buttons">
                                    <button 
                                        onClick={autoLoginForTesting}
                                        className="test-login-btn"
                                    >
                                        Test Login
                                    </button>
                                    <button 
                                        onClick={() => window.location.href = '/auth/login'}
                                        className="login-btn"
                                    >
                                        Log In
                                    </button>
                                    <button 
                                        onClick={() => window.location.href = '/auth/signup'}
                                        className="signup-btn"
                                    >
                                        Sign Up
                                    </button>
                                    <button 
                                        onClick={() => {
                                            localStorage.clear()
                                            sessionStorage.clear()
                                            window.location.reload()
                                        }}
                                        className="clear-storage-btn"
                                    >
                                        Clear Storage & Reload
                                    </button>
                                </div>
                            </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
            
        </div>
    )
}

