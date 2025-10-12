const { DEV, VITE_LOCAL } = import.meta.env

import { userService as local } from './user.service.local'
import { userService as remote } from './user.service.remote'

function getEmptyUser() {
    return {
        username: '', 
        password: '', 
        fullname: '',
        imgUrl: '',
        isAdmin: false,
        followers: [], // Array of user IDs who follow this user
        following: [], // Array of user IDs this user follows
        savedPosts: [], // Array of post IDs this user saved
    }
}

const service = (VITE_LOCAL === 'true')? local : remote
export const userService = { ...service, getEmptyUser }

// Easy access to this service from the dev tools console
// when using script - dev / dev:local

if(DEV) window.userService = userService