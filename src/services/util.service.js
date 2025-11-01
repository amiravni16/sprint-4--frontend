export function makeId(length = 6) {
    var txt = ''
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

    for (var i = 0; i < length; i++) {
        txt += possible.charAt(Math.floor(Math.random() * possible.length))
    }

    return txt
}

export function makeLorem(size = 100) {
    var words = ['The sky', 'above', 'the port', 'was', 'the color of television', 'tuned', 'to', 'a dead channel', '.', 'All', 'this happened', 'more or less', '.', 'I', 'had', 'the story', 'bit by bit', 'from various people', 'and', 'as generally', 'happens', 'in such cases', 'each time', 'it', 'was', 'a different story', '.', 'It', 'was', 'a pleasure', 'to', 'burn']
    var txt = ''
    while (size > 0) {
        size--
        txt += words[Math.floor(Math.random() * words.length)] + ' '
    }
    return txt
}

export function getRandomIntInclusive(min, max) {
    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(Math.random() * (max - min + 1)) + min //The maximum is inclusive and the minimum is inclusive 
}


export function randomPastTime() {
    const HOUR = 1000 * 60 * 60
    const DAY = 1000 * 60 * 60 * 24
    const WEEK = 1000 * 60 * 60 * 24 * 7

    const pastTime = getRandomIntInclusive(HOUR, WEEK)
    return Date.now() - pastTime
}

export function formatTimeAgo(timestamp) {
    const now = new Date()
    const postTime = new Date(timestamp)
    const diffInSeconds = Math.floor((now - postTime) / 1000)
    
    if (diffInSeconds < 60) return 'now'
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m`
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h`
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d`
    return `${Math.floor(diffInSeconds / 604800)}w`
}

export function debounce(func, timeout = 300) {
    let timer
    return (...args) => {
        clearTimeout(timer)
        timer = setTimeout(() => { func.apply(this, args) }, timeout)
    }
}

export function saveToStorage(key, value) {
    localStorage.setItem(key, JSON.stringify(value))
}

export function loadFromStorage(key) {
    const data = localStorage.getItem(key)
    return (data) ? JSON.parse(data) : undefined
}

export function shuffleArray(array) {
    const shuffled = [...array]
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
    return shuffled
}

// Build a responsive srcSet for common image CDNs (Unsplash, Picsum, Cloudinary)
// Falls back gracefully if the URL doesn't support width params
export function buildResponsiveSrcSet(imgUrl, baseWidth = 800) {
    if (!imgUrl) return undefined
    try {
        const url = new URL(imgUrl, window.location.origin)
        const host = url.hostname
        // Generate wider range of sizes for high-DPI displays (up to 4x for ultra-retina)
        const widths = [baseWidth, Math.round(baseWidth * 1.5), baseWidth * 2, baseWidth * 3, baseWidth * 4]

        const makeUrl = (w) => {
            const u = new URL(url.href)
            if (host.includes('unsplash.com')) {
                u.searchParams.set('w', String(w))
                u.searchParams.set('q', '90') // Higher quality
            } else if (host.includes('pexels.com')) {
                // Pexels: Build clean URL with only high-res parameters
                const baseUrl = `${u.protocol}//${u.hostname}${u.pathname}`
                const cleanUrl = new URL(baseUrl)
                // Set high-resolution parameters for this width
                cleanUrl.searchParams.set('auto', 'compress')
                cleanUrl.searchParams.set('cs', 'tinysrgb')
                cleanUrl.searchParams.set('w', String(w))
                // For retina displays, multiply width by 2 in srcSet densities instead of using dpr
                return cleanUrl.href
            } else if (host.includes('picsum.photos')) {
                // picsum already encodes size in path; leave as-is
                return u.href
            } else if (host.includes('cloudinary.com')) {
                // naive Cloudinary width transform injection
                u.pathname = u.pathname.replace('/upload/', `/upload/w_${w}/`)
                // Add quality parameter for Cloudinary
                if (!u.searchParams.has('q')) {
                    u.searchParams.set('q', 'auto:good')
                }
            }
            return u.href
        }

        // Calculate proper density descriptors based on actual width ratios
        const entries = widths.map(w => {
            const density = Math.round((w / baseWidth) * 10) / 10 // Round to 1 decimal
            return `${makeUrl(w)} ${density}x`
        })
        return entries.join(', ')
    } catch {
        return undefined
    }
}

// Generate a high-resolution version of an image URL for the base src attribute
// This ensures even browsers that don't support srcSet get a sharp image
export function getHighResImageUrl(imgUrl, targetWidth = 1200) {
    if (!imgUrl) return imgUrl
    try {
        const url = new URL(imgUrl, window.location.origin)
        const host = url.hostname

        if (host.includes('unsplash.com')) {
            url.searchParams.set('w', String(targetWidth))
            url.searchParams.set('q', '90')
        } else if (host.includes('pexels.com')) {
            // Pexels: Build clean URL with only high-res parameters
            // Remove ALL existing params that might limit resolution
            const baseUrl = `${url.protocol}//${url.hostname}${url.pathname}`
            const newUrl = new URL(baseUrl)
            // Set high-resolution parameters (don't use dpr, just large width)
            newUrl.searchParams.set('auto', 'compress')
            newUrl.searchParams.set('cs', 'tinysrgb')
            newUrl.searchParams.set('w', String(targetWidth))
            // For very high res, Pexels might need explicit large width
            // Don't set dpr as it may not work as expected - just use large width
            return newUrl.href
        } else if (host.includes('cloudinary.com')) {
            url.pathname = url.pathname.replace('/upload/', `/upload/w_${targetWidth}/`)
            if (!url.searchParams.has('q')) {
                url.searchParams.set('q', 'auto:good')
            }
        }
        return url.href
    } catch {
        return imgUrl
    }
}