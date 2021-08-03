import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import Blog from './Blog'
import { Table } from 'react-bootstrap'
import { initializeBlogs } from '../reducers/blogReducer'

const BlogList = ({ user }) => {
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(initializeBlogs())
  }, [dispatch])
  const blogs = useSelector(state => state.blogs)

  blogs.sort((a,b) => b.likes-a.likes)

  return (
    <Table striped borderless>
      <tbody>
        {blogs.map(blog =>
          <Blog key={blog.id} blog={blog} user={user}/>
        )}
      </tbody>
    </Table>
  )
}

export default BlogList