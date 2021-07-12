import anecdoteService from '../services/anecdotes'

const reducer = (state = [], action) => {
  console.log('state now: ', state)
  console.log('action', action)
  switch(action.type) {
  case 'VOTE': { //voting adds a vote to the anecdote using its id
    const id = action.data.id
    const anecdoteToChange = state.find(x => x.id === id)
    const changedAnecdote = {
      ...anecdoteToChange,
      votes: anecdoteToChange.votes + 1
    }
    return state.map(anecdote => 
      anecdote.id !== id ? anecdote : changedAnecdote)
  }
  case 'INIT_ANECDOTES':
    return action.data
  case 'NEW_ANECDOTE': {
    return [...state, action.data]
  }
  default:
    return state
  }
}

export const addAnecdote = content => {
  //adds a new anecdote to the db using anecdoteService
  return async dispatch => {
    const newAnecdote = await anecdoteService.createNew(content)
    dispatch({
      type: 'NEW_ANECDOTE',
      data: newAnecdote,
    })
  } 
}

export const addVote = anecdote => {
  //handles the voting of an anecdote using anecdoteService
  return async dispatch => {
    const updatedAnecdote = await anecdoteService.voteAnecdote(anecdote)
    dispatch({
      type: 'VOTE',
      data: updatedAnecdote
    })
  }
}

export const initializeAnecdotes = () => {
  //fetches the anecdotes from the db using anecdoteService
  return async dispatch => {
    const anecdotes = await anecdoteService.getAll()
    dispatch({
      type: 'INIT_ANECDOTES',
      data: anecdotes,
    })
  }
}

export default reducer