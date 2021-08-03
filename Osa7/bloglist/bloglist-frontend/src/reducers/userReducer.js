import loginService from '../services/login'
import blogService from '../services/blogs'
//import { setNotification } from './notificationReducer'

const reducer = (state = null, action) => {
  //console.log('state now: ', state)
  //console.log('action', action)
  switch(action.type) {
  case 'LOGIN':
    return action.data
  case 'LOGOUT':
    return action.data
  case 'INIT':
    return action.data
  default:
    return state
  }
}


export const loginUser = (username, password)  =>  {
  return async dispatch => {
    const user = await loginService.login({ username, password })
    window.localStorage.setItem(
      'loggedBlogappUser', JSON.stringify(user)
    )
    blogService.setToken(user.token)
    dispatch({
      type: 'LOGIN',
      data: user
    })
  }
}

export const logoutUser = () => {
  window.localStorage.clear()
  return dispatch => {
    dispatch({
      type: 'LOGOUT',
      data: null
    })
  }
}

export const initUser = (user) => {
  blogService.setToken(user.token)
  return dispatch => {
    dispatch({
      type: 'INIT',
      data: user
    })
  }
}

export default reducer