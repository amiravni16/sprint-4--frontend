import { Link } from 'react-router-dom'
import { useState, useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { userService } from '../services/user'
import '../assets/styles/cmps/MobileHeader.css'

export function MobileHeader() {
    const [searchTerm, setSearchTerm] = useState('')
    const [searchResults, setSearchResults] = useState([])
    const [isSearchActive, setIsSearchActive] = useState(false)
    const searchContainerRef = useRef(null)
    const loggedinUser = useSelector(storeState => storeState.userModule.user)
    const navigate = useNavigate()

    useEffect(() => {
        if (searchTerm.trim()) {
            searchUsers(searchTerm)
        } else {
            setSearchResults([])
        }
    }, [searchTerm])

    useEffect(() => {
        function handleClickOutside(event) {
            if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
                setIsSearchActive(false)
                setSearchTerm('')
                setSearchResults([])
            }
        }

        if (isSearchActive) {
            document.addEventListener('mousedown', handleClickOutside)
            return () => {
                document.removeEventListener('mousedown', handleClickOutside)
            }
        }
    }, [isSearchActive])

    async function searchUsers(query) {
        try {
            const allUsers = await userService.getUsers()
            const lowerQuery = query.toLowerCase()
            
            const results = allUsers
                .filter(user => user._id !== loggedinUser?._id)
                .filter(user => {
                    const username = (user.username || '').toLowerCase()
                    const fullname = (user.fullname || '').toLowerCase()
                    return username.includes(lowerQuery) || fullname.includes(lowerQuery)
                })
                .slice(0, 10)
            
            setSearchResults(results)
        } catch (err) {
            console.error('Error searching users:', err)
            setSearchResults([])
        }
    }

    function navigateToProfile(user) {
        setSearchTerm('')
        setIsSearchActive(false)
        navigate(`/user/${user._id}`)
    }

    return (
        <>
            <header className="mobile-header">
                <div className="mobile-header-content">
                    <Link to="/" className="mobile-logo">
                        <img 
                            src="/photograph-logo.svg" 
                            alt="photograph" 
                            className="mobile-logo-svg"
                        />
                    </Link>
                    
                    <div className="mobile-search-container" ref={searchContainerRef}>
                        <div className="mobile-search">
                            <input
                                type="text"
                                className="mobile-search-input"
                                placeholder="Search"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                onFocus={() => setIsSearchActive(true)}
                            />
                            <svg className="search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none">
                                <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </div>

                        {isSearchActive && (
                            <div className="mobile-search-results">
                                {searchResults.length === 0 && searchTerm ? (
                                    <div className="mobile-search-empty">No accounts found</div>
                                ) : (
                                    searchResults.map(user => (
                                        <div key={user._id} className="mobile-search-result-item" onClick={() => navigateToProfile(user)}>
                                            <img 
                                                src={user.imgUrl || '/img/amir-avni.jpg.jpg'}
                                                alt={user.username}
                                                className="mobile-search-avatar"
                                                onError={(e) => {
                                                    e.target.src = '/img/amir-avni.jpg.jpg';
                                                }}
                                            />
                                            <div className="mobile-search-user-info">
                                                <div className="mobile-search-username">{user.username || 'User'}</div>
                                                <div className="mobile-search-subtitle">{user.fullname || ''}</div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        )}
                    </div>
                    
                    <button className="mobile-notifications">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" stroke="currentColor" strokeWidth="2" fill="none"/>
                        </svg>
                    </button>
                </div>
            </header>
        </>
    )
}
