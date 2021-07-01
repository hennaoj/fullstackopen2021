import React, { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import BlogForm from './components/BlogForm'
import Togglable from './components/Togglable'
import Notification from './components/Notification'
import LoginForm from './components/LoginForm'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [notification, setNotification] = useState(null)

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs.sort((a,b) => b.likes-a.likes ))
    )
  },)

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

  const createBlog = (blogObject) => {
    blogFormRef.current.toggleVisibility()

    blogService
      .create(blogObject)
      .then(returnedBlog => {
        setBlogs(blogs.concat(returnedBlog))
        setNotification(`${blogObject.title} by ${blogObject.author} was added`)
        setTimeout(() => {
          setNotification(null)
        }, 4000)
      })
      .catch(error => {
        setNotification('new blogs require a title and an url')
        setTimeout(() => {
          setNotification(null)
        }, 4000)
      })
  }
  const blogFormRef = useRef()

  const blogForm = () => (
    <Togglable buttonLabel="create new blog" ref={blogFormRef}>
      <BlogForm createBlog={createBlog} />
    </Togglable>
  )


  if (user === null) {
    return (
      <div>
        <Notification message={notification} />
        <LoginForm
          username={username}
          password={password}
          handleUsernameChange={({ target }) => setUsername(target.value)}
          handlePasswordChange={({ target }) => setPassword(target.value)}
          handleSubmit={handleLogin}
        />
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
        {blogForm()}
      <br></br>
      <div>
        {blogs.map(blog =>
          <Blog key={blog.id} blog={blog} user={user}/> 
        )}
      </div>
    </div>
  )
}

export default App