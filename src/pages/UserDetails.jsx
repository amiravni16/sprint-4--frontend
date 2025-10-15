import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'

import { loadUser } from '../store/actions/user.actions'
import { store } from '../store/store'
import { showSuccessMsg, showErrorMsg } from '../services/event-bus.service'
import { socketService, SOCKET_EVENT_USER_UPDATED, SOCKET_EMIT_USER_WATCH } from '../services/socket.service'
import { userService } from '../services/user'
import { postService } from '../services/post'

export function UserDetails() {

  const params = useParams()
  const user = useSelector(storeState => storeState.userModule.watchedUser)
  const loggedinUser = useSelector(storeState => storeState.userModule.user)
  const [isFollowing, setIsFollowing] = useState(false)
  const [userPostsCount, setUserPostsCount] = useState(0)
  const [debugUser, setDebugUser] = useState(null)

  useEffect(() => {
    async function ensureUser() {
      const loaded = await loadUser(params.id)
      if (!loaded) return
      // If the loaded user id differs from the URL param, redirect to the correct stable id
      if (loaded && loaded._id && loaded._id !== params.id) {
        window.history.replaceState(null, '', `/user/${loaded._id}`)
      }
    }
    ensureUser()

    socketService.emit(SOCKET_EMIT_USER_WATCH, params.id)
    socketService.on(SOCKET_EVENT_USER_UPDATED, onUserUpdate)

    return () => {
      socketService.off(SOCKET_EVENT_USER_UPDATED, onUserUpdate)
    }

  }, [params.id])

  useEffect(() => {
    // Check if current user is following this profile
    if (loggedinUser && user) {
      const following = loggedinUser.following || []
      setIsFollowing(following.includes(user._id))
    }
  }, [loggedinUser, user])

  useEffect(() => {
    // Load posts count for this user
    async function loadUserPostsCount() {
      if (user) {
        try {
          const posts = await postService.query()
          const userPosts = posts.filter(post => post.by?._id === user._id)
          setUserPostsCount(userPosts.length)
        } catch (err) {
          console.error('Error loading user posts:', err)
          setUserPostsCount(0)
        }
      }
    }
    loadUserPostsCount()
  }, [user])

  // Keep a canonical copy from storage for debugging to avoid stale values
  useEffect(() => {
    async function loadCanonical() {
      if (!user?._id) return setDebugUser(null)
      try {
        const canonical = await userService.getById(user._id)
        setDebugUser(canonical || user)
      } catch (err) {
        // As a final fallback, try to load by username and then by stable admin id
        try {
          const all = await userService.getUsers()
          const byUsername = all.find(u => u.username === user.username)
          const byStable = all.find(u => u._id === '64f0a1c2b3d4e5f678901234')
          setDebugUser(byUsername || byStable || user)
        } catch (e) {
          setDebugUser(user)
        }
      }
    }
    loadCanonical()
  }, [user?._id])

  // Force refresh debug data on component mount
  useEffect(() => {
    async function refreshDebugData() {
      try {
        const all = await userService.getUsers()
        const adminUser = all.find(u => u.username === 'amir.avni')
        if (adminUser) {
          setDebugUser(adminUser)
          console.log('🔍 Debug data refreshed:', adminUser)
        }
      } catch (err) {
        console.error('Error refreshing debug data:', err)
      }
    }
    refreshDebugData()
  }, [])

  function onUserUpdate(user) {
    showSuccessMsg(`User ${user.fullname} profile was updated`)
    store.dispatch({ type: 'SET_WATCHED_USER', user })
  }

  async function onToggleFollow() {
    if (!loggedinUser) {
      showErrorMsg('Please login to follow users')
      return
    }

    if (loggedinUser._id === user._id) {
      showErrorMsg('You cannot follow yourself')
      return
    }

    try {
      const result = await userService.toggleFollow(user._id)
      setIsFollowing(result.isFollowing)
      
      // Update the user's follower count
      const updatedUser = { ...user, followers: user.followers || [] }
      if (result.isFollowing) {
        if (!updatedUser.followers.includes(loggedinUser._id)) {
          updatedUser.followers.push(loggedinUser._id)
        }
        showSuccessMsg(`You are now following ${user.fullname}`)
      } else {
        updatedUser.followers = updatedUser.followers.filter(id => id !== loggedinUser._id)
        showSuccessMsg(`You unfollowed ${user.fullname}`)
      }
      
      store.dispatch({ type: 'SET_WATCHED_USER', updatedUser })
      
      // Reload the logged in user to update their following list
      const freshLoggedinUser = await userService.getById(loggedinUser._id)
      store.dispatch({ type: 'SET_USER', user: freshLoggedinUser })
    } catch (err) {
      console.error('Error toggling follow:', err)
      showErrorMsg('Failed to update follow status')
    }
  }

  return (
    <section className="user-details">
      <h1>User Profile</h1>
      {user && <div className="profile-container">
        <div className="profile-header">
          <img 
            src={user.imgUrl || 'https://i.pravatar.cc/150?img=1'} 
            alt={user.fullname}
            className="profile-pic"
            style={{
              width: '150px',
              height: '150px',
              borderRadius: '50%',
              objectFit: 'cover',
              border: '2px solid #dbdbdb',
              display: 'block'
            }}
          />
          <div className="profile-info">
            <h2>{user.fullname}</h2>
            <p className="username">@{user.username}</p>
            
            <div className="profile-stats">
              <div className="stat">
                <strong>{userPostsCount}</strong>
                <span>Posts</span>
              </div>
              <div className="stat">
                <strong>{user.followers?.length || 0}</strong>
                <span>Followers</span>
              </div>
              <div className="stat">
                <strong>{user.following?.length || 0}</strong>
                <span>Following</span>
              </div>
            </div>

            {user.isAdmin && (
              <span className="admin-badge">Admin</span>
            )}

            {/* Follow/Unfollow button - only show if not viewing own profile */}
            {loggedinUser && loggedinUser._id !== user._id && (
              <button 
                className={`follow-btn ${isFollowing ? 'following' : ''}`}
                onClick={onToggleFollow}
              >
                {isFollowing ? 'Unfollow' : 'Follow'}
              </button>
            )}
          </div>
        </div>

        {/* Debug info - can remove later */}
        <details style={{ marginTop: '2rem' }}>
          <summary>Debug: User Data (click to expand)</summary>
          <div style={{ marginBottom: '1rem' }}>
            <button 
              onClick={async () => {
                try {
                  const all = await userService.getUsers()
                  const adminUser = all.find(u => u.username === 'amir.avni')
                  console.log('🔍 All users:', all)
                  console.log('🔍 Admin user found:', adminUser)
                  setDebugUser(adminUser)
                } catch (err) {
                  console.error('Error refreshing debug:', err)
                }
              }}
              style={{ 
                padding: '8px 16px', 
                backgroundColor: '#0095f6', 
                color: 'white', 
                border: 'none', 
                borderRadius: '4px',
                cursor: 'pointer',
                marginRight: '8px'
              }}
            >
              Refresh Debug Data
            </button>
            <button 
              onClick={() => {
                const stored = localStorage.getItem('user')
                console.log('🔍 Raw localStorage user data:', stored)
                try {
                  const parsed = JSON.parse(stored)
                  console.log('🔍 Parsed localStorage user data:', parsed)
                } catch (e) {
                  console.log('🔍 Error parsing localStorage:', e)
                }
              }}
              style={{ 
                padding: '8px 16px', 
                backgroundColor: '#8e8e8e', 
                color: 'white', 
                border: 'none', 
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Check localStorage
            </button>
          </div>
          <pre style={{ fontSize: '12px', background: '#f5f5f5', padding: '1rem', borderRadius: '8px', overflow: 'auto' }}>
            {JSON.stringify({
              _id: debugUser?._id,
              username: debugUser?.username,
              fullname: debugUser?.fullname,
              imgUrl: debugUser?.imgUrl,
              isAdmin: debugUser?.isAdmin,
              stats: {
                postsCount: userPostsCount,
                followersCount: debugUser?.followers?.length || 0,
                followingCount: debugUser?.following?.length || 0,
                savedPostsCount: debugUser?.savedPosts?.length || 0
              },
              followers: debugUser?.followers || [],
              following: debugUser?.following || [],
              savedPosts: debugUser?.savedPosts || []
            }, null, 2)}
          </pre>
        </details>
      </div>}
    </section>
  )
}