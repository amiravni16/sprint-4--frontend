import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { addPostMsg } from '../store/actions/post.actions'
import { showSuccessMsg } from '../services/event-bus.service'
import { userService } from '../services/user'
import { useCurrentUser } from '../customHooks/useCurrentUser'
import { CommentItem } from './CommentItem'
import { formatTimeAgo } from '../services/util.service'

export function PostViewModal({ isOpen, onClose, post, onLike, onDelete, onEdit, onUpdate, onPostUnsaved }) {
    const [commentText, setCommentText] = useState('')
    const [isAnimating, setIsAnimating] = useState(false)
    const [imageAspectRatio, setImageAspectRatio] = useState('square')
    const navigate = useNavigate()
    const [isSaved, setIsSaved] = useState(false)
    const [showDeleteCommentModal, setShowDeleteCommentModal] = useState(false)
    const [commentToDelete, setCommentToDelete] = useState(null)
    const [showOptionsModal, setShowOptionsModal] = useState(false)
    const user = useSelector(storeState => storeState.userModule.user)
    const posts = useSelector(storeState => storeState.postModule.posts)
    
    // Get the updated post from Redux store
    const currentPost = posts.find(p => p._id === post._id) || post
    const isOwnPost = user && currentPost && user._id === currentPost.by?._id
    
    // Get current post author data
    const { currentUser: postAuthor, loading: authorLoading } = useCurrentUser(currentPost.by?._id)

    // Check if post is saved
    useEffect(() => {
        if (user && user.savedPosts) {
            setIsSaved(user.savedPosts.includes(currentPost._id))
        }
    }, [user, currentPost._id])

    const formatTimeAgo = (timestamp) => {
        const now = new Date()
        const postTime = new Date(timestamp)
        const diffInSeconds = Math.floor((now - postTime) / 1000)
        
        if (diffInSeconds < 60) return `${diffInSeconds}s`
        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m`
        if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h`
        if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}d`
        if (diffInSeconds < 31536000) return `${Math.floor(diffInSeconds / 2592000)}mo`
        return `${Math.floor(diffInSeconds / 31536000)}y`
    }

    // Detect image aspect ratio
    useEffect(() => {
        if (currentPost?.imgUrl) {
            const img = new Image()
            img.onload = () => {
                const aspectRatio = img.width / img.height
                if (aspectRatio > 1.1) {
                    setImageAspectRatio('horizontal')
                } else if (aspectRatio < 0.9) {
                    setImageAspectRatio('vertical')
                } else {
                    setImageAspectRatio('square')
                }
            }
            img.src = currentPost.imgUrl
        }
    }, [currentPost?.imgUrl])

    if (!isOpen || !currentPost) return null

    const handleAddComment = async (e) => {
        e.preventDefault()
        if (!commentText.trim()) return

        try {
            await addPostMsg(currentPost._id, commentText)
            setCommentText('')
            showSuccessMsg('Comment added! 💬')
        } catch (err) {
            console.error('Error adding comment:', err)
            showSuccessMsg('Failed to add comment')
        }
    }

    const handleCommentLike = async (commentId) => {
        if (!user) return
        
        try {
            // Find the comment and toggle the like
            const updatedComments = currentPost.comments.map(comment => {
                if (comment.id === commentId) {
                    const likedBy = comment.likedBy || []
                    const isLiked = likedBy.includes(user._id)
                    
                    return {
                        ...comment,
                        likedBy: isLiked 
                            ? likedBy.filter(id => id !== user._id)
                            : [...likedBy, user._id]
                    }
                }
                return comment
            })
            
            // Update the post with new comment likes
            const updatedPost = { ...currentPost, comments: updatedComments }
            await onUpdate(updatedPost)
            
        } catch (err) {
            console.error('Error liking comment:', err)
        }
    }

    const handleDeleteComment = (comment) => {
        setCommentToDelete(comment)
        setShowDeleteCommentModal(true)
    }

    const confirmDeleteComment = async () => {
        if (!commentToDelete || !user) return

        try {
            // Remove the comment from the post
            const updatedComments = currentPost.comments.filter(comment => comment.id !== commentToDelete.id)
            const updatedPost = { ...currentPost, comments: updatedComments }
            await onUpdate(updatedPost)
            
            // Close modal and reset state
            setShowDeleteCommentModal(false)
            setCommentToDelete(null)
        } catch (err) {
            console.error('Error deleting comment:', err)
        }
    }

    const canDeleteComment = (comment) => {
        if (!user) return false
        // User can delete if they own the post OR they wrote the comment
        return user._id === currentPost.by?._id || user._id === comment.by?._id
    }

    const handleSave = async () => {
        if (!user) return
        
        try {
            if (isSaved) {
                await userService.unsavePost(currentPost._id)
                setIsSaved(false)
                // Notify parent component that post was unsaved
                if (onPostUnsaved) {
                    onPostUnsaved(currentPost._id)
                }
            } else {
                await userService.savePost(currentPost._id)
                setIsSaved(true)
            }
            
            // Refresh user data to update saved posts
            const updatedUser = await userService.getById(user._id)
            // You might want to dispatch an action to update the Redux store here
        } catch (error) {
            console.error('Error saving/unsaving post:', error)
        }
    }

    const handleLike = () => {
        // Animate when liking
        if (!isLiked) {
            setIsAnimating(true)
            setTimeout(() => setIsAnimating(false), 400)
        }

        if (onLike) {
            onLike(currentPost._id)
        }
    }

    const handleDelete = () => {
        if (onDelete) {
            onDelete(currentPost._id)
            setShowOptionsModal(false)
            onClose() // Close the modal after deletion
        }
    }

    const handleEdit = () => {
        if (onEdit) {
            onEdit(currentPost)
            setShowOptionsModal(false)
            onClose() // Close the modal when editing
        }
    }

    const isLiked = user && currentPost.likedBy?.includes(user._id)

    return (
        <div className="post-details-overlay" onClick={onClose}>
            <div className="post-details-modal" onClick={(e) => e.stopPropagation()}>
                {/* Close button */}
                <button className="post-details-close" onClick={onClose}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                </button>

                {/* Image section */}
                <div className={`post-details-image ${imageAspectRatio}`}>
                    <img src={currentPost.imgUrl} alt="Post" />
                </div>

                {/* Details section */}
                <div className="post-details-content">
                    {/* Header */}
                    <div className="post-details-header">
                        <div className="post-details-user">
                            <img 
                                src={authorLoading ? (currentPost.by?.imgUrl || '/img/amir-avni.jpg.jpg') : (postAuthor?.imgUrl || currentPost.by?.imgUrl || '/img/amir-avni.jpg.jpg')} 
                                alt={authorLoading ? (currentPost.by?.username) : (postAuthor?.username || currentPost.by?.username)}
                                className="post-details-avatar"
                            />
                            <span className="post-details-username">{authorLoading ? (currentPost.by?.username || 'amir.avni') : (postAuthor?.username || currentPost.by?.username || 'amir.avni')}</span>
                        </div>
                        <button 
                            className="post-details-options"
                            onClick={(e) => {
                                e.stopPropagation()
                                setShowOptionsModal(true)
                            }}
                        >
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                <circle cx="12" cy="5" r="1" fill="currentColor"/>
                                <circle cx="12" cy="12" r="1" fill="currentColor"/>
                                <circle cx="12" cy="19" r="1" fill="currentColor"/>
                            </svg>
                        </button>
                    </div>

                    {/* Comments section */}
                    <div className="post-details-comments">
                        {/* Caption */}
                        <div className="post-details-comment">
                            <img 
                                src={authorLoading ? (currentPost.by?.imgUrl || '/img/amir-avni.jpg.jpg') : (postAuthor?.imgUrl || currentPost.by?.imgUrl || '/img/amir-avni.jpg.jpg')} 
                                alt={authorLoading ? (currentPost.by?.username) : (postAuthor?.username || currentPost.by?.username)}
                                className="post-details-comment-avatar"
                            />
                            <div className="post-details-comment-content">
                                <span className="post-details-comment-username clickable" onClick={() => {
                                    onClose()
                                    navigate(`/user/${currentPost.by?._id}`)
                                }}>{authorLoading ? (currentPost.by?.username || 'amir.avni') : (postAuthor?.username || currentPost.by?.username || 'amir.avni')}</span>
                                <span className="post-details-comment-text">{currentPost.txt}</span>
                            </div>
                        </div>

                        {/* Comments */}
                        {currentPost.comments && currentPost.comments.length > 0 && (
                            <>
                                {currentPost.comments.map((comment, idx) => {
                                    const isCommentLiked = user && comment.likedBy?.includes(user._id)
                                    const commentLikeCount = comment.likedBy?.length || 0
                                    const canDelete = canDeleteComment(comment)
                                    
                                    return (
                                        <div key={idx} className="post-details-comment">
                                            <img 
                                                src={comment.by?.imgUrl || '/img/amir-avni.jpg.jpg'} 
                                                alt={comment.by?.username}
                                                className="post-details-comment-avatar"
                                            />
                                            <div className="post-details-comment-content">
                                                <span className="post-details-comment-username clickable" onClick={() => {
                                                    onClose()
                                                    navigate(`/user/${comment.by?._id}`)
                                                }}>{comment.by?.username || 'amir.avni'}</span>
                                                <span className="post-details-comment-text">{comment.txt}</span>
                                                <div className="post-details-comment-actions">
                                                    <span className="post-details-comment-time">
                                                        {formatTimeAgo(comment.createdAt)}
                                                    </span>
                                                    {commentLikeCount > 0 && (
                                                        <span className="post-details-comment-likes">
                                                            {commentLikeCount} {commentLikeCount === 1 ? 'like' : 'likes'}
                                                        </span>
                                                    )}
                                                    {canDelete && (
                                                        <button 
                                                            className="post-details-comment-options-btn"
                                                            onClick={() => handleDeleteComment(comment)}
                                                        >
                                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                                                <circle cx="12" cy="5" r="1.5" fill="currentColor"/>
                                                                <circle cx="12" cy="12" r="1.5" fill="currentColor"/>
                                                                <circle cx="12" cy="19" r="1.5" fill="currentColor"/>
                                                            </svg>
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                            <button 
                                                className={`post-details-comment-like-btn ${isCommentLiked ? 'liked' : ''}`}
                                                onClick={() => handleCommentLike(comment.id)}
                                            >
                                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                                                    {isCommentLiked ? (
                                                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="currentColor"/>
                                                    ) : (
                                                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" stroke="currentColor" strokeWidth="2" fill="none"/>
                                                    )}
                                                </svg>
                                            </button>
                                        </div>
                                    )
                                })}
                            </>
                        )}
                    </div>

                    {/* Actions */}
                    <div className="post-details-actions">
                        <div className="action-group">
                            <button 
                                className={`action-btn like-btn ${isLiked ? 'liked' : ''} ${isAnimating ? 'animating' : ''}`}
                                onClick={handleLike}
                            >
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                    {isLiked ? (
                                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="currentColor"/>
                                    ) : (
                                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" stroke="currentColor" strokeWidth="2" fill="none"/>
                                    )}
                                </svg>
                            </button>
                            {currentPost.likedBy && currentPost.likedBy.length > 0 && (
                                <span className="action-count">
                                    {currentPost.likedBy.length}
                                </span>
                            )}
                            <button className="action-btn comment-btn">
                                <img 
                                    src="/src/assets/icons/comment.svg" 
                                    alt="Comment" 
                                    width="24" 
                                    height="24"
                                />
                            </button>
                            {currentPost.comments && currentPost.comments.length > 0 && (
                                <span className="action-count">
                                    {currentPost.comments.length}
                                </span>
                            )}
                            <button className="action-btn share-btn">
                                <img 
                                    src="/src/assets/icons/share.svg" 
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
                                    src="/src/assets/icons/save.svg" 
                                    alt="Save" 
                                    width="24" 
                                    height="24"
                                />
                            )}
                        </button>
                    </div>

                    {/* Likes count */}
                    <div className="post-details-likes">
                        <strong>{currentPost.likedBy?.length || 0} {currentPost.likedBy?.length === 1 ? 'like' : 'likes'}</strong>
                    </div>

                    {/* Post time */}
                    {currentPost.createdAt && (
                        <div className="post-details-time">
                            {formatTimeAgo(currentPost.createdAt)} ago
                        </div>
                    )}

                    {/* Comment form */}
                    <form className="post-details-comment-form" onSubmit={handleAddComment}>
                        <input
                            type="text"
                            placeholder="Add a comment..."
                            value={commentText}
                            onChange={(e) => setCommentText(e.target.value)}
                        />
                        <button 
                            type="submit" 
                            className={`post-details-comment-submit ${commentText.trim() ? 'active' : ''}`}
                            disabled={!commentText.trim()}
                        >
                            Post
                        </button>
                    </form>
                </div>
            </div>

            {/* Delete Comment Modal */}
            {showDeleteCommentModal && (
                <div className="post-options-overlay" onClick={() => setShowDeleteCommentModal(false)}>
                    <div className="post-options-modal" onClick={(e) => e.stopPropagation()}>
                        <button className="post-option-btn post-option-delete" onClick={confirmDeleteComment}>
                            Delete
                        </button>
                        <div className="post-option-divider"></div>
                        <button className="post-option-btn" onClick={() => setShowDeleteCommentModal(false)}>
                            Cancel
                        </button>
                    </div>
                </div>
            )}

            {/* Post Options Modal */}
            {showOptionsModal && (
                <div className="post-options-overlay" onClick={() => setShowOptionsModal(false)}>
                    <div className="post-options-modal" onClick={(e) => e.stopPropagation()}>
                        {/* Only show options if user owns the post */}
                        {user && currentPost.by?._id === user._id ? (
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
        </div>
    )
}
