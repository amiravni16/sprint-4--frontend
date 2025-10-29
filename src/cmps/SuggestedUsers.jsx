import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { userService } from '../services/user'
import { useCurrentUser } from '../customHooks/useCurrentUser'

export function SuggestedUsers() {
    const [suggestedUsers, setSuggestedUsers] = useState([])
    const [loading, setLoading] = useState(true)
    const loggedInUser = useSelector(stateState => stateState.userModule.user)
    const navigate = useNavigate()

    useEffect(() => {
        // Load suggested users immediately
        loadSuggestedUsers()
        
        // Ensure demo users exist in the background (non-blocking)
        ensureDemoUsersExist()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [loggedInUser?._id])

    async function ensureDemoUsersExist() {
        try {
            // Check if we have the new demo users
            const allUsers = await userService.getUsers()
            const existingUserIds = allUsers.map(u => u._id)
            
            // New users we added
            const newUsers = [
                { _id: 'user7', username: 'david_music', fullname: 'David Rodriguez', imgUrl: 'https://i.pravatar.cc/150?img=7', bio: '🎵 Music Producer | LA Studio Sessions', password: 'demo123', isAdmin: false, followers: ['user1', 'user3', 'user8'], following: ['user1', 'user2', 'user9'], savedPosts: [] },
                { _id: 'user8', username: 'jessica_yoga', fullname: 'Jessica Williams', imgUrl: 'https://i.pravatar.cc/150?img=8', bio: '🧘‍♀️ Yoga Instructor | Mind • Body • Soul', password: 'demo123', isAdmin: false, followers: ['user2', 'user7', 'user9'], following: ['user3', 'user7', 'user10'], savedPosts: [] },
                { _id: 'user9', username: 'carlos_chef', fullname: 'Carlos Mendez', imgUrl: 'https://i.pravatar.cc/150?img=9', bio: '👨‍🍳 Chef | Italian Cuisine Specialist', password: 'demo123', isAdmin: false, followers: ['user7', 'user8', 'user10'], following: ['user1', 'user8'], savedPosts: [] },
                { _id: 'user10', username: 'maya_design', fullname: 'Maya Patel', imgUrl: 'https://i.pravatar.cc/150?img=10', bio: '🎨 UI/UX Designer | Creating beautiful experiences', password: 'demo123', isAdmin: false, followers: ['user8', 'user9'], following: ['user7', 'user9'], savedPosts: [] },
                { _id: 'user11', username: 'tom_outdoor', fullname: 'Tom Anderson', imgUrl: 'https://i.pravatar.cc/150?img=11', bio: '🏔️ Adventure Guide | Capturing nature\'s beauty', password: 'demo123', isAdmin: false, followers: ['user9', 'user12'], following: ['user10', 'user12'], savedPosts: [] },
                { _id: 'user12', username: 'sophie_books', fullname: 'Sophie Turner', imgUrl: 'https://i.pravatar.cc/150?img=12', bio: '📚 Book Reviewer | Literary enthusiast', password: 'demo123', isAdmin: false, followers: ['user10', 'user11'], following: ['user8', 'user11'], savedPosts: [] },
                { _id: 'user13', username: 'jake_skate', fullname: 'Jake Miller', imgUrl: 'https://i.pravatar.cc/150?img=13', bio: '🛹 Pro Skateboarder | Street style vibes', password: 'demo123', isAdmin: false, followers: ['user11', 'user14'], following: ['user12', 'user14'], savedPosts: [] },
                { _id: 'user14', username: 'nina_coffee', fullname: 'Nina Garcia', imgUrl: 'https://i.pravatar.cc/150?img=14', bio: '☕ Coffee Enthusiast | Brewing the perfect cup', password: 'demo123', isAdmin: false, followers: ['user12', 'user13'], following: ['user10', 'user13'], savedPosts: [] }
            ]
            
            // Add missing users WITHOUT changing logged-in session
            const { storageService } = await import('../services/async-storage.service')
            for (const user of newUsers) {
                if (!existingUserIds.includes(user._id)) {
                    // Use storageService.post directly to avoid signup() changing the session
                    await storageService.post('user', user)
                    console.log(`➕ Added missing demo user: ${user.username}`)
                }
            }
            
            // Also add missing posts for the new users
            const { postService } = await import('../services/post')
            const existingPosts = await postService.query()
            const existingPostIds = existingPosts.map(p => p._id)
            
            const newPosts = [
                { _id: 'post8', txt: 'Late night studio session 🎧 New track dropping soon!', imgUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop&crop=center', tags: ['music', 'studio', 'producer'], by: { _id: 'user7', fullname: 'David Rodriguez', username: 'david_music', imgUrl: 'https://i.pravatar.cc/150?img=7' }, likedBy: ['user8', 'user9'], comments: [], createdAt: Date.now() - 2400000 },
                { _id: 'post9', txt: 'Morning yoga flow by the ocean 🧘‍♀️ Find your inner peace', imgUrl: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=400&fit=crop&crop=center', tags: ['yoga', 'meditation', 'wellness'], by: { _id: 'user8', fullname: 'Jessica Williams', username: 'jessica_yoga', imgUrl: 'https://i.pravatar.cc/150?img=8' }, likedBy: ['user7', 'user9', 'user10'], comments: [], createdAt: Date.now() - 3600000 },
                { _id: 'post10', txt: 'Homemade fresh pasta with truffle oil 🍝 Italian tradition meets modern technique', imgUrl: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=400&h=400&fit=crop&crop=center', tags: ['food', 'italian', 'pasta', 'chef'], by: { _id: 'user9', fullname: 'Carlos Mendez', username: 'carlos_chef', imgUrl: 'https://i.pravatar.cc/150?img=9' }, likedBy: ['user8', 'user10'], comments: [], createdAt: Date.now() - 4800000 },
                { _id: 'post11', txt: 'Working on a new mobile app design 📱 Clean, minimal, beautiful', imgUrl: 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=400&h=400&fit=crop&crop=center', tags: ['design', 'ux', 'mobile', 'ui'], by: { _id: 'user10', fullname: 'Maya Patel', username: 'maya_design', imgUrl: 'https://i.pravatar.cc/150?img=10' }, likedBy: ['user9', 'user11'], comments: [], createdAt: Date.now() - 5400000 },
                { _id: 'post12', txt: 'Summit sunrise hike 🏔️ Nothing beats this view at 6000ft', imgUrl: 'https://images.unsplash.com/photo-1464822759844-d150baec0494?w=400&h=400&fit=crop&crop=center', tags: ['hiking', 'adventure', 'mountains', 'sunrise'], by: { _id: 'user11', fullname: 'Tom Anderson', username: 'tom_outdoor', imgUrl: 'https://i.pravatar.cc/150?img=11' }, likedBy: ['user10', 'user12'], comments: [], createdAt: Date.now() - 7200000 },
                { _id: 'post13', txt: 'Currently reading "The Seven Husbands of Evelyn Hugo" 📖 Absolutely captivating!', imgUrl: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=400&fit=crop&crop=center', tags: ['books', 'reading', 'literature'], by: { _id: 'user12', fullname: 'Sophie Turner', username: 'sophie_books', imgUrl: 'https://i.pravatar.cc/150?img=12' }, likedBy: ['user11', 'user13'], comments: [], createdAt: Date.now() - 8640000 },
                { _id: 'post14', txt: 'New trick learned today! 🛹 Street skating never gets old', imgUrl: 'https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=400&h=400&fit=crop&crop=center', tags: ['skateboard', 'street', 'tricks', 'urban'], by: { _id: 'user13', fullname: 'Jake Miller', username: 'jake_skate', imgUrl: 'https://i.pravatar.cc/150?img=13' }, likedBy: ['user12', 'user14'], comments: [], createdAt: Date.now() - 10800000 },
                { _id: 'post15', txt: 'Perfect latte art this morning ☕ The key is in the milk texture', imgUrl: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&h=400&fit=crop&crop=center', tags: ['coffee', 'latte', 'barista', 'art'], by: { _id: 'user14', fullname: 'Nina Garcia', username: 'nina_coffee', imgUrl: 'https://i.pravatar.cc/150?img=14' }, likedBy: ['user13', 'user7'], comments: [], createdAt: Date.now() - 12600000 }
            ]
            
            for (const post of newPosts) {
                if (!existingPostIds.includes(post._id)) {
                    const { storageService } = await import('../services/async-storage.service')
                    await storageService.post('post', post)
                    console.log(`➕ Added missing demo post: ${post._id} by ${post.by.username}`)
                }
            }
            
            console.log('✅ All demo users and posts ensured to exist!')
        } catch (err) {
            console.error('Error ensuring demo users exist:', err)
        }
    }

    async function loadSuggestedUsers() {
        if (!loggedInUser) {
            setLoading(false)
            return
        }

        try {
            // Use cached users from Redux store first
            const { store } = await import('../store/store')
            const state = store.getState()
            let allUsers = state.userModule.users || []
            
            // If no cached users, fetch them and cache in Redux
            if (allUsers.length === 0) {
                allUsers = await userService.getUsers()
                store.dispatch({ type: 'SET_USERS', users: allUsers })
            }
            
            const following = loggedInUser.following || []
            
            // Normalize IDs to strings for comparison
            const normalizeId = (id) => {
                if (id && typeof id === 'object' && id.toString) {
                    return id.toString()
                }
                return String(id)
            }
            
            const loggedInUserIdStr = normalizeId(loggedInUser._id)
            const followingIdsStr = following.map(normalizeId)
            
            // Filter out users already being followed and the logged-in user
            const nonFollowedUsers = allUsers.filter(user => {
                const userIdStr = normalizeId(user._id)
                return userIdStr !== loggedInUserIdStr && !followingIdsStr.includes(userIdStr)
            })

            // Randomize and take 5 users
            const shuffled = nonFollowedUsers.sort(() => Math.random() - 0.5)
            setSuggestedUsers(shuffled.slice(0, 5))
            
            // Fetch fresh users in background to update cache
            if (state.userModule.users.length > 0) {
                userService.getUsers().then(freshUsers => {
                    store.dispatch({ type: 'SET_USERS', users: freshUsers })
                }).catch(() => {}) // Silently fail - we have cached data
            }
        } catch (err) {
            console.error('Error loading suggested users:', err)
        } finally {
            setLoading(false)
        }
    }

    async function handleFollow(userId) {
        try {
            // Prevent self-follow
            const normalizeId = (id) => {
                if (id && typeof id === 'object' && id.toString) {
                    return id.toString()
                }
                return String(id)
            }
            
            const loggedInUserIdStr = normalizeId(loggedInUser._id)
            const userIdToFollowStr = normalizeId(userId)
            
            if (loggedInUserIdStr === userIdToFollowStr) {
                console.log('⚠️ Cannot follow yourself')
                return
            }
            
            console.log('🔄 Following user:', userId)
            
            // Actually follow the user first
            await userService.toggleFollow(userId)
            console.log('✅ Successfully followed user:', userId)
            
            // Then remove from suggestions
            setSuggestedUsers(prev => prev.filter(user => user._id !== userId))
            
            // Update the logged-in user in Redux store to reflect new following list
            const updatedUser = await userService.getById(loggedInUser._id)
            if (updatedUser) {
                const { store } = await import('../store/store')
                store.dispatch({ type: 'SET_USER', user: updatedUser })
                console.log('✅ Updated following list:', updatedUser.following)
            }
        } catch (err) {
            console.error('❌ Error following user:', err)
            // If follow failed, reload suggestions to restore the user
            loadSuggestedUsers()
        }
    }

    function handleViewProfile(userId) {
        navigate(`/user/${userId}`)
    }

    if (loading) {
        return (
            <div className="suggested-users">
                <div className="suggested-header">
                    <h3>Suggested for you</h3>
                </div>
                <div className="suggested-loading">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <div key={i} className="suggested-user-skeleton">
                            <div className="skeleton-avatar"></div>
                            <div className="skeleton-info">
                                <div className="skeleton-username"></div>
                                <div className="skeleton-subtitle"></div>
                            </div>
                            <div className="skeleton-button"></div>
                        </div>
                    ))}
                </div>
            </div>
        )
    }

    if (!loggedInUser || suggestedUsers.length === 0) {
        return null
    }

    return (
        <div className="suggested-users">
            <div className="suggested-header">
                <div className="suggested-title">
                    <span className="suggested-user-info">
                        <img 
                            src={loggedInUser.imgUrl || '/img/amir-avni.jpg.jpg'} 
                            alt={loggedInUser.username}
                            className="suggested-current-user-avatar"
                            onClick={() => handleViewProfile(loggedInUser._id)}
                        />
                        <div className="suggested-current-user-details">
                            <span className="suggested-current-username" onClick={() => handleViewProfile(loggedInUser._id)}>
                                {loggedInUser.username}
                            </span>
                            <span className="suggested-current-fullname">{loggedInUser.fullname}</span>
                        </div>
                    </span>
                    <button className="switch-btn" onClick={() => navigate('/auth/login')}>
                        Switch
                    </button>
                </div>
            </div>

            <div className="suggested-content">
                <div className="suggested-section-header">
                    <h3>Suggested for you</h3>
                </div>

                <div className="suggested-users-list">
                    {suggestedUsers.map(user => (
                        <SuggestedUserItem 
                            key={user._id}
                            user={user}
                            onFollow={() => handleFollow(user._id)}
                            onViewProfile={() => handleViewProfile(user._id)}
                        />
                    ))}
                </div>
            </div>
        </div>
    )
}

function SuggestedUserItem({ user, onFollow, onViewProfile }) {
    const { currentUser } = useCurrentUser(user._id)
    const displayUser = currentUser || user

    return (
        <div className="suggested-user-item">
            <img 
                src={displayUser.imgUrl || '/img/amir-avni.jpg.jpg'} 
                alt={displayUser.username}
                className="suggested-user-avatar"
                onClick={onViewProfile}
            />
            <div className="suggested-user-info">
                <span className="suggested-username" onClick={onViewProfile}>
                    {displayUser.username}
                </span>
                <span className="suggested-subtitle">
                    {displayUser.bio ? displayUser.bio.slice(0, 30) + '...' : 'Suggested for you'}
                </span>
            </div>
            <button className="follow-btn" onClick={onFollow}>
                Follow
            </button>
        </div>
    )
}
