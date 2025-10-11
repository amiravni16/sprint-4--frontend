import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

import { showSuccessMsg, showErrorMsg } from '../services/event-bus.service'
import { loadPost, addPostMsg } from '../store/actions/post.actions'

export function PostDetails() {

  const {postId} = useParams()
  const post = useSelector(storeState => storeState.postModule.post)

  useEffect(() => {
    loadPost(postId)
  }, [postId])

  async function onAddPostMsg(postId) {
    try {
        await addPostMsg(postId, 'bla bla ' + parseInt(Math.random()*10))
        showSuccessMsg(`Post comment added`)
    } catch (err) {
        showErrorMsg('Cannot add post comment')
    }        
}

  return (
    <section className="post-details">
      <Link to="/post">Back to list</Link>
      <h1>Post Details</h1>
      {post && <div>
        <h3>{post.title}</h3>
        <pre> {JSON.stringify(post, null, 2)} </pre>
      </div>
      }
      <button onClick={() => { onAddPostMsg(post._id) }}>Add post comment</button>

    </section>
  )
}
