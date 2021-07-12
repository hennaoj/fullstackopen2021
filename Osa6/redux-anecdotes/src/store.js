import anecdoteReducer from './reducers/anecdoteReducer'
import notificationReducer from './reducers/notificationReducer'
import filterReducer from './reducers/filterReducer'

import { createStore, combineReducers, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import { composeWithDevTools } from 'redux-devtools-extension'

//creates reducer combining the three reduceres and sets up a store using the combined reducer

const reducer = combineReducers({
    anecdotes: anecdoteReducer,
    notification: notificationReducer,
    filter: filterReducer,
})

const store = createStore(
    reducer,
    composeWithDevTools(applyMiddleware(thunk)))

console.log(store.getState())

export default store