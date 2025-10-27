import { storageService } from '../async-storage.service'

const STORAGE_KEY_LOGGEDIN_USER = 'loggedinUser'

export const userService = {
    login,
    logout,
    signup,
    getUsers,
    getById,
    remove,
    update,
    getLoggedinUser,
    saveLoggedinUser,
    toggleFollow,
    savePost,
    unsavePost,
}

async function getUsers() {
    const users = await storageService.query('user')
    return users.map(user => {
        delete user.password
        // Remove any legacy fields that shouldn't be in Instagram
        delete user.score
        // Ensure Instagram fields exist
        user.followers = user.followers || []
        user.following = user.following || []
        user.savedPosts = user.savedPosts || []
        return user
    })
}

async function getById(userId) {
    const user = await storageService.get('user', userId)
    if (user) {
        // Remove any legacy fields that shouldn't be in Instagram
        delete user.score
        // Ensure Instagram fields exist
        user.followers = user.followers || []
        user.following = user.following || []
        user.savedPosts = user.savedPosts || []
    }
    return user
}

function remove(userId) {
    return storageService.remove('user', userId)
}

async function update(userToUpdate) {
    const user = await storageService.get('user', userToUpdate._id)
    
    // Update user fields (except password)
    if (userToUpdate.fullname !== undefined) user.fullname = userToUpdate.fullname
    if (userToUpdate.imgUrl !== undefined) user.imgUrl = userToUpdate.imgUrl
    if (userToUpdate.isAdmin !== undefined) user.isAdmin = userToUpdate.isAdmin
    
    await storageService.put('user', user)

	// When admin updates other user's details, do not update loggedinUser
    const loggedinUser = getLoggedinUser()
    if (loggedinUser && loggedinUser._id === user._id) saveLoggedinUser(user)

    return user
}

async function login(userCred) {
    const users = await storageService.query('user')
    const user = users.find(user => user.username === userCred.username)

    if (user) return saveLoggedinUser(user)
}

async function signup(userCred) {
    if (!userCred.imgUrl) userCred.imgUrl = '/img/amir-avni.jpg.jpg'
    
    // Initialize Instagram-specific fields
    userCred.followers = userCred.followers || []
    userCred.following = userCred.following || []
    userCred.savedPosts = userCred.savedPosts || []

    const user = await storageService.post('user', userCred)
    return saveLoggedinUser(user)
}

async function logout() {
    sessionStorage.removeItem(STORAGE_KEY_LOGGEDIN_USER)
}

function getLoggedinUser() {
    const user = JSON.parse(sessionStorage.getItem(STORAGE_KEY_LOGGEDIN_USER))
    console.log('🔍 Current logged-in user:', user?.username, 'ID:', user?._id)
    return user
}

function saveLoggedinUser(user) {
	const userToSave = { 
        _id: user._id,
        username: user.username,
        fullname: user.fullname, 
        imgUrl: user.imgUrl, 
        isAdmin: user.isAdmin,
        following: user.following || [],
        followers: user.followers || [],
        savedPosts: user.savedPosts || []
    }
	sessionStorage.setItem(STORAGE_KEY_LOGGEDIN_USER, JSON.stringify(userToSave))
	return userToSave
}

// Instagram-specific functions

async function toggleFollow(userIdToFollow) {
    console.log('🔄 toggleFollow called for user:', userIdToFollow)
    const loggedinUser = getLoggedinUser()
    if (!loggedinUser) throw new Error('User not logged in')
    
    // Get both users from storage
    const currentUser = await storageService.get('user', loggedinUser._id)
    const targetUser = await storageService.get('user', userIdToFollow)
    
    console.log('📊 Before follow:')
    console.log('- Current user following:', currentUser.following?.length || 0, 'users')
    console.log('- Target user followers:', targetUser.followers?.length || 0, 'users')
    
    // Initialize arrays if they don't exist
    currentUser.following = currentUser.following || []
    targetUser.followers = targetUser.followers || []
    
    // Check if already following
    const isFollowing = currentUser.following.includes(userIdToFollow)
    console.log('- Already following?', isFollowing)
    
    if (isFollowing) {
        // Unfollow
        currentUser.following = currentUser.following.filter(id => id !== userIdToFollow)
        targetUser.followers = targetUser.followers.filter(id => id !== loggedinUser._id)
        console.log('👋 Unfollowed user')
    } else {
        // Follow
        currentUser.following.push(userIdToFollow)
        targetUser.followers.push(loggedinUser._id)
        console.log('✅ Followed user')
    }
    
    console.log('📊 After follow:')
    console.log('- Current user now following:', currentUser.following.length, 'users')
    console.log('- Target user now has:', targetUser.followers.length, 'followers')
    
    // Save both users
    await storageService.put('user', currentUser)
    await storageService.put('user', targetUser)
    console.log('💾 Saved both users to storage')
    
    // Update logged in user session
    saveLoggedinUser(currentUser)
    console.log('🔄 Updated logged-in user session')
    
    return { isFollowing: !isFollowing, followersCount: targetUser.followers.length }
}

async function savePost(postId) {
    const loggedinUser = getLoggedinUser()
    if (!loggedinUser) throw new Error('User not logged in')
    
    const user = await storageService.get('user', loggedinUser._id)
    user.savedPosts = user.savedPosts || []
    
    if (!user.savedPosts.includes(postId)) {
        user.savedPosts.push(postId)
        await storageService.put('user', user)
        saveLoggedinUser(user)
    }
    
    return user
}

async function unsavePost(postId) {
    const loggedinUser = getLoggedinUser()
    if (!loggedinUser) throw new Error('User not logged in')
    
    const user = await storageService.get('user', loggedinUser._id)
    user.savedPosts = user.savedPosts || []
    
    user.savedPosts = user.savedPosts.filter(id => id !== postId)
    await storageService.put('user', user)
    saveLoggedinUser(user)
    
    return user
}

// Admin user is now created via demo data
// No need to manually create it here