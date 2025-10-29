import { httpService } from '../http.service'

export const postService = {
    query,
    getById,
    getByUserId,
    save,
    remove,
    addPostMsg
}

async function query(filterBy = { txt: '' }) {
    return httpService.get(`post`, filterBy)
}

function getById(postId) {
    return httpService.get(`post/${postId}`)
}

function getByUserId(userId) {
    return httpService.get(`post/user/${userId}`)
}

async function remove(postId) {
    return httpService.delete(`post/${postId}`)
}

async function save(post) {
    var savedPost
    if (post._id) {
        savedPost = await httpService.put(`post/${post._id}`, post)
    } else {
        savedPost = await httpService.post('post', post)
    }
    return savedPost
}

async function addPostMsg(postId, txt) {
    const savedMsg = await httpService.post(`post/${postId}/msg`, {txt})
    return savedMsg
}
