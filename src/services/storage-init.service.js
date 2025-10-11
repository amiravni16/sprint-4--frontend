// Storage initialization service
// Ensures localStorage has valid structure on app startup

export const storageInitService = {
    init
}

function init() {
    console.log('🔧 Initializing storage...')
    
    const entities = ['user', 'post', 'review', 'car']
    
    entities.forEach(entityType => {
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
    
    console.log('✅ Storage initialization complete!')
}

