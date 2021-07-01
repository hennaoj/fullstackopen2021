import React, { useState, useEffect } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')
  const [notification, setNotification] = useState(null)

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )  
  }, )

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])


  const logout = (event) => {
    event.preventDefault()
    setUser(null)
    window.localStorage.clear()
    setNotification('logout succeeded')
    setTimeout(() => {
      setNotification(null)
    }, 4000)
  }

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({
        username, password
      })


      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      ) 
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
      setNotification('login succeeded')
      setTimeout(() => {
        setNotification(null)
      }, 4000)
      } catch (exception) {
        setNotification('wrong username or password')
        setTimeout(() => {
          setNotification(null)
        }, 4000)
      }

    console.log('logging in with', username, password)
  }

  const createBlog = (event) => {
    event.preventDefault()
    const blogObject = {
      title: title,
      author: author,
      url: url
    }

    blogService
      .create(blogObject)
      .then(returnedBlog => {
        setBlogs(blogs.concat(returnedBlog))
        setNotification(`${title} by ${author} was added`)
        setTimeout(() => {
          setNotification(null)
        }, 4000)
        setTitle('')
        setAuthor('')
        setUrl('')
        console.log('here')
      })
      .catch(error => {
        setNotification('new blogs require a title and an url')
        setTimeout(() => {
          setNotification(null)
        }, 4000)
      })
  }

  if (user === null) {
    return (
      <div>
        <Notification message={notification} />
        <h2>Log in to application</h2>
        <form onSubmit={handleLogin}>
        <div>
        username: { }
          <input
          type="text"
          value={username}
          name="Username"
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
        password: { }
          <input
          type="password"
          value={password}
          name="Password"
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <button type="submit">login</button>
        </form>
      </div>
    )
  }

  return (
    <div>
      <Notification message={notification} />
      <h2>blogs</h2>
        <div>
          {user.name} logged in  <button onClick={logout}>logout</button>
        </div>
      <h2>create new</h2>
        <form onSubmit={createBlog}>
          <div>
            title: { }
            <input
            type="text"
            value={title}
            name="Title"
            onChange={({ target }) => setTitle(target.value)}
            />
          </div>
          <div>
            author: { }
            <input
            type="text"
            value={author}
            name="Author"
            onChange={({ target }) => setAuthor(target.value)}
            />
          </div>
          <div>
            url: { }
            <input
            type="text"
            value={url}
            name="Url"
            onChange={({ target }) => setUrl(target.value)}
            />
          </div>
          <button type="submit">create</button>
        </form>
      <br></br>
      <div>
        {blogs.map(blog =>
          <Blog key={blog.id} blog={blog} />
        )}
      </div>
    </div>
  )
}

export default App