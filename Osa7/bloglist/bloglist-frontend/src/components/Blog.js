import React from 'react'
import { addLike } from '../reducers/blogReducer'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'

const Blog = ({ blog }) => {

  return (
    <tr className='blog' id='blog'>
      <td>
        <Link to={`/blogs/${blog.id}`}>{blog.title} by {blog.author}</Link>
      </td>
    </tr>
  )
}

export default connect(null,{ addLike })(Blog)