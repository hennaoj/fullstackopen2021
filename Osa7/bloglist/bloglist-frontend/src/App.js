import React, { useEffect, useRef } from 'react'
import { connect, useDispatch, useSelector } from 'react-redux'
import { BrowserRouter, Switch, Route, Link } from 'react-router-dom'

import BlogList from './components/BlogList'
import BlogForm from './components/BlogForm'
import Togglable from './components/Togglable'
import Notification from './components/Notification'
import LoginForm from './components/LoginForm'
import UserList from './components/UserList'
import User from './components/User'
import BlogInfo from './components/BlogInfo'

import { setNotification } from './reducers/notificationReducer'
import { initializeBlogs, addBlog } from './reducers/blogReducer'
import { logoutUser, initUser } from './reducers/userReducer'

const App = (props) => {

  const user = useSelector(state => state.user)

  const dispatch = useDispatch()
  useEffect(() => { //initializing the anecdotes when the app is first launched
    dispatch(initializeBlogs())
  }, [dispatch])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      props.initUser(user)
    }
  }, [])


  const logout = (event) => {
    event.preventDefault()
    props.logoutUser()
    props.setNotification('logout succeeded', 5)
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

  const padding = {
    padding: 5
  }

  //is user is not logged in, shows the log in form
  if (user === null) {
    return (
      <div>
        <Notification/>
        <LoginForm/>
      </div>
    )
  }


  return (
    <BrowserRouter>
      <div>
        <Link style={padding} to="/">blogs</Link>
        <Link style={padding} to="/users">users</Link>
        <small>{user.name} logged in </small>
        <button onClick={logout}>logout</button>
      </div>
      <div>
        <Notification/>
        <h2>Blog App</h2>
      </div>
      <Switch>
        <Route path="/users/:id">
          <User />
        </Route>
        <Route path='/users'>
          <UserList />
        </Route>
        <Route path="/blogs/:id">
          <BlogInfo />
        </Route>
        <Route path='/'>
          {blogForm()}
          <BlogList user={ user } />
        </Route>
      </Switch>
    </BrowserRouter>
  )
}

export default connect(null,{ setNotification, addBlog, logoutUser, initUser })(App)