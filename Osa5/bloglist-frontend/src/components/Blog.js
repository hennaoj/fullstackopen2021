import React, { useState } from 'react'
import blogService from '../services/blogs'

const Blog = ({ blog, user, handleLike }) => {
  const [showBlog, setShowBlog] = useState(false)

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const toggleShow = () => {
    setShowBlog(!showBlog)
  }

  const handleRemove = () => {
    const id = blog.id
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}`)) {
      blogService.destroy(id)
    }
  }


  return (
    <div className='blog'>
      {showBlog === false ?
        <div style={blogStyle}>
          {blog.title} by {blog.author} <button onClick={toggleShow}>view</button>
        </div>
        :
        <div style={blogStyle}>
          <p>{blog.title} by {blog.author} <button onClick={toggleShow}>hide</button></p>
          <p>{blog.url}</p>
          <p>likes {blog.likes} <button onClick={handleLike}>like</button></p>
          <p>{blog.user.name}</p>
          {user.username === blog.user.username ?
            <button onClick={handleRemove}>remove</button>
            :
            null
          }
        </div>
      }
    </div>
  )
}

export default Blog