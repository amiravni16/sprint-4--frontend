import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { loadUsers, removeUser } from '../store/actions/user.actions'
import { useNavigate } from 'react-router'
import { Link } from 'react-router-dom'
import { showSuccessMsg, showErrorMsg } from '../services/event-bus.service'

export function AdminIndex() {
    const navigate = useNavigate()

	const user = useSelector(storeState => storeState.userModule.user)
	const users = useSelector(storeState => storeState.userModule.users)
	const isLoading = useSelector(storeState => storeState.userModule.isLoading)

	useEffect(() => {
        if(!user?.isAdmin) navigate('/')
		loadUsers()
	}, [])

	async function onRemoveUser(userId, username) {
		try {
			await removeUser(userId)
			showSuccessMsg(`User ${username} removed successfully`)
		} catch (err) {
			showErrorMsg('Failed to remove user')
		}
	}

	return <section className="admin-page">
		<div className="admin-header">
			<h1>👑 Admin Dashboard</h1>
			<p>Manage users and content</p>
		</div>

        {isLoading && <div className="loading">Loading users...</div>}
        
        {users && (
			<div className="users-grid">
				{users.map(user => (
					<div key={user._id} className="user-card">
						<div className="user-header">
							<img 
								src={user.imgUrl} 
								alt={user.fullname}
								className="user-avatar"
							/>
							<div className="user-info">
								<h3>{user.fullname}</h3>
								<p>@{user.username}</p>
								{user.isAdmin && <span className="admin-badge">Admin</span>}
							</div>
						</div>

						<div className="user-stats">
							<div className="stat">
								<strong>{user.followers?.length || 0}</strong>
								<span>Followers</span>
							</div>
							<div className="stat">
								<strong>{user.following?.length || 0}</strong>
								<span>Following</span>
							</div>
							<div className="stat">
								<strong>{user.savedPosts?.length || 0}</strong>
								<span>Saved</span>
							</div>
						</div>

						<div className="user-actions">
							<Link 
								to={`/user/${user._id}`}
								className="btn btn-primary"
							>
								View Profile
							</Link>
							{!user.isAdmin && (
								<button 
									className="btn btn-danger"
									onClick={() => onRemoveUser(user._id, user.username)}
								>
									Remove User
								</button>
							)}
						</div>

						{/* Clean debug info */}
						<details className="debug-info">
							<summary>Debug Data</summary>
							<pre>{JSON.stringify({
								_id: user._id,
								username: user.username,
								fullname: user.fullname,
								isAdmin: user.isAdmin,
								followers: user.followers || [],
								following: user.following || [],
								savedPosts: user.savedPosts || []
							}, null, 2)}</pre>
						</details>
					</div>
				))}
			</div>
        )}
    </section>
}
