import { Link } from 'react-router-dom'
import { useRef, useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { userService } from '../services/user'
import { buildResponsiveSrcSet } from '../services/util.service'
import { useCurrentUser } from '../customHooks/useCurrentUser'

export function PostPreview({ post, onLike, onComment, user, onDelete, onEdit, onOpenDetails }) {
    const [isAnimating, setIsAnimating] = useState(false)
    const [isSaved, setIsSaved] = useState(false)
    const justUnlikedRef = useRef(false)
    const [imageError, setImageError] = useState(false)
    const [showOptionsModal, setShowOptionsModal] = useState(false)
    const [isCaptionExpanded, setIsCaptionExpanded] = useState(false)
    const loggedInUser = useSelector(storeState => storeState.userModule.user)
    
    // Get current user data instead of using embedded data
    const { currentUser: postAuthor, loading: authorLoading } = useCurrentUser(post.by?._id)
    
    // Check if post is saved
    useEffect(() => {
        if (loggedInUser && loggedInUser.savedPosts) {
            setIsSaved(loggedInUser.savedPosts.includes(post._id))
        }
    }, [loggedInUser, post._id])
    
    const formatTimeAgo = (timestamp) => {
        const now = new Date()
        const postTime = new Date(timestamp)
        const diffInSeconds = Math.floor((now - postTime) / 1000)
        
        if (diffInSeconds < 60) return 'JUST NOW'
        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}M`
        if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}H`
        return `${Math.floor(diffInSeconds / 86400)}D`
    }

    const isLiked = post.likedBy && user && post.likedBy.includes(user._id)
    const hasComments = post.comments && post.comments.length > 0
    const hasLikes = post.likedBy && post.likedBy.length > 0

    // Caption truncation logic
    const MAX_CAPTION_LENGTH = 150
    const shouldTruncate = post.txt && post.txt.length > MAX_CAPTION_LENGTH
    const displayCaption = shouldTruncate && !isCaptionExpanded 
        ? post.txt.substring(0, MAX_CAPTION_LENGTH) + '...'
        : post.txt

    const handleToggleCaption = () => {
        setIsCaptionExpanded(!isCaptionExpanded)
    }

    const handleLike = () => {
        if (!onLike) return

        // If currently not liked → clicking will like: animate immediately
        if (!isLiked) {
            setIsAnimating(true)
            setTimeout(() => setIsAnimating(false), 400)
            justUnlikedRef.current = false // reset unlike loop when liked
        } else {
            // Currently liked → clicking will unlike: animate on unhover
            justUnlikedRef.current = true
        }

        onLike(post._id)
    }

    const handleMouseLeave = () => {
        if (justUnlikedRef.current && !isLiked) {
            setIsAnimating(true)
            setTimeout(() => {
                setIsAnimating(false)
            }, 400)
        }
    }

    const handleSave = async () => {
        if (!loggedInUser) return
        
        // OPTIMISTIC UPDATE: Update UI immediately
        const newSavedState = !isSaved
        setIsSaved(newSavedState)
        
        // Update Redux store immediately for instant feedback
        const { store } = await import('../store/store')
        const currentUser = store.getState().userModule.user
        if (currentUser) {
            const savedPosts = currentUser.savedPosts || []
            let updatedSavedPosts
            if (newSavedState) {
                // Save: add post ID if not already there
                updatedSavedPosts = savedPosts.includes(post._id) 
                    ? savedPosts 
                    : [...savedPosts, post._id]
            } else {
                // Unsave: remove post ID
                updatedSavedPosts = savedPosts.filter(id => id !== post._id)
            }
            
            const updatedUser = {
                ...currentUser,
                savedPosts: updatedSavedPosts
            }
            store.dispatch({ type: 'SET_USER', user: updatedUser })
        }
        
        try {
            // Sync with backend (non-blocking)
            if (isSaved) {
                await userService.unsavePost(post._id)
            } else {
                await userService.savePost(post._id)
            }
            
            // Refresh user data from backend to confirm
            const freshUser = await userService.getById(loggedInUser._id)
            store.dispatch({ type: 'SET_USER', user: freshUser })
        } catch (error) {
            console.error('Error saving/unsaving post:', error)
            // Revert optimistic update on error
            setIsSaved(isSaved)
            const { store } = await import('../store/store')
            const currentUser = store.getState().userModule.user
            if (currentUser) {
                const savedPosts = currentUser.savedPosts || []
                let revertedSavedPosts
                if (newSavedState) {
                    // Revert: remove if we added
                    revertedSavedPosts = savedPosts.filter(id => id !== post._id)
                } else {
                    // Revert: add back if we removed
                    revertedSavedPosts = savedPosts.includes(post._id)
                        ? savedPosts
                        : [...savedPosts, post._id]
                }
                const revertedUser = {
                    ...currentUser,
                    savedPosts: revertedSavedPosts
                }
                store.dispatch({ type: 'SET_USER', user: revertedUser })
            }
        }
    }

    const handleDelete = () => {
        if (onDelete) {
            onDelete(post._id)
            setShowOptionsModal(false)
        }
    }

    const handleEdit = () => {
        if (onEdit) {
            onEdit(post)
            setShowOptionsModal(false)
        }
    }


    return (
        <article className="post-preview">
            {/* Post Header */}
            <div className="post-header">
                <div className="user-info">
                    <div className="profile-pic-container" style={{ position: 'relative', width: '32px', height: '32px' }}>
                        <img 
                            src={authorLoading ? (post.by?.imgUrl || '/img/amir-avni.jpg.jpg') : (postAuthor?.imgUrl || post.by?.imgUrl || '/img/amir-avni.jpg.jpg')} 
                            alt={authorLoading ? (post.by?.username || 'Profile') : (postAuthor?.username || post.by?.username || 'Profile')} 
                            className="profile-pic"
                            onError={(e) => {
                                e.target.src = '/img/amir-avni.jpg.jpg';
                            }}
                            style={{
                                width: '32px',
                                height: '32px',
                                borderRadius: '50%',
                                objectFit: 'cover',
                                display: 'block'
                            }}
                        />
                    </div>
                    <Link to={`/user/${post.by?._id}`} className="username">
                        {authorLoading ? (post.by?.username || 'amir.avni') : (postAuthor?.username || post.by?.username || 'amir.avni')}
                    </Link>
                </div>
                <button className="more-btn" onClick={() => setShowOptionsModal(true)}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="12" r="1" fill="currentColor"/>
                        <circle cx="19" cy="12" r="1" fill="currentColor"/>
                        <circle cx="5" cy="12" r="1" fill="currentColor"/>
                    </svg>
                </button>
            </div>

            {/* Post Image */}
            {post.imgUrl && !imageError && (
                <img 
                    src={post.imgUrl}
                    srcSet={buildResponsiveSrcSet(post.imgUrl, 800)}
                    sizes="(max-width: 768px) 100vw, 600px"
                    decoding="async"
                    loading="lazy"
                    alt="Post" 
                    className="post-image"
                    onError={(e) => {
                        console.warn('Image failed to load:', post.imgUrl)
                        // Try fallback: remove any query params for Pexels
                        if (post.imgUrl.includes('pexels.com')) {
                            try {
                                const url = new URL(post.imgUrl)
                                const baseUrl = `${url.protocol}//${url.hostname}${url.pathname}`
                                if (baseUrl !== post.imgUrl && e.target.src !== baseUrl) {
                                    e.target.src = baseUrl
                                    return // Don't set error state yet, try fallback
                                }
                            } catch {}
                        }
                        setImageError(true)
                    }}
                    onClick={() => onOpenDetails && onOpenDetails(post)}
                    style={{ cursor: 'pointer' }}
                />
            )}
            {imageError && (
                <div className="post-image-error">
                    <svg width="64" height="64" viewBox="0 0 24 24" fill="none">
                        <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" stroke="currentColor" strokeWidth="2" fill="none"/>
                    </svg>
                    <p>Image not available</p>
                </div>
            )}

            {/* Post Actions */}
            <div className={`post-actions ${!hasLikes ? 'no-likes' : ''} ${!hasComments ? 'no-comments' : ''}`}>
                <div className="action-group">
                    <button 
                        className={`action-btn like-btn ${isLiked ? 'liked' : ''} ${isAnimating ? 'animating' : ''}`}
                        onClick={handleLike}
                        onMouseLeave={handleMouseLeave}
                    >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                            {isLiked ? (
                                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="currentColor"/>
                            ) : (
                                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" stroke="currentColor" strokeWidth="2" fill="none"/>
                            )}
                        </svg>
                    </button>
                    {post.likedBy && post.likedBy.length > 0 && (
                        <span className="action-count">
                            {post.likedBy.length}
                        </span>
                    )}
                    <button 
                        className="action-btn comment-btn"
                        onClick={() => onOpenDetails && onOpenDetails(post)}
                    >
                        <img 
                            src="/comment.svg" 
                            alt="Comment" 
                            width="24" 
                            height="24"
                        />
                    </button>
                    {post.comments && post.comments.length > 0 && (
                        <span className="action-count">
                            {post.comments.length}
                        </span>
                    )}
                    <button className="action-btn share-btn">
                        <img 
                            src="/share.svg" 
                            alt="Share" 
                            width="24" 
                            height="24"
                        />
                    </button>
                </div>
                <button 
                    className={`action-btn save-btn ${isSaved ? 'saved' : ''}`}
                    onClick={handleSave}
                >
                    {isSaved ? (
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" fill="currentColor"/>
                        </svg>
                    ) : (
                        <img 
                            src="/save.svg"
                            alt="Save" 
                            width="24" 
                            height="24"
                        />
                    )}
                </button>
            </div>


            {/* Post Caption */}
            <div className="post-caption">
                <Link to={`/user/${post.by?._id}`} className="username">
                    {authorLoading ? (post.by?.username || 'amir.avni') : (postAuthor?.username || post.by?.username || 'amir.avni')}
                </Link>
                {displayCaption}
                {shouldTruncate && (
                    <button 
                        className="see-more-btn" 
                        onClick={handleToggleCaption}
                    >
                        {isCaptionExpanded ? 'less' : 'more'}
                    </button>
                )}
            </div>

            {/* Post Tags */}
            {post.tags && post.tags.length > 0 && (
                <div className="post-tags">
                    {post.tags.map(tag => (
                        <Link key={tag} to={`/tag/${tag}`} className="tag">
                            #{tag}
                        </Link>
                    ))}
                </div>
            )}

            {/* Post Location */}
            {post.loc && post.loc.name && (
                <div className="post-location">
                    {post.loc.name}
                </div>
            )}

            {/* Post Time */}
            {post.createdAt && (
                <div className="post-time">
                    {formatTimeAgo(post.createdAt)} ago
                </div>
            )}

            {/* Post Options Modal */}
            {showOptionsModal && (
                <div className="post-options-overlay" onClick={() => setShowOptionsModal(false)}>
                    <div className="post-options-modal" onClick={(e) => e.stopPropagation()}>
                        {/* Only show options if user owns the post */}
                        {user && post.by?._id === user._id ? (
                            <>
                                <button className="post-option-btn post-option-delete" onClick={handleDelete}>
                                    Delete
                                </button>
                                <div className="post-option-divider"></div>
                                <button className="post-option-btn" onClick={handleEdit}>
                                    Edit
                                </button>
                                <div className="post-option-divider"></div>
                                <button className="post-option-btn" onClick={() => setShowOptionsModal(false)}>
                                    Cancel
                                </button>
                            </>
                        ) : (
                            <button className="post-option-btn" onClick={() => setShowOptionsModal(false)}>
                                Cancel
                            </button>
                        )}
                    </div>
                </div>
            )}
        </article>
    )
}
