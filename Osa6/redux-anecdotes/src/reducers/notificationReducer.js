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

export const setNotification = (notification, time) => {
    return async dispatch => {
        dispatch({
            type: 'SET_NOTIFICATION',
            notification: notification,
        })
        setTimeout(() => {
            dispatch({type: 'NULLIFY'})
        }, time*1000)
    }
}

export default notificationReducer