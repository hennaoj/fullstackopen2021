import React, { useState, useEffect } from 'react'
import { useSelector, connect, useDispatch } from 'react-redux'
import { useParams } from 'react-router'
import { addLike, removeBlog, addComments, initializeBlogs } from '../reducers/blogReducer'
import { Button, Card, Form, Table } from 'react-bootstrap'

const BlogInfo = (props) => {
  const [comment, setComment] = useState('')
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(initializeBlogs())
  }, [dispatch])
  const blogs = useSelector(state => state.blogs)
  const user = useSelector(state => state.user)

  const id = useParams().id
  const blog = blogs.find(blog => blog.id === id)

  const handleRemove = () => {
    props.removeBlog(blog)
  }

  const addComment = (event) => {
    event.preventDefault()
    props.addComments(blog, comment)
    setComment('')
  }

  if (!blog) {
    return null
  }

  if (!user) {
    return null
  }

  return (
    <div>
      <Card>
        <Card.Header>{blog.title} by {blog.author}</Card.Header>
        <Card.Body>
          <Table striped borderless='true'>
            <tbody>
              <tr><td>url: <a href={`http://${blog.url}`}>{blog.url}</a></td></tr>
              <tr><td><p id='likes'>likes: {blog.likes} <Button variant="info" id='like' onClick={() => props.addLike(blog)}>like</Button></p></td></tr>
              <tr><td><p>added by {blog.user.name}</p></td></tr>
            </tbody>
          </Table>
        </Card.Body>
      </Card>
      <br></br>
      <Card>
        <Card.Header>Comments</Card.Header>
        <Card.Body>
          <Form>
            <Form.Group>
              <Form.Control className="col-sm-3 my-1"
                id='comment'
                value={comment}
                onChange={({ target }) => setComment(target.value)}/>
              <Button variant="info" id='comment-button' type="submit" onClick={addComment}>add comment</Button>
            </Form.Group>
          </Form>
          <Table>
            <tbody>
              {blog.comments.map(comment => <tr key={comment}><td>{comment}</td></tr>)}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
      <br></br>
      {user.username === blog.user.username ? //removing possible only for blogs the logged in user has added
        <Button variant="info" id='remove' onClick={handleRemove}>remove blog</Button>
        :
        null
      }
    </div>
  )
}

export default connect(null,{ addLike, removeBlog, addComments })(BlogInfo)