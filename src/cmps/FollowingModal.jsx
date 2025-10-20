import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { userService } from '../services/user'
import { showSuccessMsg, showErrorMsg } from '../services/event-bus.service'

export function FollowingModal({ isOpen, onClose, following, currentUserId, onUpdate }) {
    const [searchTerm, setSearchTerm] = useState('')
    const [followingList, setFollowingList] = useState([])
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

    // Check if this is view-only mode (no onUpdate callback means it's another user's profile)
    const isViewOnly = !onUpdate

    const filteredFollowing = followingList.filter(user => {
        const searchLower = searchTerm.toLowerCase()
        return user.username.toLowerCase().includes(searchLower) || 
               (user.fullname && user.fullname.toLowerCase().includes(searchLower))
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
                                    src={followingUser.imgUrl || 'https://i.pravatar.cc/150?img=1'} 
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
                                    <span className="followers-modal-username">{followingUser.username}</span>
                                    <span className="followers-modal-fullname">{followingUser.fullname}</span>
                                </div>
                                {!isViewOnly && (
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
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    )
}

