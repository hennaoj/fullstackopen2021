import React, { useState } from 'react'
import { useSelector, connect } from 'react-redux'
import { useParams } from 'react-router'
import { addLike, removeBlog, addComments } from '../reducers/blogReducer'

const BlogInfo = (props) => {
  const [comment, setComment] = useState('')

  const user = useSelector(state => state.user)
  const blogs = useSelector(state => state.blogs)
  const id = useParams().id
  const blog = blogs.find(blog => blog.id === id)

  const handleRemove = () => {
    props.removeBlog(blog)
  }

  const addComment = (event) => {
    event.preventDefault()
    props.addComments(blog, comment)
  }

  if (!blog) {
    return null
  }

  return (
    <div>
      <h2>{blog.title} by {blog.author}</h2>
      <a href={`http://${blog.url}`}>{blog.url}</a>
      <p id='likes'>likes: {blog.likes} <button id='like' onClick={() => props.addLike(blog)}>like</button></p>
      <p>added by {blog.user.name}</p>
      <h3>comments</h3>
      <form onSubmit={addComment}>
        <input
          id='comment'
          value={comment}
          onChange={({ target }) => setComment(target.value)}/>
        <button id='comment-button' type="submit">add comment</button>
      </form>
      <ul>
        {blog.comments.map(comment => <li key={comment}>{comment}</li>)}
      </ul>
      {user.username === blog.user.username ? //removing possible only for blogs the logged in user has added
        <button id='remove' onClick={handleRemove}>remove</button>
        :
        null
      }
    </div>
  )
}

export default connect(null,{ addLike, removeBlog, addComments })(BlogInfo)