import { Link, NavLink } from 'react-router-dom'
import { useNavigate } from 'react-router'
import { useSelector } from 'react-redux'
import { showErrorMsg, showSuccessMsg } from '../services/event-bus.service'
import { logout } from '../store/actions/user.actions'

export function AppHeader() {
	const user = useSelector(storeState => storeState.userModule.user)
	const navigate = useNavigate()

	async function onLogout() {
		try {
			await logout()
			navigate('/')
			showSuccessMsg(`Bye now`)
		} catch (err) {
			showErrorMsg('Cannot logout')
		}
	}

	return (
		<header className="app-header full">
			<nav>
				<NavLink to="/" className="logo">
					photograph
				</NavLink>
				<NavLink to="post">Posts</NavLink>

				{!user && <NavLink to="auth/login" className="login-link">Login</NavLink>}
			{user && (
				<div className="user-info">
					<Link to={`user/${user._id}`}>
						<img 
							src={user?.imgUrl || '/img/amir-avni.jpg.jpg'} 
							alt={user.fullname}
							onError={(e) => {
								e.target.src = '/img/amir-avni.jpg.jpg';
							}}
							style={{
								width: '32px',
								height: '32px',
								borderRadius: '50%',
								objectFit: 'cover',
								marginRight: '8px'
							}}
						/>
						{user.username || 'amir.avni'}
					</Link>
					<button onClick={onLogout}>logout</button>
				</div>
			)}
			</nav>
		</header>
	)
}
