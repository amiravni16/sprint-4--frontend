import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'

import { loadPosts, addPost, updatePost, removePost, addPostMsg } from '../store/actions/post.actions'

import { showSuccessMsg, showErrorMsg } from '../services/event-bus.service'
import { postService } from '../services/post/'
import { userService } from '../services/user'

import { PostList } from '../cmps/PostList'
import { PostFilter } from '../cmps/PostFilter'

export function PostIndex() {

    const [ filterBy, setFilterBy ] = useState(postService.getDefaultFilter())
    const posts = useSelector(storeState => storeState.postModule.posts)

    useEffect(() => {
        loadPosts(filterBy)
    }, [filterBy])

    async function onRemovePost(postId) {
        try {
            await removePost(postId)
            showSuccessMsg('Post removed')            
        } catch (err) {
            showErrorMsg('Cannot remove post')
        }
    }

    async function onAddPost() {
        const post = postService.getEmptyPost()
        post.txt = prompt('Post text?', 'Best trip ever!')
        post.imgUrl = prompt('Image URL?', 'https://picsum.photos/400/400')
        post.tags = prompt('Tags (comma separated)?', 'fun, travel').split(',').map(tag => tag.trim())
        try {
            const savedPost = await addPost(post)
            showSuccessMsg(`Post added (id: ${savedPost._id})`)
        } catch (err) {
            showErrorMsg('Cannot add post')
        }        
    }

    async function onUpdatePost(post) {
        const txt = prompt('New text?', post.txt) || ''
        if(txt === '' || txt === post.txt) return

        const postToSave = { ...post, txt }
        try {
            const savedPost = await updatePost(postToSave)
            showSuccessMsg(`Post updated, new text: ${savedPost.txt}`)
        } catch (err) {
            showErrorMsg('Cannot update post')
        }        
    }

    return (
        <section className="post-index">
            <header>
                <h2>Posts</h2>
                {userService.getLoggedinUser() && <button onClick={onAddPost}>Add a Post</button>}
            </header>
            <PostFilter filterBy={filterBy} setFilterBy={setFilterBy} />
            <PostList 
                posts={posts}
                onRemovePost={onRemovePost} 
                onUpdatePost={onUpdatePost}/>
        </section>
    )
}
