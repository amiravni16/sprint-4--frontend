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
        post.title = prompt('Post title?', 'Some Post Title')
        try {
            const savedPost = await addPost(post)
            showSuccessMsg(`Post added (id: ${savedPost._id})`)
        } catch (err) {
            showErrorMsg('Cannot add post')
        }        
    }

    async function onUpdatePost(post) {
        const title = prompt('New title?', post.title) || ''
        if(title === '' || title === post.title) return

        const postToSave = { ...post, title }
        try {
            const savedPost = await updatePost(postToSave)
            showSuccessMsg(`Post updated, new title: ${savedPost.title}`)
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
