import React from 'react'
import { addLike } from '../reducers/blogReducer'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'

const Blog = ({ blog }) => {

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  return (
    <div className='blog' id='blog'>
      <div style={blogStyle}>
        <Link to={`/blogs/${blog.id}`}>{blog.title} by {blog.author}</Link>
      </div>
    </div>
  )
}

export default connect(null,{ addLike })(Blog)