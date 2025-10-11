import { Link } from 'react-router-dom'

export function PostPreview({ post }) {
    return <article className="post-preview">
        <header>
            <Link to={`/post/${post._id}`}>{post.title}</Link>
        </header>

        {post.owner && <p>Author: <span>{post.owner.fullname}</span></p>}
        {post.createdAt && <p>Created: <span>{new Date(post.createdAt).toLocaleDateString()}</span></p>}
        
    </article>
}
