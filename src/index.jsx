import React from 'react'
import ReactDOM from 'react-dom/client'

import { BrowserRouter as Router } from 'react-router-dom'
import { Provider } from 'react-redux'

import * as serviceWorkerRegistration from './serviceWorkerRegistration'

import { store } from './store/store'
import { RootCmp } from './RootCmp'
import { storageInitService } from './services/storage-init.service'

import './assets/styles/main.css'

// Initialize storage before rendering app
storageInitService.init()

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
	<Provider store={store}>
		<Router>
			<RootCmp />
		</Router>
	</Provider>
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
// Disable SW for now to avoid 404s in production/incognito
serviceWorkerRegistration.unregister()
