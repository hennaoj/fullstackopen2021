import React, { useState } from 'react'
import { connect } from 'react-redux'
import { setNotification } from '../reducers/notificationReducer'
import { addBlog } from '../reducers/blogReducer'
import { Form, Button } from 'react-bootstrap'

const BlogForm = (props) => {
  //a form for creating a blog with author, title and url
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const addNew = async (event) => {
    event.preventDefault()
    props.addBlog({
      title: title,
      author: author,
      url: url,
      user: props.user
    })
    props.setNotification(`${title} by ${author} was added`, 5)
    setTitle('')
    setAuthor('')
    setUrl('')
    props.toggleVisibility()
  }

  return (
    <div className="blogform">
      <h2>create new</h2>
      <Form>
        <Form.Group row="true">
          <Form.Label>title: </Form.Label>
          <Form.Control className="col-sm-3 my-1"
            id="title"
            type="text"
            value={title}
            name="Title"
            onChange={({ target }) => setTitle(target.value)}
          />
          <Form.Label>author: </Form.Label>
          <Form.Control className="col-sm-3 my-1"
            id="author"
            type="text"
            value={author}
            name="Author"
            onChange={({ target }) => setAuthor(target.value)}
          />
          <Form.Label>url: </Form.Label>
          <Form.Control className="col-sm-3 my-1"
            id="url"
            type="text"
            value={url}
            name="Url"
            onChange={({ target }) => setUrl(target.value)}
          />
          <Button variant="info" onClick={addNew} id='create' type="submit">create</Button>
        </Form.Group>
      </Form>
    </div>
  )
}

export default connect(null,{ setNotification, addBlog })(BlogForm)