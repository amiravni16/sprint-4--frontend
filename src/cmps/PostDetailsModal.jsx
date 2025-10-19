import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'

export function PostDetailsModal({ croppedImage, onBack, onClose, onPost, caption: initialCaption = '' }) {
    const user = useSelector(storeState => storeState.userModule.user)
    const [caption, setCaption] = useState(initialCaption)
    const [showEmojiPicker, setShowEmojiPicker] = useState(false)

    // Update caption when initialCaption changes (for edit mode)
    useEffect(() => {
        setCaption(initialCaption)
    }, [initialCaption])

    const emojis = ['❤️', '😍', '😊', '😂', '😮', '😢', '👍', '👏', '🔥', '🎉', '💯', '✨', '😎', '🤔', '😀', '🙌']

    const handlePost = () => {
        onPost({ caption, image: croppedImage })
    }

    const insertEmoji = (emoji) => {
        setCaption(prev => prev + emoji)
        setShowEmojiPicker(false)
    }

    if (!croppedImage) return null

    return (
        <div className="post-create-overlay" onClick={onClose}>
            <button className="post-create-close-btn" onClick={onClose}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
            </button>
            <div className="post-create-modal" onClick={(e) => e.stopPropagation()}>
                {/* Left side - Image preview */}
                <div className="post-create-image-section">
                    <img 
                        src={croppedImage} 
                        alt="Post preview" 
                        className="post-create-image"
                    />
                </div>

                {/* Right side - Post details */}
                <div className="post-create-details-section">
                    {/* Header */}
                    <div className="post-create-header">
                        {onBack ? (
                            <button className="post-create-back-btn" onClick={onBack}>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                    <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                            </button>
                        ) : (
                            <div className="post-create-back-btn-placeholder"></div>
                        )}
                        <h2>{initialCaption ? 'Edit post' : 'Create new post'}</h2>
                        <button className="post-create-share-header-btn" onClick={handlePost}>
                            {initialCaption ? 'Done' : 'Share'}
                        </button>
                    </div>

                    {/* User info */}
                    <div className="post-create-user">
                        <img 
                            src={user?.imgUrl || 'https://i.pravatar.cc/40?img=1'} 
                            alt={user?.username}
                            className="post-create-avatar"
                        />
                        <span className="post-create-username">{user?.username || 'user'}</span>
                    </div>

                    {/* Caption input */}
                    <div className="post-create-caption-section">
                        <textarea
                            className="post-create-caption-input"
                            placeholder="Write a caption..."
                            value={caption}
                            onChange={(e) => setCaption(e.target.value)}
                            maxLength={2200}
                            rows={8}
                        />
                        <div className="post-create-caption-footer">
                            <button 
                                className="post-create-emoji-btn"
                                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                                type="button"
                            >
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none"/>
                                    <circle cx="9" cy="9" r="1" fill="currentColor"/>
                                    <circle cx="15" cy="9" r="1" fill="currentColor"/>
                                    <path d="M9 14c0 1.5 1.5 3 3 3s3-1.5 3-3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none"/>
                                </svg>
                            </button>
                            <span className="post-create-char-count">{caption.length}/2,200</span>
                        </div>

                        {/* Emoji picker */}
                        {showEmojiPicker && (
                            <div className="post-create-emoji-picker">
                                {emojis.map((emoji, idx) => (
                                    <button
                                        key={idx}
                                        className="post-create-emoji-item"
                                        onClick={() => insertEmoji(emoji)}
                                        type="button"
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
    )
}

