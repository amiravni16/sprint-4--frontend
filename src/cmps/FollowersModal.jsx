import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { userService } from '../services/user'
import { showSuccessMsg, showErrorMsg } from '../services/event-bus.service'

export function FollowersModal({ isOpen, onClose, followers, currentUserId, onUpdate }) {
    const [searchTerm, setSearchTerm] = useState('')
    const [followersList, setFollowersList] = useState([])
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

    // Check if this is view-only mode (no onUpdate callback means it's another user's profile)
    const isViewOnly = !onUpdate

    const filteredFollowers = followersList.filter(user => {
        const searchLower = searchTerm.toLowerCase()
        return user.username.toLowerCase().includes(searchLower) || 
               (user.fullname && user.fullname.toLowerCase().includes(searchLower))
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
                                    <span className="followers-modal-username">{follower.username}</span>
                                    <span className="followers-modal-fullname">{follower.fullname}</span>
                                </div>
                                {!isViewOnly && (
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
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    )
}

