import { httpService } from '../http.service'

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

function getUsers() {
	return httpService.get(`user`)
}

async function getById(userId) {
	const user = await httpService.get(`user/${userId}`)
	return user
}

function remove(userId) {
	return httpService.delete(`user/${userId}`)
}

async function update(userToUpdate) {
	const user = await httpService.put(`user/${userToUpdate._id}`, userToUpdate)

	// When admin updates other user's details, do not update loggedinUser
    const loggedinUser = getLoggedinUser()
    if (loggedinUser && loggedinUser._id === user._id) saveLoggedinUser(user)

	return user
}

async function login(userCred) {
    const res = await httpService.post('auth/login', userCred)
    const user = res?.user || res
    if (res?.token) sessionStorage.setItem('loginToken', res.token)
    if (user) return saveLoggedinUser(user)
}

async function signup(userCred) {
	if (!userCred.imgUrl) userCred.imgUrl = 'https://cdn.pixabay.com/photo/2020/07/01/12/58/icon-5359553_1280.png'

    const res = await httpService.post('auth/signup', userCred)
    const user = res?.user || res
    if (res?.token) sessionStorage.setItem('loginToken', res.token)
    return saveLoggedinUser(user)
}

async function logout() {
	localStorage.removeItem(STORAGE_KEY_LOGGEDIN_USER)
    sessionStorage.removeItem('loginToken')
	return await httpService.post('auth/logout')
}

function getLoggedinUser() {
    return JSON.parse(localStorage.getItem(STORAGE_KEY_LOGGEDIN_USER))
}

function saveLoggedinUser(user) {
	user = { 
        _id: user._id, 
        username: user.username,
        fullname: user.fullname, 
        imgUrl: user.imgUrl, 
        isAdmin: user.isAdmin,
        following: user.following || [],
        followers: user.followers || [],
        savedPosts: user.savedPosts || []
    }
	localStorage.setItem(STORAGE_KEY_LOGGEDIN_USER, JSON.stringify(user))
	return user
}

// Instagram-specific functions
async function toggleFollow(userIdToFollow) {
    const loggedinUser = getLoggedinUser()
    if (!loggedinUser) throw new Error('User not logged in')
    
    const result = await httpService.post(`user/${loggedinUser._id}/toggleFollow/${userIdToFollow}`)
    
    // Update session with new following list
    const updatedUser = await getById(loggedinUser._id)
    saveLoggedinUser(updatedUser)
    
    return result
}

async function savePost(postId) {
    const loggedinUser = getLoggedinUser()
    if (!loggedinUser) throw new Error('User not logged in')
    
    const result = await httpService.post(`user/${loggedinUser._id}/save/${postId}`)
    
    // Update session
    const updatedUser = await getById(loggedinUser._id)
    saveLoggedinUser(updatedUser)
    
    return result
}

async function unsavePost(postId) {
    const loggedinUser = getLoggedinUser()
    if (!loggedinUser) throw new Error('User not logged in')
    
    const result = await httpService.delete(`user/${loggedinUser._id}/save/${postId}`)
    
    // Update session
    const updatedUser = await getById(loggedinUser._id)
    saveLoggedinUser(updatedUser)
    
    return result
}
