import { demoUsers } from '../data/demo-users.js'
import { demoPosts } from '../data/demo-posts.js'

export const storageService = {
    query,
    get,
    post,
    put,
    remove,
}

// Initialize demo data on first load
_initializeDemoData()

function query(entityType, delay = 500) {
    try {
        const data = localStorage.getItem(entityType)
        let entities = data ? JSON.parse(data) : []
        
        // Ensure entities is always an array
        if (!Array.isArray(entities)) {
            console.warn(`Invalid data structure for ${entityType}, resetting to empty array`)
            entities = []
            localStorage.setItem(entityType, JSON.stringify(entities))
        }
        
        return new Promise(resolve => setTimeout(() => resolve(entities), delay))
    } catch (err) {
        console.error(`Error querying ${entityType}:`, err)
        // Reset corrupted storage
        localStorage.setItem(entityType, JSON.stringify([]))
        return new Promise(resolve => setTimeout(() => resolve([]), delay))
    }
}

function get(entityType, entityId) {
    return query(entityType).then(entities => {
        const entity = entities.find(entity => entity._id === entityId)
        if (!entity) throw new Error(`Get failed, cannot find entity with id: ${entityId} in: ${entityType}`)
        return entity
    })
}

function post(entityType, newEntity) {
    // Preserve provided _id for stable demo data; otherwise assign a new one
    if (!newEntity._id) newEntity._id = _makeId()
    return query(entityType).then(entities => {
        // If an entity with the same _id already exists, replace it (idempotent upsert)
        const existingIdx = entities.findIndex(entity => entity._id === newEntity._id)
        if (existingIdx !== -1) {
            entities.splice(existingIdx, 1, newEntity)
            _save(entityType, entities)
            return newEntity
        }
        entities.push(newEntity)
        _save(entityType, entities)
        return newEntity
    })
}

function put(entityType, updatedEntity) {
    return query(entityType).then(entities => {
        const idx = entities.findIndex(entity => entity._id === updatedEntity._id)
        if (idx < 0) throw new Error(`Update failed, cannot find entity with id: ${updatedEntity._id} in: ${entityType}`)
        const entityToUpdate = {...entities[idx], ...updatedEntity}
        entities.splice(idx, 1, entityToUpdate)
        _save(entityType, entities)
        return entityToUpdate
    })
}

function remove(entityType, entityId) {
    return query(entityType).then(entities => {
        const idx = entities.findIndex(entity => entity._id === entityId)
        if (idx < 0) throw new Error(`Remove failed, cannot find entity with id: ${entityId} in: ${entityType}`)
        entities.splice(idx, 1)
        _save(entityType, entities)
    })
}

// Private functions

function _save(entityType, entities) {
    localStorage.setItem(entityType, JSON.stringify(entities))
}

function _makeId(length = 5) {
    var text = ''
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    for (var i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length))
    }
    return text
}

function _initializeDemoData() {
    try {
        // Check if demo data already exists
        const existingUsers = localStorage.getItem('user')
        const existingPosts = localStorage.getItem('post')
        
        const users = existingUsers ? JSON.parse(existingUsers) : []
        const posts = existingPosts ? JSON.parse(existingPosts) : []
        
        // Only initialize if storage is empty
        if (users.length === 0 && posts.length === 0) {
            console.log('🚀 Initializing demo data on first load...')
            
            // Save demo users
            localStorage.setItem('user', JSON.stringify(demoUsers))
            
            // Save demo posts
            localStorage.setItem('post', JSON.stringify(demoPosts))
            
            console.log('✅ Demo data initialized:', {
                users: demoUsers.length,
                posts: demoPosts.length
            })
        } else {
            console.log('📊 Existing data found:', {
                users: users.length,
                posts: posts.length
            })
        }
    } catch (err) {
        console.error('❌ Error initializing demo data:', err)
    }
}