import { useState, useEffect } from 'react'
import { userService } from '../services/user'

// Cache to prevent multiple lookups for the same user
const userCache = new Map()
const pendingRequests = new Map()

// Custom hook to always get current user data by ID
export function useCurrentUser(userId) {
    const [currentUser, setCurrentUser] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (!userId) {
            setLoading(false)
            return
        }

        // Check cache first
        if (userCache.has(userId)) {
            setCurrentUser(userCache.get(userId))
            setLoading(false)
            return
        }

        // Check if there's already a pending request for this user
        if (pendingRequests.has(userId)) {
            pendingRequests.get(userId).then(user => {
                setCurrentUser(user)
                setLoading(false)
            })
            return
        }

        // Create new request
        const requestPromise = fetchAndCacheUser(userId)
        pendingRequests.set(userId, requestPromise)

        requestPromise
            .then(user => {
                setCurrentUser(user)
                setLoading(false)
            })
            .catch(err => {
                console.error('Error fetching current user data:', err)
                setCurrentUser(null)
                setLoading(false)
            })
            .finally(() => {
                pendingRequests.delete(userId)
            })
    }, [userId])

    return { currentUser, loading }
}

async function fetchAndCacheUser(userId) {
    try {
        const user = await userService.getById(userId)
        userCache.set(userId, user)
        return user
    } catch (err) {
        throw err
    }
}
