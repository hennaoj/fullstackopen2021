const getId = () => (100000 * Math.random()).toFixed(0)

const reducer = (state = [], action) => {
  console.log('state now: ', state)
  console.log('action', action)
  switch(action.type) {
  case 'VOTE': {
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

export const addAnecdote = (data) => {
  return {
    type: 'NEW_ANECDOTE',
    data,
  }
}

export const addVote = (id) => {
  return {
    type: 'VOTE',
    data: { id }
  }
}

export const initializeAnecdotes = (anecdotes) => {
  return{
    type: 'INIT_ANECDOTES',
    data: anecdotes,
  }
}

export default reducer