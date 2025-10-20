import { postService } from '../../services/post'
import { store } from '../store'
import { ADD_POST, REMOVE_POST, SET_POSTS, SET_POST, UPDATE_POST, ADD_POST_MSG } from '../reducers/post.reducer'

export async function loadPosts(filterBy) {
    try {
        const posts = await postService.query(filterBy)
        
        // Filter posts to show only posts from users the current user is following
        const state = store.getState()
        const loggedInUser = state.userModule.user
        
        if (loggedInUser && loggedInUser.following && loggedInUser.following.length > 0) {
            const followingIds = loggedInUser.following
            const filteredPosts = posts.filter(post => {
                // Include posts from users you're following OR your own posts
                return followingIds.includes(post.by?._id) || post.by?._id === loggedInUser._id
            })
            store.dispatch(getCmdSetPosts(filteredPosts))
            return filteredPosts
        } else if (loggedInUser) {
            // If user is logged in but not following anyone, show only their own posts
            const ownPosts = posts.filter(post => post.by?._id === loggedInUser._id)
            store.dispatch(getCmdSetPosts(ownPosts))
            return ownPosts
        } else {
            // If no user is logged in, show all posts
            store.dispatch(getCmdSetPosts(posts))
            return posts
        }
    } catch (err) {
        console.log('Cannot load posts', err)
        throw err
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
