import { PostPreview } from './PostPreview'

export function PostList({ posts, onLike, onComment }) {
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
                    </li>
                ))}
            </ul>
        </section>
    )
}
