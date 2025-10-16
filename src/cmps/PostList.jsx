import { PostPreview } from './PostPreview'

export function PostList({ posts, onLike, onComment, user }) {
    return (
        <section className="post-feed">
            <ul className="post-list">
                {posts.map(post => (
                    <li key={post._id}>
                        <PostPreview 
                            post={post}
                            onLike={onLike}
                            onComment={onComment}
                            user={user}
                        />
                    </li>
                ))}
            </ul>
        </section>
    )
}
