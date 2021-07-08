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

export const changeNotification = notification => {
    return {
        type: 'SET_NOTIFICATION',
        notification,
    }
}

export const nullifyNotification = () => {
    return {
        type: 'NULLIFY',
    }
}

export default notificationReducer