import { postService } from '../../services/post'
import { feedService } from '../../services/feed.service'
import { store } from '../store'
import { ADD_POST, REMOVE_POST, SET_POSTS, SET_POST, UPDATE_POST, ADD_POST_MSG } from '../reducers/post.reducer'

export async function loadPosts(filterBy) {
    try {
        // Get current user from store
        const state = store.getState()
        const loggedInUser = state.userModule.user
        
        console.log('🔍 [POSTS] Loading posts with bulletproof feed service...', { 
            user: loggedInUser?.username, 
            following: loggedInUser?.following?.length || 0 
        })
        
        // Use bulletproof feed service to get posts
        const feedPosts = await feedService.getFeedPosts(filterBy, loggedInUser)
        
        // Update store with feed posts
        store.dispatch(getCmdSetPosts(feedPosts))
        
        console.log('✅ [POSTS] Feed posts loaded successfully:', feedPosts.length)
        return feedPosts
        
    } catch (err) {
        console.error('❌ [POSTS] Error loading posts:', err)
        
        // Ultimate fallback: try to get all posts
        try {
            const allPosts = await postService.query(filterBy)
            store.dispatch(getCmdSetPosts(allPosts))
            console.log('🔄 [POSTS] Fallback: loaded all posts due to error')
            return allPosts
        } catch (fallbackErr) {
            console.error('❌ [POSTS] Fallback also failed:', fallbackErr)
            store.dispatch(getCmdSetPosts([]))
            return []
        }
    }
}

export async function loadPost(postId) {
    try {
        const post = await postService.getById(postId)
        store.dispatch(getCmdSetPost(post))
    } catch (err) {
        console.log('Cannot load post', err)
        throw err
    }
}

export async function removePost(postId) {
    try {
        await postService.remove(postId)
        store.dispatch(getCmdRemovePost(postId))
    } catch (err) {
        console.log('Cannot remove post', err)
        throw err
    }
}

export async function addPost(post) {
    try {
        const savedPost = await postService.save(post)
        store.dispatch(getCmdAddPost(savedPost))
        return savedPost
    } catch (err) {
        console.log('Cannot add post', err)
        throw err
    }
}

export async function updatePost(post) {
    try {
        const savedPost = await postService.save(post)
        store.dispatch(getCmdUpdatePost(savedPost))
        return savedPost
    } catch (err) {
        console.log('Cannot save post', err)
        throw err
    }
}

export async function addPostMsg(postId, txt) {
    try {
        const msg = await postService.addPostMsg(postId, txt)
        store.dispatch(getCmdAddPostMsg(msg, postId))
        return msg
    } catch (err) {
        console.log('Cannot add post msg', err)
        throw err
    }
}

// Command Creators:
function getCmdSetPosts(posts) {
    return {
        type: SET_POSTS,
        posts
    }
}

function getCmdSetPost(post) {
    return {
        type: SET_POST,
        post
    }
}

function getCmdRemovePost(postId) {
    return {
        type: REMOVE_POST,
        postId
    }
}

function getCmdAddPost(post) {
    return {
        type: ADD_POST,
        post
    }
}

function getCmdUpdatePost(post) {
    return {
        type: UPDATE_POST,
        post
    }
}

function getCmdAddPostMsg(msg, postId) {
    return {
        type: ADD_POST_MSG,
        msg,
        postId
    }
}

// unitTestActions()
async function unitTestActions() {
    await loadPosts()
    await addPost(postService.getEmptyPost())
    await updatePost({
        _id: 'm1oC7',
        txt: 'Updated Post Title',
    })
    await removePost('m1oC7')
    // TODO unit test addPostMsg
}
