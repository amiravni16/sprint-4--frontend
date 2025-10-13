import { Link } from 'react-router-dom'

export function PostPreview({ post, onLike, onComment }) {
    
    const formatTimeAgo = (timestamp) => {
        const now = new Date()
        const postTime = new Date(timestamp)
        const diffInSeconds = Math.floor((now - postTime) / 1000)
        
        if (diffInSeconds < 60) return 'JUST NOW'
        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}M`
        if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}H`
        return `${Math.floor(diffInSeconds / 86400)}D`
    }

    const isLiked = post.likedBy && post.likedBy.length > 0

    return (
        <article className="post-preview">
            {/* Post Header */}
            <div className="post-header">
                <div className="user-info">
                    <div className="profile-pic-container" style={{ position: 'relative', width: '32px', height: '32px' }}>
                        <img 
                            src="https://i.pravatar.cc/32?img=1" 
                            alt="Profile" 
                            className="profile-pic"
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
                        {post.by?.username || 'amir.avni'}
                    </Link>
                </div>
                <button className="more-btn">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="12" r="1" fill="currentColor"/>
                        <circle cx="19" cy="12" r="1" fill="currentColor"/>
                        <circle cx="5" cy="12" r="1" fill="currentColor"/>
                    </svg>
                </button>
            </div>

            {/* Post Image */}
            {post.imgUrl && (
                <img 
                    src={post.imgUrl} 
                    alt="Post" 
                    className="post-image"
                />
            )}

            {/* Post Actions */}
            <div className="post-actions">
                <button 
                    className={`action-btn like-btn ${isLiked ? 'liked' : ''}`}
                    onClick={() => onLike && onLike(post._id)}
                >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                        {isLiked ? (
                            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="currentColor"/>
                        ) : (
                            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" stroke="currentColor" strokeWidth="2" fill="none"/>
                        )}
                    </svg>
                </button>
                <button className="action-btn comment-btn">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path d="M21.99 4c0-1.1-.89-2-2-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14l4 4-.01-18z" stroke="currentColor" strokeWidth="2" fill="none"/>
                    </svg>
                </button>
                <button className="action-btn share-btn">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <polyline points="16,6 12,2 8,6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <line x1="12" y1="2" x2="12" y2="15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                </button>
                <button className="action-btn save-btn">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" stroke="currentColor" strokeWidth="2" fill="none"/>
                    </svg>
                </button>
            </div>

            {/* Post Stats */}
            {post.likedBy && post.likedBy.length > 0 && (
                <div className="post-stats">
                    {post.likedBy.length} like{post.likedBy.length !== 1 ? 's' : ''}
                </div>
            )}

            {/* Post Caption */}
            <div className="post-caption">
                <Link to={`/user/${post.by?._id}`} className="username">
                    {post.by?.username || 'amir.avni'}
                </Link>
                {post.txt}
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

            {/* Comments Section */}
            {post.comments && post.comments.length > 0 && (
                <div className="comments-section">
                    {post.comments.length > 2 && (
                        <div style={{ fontSize: '14px', color: '#8e8e8e', marginBottom: '8px' }}>
                            View all {post.comments.length} comments
                        </div>
                    )}
                    {post.comments.slice(-2).map(comment => (
                        <div key={comment.id} className="comment">
                            <Link to={`/user/${comment.by._id}`} className="username">
                                {comment.by.fullname}
                            </Link>
                            {comment.txt}
                        </div>
                    ))}
                </div>
            )}

            {/* Post Time */}
            {post.createdAt && (
                <div className="post-time">
                    {formatTimeAgo(post.createdAt)} ago
                </div>
            )}

            {/* Add Comment */}
            <div className="add-comment">
                <input 
                    type="text" 
                    placeholder="Add a comment..." 
                    onKeyPress={(e) => {
                        if (e.key === 'Enter' && e.target.value.trim()) {
                            onComment && onComment(post._id, e.target.value.trim())
                            e.target.value = ''
                        }
                    }}
                />
                <button>Post</button>
            </div>
        </article>
    )
}
