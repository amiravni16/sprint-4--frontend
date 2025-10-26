import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { loadPosts, addPost, updatePost, removePost } from '../store/actions/post.actions'
import { addPostMsg } from '../store/actions/post.actions'
import { PostList } from '../cmps/PostList'
import { PostDetailsModal } from '../cmps/PostDetailsModal'
import { PostViewModal } from '../cmps/PostViewModal'
import { postService } from '../services/post'
import { userService } from '../services/user'
import { feedService } from '../services/feed.service'
import { login, signup } from '../store/actions/user.actions'
import { store } from '../store/store'

export function HomePage() {
    const [filterBy, setFilterBy] = useState({ txt: '', sortField: '', sortDir: '' })
    const posts = useSelector(storeState => storeState.postModule.posts)
    const user = useSelector(storeState => storeState.userModule.user)
    const [editingPost, setEditingPost] = useState(null)
    const [viewingPost, setViewingPost] = useState(null)

        // Expose storage clear function to window for console access
        if (typeof window !== 'undefined') {
            // Quick fix for following issue - auto-refresh following on page load
            window.autoFixFollowing = async () => {
                try {
                    console.log('🔧 Auto-fixing following status...')
                    const currentUser = store.getState().userModule.user
                    if (!currentUser) {
                        console.log('❌ No user logged in')
                        return
                    }
                    const updatedUser = await userService.getById(currentUser._id)
                    if (updatedUser && (!updatedUser.following || updatedUser.following.length === 0)) {
                        // Restore demo following relationships
                        updatedUser.following = ['user1', 'user2', 'user3', 'user4', 'user5']
                        await userService.save(updatedUser)
                        store.dispatch({ type: 'SET_USER', user: updatedUser })
                        await loadPosts(filterBy)
                        console.log('✅ Following status auto-fixed!')
                        console.log('👥 Now following:', updatedUser.following)
                    } else {
                        console.log('✅ User already following people:', updatedUser.following)
                    }
                } catch (err) {
                    console.error('Error auto-fixing following:', err)
                }
            }
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
            
            // Demo data management
            window.resetToDemo = () => {
                console.log('🔄 Resetting to demo data...')
                localStorage.clear()
                sessionStorage.clear()
                window.location.reload()
            }
            
            window.refreshPosts = async () => {
                try {
                    await loadPosts(filterBy)
                    console.log('🔄 Posts refreshed!')
                } catch (err) {
                    console.error('Error refreshing posts:', err)
                }
            }
            
            window.checkData = async () => {
                try {
                    // Check raw localStorage
                    const rawUsers = localStorage.getItem('user')
                    const rawPosts = localStorage.getItem('post')
                    console.log('📦 Raw localStorage user:', rawUsers ? JSON.parse(rawUsers).length : 0)
                    console.log('📦 Raw localStorage post:', rawPosts ? JSON.parse(rawPosts).length : 0)
                    
                    // Check via services
                    const users = await userService.getUsers()
                    const posts = await postService.query()
                    console.log('👥 Users from service:', users.length, users)
                    console.log('📝 Posts from service:', posts.length, posts)
                    console.log('🔍 Current filter:', filterBy)
                    console.log('👤 Current user:', user)
                    console.log('📊 Redux posts state:', posts)
                } catch (err) {
                    console.error('Error checking data:', err)
                }
            }
            
            window.refreshFollowing = async () => {
                try {
                    console.log('🔄 Refreshing following status...')
                    const updatedUser = await userService.getById(user._id)
                    store.dispatch({ type: 'SET_USER', user: updatedUser })
                    await loadPosts(filterBy)
                    console.log('✅ Following status refreshed!')
                    console.log('👤 Updated user:', updatedUser)
                    console.log('👥 Following:', updatedUser.following)
                } catch (err) {
                    console.error('Error refreshing following:', err)
                }
            }
            
            // Debug function to check feed status
            window.debugFeed = async () => {
                try {
                    console.log('🔍 Debugging feed status...')
                    const state = store.getState()
                    const currentUser = state.userModule.user
                    const currentPosts = state.postModule.posts
                    
                    console.log('👤 Current user:', currentUser)
                    console.log('👥 Following:', currentUser?.following)
                    console.log('📝 Current posts in state:', currentPosts?.length)
                    console.log('📝 Posts:', currentPosts)
                    
                    // Check all posts in storage
                    const allPosts = await postService.query()
                    console.log('📦 All posts in storage:', allPosts.length)
                    console.log('📦 All posts:', allPosts)
                    
                    // Check users in storage
                    const allUsers = await userService.getUsers()
                    console.log('👥 All users in storage:', allUsers.length)
                    console.log('👥 Users:', allUsers)
                    
                } catch (err) {
                    console.error('Error debugging feed:', err)
                }
            }
            
        }

    useEffect(() => {
        loadPosts(filterBy)
        
        // Auto-fix following status if user is loaded but not following enough people
        if (user && user.username === 'amir.avni' && (!user.following || user.following.length < 5)) {
            console.log('🔧 Auto-fixing following status for amir.avni...')
            autoFixFollowing()
        }
        
        // Profile picture fix disabled - let user keep their chosen profile picture
        // if (user && user.username === 'amir.avni' && user.imgUrl !== '/img/amir-avni.jpg.jpg') {
        //     console.log('🔧 Fixing profile picture for amir.avni...')
        //     fixProfilePicture()
        // }
    }, [filterBy, user])

    // Auto-login on mount
    useEffect(() => {
        if (!user) {
            autoLoginForTesting()
        }
    }, [])
    
    async function autoFixFollowing() {
        try {
            console.log('🔧 Auto-fixing following status...')
            const updatedUser = await userService.getById(user._id)
            if (updatedUser && (!updatedUser.following || updatedUser.following.length < 5)) {
                console.log(`📊 Current following count: ${updatedUser.following?.length || 0}, expected: 5`)
                // Restore demo following relationships - amir.avni should follow these 5 users
                updatedUser.following = ['user1', 'user2', 'user3', 'user4', 'user5']
                await userService.update(updatedUser)
                store.dispatch({ type: 'SET_USER', user: updatedUser })
                console.log('✅ Following status auto-fixed!')
                console.log('👥 Now following:', updatedUser.following)
                // Reload posts after fixing following relationships
                await loadPosts(filterBy)
            } else if (updatedUser) {
                console.log('✅ User already has correct following relationships:', updatedUser.following)
            }
        } catch (err) {
            console.error('Error auto-fixing following:', err)
        }
    }

    async function fixProfilePicture() {
        try {
            console.log('🔧 Fixing profile picture for amir.avni...')
            const freshUser = await userService.getById(user._id)
            if (freshUser && freshUser.username === 'amir.avni') {
                // Update the user data with correct profile picture
                freshUser.imgUrl = '/img/amir-avni.jpg.jpg'
                const updatedUser = await userService.update(freshUser)
                
                // Update Redux store
                store.dispatch({ type: 'SET_USER', user: updatedUser })
                
                // Update sessionStorage directly
                userService.saveLoggedinUser(updatedUser)
                
                console.log('✅ Profile picture fixed for amir.avni!')
                console.log('🖼️ Profile picture URL:', updatedUser.imgUrl)
            }
        } catch (err) {
            console.error('Error fixing profile picture:', err)
        }
    }

    async function autoLoginForTesting() {
        try {
            // Demo data is initialized by async-storage.service.js
            // No need to check or reset storage here

            // Try different test users in order
            const testUsers = [
                { username: 'amir.avni', password: 'admin' },
                { username: 'admin', password: 'admin' },
                { username: 'testuser', password: '123' },
                { username: 'user1', password: 'user1' },
                { username: 'guest', password: 'guest' }
            ]

            let loginSuccess = false
            let loggedInUser = null
            for (const testUser of testUsers) {
                try {
                    loggedInUser = await login(testUser)
                    if (loggedInUser) {
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
                    imgUrl: '/img/amir-avni.jpg.jpg',
                    isAdmin: true
                }
                    loggedInUser = await signup(defaultUser)
                    console.log('✅ Created user:', loggedInUser)
                    console.log('Profile picture URL:', loggedInUser.imgUrl)
                } catch (signupErr) {
                    console.log('Failed to create test user:', signupErr)
                }
            }

            // Auto-follow all other users so you can see their posts (only if not already following)
            if (loggedInUser) {
                try {
                    const allUsers = await userService.getUsers()
                    const otherUsers = allUsers.filter(u => u._id !== loggedInUser._id)
                    const following = loggedInUser.following || []
                    
                    for (const otherUser of otherUsers) {
                        // Only follow if not already following
                        if (!following.includes(otherUser._id)) {
                            try {
                                await userService.toggleFollow(otherUser._id)
                                console.log(`✅ Auto-followed ${otherUser.username}`)
                            } catch (err) {
                                console.log(`Failed to follow ${otherUser.username}:`, err)
                            }
                        }
                    }
                    
                    // Reload the user to get updated following list
                    const updatedUser = await userService.getById(loggedInUser._id)
                    store.dispatch({ type: 'SET_USER', user: updatedUser })
                } catch (err) {
                    console.log('Failed to auto-follow users:', err)
                }
            }
        } catch (err) {
            console.log('Auto-login failed completely:', err)
            showErrorMsg('Auto-login failed. Please login manually.')
        }
    }

    async function onLike(postId) {
        if (!user) {
            showErrorMsg('Please login to like posts')
            return
        }

        try {
            // Find the post in the current posts array
            const post = posts.find(p => p._id === postId)
            if (!post) {
                showErrorMsg('Post not found')
                return
            }

            // Initialize likedBy array if it doesn't exist
            const likedBy = post.likedBy || []
            const isCurrentlyLiked = likedBy.includes(user._id)

            let updatedLikedBy
            if (isCurrentlyLiked) {
                // Unlike: remove user from likedBy array
                updatedLikedBy = likedBy.filter(id => id !== user._id)
            } else {
                // Like: add user to likedBy array
                updatedLikedBy = [...likedBy, user._id]
            }

            // Update the post with new like status
            const updatedPost = {
                ...post,
                likedBy: updatedLikedBy
            }

            await updatePost(updatedPost)
            
        } catch (err) {
            console.error('Error toggling like:', err)
        }
    }

    async function onComment(postId, commentText) {
        try {
            await addPostMsg(postId, commentText)
        } catch (err) {
        }
    }

    function onOpenPostDetails(post) {
        setViewingPost(post)
    }

    function onClosePostDetails() {
        setViewingPost(null)
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
            // Reload posts to show the new one
            loadPosts(filterBy)
        } catch (err) {
        }
    }

    async function onDeletePost(postId) {
        try {
            await removePost(postId)
            // Reload posts to reflect the deletion
            loadPosts(filterBy)
        } catch (err) {
        }
    }

    async function onEditPost(post) {
        // Open edit modal with post data
        setEditingPost(post)
    }

    async function onSaveEdit(postData) {
        try {
            // Update the post with new data
            const updatedPost = {
                ...editingPost,
                txt: postData.caption || editingPost.txt,
                imgUrl: postData.image || editingPost.imgUrl
            }
            await updatePost(updatedPost)
            setEditingPost(null)
            // Reload posts to reflect the update
            loadPosts(filterBy)
        } catch (err) {
        }
    }

    function onCancelEdit() {
        setEditingPost(null)
    }


    return (
        <div className="instagram-home">
            <div className="feed-container">
                {posts && posts.length > 0 ? (
                    <PostList 
                        posts={posts}
                        onLike={onLike}
                        onComment={onComment}
                        onDelete={onDeletePost}
                        onEdit={onEditPost}
                        onOpenDetails={onOpenPostDetails}
                        user={user}
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

            {/* Edit Post Modal */}
            {editingPost && (
                <PostDetailsModal
                    croppedImage={editingPost.imgUrl}
                    caption={editingPost.txt}
                    onClose={onCancelEdit}
                    onPost={onSaveEdit}
                    onUpdate={updatePost}
                    isEditMode={true}
                />
            )}

            {/* Post View Modal */}
            {viewingPost && (
                <PostViewModal
                    isOpen={!!viewingPost}
                    onClose={onClosePostDetails}
                    post={viewingPost}
                    onLike={onLike}
                    onDelete={onDeletePost}
                    onEdit={onEditPost}
                    onUpdate={updatePost}
                    onPostUnsaved={() => {}} // No saved posts functionality in HomePage
                />
            )}
        </div>
    )
}

