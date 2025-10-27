import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { showErrorMsg } from '../services/event-bus.service'
import { shuffleArray } from '../services/util.service'
import { PostViewModal } from '../cmps/PostViewModal'
import '../assets/styles/cmps/ExplorePage.css'

export function ExplorePage() {
    const user = useSelector(storeState => storeState.userModule.user)
    const [explorePosts, setExplorePosts] = useState([])
    const [selectedPost, setSelectedPost] = useState(null)

    useEffect(() => {
        loadExplorePosts()
    }, [user])

    async function loadExplorePosts() {
        try {
            const followingIds = user?.following || []
            
            // Load posts directly from the service
            const { postService } = await import('../services/post')
            const posts = await postService.query() || []
            
            // Show all posts from users you DON'T follow (excluding your own posts)
            const explorePosts = posts.filter(post => {
                const byId = typeof post.by === 'string' ? post.by : post.by?._id
                
                // Must have an author ID and image
                if (!byId || !post.imgUrl) return false
                
                // Must NOT be from someone you follow
                const isFollowed = followingIds.some(followId => {
                    const followUserId = typeof followId === 'string' ? followId : followId._id || followId
                    return followUserId === byId
                })
                
                // Must not be your own post
                return !isFollowed && byId !== user?._id
            })

            // If no posts from unfollowed users, show all posts except your own
            const finalPosts = explorePosts.length > 0 ? explorePosts : 
                posts.filter(post => {
                    const byId = typeof post.by === 'string' ? post.by : post.by?._id
                    return byId && post.imgUrl && byId !== user?._id
                })

            // Shuffle and take at least 12 posts
            const shuffled = shuffleArray([...finalPosts])
            const minPosts = 12
            const postCount = Math.max(minPosts, Math.min(30, shuffled.length))
            
            setExplorePosts(shuffled.slice(0, postCount))
        } catch (err) {
            console.error('Failed to load explore posts:', err)
            showErrorMsg('Failed to load explore posts')
        }
    }

    function handlePostClick(post) {
        setSelectedPost(post)
    }

    function handleCloseModal() {
        setSelectedPost(null)
    }

    async function handleUpdatePost(updatedPost) {
        try {
            // Update the post in explorePosts
            setExplorePosts(prevPosts => 
                prevPosts.map(p => p._id === updatedPost._id ? updatedPost : p)
            )
            
            // Also update selectedPost if it's the one being updated
            if (selectedPost && selectedPost._id === updatedPost._id) {
                setSelectedPost(updatedPost)
            }
        } catch (err) {
            console.error('Failed to update post:', err)
        }
    }

    if (!explorePosts.length) {
        return (
            <div className="explore-page">
                <div className="explore-empty">
                    <h2>Explore</h2>
                    <p>No posts to explore right now. Follow more users to see their content in your feed!</p>
                </div>
            </div>
        )
    }

    return (
        <>
            <div className="explore-page">
                <div className="explore-grid">
                    {explorePosts.map(post => (
                        <div 
                            key={post._id} 
                            className="explore-post-wrapper"
                            onClick={() => handlePostClick(post)}
                        >
                            <img 
                                src={post.imgUrl} 
                                alt="Post" 
                                className="explore-post-image"
                                loading="lazy"
                            />
                            <div className="explore-post-overlay">
                                <div className="explore-post-stats">
                                    {post.likedBy && post.likedBy.length > 0 && (
                                        <div className="stat-item">
                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                                                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                                            </svg>
                                            <span>{post.likedBy.length}</span>
                                        </div>
                                    )}
                                    {post.comments && post.comments.length > 0 && (
                                        <div className="stat-item">
                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                                            </svg>
                                            <span>{post.comments.length}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            
            {selectedPost && (
                <PostViewModal 
                    post={selectedPost} 
                    isOpen={!!selectedPost} 
                    onClose={handleCloseModal}
                    onUpdate={handleUpdatePost}
                />
            )}
        </>
    )
}

