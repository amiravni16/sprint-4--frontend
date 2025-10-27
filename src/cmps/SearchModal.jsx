import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { userService } from '../services/user'
import { store } from '../store/store'
import '../assets/styles/cmps/SearchModal.css'

export function SearchModal({ isOpen, onClose }) {
    const [searchTerm, setSearchTerm] = useState('')
    const [searchResults, setSearchResults] = useState([])
    const [recentSearches, setRecentSearches] = useState([])
    const loggedinUser = useSelector(storeState => storeState.userModule.user)
    const navigate = useNavigate()

    useEffect(() => {
        if (isOpen) {
            loadRecentSearches()
        } else {
            setSearchTerm('')
            setSearchResults([])
        }
    }, [isOpen])

    useEffect(() => {
        if (searchTerm.trim()) {
            searchUsers(searchTerm)
        } else {
            setSearchResults([])
        }
    }, [searchTerm])

    function loadRecentSearches() {
        try {
            const recent = localStorage.getItem('recentSearches')
            if (recent) {
                setRecentSearches(JSON.parse(recent))
            }
        } catch (err) {
            console.error('Error loading recent searches:', err)
        }
    }

    async function searchUsers(query) {
        try {
            const allUsers = await userService.getUsers()
            const lowerQuery = query.toLowerCase()
            
            const results = allUsers
                .filter(user => user._id !== loggedinUser?._id) // Don't show current user
                .filter(user => {
                    const username = (user.username || '').toLowerCase()
                    const fullname = (user.fullname || '').toLowerCase()
                    return username.includes(lowerQuery) || fullname.includes(lowerQuery)
                })
                .slice(0, 10) // Limit to 10 results
            
            setSearchResults(results)
        } catch (err) {
            console.error('Error searching users:', err)
            setSearchResults([])
        }
    }

    function addToRecentSearches(user) {
        try {
            const recent = [...recentSearches]
            // Remove if already exists
            const filtered = recent.filter(u => u._id !== user._id)
            // Add to beginning
            filtered.unshift(user)
            // Keep only last 10
            const limited = filtered.slice(0, 10)
            setRecentSearches(limited)
            localStorage.setItem('recentSearches', JSON.stringify(limited))
        } catch (err) {
            console.error('Error saving recent search:', err)
        }
    }

    function clearRecentSearches() {
        setRecentSearches([])
        localStorage.removeItem('recentSearches')
    }

    function removeRecentSearch(userId) {
        const filtered = recentSearches.filter(u => u._id !== userId)
        setRecentSearches(filtered)
        localStorage.setItem('recentSearches', JSON.stringify(filtered))
    }

    async function handleFollow(userId) {
        if (!loggedinUser) return
        
        try {
            await userService.toggleFollow(userId)
            
            // Refresh logged-in user data
            const freshLoggedinUser = await userService.getById(loggedinUser._id)
            store.dispatch({ type: 'SET_USER', user: freshLoggedinUser })
            
            // Update search results
            setSearchResults(prev => prev.map(user => 
                user._id === userId 
                    ? { ...user, updated: true } 
                    : user
            ))
        } catch (err) {
            console.error('Error following user:', err)
        }
    }

    async function handleUnfollow(userId) {
        if (!loggedinUser) return
        
        try {
            await userService.toggleFollow(userId)
            
            // Refresh logged-in user data
            const freshLoggedinUser = await userService.getById(loggedinUser._id)
            store.dispatch({ type: 'SET_USER', user: freshLoggedinUser })
            
            // Update search results
            setSearchResults(prev => prev.map(user => 
                user._id === userId 
                    ? { ...user, updated: true } 
                    : user
            ))
        } catch (err) {
            console.error('Error unfollowing user:', err)
        }
    }

    function isFollowingUser(userId) {
        if (!loggedinUser) return false
        return (loggedinUser.following || []).includes(userId)
    }

    function navigateToProfile(user) {
        addToRecentSearches(user)
        onClose()
        navigate(`/user/${user._id}`)
    }

    const displayedUsers = searchTerm ? searchResults : recentSearches

    if (!isOpen) return null

    return (
        <div className="search-modal-overlay" onClick={onClose}>
            <div className="search-modal" onClick={(e) => e.stopPropagation()}>
                <div className="search-modal-header">
                    <h2>Search</h2>
                    <button className="search-modal-close" onClick={onClose}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                        </svg>
                    </button>
                </div>

                <div className="search-modal-input-container">
                    <input
                        type="text"
                        className="search-modal-input"
                        placeholder="Search"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        autoFocus
                    />
                </div>

                {searchTerm && (
                    <div className="search-modal-results">
                        <div className="search-section-header">
                            <h3>Results</h3>
                        </div>
                        <div className="search-user-list">
                            {displayedUsers.length === 0 ? (
                                <div className="search-empty">
                                    No accounts found
                                </div>
                            ) : (
                                displayedUsers.map(user => (
                                    <UserSearchItem
                                        key={user._id}
                                        user={user}
                                        isFollowing={isFollowingUser(user._id)}
                                        onFollow={() => handleFollow(user._id)}
                                        onUnfollow={() => handleUnfollow(user._id)}
                                        onClick={() => navigateToProfile(user)}
                                    />
                                ))
                            )}
                        </div>
                    </div>
                )}

                {!searchTerm && recentSearches.length > 0 && (
                    <div className="search-modal-results">
                        <div className="search-section-header">
                            <h3>Recent</h3>
                            <button className="search-clear-all" onClick={clearRecentSearches}>
                                Clear all
                            </button>
                        </div>
                        <div className="search-user-list">
                            {recentSearches.map(user => (
                                <UserSearchItem
                                    key={user._id}
                                    user={user}
                                    isFollowing={isFollowingUser(user._id)}
                                    onFollow={() => handleFollow(user._id)}
                                    onUnfollow={() => handleUnfollow(user._id)}
                                    onClick={() => navigateToProfile(user)}
                                    onRemove={() => removeRecentSearch(user._id)}
                                    showRemove={true}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

function UserSearchItem({ user, isFollowing, onFollow, onUnfollow, onClick, onRemove, showRemove }) {
    return (
        <div className="search-user-item" onClick={onClick}>
            <img 
                src={user.imgUrl || '/img/amir-avni.jpg.jpg'}
                alt={user.username}
                className="search-user-avatar"
                onError={(e) => {
                    e.target.src = '/img/amir-avni.jpg.jpg';
                }}
            />
            <div className="search-user-info">
                <div className="search-username">{user.username || 'User'}</div>
                <div className="search-user-subtitle">
                    {isFollowing ? 'Following' : user.fullname || ''}
                </div>
            </div>
            <div className="search-user-actions">
                {isFollowing ? (
                    <button 
                        className="search-follow-btn following"
                        onClick={(e) => {
                            e.stopPropagation()
                            onUnfollow()
                        }}
                    >
                        Following
                    </button>
                ) : (
                    <button 
                        className="search-follow-btn"
                        onClick={(e) => {
                            e.stopPropagation()
                            onFollow()
                        }}
                    >
                        Follow
                    </button>
                )}
                {showRemove && onRemove && (
                    <button 
                        className="search-remove-btn"
                        onClick={(e) => {
                            e.stopPropagation()
                            onRemove()
                        }}
                    >
                        ×
                    </button>
                )}
            </div>
        </div>
    )
}

