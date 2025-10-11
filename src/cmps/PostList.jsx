import { userService } from '../services/user'
import { PostPreview } from './PostPreview'

export function PostList({ posts, onRemovePost, onUpdatePost, onLike, onComment }) {
    
    function shouldShowActionBtns(post) {
        const user = userService.getLoggedinUser()
        
        if (!user) return false
        if (user.isAdmin) return true
        return post.by?._id === user._id
    }

    return (
        <section className="post-feed">
            <ul className="post-list">
                {posts.map(post => (
                    <li key={post._id}>
                        <PostPreview 
                            post={post}
                            onLike={onLike}
                            onComment={onComment}
                        />
                        {shouldShowActionBtns(post) && (
                            <div className="actions">
                                <button 
                                    className="edit-btn"
                                    onClick={() => onUpdatePost(post)}
                                >
                                    ✏️ Edit
                                </button>
                                <button 
                                    className="delete-btn"
                                    onClick={() => onRemovePost(post._id)}
                                >
                                    🗑️ Delete
                                </button>
                            </div>
                        )}
                    </li>
                ))}
            </ul>
        </section>
    )
}
