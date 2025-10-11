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
            newState = { ...state, posts: [...state.posts, action.post] }
            break
        case UPDATE_POST:
            posts = state.posts.map(post => (post._id === action.post._id) ? action.post : post)
            newState = { ...state, posts }
            break
        case ADD_POST_MSG:
            if (action.msg && state.post) {
                newState = { ...state, post: { ...state.post, msgs: [...state.post.msgs || [], action.msg] } }
                break
            }
        default:
    }
    return newState
}

// unitTestReducer()

function unitTestReducer() {
    var state = initialState
    const post1 = { _id: 'p101', title: 'Post ' + parseInt('' + Math.random() * 10), owner: null, msgs: [] }
    const post2 = { _id: 'p102', title: 'Post ' + parseInt('' + Math.random() * 10), owner: null, msgs: [] }

    state = postReducer(state, { type: SET_POSTS, posts: [post1] })
    console.log('After SET_POSTS:', state)

    state = postReducer(state, { type: ADD_POST, post: post2 })
    console.log('After ADD_POST:', state)

    state = postReducer(state, { type: UPDATE_POST, post: { ...post2, title: 'Updated Post' } })
    console.log('After UPDATE_POST:', state)

    state = postReducer(state, { type: REMOVE_POST, postId: post2._id })
    console.log('After REMOVE_POST:', state)

    state = postReducer(state, { type: SET_POST, post: post1 })
    console.log('After SET_POST:', state)

    const msg = { id: 'm' + parseInt('' + Math.random() * 100), txt: 'Some comment', by: { _id: 'u123', fullname: 'test' } }
    state = postReducer(state, { type: ADD_POST_MSG, postId: post1._id, msg })
    console.log('After ADD_POST_MSG:', state)
}
