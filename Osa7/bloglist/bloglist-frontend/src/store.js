import notificationReducer from './reducers/notificationReducer'
import blogReducer from './reducers/blogReducer'
import { composeWithDevTools } from 'redux-devtools-extension'
import { createStore, combineReducers, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'

const reducer = combineReducers({
  blogs: blogReducer,
  notification: notificationReducer
})

const store = createStore(
  reducer,
  composeWithDevTools(applyMiddleware(thunk))
)

console.log(store.getState())

export default store