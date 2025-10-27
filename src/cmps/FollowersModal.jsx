import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { userService } from '../services/user'
import { store } from '../store/store'
import { showSuccessMsg, showErrorMsg } from '../services/event-bus.service'

export function FollowersModal({ isOpen, onClose, followers, currentUserId, onUpdate }) {
    const [searchTerm, setSearchTerm] = useState('')
    const [followersList, setFollowersList] = useState([])
    const loggedinUser = useSelector(storeState => storeState.userModule.user)
    const navigate = useNavigate()

    useEffect(() => {
        if (isOpen) {
            // Add a small delay to ensure the parent component has finished updating
            const timeoutId = setTimeout(() => {
                loadFollowers()
            }, 100)
            
            return () => clearTimeout(timeoutId)
        }
    }, [isOpen, followers])

    async function loadFollowers() {
        try {
            const allUsers = await userService.getUsers()
            const followersData = allUsers.filter(user => followers.includes(user._id))
            setFollowersList(followersData)
        } catch (err) {
            console.error('Error loading followers:', err)
            showErrorMsg('Failed to load followers')
        }
    }

    async function handleRemoveFollower(followerId) {
        try {
            // Get the follower user
            const followerUser = await userService.getById(followerId)
            
            // Remove current user from follower's following list
            const updatedFollowing = (followerUser.following || []).filter(id => id !== currentUserId)
            await userService.update({ ...followerUser, following: updatedFollowing })
            
            // Remove follower from current user's followers list
            const updatedFollowers = followers.filter(id => id !== followerId)
            
            // Update the current user
            const currentUser = await userService.getById(currentUserId)
            await userService.update({ ...currentUser, followers: updatedFollowers })
            
            // Refresh both users in store
            const freshCurrentUser = await userService.getById(currentUserId)
            store.dispatch({ type: 'SET_WATCHED_USER', user: freshCurrentUser })
            
            if (loggedinUser && loggedinUser._id === currentUserId) {
                store.dispatch({ type: 'SET_USER', user: freshCurrentUser })
            }
            
            // Update local state
            setFollowersList(prev => prev.filter(user => user._id !== followerId))
            
            // Notify parent to refresh
            if (onUpdate) {
                onUpdate()
            }
            
            showSuccessMsg('Follower removed')
        } catch (err) {
            console.error('Error removing follower:', err)
            showErrorMsg('Failed to remove follower')
        }
    }

    async function handleFollow(userId) {
        if (!loggedinUser) return
        
        try {
            await userService.toggleFollow(userId)
            
            // Refresh logged-in user data
            const freshLoggedinUser = await userService.getById(loggedinUser._id)
            store.dispatch({ type: 'SET_USER', user: freshLoggedinUser })
            
            // Refresh watched user data
            if (currentUserId) {
                const freshWatchedUser = await userService.getById(currentUserId)
                store.dispatch({ type: 'SET_WATCHED_USER', user: freshWatchedUser })
            }
            
            showSuccessMsg('Followed')
        } catch (err) {
            console.error('Error following:', err)
            showErrorMsg('Failed to follow')
        }
    }

    async function handleUnfollowFromView(userId) {
        if (!loggedinUser) return
        
        try {
            await userService.toggleFollow(userId)
            
            // Refresh logged-in user data
            const freshLoggedinUser = await userService.getById(loggedinUser._id)
            store.dispatch({ type: 'SET_USER', user: freshLoggedinUser })
            
            // Refresh watched user data
            if (currentUserId) {
                const freshWatchedUser = await userService.getById(currentUserId)
                store.dispatch({ type: 'SET_WATCHED_USER', user: freshWatchedUser })
            }
            
            showSuccessMsg('Unfollowed')
        } catch (err) {
            console.error('Error unfollowing:', err)
            showErrorMsg('Failed to unfollow')
        }
    }

    function isFollowingUser(userId) {
        if (!loggedinUser) return false
        return (loggedinUser.following || []).includes(userId)
    }

    function isOwnProfile() {
        if (!loggedinUser) return false
        return loggedinUser._id === currentUserId
    }

    // Check if this is view-only mode (no onUpdate callback AND it's not the logged-in user's own profile)
    const isViewOnly = !onUpdate && !isOwnProfile()

    const filteredFollowers = followersList.filter(user => {
        const searchLower = searchTerm.toLowerCase()
        return user.username && user.username.toLowerCase().includes(searchLower)
    })

    if (!isOpen) return null

    return (
        <div className="followers-modal-overlay" onClick={onClose}>
            <div className="followers-modal" onClick={(e) => e.stopPropagation()}>
                <div className="followers-modal-header">
                    <h2>Followers</h2>
                    <button className="followers-modal-close" onClick={onClose}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                        </svg>
                    </button>
                </div>

                <div className="followers-modal-search">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2"/>
                        <path d="m21 21-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                    <input
                        type="text"
                        placeholder="Search"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="followers-modal-list">
                    {filteredFollowers.length === 0 ? (
                        <div className="followers-modal-empty">
                            <p>No followers found</p>
                        </div>
                    ) : (
                        filteredFollowers.map(follower => (
                            <div key={follower._id} className="followers-modal-item">
                                <img 
                                    src={follower.imgUrl || '/img/amir-avni.jpg.jpg'} 
                                    alt={follower.username}
                                    className="followers-modal-avatar"
                                    onClick={() => {
                                        onClose()
                                        navigate(`/user/${follower._id}`)
                                    }}
                                />
                                <div 
                                    className="followers-modal-user-info"
                                    onClick={() => {
                                        onClose()
                                        navigate(`/user/${follower._id}`)
                                    }}
                                >
                                    <span className="followers-modal-username">{follower.username || 'amir.avni'}</span>
                                </div>
                                {onUpdate && (
                                    <button 
                                        className="followers-modal-action-btn"
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            handleRemoveFollower(follower._id)
                                        }}
                                    >
                                        Remove
                                    </button>
                                )}
                                {!onUpdate && loggedinUser && follower._id !== loggedinUser._id && (
                                    isFollowingUser(follower._id) ? (
                                        <button 
                                            className="followers-modal-action-btn following"
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                handleUnfollowFromView(follower._id)
                                            }}
                                        >
                                            Following
                                        </button>
                                    ) : (
                                        <button 
                                            className="followers-modal-action-btn"
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                handleFollow(follower._id)
                                            }}
                                        >
                                            Follow
                                        </button>
                                    )
                                )}
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    )
}

