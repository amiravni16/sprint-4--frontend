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
        posts = posts.filter(post => regex.test(post.txt) || (post.tags && post.tags.some(tag => regex.test(tag))))
    }
    
    if(sortField === 'txt'){
        posts.sort((post1, post2) => 
            post1[sortField].localeCompare(post2[sortField]) * +sortDir)
    }
    if(sortField === 'createdAt'){
        posts.sort((post1, post2) => 
            (new Date(post1[sortField]) - new Date(post2[sortField])) * +sortDir)
    }
    
    posts = posts.map(({ _id, txt, by, createdAt, imgUrl, likedBy, comments, tags, loc }) => ({ _id, txt, by, createdAt, imgUrl, likedBy, comments, tags, loc }))
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
            txt: post.txt,
            imgUrl: post.imgUrl,
            tags: post.tags || [],
            likedBy: post.likedBy || [],
            comments: post.comments || [],
            by: post.by,
            loc: post.loc || { name: '', lat: 0, lng: 0 },
            createdAt: post.createdAt || Date.now()
        }
        savedPost = await storageService.put(STORAGE_KEY, postToSave)
    } else {
        const loggedinUser = userService.getLoggedinUser()
        const postToSave = {
            txt: post.txt,
            imgUrl: post.imgUrl,
            by: {
                _id: loggedinUser._id,
                fullname: loggedinUser.fullname,
                username: loggedinUser.username,
                imgUrl: loggedinUser.imgUrl
            },
            loc: post.loc || { name: '', lat: 0, lng: 0 },
            comments: [],
            likedBy: [],
            tags: post.tags || [],
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
        by: {
            _id: userService.getLoggedinUser()._id,
            fullname: userService.getLoggedinUser().fullname,
            imgUrl: userService.getLoggedinUser().imgUrl
        },
        txt,
        likedBy: [],
        createdAt: Date.now()
    }
    post.comments.push(msg)
    await storageService.put(STORAGE_KEY, post)

    return msg
}
