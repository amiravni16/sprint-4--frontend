const { DEV, VITE_LOCAL } = import.meta.env

import { getRandomIntInclusive, makeId } from '../util.service'

import { postService as local } from './post.service.local'
import { postService as remote } from './post.service.remote'

function getEmptyPost() {
	return {
        _id: '',
		txt: '',
		imgUrl: '',
		by: {
			_id: '',
			username: '',
			imgUrl: ''
		},
		loc: {
			name: '',
			lat: 0,
			lng: 0
		},
		comments: [],
		likedBy: [],
		tags: []
	}
}

function getDefaultFilter() {
    return {
        txt: '',
        sortField: '',
        sortDir: '',
    }
}

const service = (VITE_LOCAL === 'true') ? local : remote
export const postService = { getEmptyPost, getDefaultFilter, ...service }

// Easy access to this service from the dev tools console
// when using script - dev / dev:local

if (DEV) window.postService = postService
