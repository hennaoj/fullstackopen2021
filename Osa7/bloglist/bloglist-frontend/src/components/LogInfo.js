import React from 'react'
import { useSelector, connect } from 'react-redux'
import { logoutUser } from '../reducers/userReducer'
import { setNotification } from '../reducers/notificationReducer'
import { Button } from 'react-bootstrap'

const LogInfo = (props) => {
  const user = useSelector(state => state.user)
  const logout = (event) => {
    event.preventDefault()
    props.logoutUser()
    props.setNotification('logout succeeded', 5)
  }

  return (
    <>
      <small>{user.name} logged in &nbsp;</small>
      <Button variant="info" onClick={logout}>logout</Button>
    </>
  )
}

export default connect(null,{ logoutUser, setNotification })(LogInfo)