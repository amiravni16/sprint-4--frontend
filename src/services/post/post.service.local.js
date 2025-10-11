import { storageService } from '../async-storage.service'
import { makeId } from '../util.service'
import { userService } from '../user'

const STORAGE_KEY = 'post'

export const postService = {
    query,
    getById,
    save,
    remove,
    addPostMsg
}
window.ps = postService

async function query(filterBy = { txt: '' }) {
    var posts = await storageService.query(STORAGE_KEY)
    const { txt, sortField, sortDir } = filterBy

    if (txt) {
        const regex = new RegExp(filterBy.txt, 'i')
        posts = posts.filter(post => regex.test(post.title) || regex.test(post.description))
    }
    
    if(sortField === 'title'){
        posts.sort((post1, post2) => 
            post1[sortField].localeCompare(post2[sortField]) * +sortDir)
    }
    if(sortField === 'createdAt'){
        posts.sort((post1, post2) => 
            (new Date(post1[sortField]) - new Date(post2[sortField])) * +sortDir)
    }
    
    posts = posts.map(({ _id, title, owner, createdAt }) => ({ _id, title, owner, createdAt }))
    return posts
}

function getById(postId) {
    return storageService.get(STORAGE_KEY, postId)
}

async function remove(postId) {
    await storageService.remove(STORAGE_KEY, postId)
}

async function save(post) {
    var savedPost
    if (post._id) {
        const postToSave = {
            _id: post._id,
            title: post.title
        }
        savedPost = await storageService.put(STORAGE_KEY, postToSave)
    } else {
        const postToSave = {
            title: post.title,
            owner: userService.getLoggedinUser(),
            msgs: [],
            createdAt: Date.now()
        }
        savedPost = await storageService.post(STORAGE_KEY, postToSave)
    }
    return savedPost
}

async function addPostMsg(postId, txt) {
    const post = await getById(postId)

    const msg = {
        id: makeId(),
        by: userService.getLoggedinUser(),
        txt
    }
    post.msgs.push(msg)
    await storageService.put(STORAGE_KEY, post)

    return msg
}
