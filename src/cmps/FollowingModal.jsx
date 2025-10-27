import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { userService } from '../services/user'
import { store } from '../store/store'
import { showSuccessMsg, showErrorMsg } from '../services/event-bus.service'

export function FollowingModal({ isOpen, onClose, following, currentUserId, onUpdate }) {
    const [searchTerm, setSearchTerm] = useState('')
    const [followingList, setFollowingList] = useState([])
    const loggedinUser = useSelector(storeState => storeState.userModule.user)
    const navigate = useNavigate()

    useEffect(() => {
        if (isOpen) {
            loadFollowing()
        }
    }, [isOpen, following])

    async function loadFollowing() {
        try {
            const allUsers = await userService.getUsers()
            const followingData = allUsers.filter(user => following.includes(user._id))
            setFollowingList(followingData)
        } catch (err) {
            console.error('Error loading following:', err)
            showErrorMsg('Failed to load following')
        }
    }

    async function handleUnfollow(followingId) {
        try {
            // Unfollow the user
            await userService.toggleFollow(followingId)
            
            // Remove from local state
            setFollowingList(prev => prev.filter(user => user._id !== followingId))
            
            // Refresh logged-in user data
            if (loggedinUser) {
                const freshLoggedinUser = await userService.getById(loggedinUser._id)
                store.dispatch({ type: 'SET_USER', user: freshLoggedinUser })
            }
            
            // Refresh watched user data
            if (currentUserId) {
                const freshWatchedUser = await userService.getById(currentUserId)
                store.dispatch({ type: 'SET_WATCHED_USER', user: freshWatchedUser })
            }
            
            // Notify parent to refresh
            if (onUpdate) {
                onUpdate()
            }
            
            showSuccessMsg('Unfollowed')
        } catch (err) {
            console.error('Error unfollowing:', err)
            showErrorMsg('Failed to unfollow')
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

    function isOwnFollowing() {
        if (!loggedinUser) return false
        return loggedinUser._id === currentUserId
    }

    // Check if this is view-only mode (no onUpdate callback AND it's not the logged-in user's own profile)
    const isViewOnly = !onUpdate && !isOwnFollowing()

    const filteredFollowing = followingList.filter(user => {
        const searchLower = searchTerm.toLowerCase()
        return user.username && user.username.toLowerCase().includes(searchLower)
    })

    if (!isOpen) return null

    return (
        <div className="followers-modal-overlay" onClick={onClose}>
            <div className="followers-modal" onClick={(e) => e.stopPropagation()}>
                <div className="followers-modal-header">
                    <h2>Following</h2>
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
                    {filteredFollowing.length === 0 ? (
                        <div className="followers-modal-empty">
                            <p>Not following anyone</p>
                        </div>
                    ) : (
                        filteredFollowing.map(followingUser => (
                            <div key={followingUser._id} className="followers-modal-item">
                                <img 
                                    src={followingUser.imgUrl || '/img/amir-avni.jpg.jpg'} 
                                    alt={followingUser.username}
                                    className="followers-modal-avatar"
                                    onClick={() => {
                                        onClose()
                                        navigate(`/user/${followingUser._id}`)
                                    }}
                                />
                                <div 
                                    className="followers-modal-user-info"
                                    onClick={() => {
                                        onClose()
                                        navigate(`/user/${followingUser._id}`)
                                    }}
                                >
                                    <span className="followers-modal-username">{followingUser.username || 'amir.avni'}</span>
                                </div>
                                {onUpdate && (
                                    <button 
                                        className="followers-modal-action-btn following"
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            handleUnfollow(followingUser._id)
                                        }}
                                    >
                                        Following
                                    </button>
                                )}
                                {!onUpdate && loggedinUser && followingUser._id !== loggedinUser._id && (
                                    isFollowingUser(followingUser._id) ? (
                                        <button 
                                            className="followers-modal-action-btn following"
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                handleUnfollowFromView(followingUser._id)
                                            }}
                                        >
                                            Following
                                        </button>
                                    ) : (
                                        <button 
                                            className="followers-modal-action-btn"
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                handleFollow(followingUser._id)
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

