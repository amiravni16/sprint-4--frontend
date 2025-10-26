import { useNavigate } from 'react-router-dom'
import { useCommentUser } from '../customHooks/useCommentUser'
import { formatTimeAgo } from '../services/util.service'

export function CommentItem({ comment, loggedInUser, canDelete, onDeleteComment, onCommentLike, onClose }) {
    const navigate = useNavigate()
    const { commentUser } = useCommentUser(comment)
    
    const isCommentLiked = loggedInUser && comment.likedBy?.includes(loggedInUser._id)
    const commentLikeCount = comment.likedBy?.length || 0

    return (
        <div className="post-details-comment">
            <img 
                src={commentUser?.imgUrl || comment.by?.imgUrl || '/img/amir-avni.jpg.jpg'} 
                alt={commentUser?.username || comment.by?.username}
                className="post-details-comment-avatar"
            />
            <div className="post-details-comment-content">
                <span className="post-details-comment-username clickable" onClick={() => {
                    onClose()
                    navigate(`/user/${comment.by?._id}`)
                }}>{commentUser?.username || comment.by?.username || 'amir.avni'}</span>
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
                            onClick={() => onDeleteComment(comment)}
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
                onClick={() => onCommentLike(comment.id)}
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
}
