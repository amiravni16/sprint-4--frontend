import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'

import { loadUser } from '../store/actions/user.actions'
import { store } from '../store/store'
import { socketService, SOCKET_EVENT_USER_UPDATED, SOCKET_EMIT_USER_WATCH } from '../services/socket.service'
import { userService } from '../services/user'
import { postService } from '../services/post'
import { FollowersModal } from '../cmps/FollowersModal'
import { FollowingModal } from '../cmps/FollowingModal'

export function UserDetails() {

  const params = useParams()
  const user = useSelector(storeState => storeState.userModule.watchedUser)
  const loggedinUser = useSelector(storeState => storeState.userModule.user)
  const [isFollowing, setIsFollowing] = useState(false)
  const [userPosts, setUserPosts] = useState([])
  const [savedPosts, setSavedPosts] = useState([])
  const [activeTab, setActiveTab] = useState('posts') // 'posts' or 'saved'
  const [debugUser, setDebugUser] = useState(null)
  const [showFollowersModal, setShowFollowersModal] = useState(false)
  const [showFollowingModal, setShowFollowingModal] = useState(false)

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
    // Refresh logged-in user data when navigating to a new profile
    async function refreshLoggedInUser() {
      if (loggedinUser) {
        try {
          const freshLoggedinUser = await userService.getById(loggedinUser._id)
          store.dispatch({ type: 'SET_USER', user: freshLoggedinUser })
        } catch (err) {
          console.error('Error refreshing logged-in user:', err)
        }
      }
    }
    refreshLoggedInUser()
  }, [params.id])

  useEffect(() => {
    // Load posts for this user
    async function loadUserPosts() {
      if (user) {
        try {
          const posts = await postService.query()
          const postsByUser = posts.filter(post => post.by?._id === user._id)
          // Sort by createdAt descending (newest first)
          postsByUser.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          setUserPosts(postsByUser)
        } catch (err) {
          console.error('Error loading user posts:', err)
          setUserPosts([])
        }
      }
    }
    loadUserPosts()
  }, [user])

  useEffect(() => {
    // Load saved posts
    async function loadSavedPosts() {
      if (user && loggedinUser && user._id === loggedinUser._id) {
        try {
          const posts = await postService.query()
          const savedPostIds = loggedinUser.savedPosts || []
          const savedPostsData = posts.filter(post => savedPostIds.includes(post._id))
          // Sort by createdAt descending (newest first)
          savedPostsData.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          setSavedPosts(savedPostsData)
        } catch (err) {
          console.error('Error loading saved posts:', err)
          setSavedPosts([])
        }
      }
    }
    loadSavedPosts()
  }, [user, loggedinUser])

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
    store.dispatch({ type: 'SET_WATCHED_USER', user })
  }

  async function onToggleFollow() {
    if (!loggedinUser) {
      return
    }

    if (loggedinUser._id === user._id) {
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
      } else {
        updatedUser.followers = updatedUser.followers.filter(id => id !== loggedinUser._id)
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

  async function handleRefreshUser() {
    try {
      const updatedUser = await userService.getById(user._id)
      store.dispatch({ type: 'SET_WATCHED_USER', user: updatedUser })
      
      if (loggedinUser) {
        const freshLoggedinUser = await userService.getById(loggedinUser._id)
        store.dispatch({ type: 'SET_USER', user: freshLoggedinUser })
        setIsFollowing((freshLoggedinUser.following || []).includes(user._id))
      }
    } catch (err) {
      console.error('Error refreshing user:', err)
    }
  }

  const isOwnProfile = loggedinUser && user && loggedinUser._id === user._id

  return (
    <section className="user-details">
      {user && <div className="profile-container">
        <div className="profile-header">
          <img 
            src={user.imgUrl || 'https://i.pravatar.cc/150?img=1'} 
            alt={user.fullname}
            className="profile-pic"
          />
          <div className="profile-info">
            <div className="profile-header-top">
              <h2 className="profile-username">{user.username}</h2>
              {isOwnProfile ? (
                <button className="edit-profile-btn">Edit profile</button>
              ) : (
                <button 
                  className={`follow-btn ${isFollowing ? 'following' : ''}`}
                  onClick={onToggleFollow}
                >
                  {isFollowing ? 'Following' : 'Follow'}
                </button>
              )}
            </div>

            <div className="profile-stats">
              <button className="stat" onClick={() => {}}>
                <strong>{userPosts.length}</strong>
                <span>{userPosts.length === 1 ? 'post' : 'posts'}</span>
              </button>
              <button 
                className="stat"
                onClick={() => setShowFollowersModal(true)}
              >
                <strong>{user.followers?.length || 0}</strong>
                <span>{user.followers?.length === 1 ? 'follower' : 'followers'}</span>
              </button>
              <button 
                className="stat"
                onClick={() => setShowFollowingModal(true)}
              >
                <strong>{user.following?.length || 0}</strong>
                <span>following</span>
              </button>
            </div>

            <div className="profile-bio">
              <p className="profile-fullname">{user.fullname}</p>
              {user.bio && <p className="profile-bio-text">{user.bio}</p>}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="profile-tabs">
          <button 
            className={`profile-tab ${activeTab === 'posts' ? 'active' : ''}`}
            onClick={() => setActiveTab('posts')}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <rect x="3" y="3" width="7" height="7" stroke="currentColor" strokeWidth="2" fill={activeTab === 'posts' ? 'currentColor' : 'none'}/>
              <rect x="3" y="14" width="7" height="7" stroke="currentColor" strokeWidth="2" fill={activeTab === 'posts' ? 'currentColor' : 'none'}/>
              <rect x="14" y="3" width="7" height="7" stroke="currentColor" strokeWidth="2" fill={activeTab === 'posts' ? 'currentColor' : 'none'}/>
              <rect x="14" y="14" width="7" height="7" stroke="currentColor" strokeWidth="2" fill={activeTab === 'posts' ? 'currentColor' : 'none'}/>
            </svg>
          </button>
          
          {isOwnProfile && (
            <button 
              className={`profile-tab ${activeTab === 'saved' ? 'active' : ''}`}
              onClick={() => setActiveTab('saved')}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" stroke="currentColor" strokeWidth="2" fill={activeTab === 'saved' ? 'currentColor' : 'none'}/>
              </svg>
            </button>
          )}
        </div>

        {/* Posts Grid */}
        <div className="profile-posts-grid">
          {(activeTab === 'posts' ? userPosts : savedPosts).map(post => (
            <div key={post._id} className="profile-post-thumbnail">
              <img src={post.imgUrl} alt="Post" />
              <div className="post-overlay">
                <div className="post-stats">
                  <span>❤️ {post.likedBy?.length || 0}</span>
                  <span>💬 {post.comments?.length || 0}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {activeTab === 'posts' && userPosts.length === 0 && (
          <div className="empty-state">
            <p>No posts yet</p>
          </div>
        )}

        {activeTab === 'saved' && savedPosts.length === 0 && (
          <div className="empty-state">
            <p>No saved posts yet</p>
          </div>
        )}

        {/* Debug info - only show on own profile */}
        {isOwnProfile && (
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
                  postsCount: userPosts.length,
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
        )}
      </div>}

      {/* Followers Modal */}
      {isOwnProfile && (
        <FollowersModal
          isOpen={showFollowersModal}
          onClose={() => setShowFollowersModal(false)}
          followers={user.followers || []}
          currentUserId={user._id}
          onUpdate={handleRefreshUser}
        />
      )}

      {/* Following Modal */}
      {isOwnProfile && (
        <FollowingModal
          isOpen={showFollowingModal}
          onClose={() => setShowFollowingModal(false)}
          following={user.following || []}
          currentUserId={user._id}
          onUpdate={handleRefreshUser}
        />
      )}

      {/* View-only modals for other users - render only when user is loaded */}
      {!isOwnProfile && user && (
        <FollowersModal
          isOpen={showFollowersModal}
          onClose={() => setShowFollowersModal(false)}
          followers={user.followers || []}
          currentUserId={user._id}
        />
      )}

      {!isOwnProfile && user && (
        <FollowingModal
          isOpen={showFollowingModal}
          onClose={() => setShowFollowingModal(false)}
          following={user.following || []}
          currentUserId={user._id}
        />
      )}
    </section>
  )
}