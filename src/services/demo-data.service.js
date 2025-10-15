import { demoUsers } from '../data/demo-users.js'
import { demoPosts } from '../data/demo-posts.js'
import { storageService } from './async-storage.service.js'

export const demoDataService = {
    initializeDemoData,
    clearDemoData,
    isDemoDataLoaded
}

async function initializeDemoData() {
    try {
        // Check if demo data already exists
        const existingUsers = await storageService.query('user')
        const existingPosts = await storageService.query('post')
        
        console.log('📊 Current data:', { users: existingUsers.length, posts: existingPosts.length })
        
        if (existingUsers.length > 1 || existingPosts.length > 0) {
            console.log('📊 Demo data already exists, skipping initialization')
            return { users: existingUsers, posts: existingPosts }
        }

        console.log('🚀 Initializing demo data...')

        // Initialize users
        const users = []
        for (const user of demoUsers) {
            const savedUser = await storageService.post('user', user)
            users.push(savedUser)
        }
        console.log(`✅ Created ${users.length} demo users`)

        // Initialize posts
        const posts = []
        for (const post of demoPosts) {
            const savedPost = await storageService.post('post', post)
            posts.push(savedPost)
        }
        console.log(`✅ Created ${posts.length} demo posts`)

        console.log('🎉 Demo data initialization complete!')
        return { users, posts }
    } catch (err) {
        console.error('❌ Error initializing demo data:', err)
        throw err
    }
}

async function clearDemoData() {
    try {
        // Clear all users except admin
        const users = await storageService.query('user')
        for (const user of users) {
            if (user._id !== '64f0a1c2b3d4e5f678901234') {
                await storageService.remove('user', user._id)
            }
        }

        // Clear all posts
        const posts = await storageService.query('post')
        for (const post of posts) {
            await storageService.remove('post', post._id)
        }

        console.log('🗑️ Demo data cleared!')
    } catch (err) {
        console.error('❌ Error clearing demo data:', err)
        throw err
    }
}

async function isDemoDataLoaded() {
    try {
        const users = await storageService.query('user')
        const posts = await storageService.query('post')
        return users.length > 1 && posts.length > 0
    } catch (err) {
        return false
    }
}
