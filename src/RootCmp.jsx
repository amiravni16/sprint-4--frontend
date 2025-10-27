import React from 'react'
import { Routes, Route } from 'react-router'

import { HomePage } from './pages/HomePage'
import { PostIndex } from './pages/PostIndex.jsx'
import { PostDetails } from './pages/PostDetails'
import { UserDetails } from './pages/UserDetails'
import { ExplorePage } from './pages/ExplorePage'

import { AppHeader } from './cmps/AppHeader'
import { AppFooter } from './cmps/AppFooter'
import { InstagramSidebar } from './cmps/InstagramSidebar.jsx'
import { MobileHeader } from './cmps/MobileHeader.jsx'
import { MobileFooter } from './cmps/MobileFooter.jsx'
import { LoginSignup, Login, Signup } from './pages/LoginSignup.jsx'


export function RootCmp() {
    return (
        <div className="instagram-app">
            <InstagramSidebar />
            <MobileHeader />
            
            <div className="main-content">
                <Routes>
                    <Route path="" element={<HomePage />} />
                    <Route path="post" element={<PostIndex />} />
                    <Route path="post/:postId" element={<PostDetails />} />
                    <Route path="user/:id" element={<UserDetails />} />
                    <Route path="search" element={<div>Search Page (Coming Soon)</div>} />
                    <Route path="explore" element={<ExplorePage />} />
                    <Route path="reels" element={<div>Reels Page (Coming Soon)</div>} />
                    <Route path="auth" element={<LoginSignup />}>
                        <Route path="login" element={<Login />} />
                        <Route path="signup" element={<Signup />} />
                    </Route>
                </Routes>
            </div>
            
            <MobileFooter />
        </div>
    )
}


