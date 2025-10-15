// Storage initialization service
// Ensures localStorage has valid structure on app startup

export const storageInitService = {
    init
}

function init() {
    console.log('🔧 Initializing storage...')
    
    // Only check for legacy entities (review, car)
    // user and post are handled by demo data initialization in async-storage.service.js
    const legacyEntities = ['review', 'car']
    
    legacyEntities.forEach(entityType => {
        try {
            const data = localStorage.getItem(entityType)
            
            // Check if data exists and is valid JSON
            if (data) {
                const parsed = JSON.parse(data)
                
                // Ensure it's an array
                if (!Array.isArray(parsed)) {
                    console.warn(`⚠️ ${entityType} storage corrupted (not an array), resetting...`)
                    localStorage.setItem(entityType, JSON.stringify([]))
                } else {
                    console.log(`✅ ${entityType} storage OK (${parsed.length} items)`)
                }
            } else {
                // Initialize empty array if doesn't exist
                console.log(`📝 Initializing empty ${entityType} storage`)
                localStorage.setItem(entityType, JSON.stringify([]))
            }
        } catch (err) {
            console.error(`❌ Error initializing ${entityType} storage:`, err)
            localStorage.setItem(entityType, JSON.stringify([]))
        }
    })
    
    // Check user and post storage but don't initialize - let demo data handle it
    const coreEntities = ['user', 'post']
    coreEntities.forEach(entityType => {
        try {
            const data = localStorage.getItem(entityType)
            if (data) {
                const parsed = JSON.parse(data)
                if (Array.isArray(parsed)) {
                    console.log(`✅ ${entityType} storage OK (${parsed.length} items)`)
                } else {
                    console.warn(`⚠️ ${entityType} storage corrupted (not an array)`)
                }
            } else {
                console.log(`📝 ${entityType} will be initialized by demo data`)
            }
        } catch (err) {
            console.warn(`⚠️ Error checking ${entityType} storage:`, err)
        }
    })
    
    console.log('✅ Storage initialization complete!')

    // Ensure loggedinUser points to an existing user; fallback to admin if present
    try {
        const loggedStr = sessionStorage.getItem('loggedinUser')
        if (loggedStr) {
            const logged = JSON.parse(loggedStr)
            const users = JSON.parse(localStorage.getItem('user') || '[]')
            const exists = users.some(u => u._id === logged._id)
            if (!exists) {
                const admin = users.find(u => u._id === '64f0a1c2b3d4e5f678901234') || users.find(u => u.username === 'amir.avni') || users[0]
                if (admin) {
                    sessionStorage.setItem('loggedinUser', JSON.stringify({
                        _id: admin._id,
                        fullname: admin.fullname,
                        imgUrl: admin.imgUrl,
                        isAdmin: !!admin.isAdmin,
                    }))
                    console.log('🔁 Fixed stale loggedinUser session to', admin._id)
                } else {
                    sessionStorage.removeItem('loggedinUser')
                }
            }
        }
    } catch (err) {
        console.warn('⚠️ Could not validate loggedinUser session:', err)
    }

    // Migrate posts/comments to reference valid user IDs
    try {
        const users = JSON.parse(localStorage.getItem('user') || '[]')
        const posts = JSON.parse(localStorage.getItem('post') || '[]')
        const userIdSet = new Set(users.map(u => u._id))

        let mutated = false
        const resolveUserId = (by) => {
            if (!by) return null
            if (userIdSet.has(by._id)) return by._id
            // try find by username or fullname
            const found = users.find(u => (by.username && u.username === by.username) || (by.fullname && u.fullname === by.fullname))
            return found ? found._id : null
        }

        posts.forEach(post => {
            const newId = resolveUserId(post.by)
            if (newId && newId !== post.by?._id) {
                post.by._id = newId
                mutated = true
            }
            // fix comments
            if (Array.isArray(post.comments)) {
                post.comments.forEach(c => {
                    if (c.by) {
                        const cid = resolveUserId(c.by)
                        if (cid && cid !== c.by._id) {
                            c.by._id = cid
                            mutated = true
                        }
                    }
                })
            }
        })

        if (mutated) {
            localStorage.setItem('post', JSON.stringify(posts))
            console.log('🛠️ Migrated posts/comments to valid user IDs')
        }
    } catch (err) {
        console.warn('⚠️ Could not migrate posts for stable user IDs:', err)
    }
}

