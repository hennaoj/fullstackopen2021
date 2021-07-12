const notificationReducer = (state=null, action) => {
    switch (action.type) {
        case 'SET_NOTIFICATION':
            return action.notification
        case 'NULLIFY':
            return null
        default:
            return state
    }
}

let timeout
export const setNotification = (notification, time) => {
    if (timeout) { //clears the timeout if notification changes while the previous hasn't nullified yet
        clearTimeout(timeout)
    }
    return async dispatch => {
        dispatch({ //setting the notification string as the string received as a parameter
            type: 'SET_NOTIFICATION',
            notification: notification,
        })
        timeout = setTimeout(() => { //setting notification to null in the time received as a parameter
            dispatch({type: 'NULLIFY'})
        }, time*1000)
    }
}

export default notificationReducer