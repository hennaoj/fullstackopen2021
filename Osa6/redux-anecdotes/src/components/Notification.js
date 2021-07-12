
import React from 'react'
import { connect  } from 'react-redux'

const Notification = (props) => {
  //returns a notification box on the top of the app when a notification is set

  const style = {
    border: 'solid',
    padding: 10,
    borderWidth: 1
  }
  if (props.notification === null) {
    return null
  }
  return (
    <div style={style}>
      {props.notification}
    </div>
  )
}

const mapStateToProps = (state) => {
  return {
    notification: state.notification
  }
}

const ConnectedNotification = connect(mapStateToProps)(Notification)
export default ConnectedNotification