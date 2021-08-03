import React, { useEffect, useRef } from 'react'
import { connect, useSelector } from 'react-redux'
import { BrowserRouter, Switch, Route, Link } from 'react-router-dom'
import { Navbar } from 'react-bootstrap'

import BlogList from './components/BlogList'
import BlogForm from './components/BlogForm'
import Togglable from './components/Togglable'
import Notification from './components/Notification'
import LoginForm from './components/LoginForm'
import UserList from './components/UserList'
import User from './components/User'
import BlogInfo from './components/BlogInfo'
import LogInfo from './components/LogInfo'
import { logoutUser, initUser } from './reducers/userReducer'

const App = (props) => {
  const user = useSelector(state => state.user)

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      props.initUser(user)
    }
  }, [])

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
    padding: 10
  }

  //is user is not logged in, shows the log in form
  if (!user) {
    return (
      <div className='container'>
        <Notification/>
        <LoginForm/>
      </div>
    )
  }


  return (
    <BrowserRouter>
      <div className='container'>
        <Notification/>
        <Navbar collapseOnSelect expand="lg" className="navbar-custom">
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Link style={padding} to="/">blogs</Link>
            <Link style={padding} to="/users">users</Link>
            <LogInfo/>
          </Navbar.Collapse>
        </Navbar>
        <div>
          <br></br>
          <h2>Blog App</h2>
          <br></br>
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
            <br></br>
            <BlogList user={ user } />
          </Route>
        </Switch>
      </div>
    </BrowserRouter>
  )
}

export default connect(null,{ logoutUser, initUser })(App)