import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { addPostMsg } from '../store/actions/post.actions'
import { useCurrentUser } from '../customHooks/useCurrentUser'
import { CommentItem } from './CommentItem'
import { formatTimeAgo } from '../services/util.service'

export function PostDetailsModal({ isOpen, onClose, post, onLike, onDelete, onEdit, onUpdate, croppedImage, caption, onBack, onPost, aspectRatio = '1:1', isEditMode = false }) {
    const [commentText, setCommentText] = useState('')
    const [showCommentEmojiPicker, setShowCommentEmojiPicker] = useState(false)
    const [imageAspectRatio, setImageAspectRatio] = useState('square')
    const [showDeleteCommentModal, setShowDeleteCommentModal] = useState(false)
    const [commentToDelete, setCommentToDelete] = useState(null)
    const [showOptionsModal, setShowOptionsModal] = useState(false)
    // Create post modal state
    const [captionText, setCaptionText] = useState(caption || '')
    const [characterCount, setCharacterCount] = useState((caption || '').length)
    const [showEmojiPicker, setShowEmojiPicker] = useState(false)
    const [createImageAspectRatio, setCreateImageAspectRatio] = useState('square')
    const navigate = useNavigate()
    const user = useSelector(storeState => storeState.userModule.user)
    
    // Get current post author data
    const { currentUser: postAuthor, loading: authorLoading } = useCurrentUser(post?.by?._id)

    // Disable scrolling when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = 'unset'
        }

        // Cleanup function to restore scrolling when component unmounts
        return () => {
            document.body.style.overflow = 'unset'
        }
    }, [isOpen])

    // Detect image aspect ratio
    useEffect(() => {
        if (post?.imgUrl) {
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
            img.src = post.imgUrl || ''
        }
    }, [post?.imgUrl])

    // Detect aspect ratio for create post image
    useEffect(() => {
        if (croppedImage) {
            const img = new Image()
            img.onload = () => {
                const aspectRatio = img.width / img.height
                if (aspectRatio > 1.1) {
                    setCreateImageAspectRatio('horizontal')
                } else if (aspectRatio < 0.9) {
                    setCreateImageAspectRatio('vertical')
                } else {
                    setCreateImageAspectRatio('square')
                }
            }
            img.src = croppedImage
        }
    }, [croppedImage])

    // Get user from session storage as fallback
    const getLoggedInUser = () => {
        try {
            const loggedStr = sessionStorage.getItem('loggedinUser')
            if (loggedStr) {
                return JSON.parse(loggedStr)
            }
        } catch (err) {
            console.warn('Could not get user from session storage:', err)
        }
        return null
    }

    const loggedInUser = user || getLoggedInUser()

    const emojis = ['😊', '😂', '❤️', '👍', '👎', '😢', '😮', '😡', '🎉', '🔥', '💯', '✨']

    const addCommentEmoji = (emoji) => {
        setCommentText(prev => prev + emoji)
        setShowCommentEmojiPicker(false)
    }

    const formatTimeAgo = (timestamp) => {
        const now = new Date()
        const postTime = new Date(timestamp)
        const diffInSeconds = Math.floor((now - postTime) / 1000)
        
        if (diffInSeconds < 60) return 'JUST NOW'
        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}M`
        if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}H`
        return `${Math.floor(diffInSeconds / 86400)}D`
    }

    // Helper function to render create post modal
    const renderCreatePostModal = () => {
        console.log('renderCreatePostModal called')

        const handleCaptionChange = (e) => {
            const text = e.target.value
            setCaptionText(text)
            setCharacterCount(text.length)
        }

        const addEmoji = (emoji) => {
            setCaptionText(prev => prev + emoji)
            setCharacterCount(prev => prev + emoji.length)
            setShowEmojiPicker(false)
        }

        const handlePost = () => {
            if (onPost) {
                onPost({
                    image: croppedImage,
                    caption: captionText
                })
            }
        }

        return (
            <div className="post-create-overlay" onClick={onClose}>
                <div className={`post-create-modal ${aspectRatio === 'original' || aspectRatio === '16:9' ? 'horizontal' : ''}`} onClick={(e) => e.stopPropagation()}>
                    {/* Close button */}
                    <button className="post-create-close-btn" onClick={onClose}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                        </svg>
                    </button>

                    {/* Header */}
                    <div className="post-create-header">
                        {onBack && (
                            <button className="post-create-back-btn" onClick={onBack}>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                    <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                            </button>
                        )}
                        {!onBack && <div className="post-create-back-btn-placeholder"></div>}
                        <h2>{isEditMode ? 'Edit post' : 'Create new post'}</h2>
                        <button className="post-create-share-btn" onClick={handlePost}>
                            Share
                        </button>
                    </div>

                    {/* Content */}
                    <div className="post-create-content">
                        {/* Image Preview */}
                        <div className={`post-create-image ${createImageAspectRatio}`}>
                            <img src={croppedImage} alt="Post" />
                        </div>

                        {/* Right Panel */}
                        <div className="post-create-right">
                            {/* User Info */}
                            <div className="post-create-user-info">
                                <img 
                                    src={user?.imgUrl || '/img/amir-avni.jpg.jpg'} 
                                    alt={user?.username}
                                    className="post-create-avatar"
                                    onError={(e) => {
                                        e.target.src = '/img/amir-avni.jpg.jpg';
                                    }}
                                />
                                <span className="post-create-username">{loggedInUser?.username || 'amir.avni'}</span>
                            </div>

                            {/* Caption Textarea */}
                            <textarea
                                className="post-create-caption"
                                placeholder="Write a caption..."
                                value={captionText}
                                onChange={handleCaptionChange}
                                maxLength={2200}
                            />

                            {/* Character Count */}
                            <div className="post-create-char-count">
                                {characterCount}/2,200
                            </div>

                            {/* Emoji Button */}
                            <div className="post-create-emoji-container">
                                <div 
                                    className="post-create-emoji-btn" 
                                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                                >
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none"/>
                                        <circle cx="9" cy="9" r="1" fill="currentColor"/>
                                        <circle cx="15" cy="9" r="1" fill="currentColor"/>
                                        <path d="M9 14c0 1.5 1.5 3 3 3s3-1.5 3-3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none"/>
                                    </svg>
                                </div>
                                
                                {/* Emoji Picker */}
                                {showEmojiPicker && (
                                    <div className="post-create-emoji-picker">
                                        {emojis.map((emoji, index) => (
                                            <button
                                                key={index}
                                                className="post-create-emoji-option"
                                                onClick={() => addEmoji(emoji)}
                                            >
                                                {emoji}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
                
                {/* Post Options Modal */}
                {showOptionsModal && (
                    <div className="post-options-overlay" onClick={() => setShowOptionsModal(false)}>
                        <div className="post-options-modal" onClick={(e) => e.stopPropagation()}>
                            {user && post?.by?._id === user._id ? (
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

    // If croppedImage is provided, this is for creating a new post or editing
    if (croppedImage) {
        console.log('PostDetailsModal: rendering create post modal with croppedImage:', !!croppedImage)
        return renderCreatePostModal()
    }

    // Otherwise, this is for viewing/editing an existing post
    if (!isOpen || !post) return null

    const handleAddComment = async (e) => {
        e.preventDefault()
        if (!commentText.trim()) return

        try {
            await addPostMsg(post._id, commentText)
            setCommentText('')
            
            // Refetch the post to get the new comment
            if (onUpdate) {
                const { postService } = await import('../services/post')
                const updatedPost = await postService.getById(post._id)
                await onUpdate(updatedPost)
            }
        } catch (err) {
            console.error('Error adding comment:', err)
        }
    }

    const handleCommentLike = async (commentId) => {
        if (!loggedInUser) return
        
        try {
            // Find the comment and toggle the like
            const updatedComments = post.comments.map(comment => {
                if (comment.id === commentId) {
                    const likedBy = comment.likedBy || []
                    const isLiked = likedBy.includes(loggedInUser._id)
                    
                    return {
                        ...comment,
                        likedBy: isLiked 
                            ? likedBy.filter(id => id !== loggedInUser._id)
                            : [...likedBy, loggedInUser._id]
                    }
                }
                return comment
            })
            
            // Update the post with new comment likes
            const updatedPost = { ...post, comments: updatedComments }
            await onUpdate(updatedPost)
            
        } catch (err) {
            console.error('Error liking comment:', err)
        }
    }

    const handleDeleteComment = (comment) => {
        setCommentToDelete(comment)
        setShowDeleteCommentModal(true)
    }

    const handleDelete = () => {
        if (onDelete) {
            onDelete(post._id)
            setShowOptionsModal(false)
            onClose() // Close the modal after deletion
        }
    }

    const handleEdit = () => {
        if (onEdit) {
            onEdit(post)
            setShowOptionsModal(false)
            onClose() // Close the modal when editing
        }
    }

    const confirmDeleteComment = async () => {
        if (!commentToDelete || !loggedInUser) return

        try {
            // Remove the comment from the post
            const updatedComments = post.comments.filter(comment => comment.id !== commentToDelete.id)
            const updatedPost = { ...post, comments: updatedComments }
            await onUpdate(updatedPost)
            
            // Close modal and reset state
            setShowDeleteCommentModal(false)
            setCommentToDelete(null)
        } catch (err) {
            console.error('Error deleting comment:', err)
        }
    }

    const canDeleteComment = (comment) => {
        if (!loggedInUser) return false
        // User can delete if they own the post OR they wrote the comment
        return loggedInUser._id === post.by?._id || loggedInUser._id === comment.by?._id
    }

    const isLiked = user && post.likedBy?.includes(user._id)

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
                    <img src={post.imgUrl} alt="Post" />
                </div>

                {/* Details section */}
                <div className="post-details-content">
                    {/* Header */}
                    <div className="post-details-header">
                        <div className="post-details-user">
                            <img 
                                src={post.by?.imgUrl || '/img/amir-avni.jpg.jpg'} 
                                alt={post.by?.username}
                                className="post-details-avatar"
                            />
                            <span 
                                className="post-details-username clickable"
                                onClick={() => {
                                    onClose()
                                    navigate(`/user/${post.by?._id}`)
                                }}
                            >
                                {post.by?.username || 'amir.avni'}
                            </span>
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

                    {/* Actions */}
                    <div className="post-details-actions">
                        <div className="post-details-action-icons">
                            <button 
                                className={`post-details-action-btn ${isLiked ? 'liked' : ''}`}
                                onClick={() => onLike && onLike(post._id)}
                            >
                                <svg width="24" height="24" viewBox="0 0 24 24" fill={isLiked ? 'currentColor' : 'none'}>
                                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                            </button>
                            <button className="post-details-action-btn">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                            </button>
                            <button className="post-details-action-btn">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                    <line x1="22" y1="2" x2="11" y2="13" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                                    <polygon points="22 2 15 22 11 13 2 9 22 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                            </button>
                        </div>
                        <button className="post-details-action-btn">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </button>
                    </div>

                    {/* Likes count */}
                    <div className="post-details-likes">
                        <strong>{post.likedBy?.length || 0} likes</strong>
                    </div>

                    {/* Post time */}
                    {post.createdAt && (
                        <div className="post-details-time">
                            {formatTimeAgo(post.createdAt)} ago
                        </div>
                    )}

                    {/* Comments section */}
                    <div className="post-details-comments">
                        {/* Caption */}
                        <div className="post-details-comment">
                            <img 
                                src={authorLoading ? (post.by?.imgUrl || '/img/amir-avni.jpg.jpg') : (postAuthor?.imgUrl || post.by?.imgUrl || '/img/amir-avni.jpg.jpg')} 
                                alt={authorLoading ? (post.by?.username) : (postAuthor?.username || post.by?.username)}
                                className="post-details-comment-avatar"
                            />
                            <div className="post-details-comment-content">
                                <span className="post-details-comment-username clickable" onClick={() => {
                                    onClose()
                                    navigate(`/user/${post.by?._id}`)
                                }}>{authorLoading ? (post.by?.username || 'amir.avni') : (postAuthor?.username || post.by?.username || 'amir.avni')}</span>
                                <span className="post-details-comment-text">{post.txt}</span>
                            </div>
                        </div>

                        {/* Comments */}
                        {post.comments && post.comments.length > 0 && (
                            <>
                                {post.comments.map((comment, idx) => {
                                    const isCommentLiked = loggedInUser && comment.likedBy?.includes(loggedInUser._id)
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

                    {/* Comment form */}
                    <form className="post-details-comment-form" onSubmit={handleAddComment}>
                        <input
                            type="text"
                            placeholder="Add a comment..."
                            value={commentText}
                            onChange={(e) => setCommentText(e.target.value)}
                        />
                        <div className="post-details-emoji-container">
                            <button 
                                type="button"
                                className="post-details-emoji-btn"
                                onClick={() => setShowCommentEmojiPicker(!showCommentEmojiPicker)}
                            >
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none"/>
                                    <circle cx="9" cy="9" r="1" fill="currentColor"/>
                                    <circle cx="15" cy="9" r="1" fill="currentColor"/>
                                    <path d="M9 14c0 1.5 1.5 3 3 3s3-1.5 3-3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none"/>
                                </svg>
                            </button>
                            
                            {/* Comment Emoji Picker */}
                            {showCommentEmojiPicker && (
                                <div className="post-details-emoji-picker">
                                    {emojis.map((emoji, index) => (
                                        <button
                                            key={index}
                                            type="button"
                                            className="post-details-emoji-option"
                                            onClick={() => addCommentEmoji(emoji)}
                                        >
                                            {emoji}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
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
        </div>
    )
}
