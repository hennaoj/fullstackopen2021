import React, { useState, useEffect, useRef } from 'react'
import BlogList from './components/BlogList'
import BlogForm from './components/BlogForm'
import Togglable from './components/Togglable'
import Notification from './components/Notification'
import LoginForm from './components/LoginForm'
import blogService from './services/blogs'
import loginService from './services/login'

import { setNotification } from './reducers/notificationReducer'
import { initializeBlogs, addBlog } from './reducers/blogReducer'
import { connect, useDispatch } from 'react-redux'

const App = (props) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  const dispatch = useDispatch()
  useEffect(() => { //initializing the anecdotes when the app is first launched
    dispatch(initializeBlogs())
  }, [dispatch])

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
    props.setNotification('logout succeeded', 5)
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
      props.setNotification('login succeeded', 5)
    } catch (exception) {
      props.setNotification('wrong username or password', 5)
    }

    console.log('logging in with', username, password)
  }

  const blogFormRef = useRef()

  const toggleVisibility = () => {
    blogFormRef.current.toggleVisibility()
  }

  const blogForm = () => (
    <Togglable buttonLabel="create new blog" ref={blogFormRef}>
      <BlogForm user={user} toggleVisibility={toggleVisibility}/>
    </Togglable>
  )

  //is user is not logged in, shows the log in form
  if (user === null) {
    return (
      <div>
        <Notification/>
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

  //if user is logged in shows a list of blogs and the blogform
  return (
    <div>
      <Notification/>
      <h2>blogs</h2>
      <div>
        {user.name} logged in  <button onClick={logout}>logout</button>
      </div>
      {blogForm()}
      <br></br>
      <BlogList user={user} />
    </div>
  )
}

export default connect(null,{ setNotification, addBlog })(App)