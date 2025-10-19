import { PostPreview } from './PostPreview'

export function PostList({ posts, onLike, onComment, user, onDelete, onEdit }) {
    return (
        <section className="post-feed">
            <ul className="post-list">
                {posts.map(post => (
                    <li key={post._id}>
                        <PostPreview 
                            post={post}
                            onLike={onLike}
                            onComment={onComment}
                            onDelete={onDelete}
                            onEdit={onEdit}
                            user={user}
                        />
                    </li>
                ))}
            </ul>
        </section>
    )
}
