import React, { useState } from 'react'
import { connect } from 'react-redux'
import { setNotification } from '../reducers/notificationReducer'
import { addBlog } from '../reducers/blogReducer'

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
      <form>
        <div>
          title: { }
          <input
            id="title"
            type="text"
            value={title}
            name="Title"
            onChange={({ target }) => setTitle(target.value)}
          />
        </div>
        <div>
          author: { }
          <input
            id="author"
            type="text"
            value={author}
            name="Author"
            onChange={({ target }) => setAuthor(target.value)}
          />
        </div>
        <div>
          url: { }
          <input
            id="url"
            type="text"
            value={url}
            name="Url"
            onChange={({ target }) => setUrl(target.value)}
          />
        </div>
        <button  onClick={addNew} id='create' type="submit">create</button>
      </form>
    </div>
  )
}

export default connect(null,{ setNotification, addBlog })(BlogForm)