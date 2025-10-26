// Centralized user cache management
class UserCacheService {
    constructor() {
        this.cache = new Map()
        this.pendingRequests = new Map()
    }

    get(userId) {
        return this.cache.get(userId)
    }

    set(userId, userData) {
        this.cache.set(userId, userData)
    }

    has(userId) {
        return this.cache.has(userId)
    }

    delete(userId) {
        this.cache.delete(userId)
    }

    // Clear cache when user data changes
    invalidateUser(userId) {
        this.delete(userId)
    }

    // Clear all cache
    clear() {
        this.cache.clear()
        this.pendingRequests.clear()
    }

    // Get pending request promise
    getPendingRequest(userId) {
        return this.pendingRequests.get(userId)
    }

    // Set pending request
    setPendingRequest(userId, promise) {
        this.pendingRequests.set(userId, promise)
    }

    // Delete pending request
    deletePendingRequest(userId) {
        this.pendingRequests.delete(userId)
    }
}

export const userCacheService = new UserCacheService()
