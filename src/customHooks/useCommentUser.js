import { useState, useEffect } from 'react'
import { userService } from '../services/user'

// Custom hook to get current user data for comment authors
export function useCommentUser(comment) {
    const [commentUser, setCommentUser] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (!comment?.by?._id) {
            setLoading(false)
            return
        }

        async function fetchCommentUser() {
            try {
                const user = await userService.getById(comment.by._id)
                setCommentUser(user)
            } catch (err) {
                console.error('Error fetching comment user data:', err)
                // Fallback to embedded data if lookup fails
                setCommentUser(comment.by)
            } finally {
                setLoading(false)
            }
        }

        fetchCommentUser()
    }, [comment?.by?._id])

    return { commentUser, loading }
}
