import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'

import { loadUser } from '../store/actions/user.actions'
import { updatePost } from '../store/actions/post.actions'
import { store } from '../store/store'
import { socketService, SOCKET_EVENT_USER_UPDATED, SOCKET_EMIT_USER_WATCH } from '../services/socket.service'
import { userService } from '../services/user'
import { postService } from '../services/post'
import { FollowersModal } from '../cmps/FollowersModal'
import { FollowingModal } from '../cmps/FollowingModal'
import { PostViewModal } from '../cmps/PostViewModal'
import { ProfileSkeleton } from '../cmps/ProfileSkeleton'

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
  const [viewingPost, setViewingPost] = useState(null)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [currentUserId, setCurrentUserId] = useState(params.id)

  useEffect(() => {
    // Detect user change and show loading buffer
    if (params.id !== currentUserId) {
      setIsTransitioning(true)
      setCurrentUserId(params.id)
    }

    async function ensureUser() {
      const loaded = await loadUser(params.id)
      if (!loaded) {
        setIsTransitioning(false)
        return
      }
      // If the loaded user id differs from the URL param, redirect to the correct stable id
      if (loaded && loaded._id && loaded._id !== params.id) {
        window.history.replaceState(null, '', `/user/${loaded._id}`)
      }
      
      // Small delay to prevent flash, then show content
      setTimeout(() => {
        setIsTransitioning(false)
      }, 200)
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
      if (user && user._id) {
        try {
          // Use the optimized endpoint to get posts by user ID
          const postsByUser = await postService.getByUserId(user._id)
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

    // Optimistic update - update state immediately for better UX
    const previousIsFollowing = isFollowing
    setIsFollowing(!isFollowing)
    
    // Optimistically update followers count
    const previousFollowers = user.followers || []
    const optimisticFollowers = previousIsFollowing
      ? previousFollowers.filter(id => id !== loggedinUser._id) // Remove from followers
      : [...previousFollowers, loggedinUser._id] // Add to followers
    
    // Update watched user optimistically
    const optimisticUser = {
      ...user,
      followers: optimisticFollowers
    }
    store.dispatch({ type: 'SET_WATCHED_USER', user: optimisticUser })

    try {
      const result = await userService.toggleFollow(user._id)
      
      // Verify the actual result matches our optimistic update
      if (result.isFollowing !== !previousIsFollowing) {
        // Rollback if there was an error
        setIsFollowing(previousIsFollowing)
        store.dispatch({ type: 'SET_WATCHED_USER', user })
      }
      
      // Reload both users from storage to get the actual updated data
      const freshLoggedinUser = await userService.getById(loggedinUser._id)
      const freshWatchedUser = await userService.getById(user._id)
      
      // Update both users in the store
      store.dispatch({ type: 'SET_USER', user: freshLoggedinUser })
      store.dispatch({ type: 'SET_WATCHED_USER', user: freshWatchedUser })
      
    } catch (err) {
      console.error('Error toggling follow:', err)
      // Rollback on error
      setIsFollowing(previousIsFollowing)
      store.dispatch({ type: 'SET_WATCHED_USER', user })
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

  function onOpenPostView(post) {
    setViewingPost(post)
  }

  function onClosePostView() {
    setViewingPost(null)
  }

  function onPostUnsaved(postId) {
    // Remove the unsaved post from the saved posts list
    setSavedPosts(prevSavedPosts => 
      prevSavedPosts.filter(post => post._id !== postId)
    )
  }

  const isOwnProfile = loggedinUser && user && loggedinUser._id === user._id

  // Show skeleton during transitions or when no user data matches current URL
  if (isTransitioning || !user || user._id !== params.id) {
    return <ProfileSkeleton />
  }

  return (
    <section className="user-details">
      <div className="profile-container">
        <div className="profile-header">
          <div className="profile-left">
            <img 
              src={user.imgUrl || '/img/amir-avni.jpg.jpg'} 
              alt={user.fullname}
              className="profile-pic"
              onError={(e) => {
                e.target.src = '/img/amir-avni.jpg.jpg';
              }}
            />
            {isOwnProfile && (
              <button className="edit-profile-btn">Edit profile</button>
            )}
          </div>
          <div className="profile-info">
            <div className="profile-header-top">
              <h2 className="profile-username">{user.username}</h2>
              {!isOwnProfile && (
                <button 
                  className={`follow-btn ${isFollowing ? 'following' : ''}`}
                  onClick={onToggleFollow}
                  key={`follow-${user._id}-${isFollowing}`}
                  style={{ opacity: 1, visibility: 'visible' }}
                >
                  {isFollowing ? 'Following' : 'Follow'}
                </button>
              )}
            </div>

            <div className="profile-fullname-section">
              <p className="profile-fullname">{user.fullname}</p>
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
              <rect x="3" y="3" width="5" height="5" stroke="currentColor" strokeWidth="1.5" fill="none"/>
              <rect x="9.5" y="3" width="5" height="5" stroke="currentColor" strokeWidth="1.5" fill="none"/>
              <rect x="16" y="3" width="5" height="5" stroke="currentColor" strokeWidth="1.5" fill="none"/>
              <rect x="3" y="9.5" width="5" height="5" stroke="currentColor" strokeWidth="1.5" fill="none"/>
              <rect x="9.5" y="9.5" width="5" height="5" stroke="currentColor" strokeWidth="1.5" fill="none"/>
              <rect x="16" y="9.5" width="5" height="5" stroke="currentColor" strokeWidth="1.5" fill="none"/>
              <rect x="3" y="16" width="5" height="5" stroke="currentColor" strokeWidth="1.5" fill="none"/>
              <rect x="9.5" y="16" width="5" height="5" stroke="currentColor" strokeWidth="1.5" fill="none"/>
              <rect x="16" y="16" width="5" height="5" stroke="currentColor" strokeWidth="1.5" fill="none"/>
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
            <div 
              key={post._id} 
              className="profile-post-thumbnail"
              onClick={() => onOpenPostView(post)}
            >
              <img 
                src={post.imgUrl} 
                alt="Post" 
                onError={(e) => {
                  e.target.src = '/img/sunflowers.jpg';
                }}
              />
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

        {/* Debug info - hidden for demo presentation */}
        {false && isOwnProfile && (
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
      </div>

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
          key={`followers-${user._id}-${user.followers?.length || 0}`}
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

      {/* Post View Modal */}
      {viewingPost && (
        <PostViewModal
          isOpen={!!viewingPost}
          onClose={onClosePostView}
          post={viewingPost}
          onLike={() => {}} // You can implement like functionality here if needed
          onDelete={() => {}} // You can implement delete functionality here if needed
          onEdit={() => {}} // You can implement edit functionality here if needed
          onUpdate={updatePost}
          onPostUnsaved={onPostUnsaved}
        />
      )}
    </section>
  )
}