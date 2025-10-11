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
                <img 
                    src={post.by?.imgUrl || 'https://via.placeholder.com/32x32'} 
                    alt={post.by?.fullname} 
                    className="profile-pic"
                />
                <Link to={`/user/${post.by?._id}`} className="username">
                    {post.by?.fullname}
                </Link>
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
                    {isLiked ? '❤️' : '🤍'}
                </button>
                <button className="action-btn comment-btn">💬</button>
                <button className="action-btn share-btn">📤</button>
                <button className="action-btn save-btn">🔖</button>
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
                    {post.by?.fullname}
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
