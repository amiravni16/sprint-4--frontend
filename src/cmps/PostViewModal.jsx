import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { addPostMsg } from '../store/actions/post.actions'
import { showSuccessMsg } from '../services/event-bus.service'

export function PostViewModal({ isOpen, onClose, post, onLike, onDelete, onEdit }) {
    const [commentText, setCommentText] = useState('')
    const [isAnimating, setIsAnimating] = useState(false)
    const [imageAspectRatio, setImageAspectRatio] = useState('square')
    const user = useSelector(storeState => storeState.userModule.user)
    const posts = useSelector(storeState => storeState.postModule.posts)
    
    // Get the updated post from Redux store
    const currentPost = posts.find(p => p._id === post._id) || post
    const isOwnPost = user && currentPost && user._id === currentPost.by?._id

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
                                src={currentPost.by?.imgUrl || 'https://i.pravatar.cc/150?img=1'} 
                                alt={currentPost.by?.username}
                                className="post-details-avatar"
                            />
                            <span className="post-details-username">{currentPost.by?.username}</span>
                        </div>
                        {isOwnPost && (
                            <button 
                                className="post-details-options"
                                onClick={(e) => {
                                    e.stopPropagation()
                                    // Options menu will be handled by parent
                                }}
                            >
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                    <circle cx="12" cy="5" r="1" fill="currentColor"/>
                                    <circle cx="12" cy="12" r="1" fill="currentColor"/>
                                    <circle cx="12" cy="19" r="1" fill="currentColor"/>
                                </svg>
                            </button>
                        )}
                    </div>

                    {/* Comments section */}
                    <div className="post-details-comments">
                        {/* Caption */}
                        <div className="post-details-comment">
                            <img 
                                src={currentPost.by?.imgUrl || 'https://i.pravatar.cc/150?img=1'} 
                                alt={currentPost.by?.username}
                                className="post-details-comment-avatar"
                            />
                            <div className="post-details-comment-content">
                                <span className="post-details-comment-username">{currentPost.by?.username || currentPost.by?.fullname}</span>
                                <span className="post-details-comment-text">{currentPost.txt}</span>
                            </div>
                        </div>

                        {/* Comments */}
                        {currentPost.comments && currentPost.comments.length > 0 && (
                            <>
                                {currentPost.comments.map((comment, idx) => (
                                    <div key={idx} className="post-details-comment">
                                        <img 
                                            src={comment.by?.imgUrl || 'https://i.pravatar.cc/150?img=1'} 
                                            alt={comment.by?.username}
                                            className="post-details-comment-avatar"
                                        />
                                        <div className="post-details-comment-content">
                                            <span className="post-details-comment-username">{comment.by?.username || comment.by?.fullname}</span>
                                            <span className="post-details-comment-text">{comment.txt}</span>
                                        </div>
                                    </div>
                                ))}
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
                        <button className="action-btn save-btn">
                            <img 
                                src="/src/assets/icons/save.svg" 
                                alt="Save" 
                                width="24" 
                                height="24"
                            />
                        </button>
                    </div>

                    {/* Likes count */}
                    <div className="post-details-likes">
                        <strong>{currentPost.likedBy?.length || 0} {currentPost.likedBy?.length === 1 ? 'like' : 'likes'}</strong>
                    </div>

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
        </div>
    )
}
