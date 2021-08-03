import React, { useState } from 'react'
import { connect } from 'react-redux'
import { loginUser } from '../reducers/userReducer'
import { setNotification } from '../reducers/notificationReducer'
import { Form, Button } from 'react-bootstrap'

const LoginForm = (props) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const handleLogin = (event) => {
    event.preventDefault()
    props.loginUser(username, password)
      .then(() => props.setNotification('login succeeded', 5))
      .catch(() => props.setNotification('wrong password or username', 5))
    setUsername('')
    setPassword('')
    //console.log('logging in with', username, password)
  }

  return (
    <div>
      <h2>Login</h2>

      <Form onSubmit={handleLogin}>
        <Form.Group>
          <Form.Label>username: </Form.Label>
          <Form.Control className="col-sm-3 my-1"
            type="text"
            name="username"
            onChange={({ target }) => setUsername(target.value)}
          />
          <Form.Label>password: </Form.Label>
          <Form.Control className="col-sm-3 my-1"
            type="password"
            onChange={({ target }) => setPassword(target.value)}
          />
          <Button variant="info" id='login-button' type="submit">login</Button>
        </Form.Group>
      </Form>
    </div>
  )
}

export default connect(null,{ loginUser, setNotification })(LoginForm)