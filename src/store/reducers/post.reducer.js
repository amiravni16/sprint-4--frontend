export const SET_POSTS = 'SET_POSTS'
export const SET_POST = 'SET_POST'
export const REMOVE_POST = 'REMOVE_POST'
export const ADD_POST = 'ADD_POST'
export const UPDATE_POST = 'UPDATE_POST'
export const ADD_POST_MSG = 'ADD_POST_MSG'

const initialState = {
    posts: [],
    post: null
}

export function postReducer(state = initialState, action) {
    var newState = state
    var posts
    switch (action.type) {
        case SET_POSTS:
            newState = { ...state, posts: action.posts }
            break
        case SET_POST:
            newState = { ...state, post: action.post }
            break
        case REMOVE_POST:
            const lastRemovedPost = state.posts.find(post => post._id === action.postId)
            posts = state.posts.filter(post => post._id !== action.postId)
            newState = { ...state, posts, lastRemovedPost }
            break
        case ADD_POST:
            // Add new posts at the beginning (top of feed) for better UX
            newState = { ...state, posts: [action.post, ...state.posts] }
            break
        case UPDATE_POST:
            posts = state.posts.map(post => (post._id === action.post._id) ? action.post : post)
            newState = { ...state, posts }
            break
        case ADD_POST_MSG:
            if (action.msg && action.postId) {
                // Update the posts array
                posts = state.posts.map(post => {
                    if (post._id === action.postId) {
                        return { ...post, comments: [...(post.comments || []), action.msg] }
                    }
                    return post
                })
                newState = { ...state, posts }
                
                // Also update the single post if it exists and matches
                if (state.post && state.post._id === action.postId) {
                    newState = { ...state, posts, post: { ...state.post, comments: [...(state.post.comments || []), action.msg] } }
                }
                break
            }
        default:
    }
    return newState
}

// unitTestReducer()

function unitTestReducer() {
    var state = initialState
    const post1 = { _id: 'p101', txt: 'Post ' + parseInt('' + Math.random() * 10), by: null, comments: [] }
    const post2 = { _id: 'p102', txt: 'Post ' + parseInt('' + Math.random() * 10), by: null, comments: [] }

    state = postReducer(state, { type: SET_POSTS, posts: [post1] })
    console.log('After SET_POSTS:', state)

    state = postReducer(state, { type: ADD_POST, post: post2 })
    console.log('After ADD_POST:', state)

    state = postReducer(state, { type: UPDATE_POST, post: { ...post2, txt: 'Updated Post' } })
    console.log('After UPDATE_POST:', state)

    state = postReducer(state, { type: REMOVE_POST, postId: post2._id })
    console.log('After REMOVE_POST:', state)

    state = postReducer(state, { type: SET_POST, post: post1 })
    console.log('After SET_POST:', state)

    const msg = { id: 'm' + parseInt('' + Math.random() * 100), txt: 'Some comment', by: { _id: 'u123', fullname: 'test' } }
    state = postReducer(state, { type: ADD_POST_MSG, postId: post1._id, msg })
    console.log('After ADD_POST_MSG:', state)
}
