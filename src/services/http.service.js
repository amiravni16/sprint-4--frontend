import Axios from 'axios'

const BASE_URL = process.env.NODE_ENV === 'production'
    ? 'https://photograph-backend-j36v.onrender.com/api/'
    : '//localhost:3030/api/'


const axios = Axios.create({ withCredentials: true })

// Attach Authorization header from sessionStorage token (per-tab, supports Incognito)
axios.interceptors.request.use((config) => {
    try {
        const token = sessionStorage.getItem('loginToken')
        if (token) {
            config.headers = config.headers || {}
            config.headers['Authorization'] = `Bearer ${token}`
        }
    } catch {}
    return config
})

export const httpService = {
    get(endpoint, data) {
        return ajax(endpoint, 'GET', data)
    },
    post(endpoint, data) {
        return ajax(endpoint, 'POST', data)
    },
    put(endpoint, data) {
        return ajax(endpoint, 'PUT', data)
    },
    delete(endpoint, data) {
        return ajax(endpoint, 'DELETE', data)
    }
}

async function ajax(endpoint, method = 'GET', data = null) {
    const url = `${BASE_URL}${endpoint}`
    const params = (method === 'GET') ? data : null
    
    const options = { url, method, data, params }

    try {
        const res = await axios(options)
        return res.data
    } catch (err) {
        console.log(`Had Issues ${method}ing to the backend, endpoint: ${endpoint}, with data: `, data)
        console.dir(err)
        // Handle unauthorized error - clear localStorage and redirect to login
        if (err.response && err.response.status === 401) {
            localStorage.removeItem('loggedinUser')
            try { sessionStorage.removeItem('loginToken') } catch {}
            console.log('⚠️ 401 Unauthorized - cleared loggedinUser from localStorage')
            // Only redirect if not already on login page to prevent infinite loop
            if (!window.location.pathname.includes('/auth')) {
                window.location.assign('/auth/login')
            }
        }
        throw err
    }
}