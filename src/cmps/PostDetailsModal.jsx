import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { addPostMsg } from '../store/actions/post.actions'

export function PostDetailsModal({ isOpen, onClose, post, onLike, onDelete, onEdit, croppedImage, caption, onBack, onPost, aspectRatio = '1:1' }) {
    const [commentText, setCommentText] = useState('')
    const [showCommentEmojiPicker, setShowCommentEmojiPicker] = useState(false)
    const user = useSelector(storeState => storeState.userModule.user)
    const isOwnPost = user && post && user._id === post.by?._id

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

    // If croppedImage is provided, this is for creating a new post
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
        } catch (err) {
            console.error('Error adding comment:', err)
        }
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
                <div className="post-details-image">
                    <img src={post.imgUrl} alt="Post" />
                </div>

                {/* Details section */}
                <div className="post-details-content">
                    {/* Header */}
                    <div className="post-details-header">
                        <div className="post-details-user">
                            <img 
                                src={post.by?.imgUrl || 'https://i.pravatar.cc/150?img=1'} 
                                alt={post.by?.username}
                                className="post-details-avatar"
                            />
                            <span className="post-details-username">{post.by?.username}</span>
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
                                src={post.by?.imgUrl || 'https://i.pravatar.cc/150?img=1'} 
                                alt={post.by?.username}
                                className="post-details-comment-avatar"
                            />
                            <div className="post-details-comment-content">
                                <span className="post-details-comment-username">{post.by?.username}</span>
                                <span className="post-details-comment-text">{post.txt}</span>
                            </div>
                        </div>

                        {/* Comments */}
                        {post.comments && post.comments.length > 0 && (
                            <>
                                {post.comments.map((comment, idx) => (
                                    <div key={idx} className="post-details-comment">
                                        <img 
                                            src={comment.by?.imgUrl || 'https://i.pravatar.cc/150?img=1'} 
                                            alt={comment.by?.username}
                                            className="post-details-comment-avatar"
                                        />
                                        <div className="post-details-comment-content">
                                            <span className="post-details-comment-username">{comment.by?.username}</span>
                                            <span className="post-details-comment-text">{comment.txt}</span>
                                        </div>
                                    </div>
                                ))}
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
        </div>
    )

    function renderCreatePostModal() {
        console.log('renderCreatePostModal called')
        const [captionText, setCaptionText] = useState(caption || '')
        const [characterCount, setCharacterCount] = useState(captionText.length)
        const [showEmojiPicker, setShowEmojiPicker] = useState(false)

        const emojis = ['😊', '😂', '❤️', '👍', '👎', '😢', '😮', '😡', '🎉', '🔥', '💯', '✨']

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
                        <h2>Create new post</h2>
                        <button className="post-create-share-btn" onClick={handlePost}>
                            Share
                        </button>
                    </div>

                    {/* Content */}
                    <div className="post-create-content">
                        {/* Image Preview */}
                        <div className="post-create-image">
                            <img src={croppedImage} alt="Post" />
                        </div>

                        {/* Right Panel */}
                        <div className="post-create-right">
                            {/* User Info */}
                            <div className="post-create-user-info">
                                <img 
                                    src={user?.imgUrl || 'https://i.pravatar.cc/150?img=1'} 
                                    alt={user?.username}
                                    className="post-create-avatar"
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
            </div>
        )
    }
}
