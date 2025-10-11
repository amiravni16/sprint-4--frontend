import { Link } from 'react-router-dom'

export function PostPreview({ post }) {
    return <article className="post-preview">
        <header>
            <Link to={`/post/${post._id}`}>{post.txt}</Link>
        </header>

        {post.imgUrl && <img src={post.imgUrl} alt="Post" style={{width: '100px', height: '100px', objectFit: 'cover'}} />}
        {post.by && <p>Author: <span>{post.by.fullname}</span></p>}
        {post.createdAt && <p>Created: <span>{new Date(post.createdAt).toLocaleDateString()}</span></p>}
        {post.tags && post.tags.length > 0 && <p>Tags: <span>{post.tags.join(', ')}</span></p>}
        {post.likedBy && <p>Likes: <span>{post.likedBy.length}</span></p>}
        {post.comments && <p>Comments: <span>{post.comments.length}</span></p>}
        
    </article>
}
