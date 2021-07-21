import React, { useState } from 'react'
import blogService from '../services/blogs'
import { addLike } from '../reducers/blogReducer'
import { connect } from 'react-redux'

const Blog = ({ blog, user, addLike }) => {
  const [showBlog, setShowBlog] = useState(false)

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const toggleShow = () => {
    //used to show or hide extra information about the blogs
    setShowBlog(!showBlog)
  }


  const handleRemove = () => {
    //removes a blog using blogService and the blog's id
    const id = blog.id
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}`)) {
      blogService.destroy(id, user)
    }
  }

  return (
    <div className='blog' id='blog'>
      {showBlog === false ?
        <div style={blogStyle}>
          {blog.title} by {blog.author} <button id='view' onClick={toggleShow}>view</button>
        </div>
        :
        <div style={blogStyle}>
          <p>{blog.title} by {blog.author} <button onClick={toggleShow}>hide</button></p>
          <p>{blog.url}</p>
          <p id='likes'>likes: {blog.likes} <button id='like' onClick={() => addLike(blog)}>like</button></p>
          <p>{blog.user.name}</p>
          {user.username === blog.user.username ? //removing possible only for blogs the logged in user has added
            <button id='remove' onClick={handleRemove}>remove</button>
            :
            null
          }
        </div>
      }
    </div>
  )
}

export default connect(null,{ addLike })(Blog)