import React from 'react'
import { useDispatch } from 'react-redux'
import { addAnecdote } from '../reducers/anecdoteReducer'
import { changeNotification, nullifyNotification } from '../reducers/notificationReducer'
import anecdoteSevice from '../services/anecdotes'

const AnecdoteForm = () => {
  const dispatch = useDispatch()

  const createAnecdote = async (event) => {
    event.preventDefault()
    const content = event.target.anecdote.value
    event.target.anecdote.value = ''
    const newAnecdote = await anecdoteSevice.createNew(content)
    dispatch(addAnecdote(newAnecdote))
    dispatch(changeNotification(`you added '${content}'`))
    setTimeout(() => {
      dispatch(nullifyNotification())
    }, 4000)
  }

  return (
    <div>
    <h2>create new</h2>
    <form onSubmit={createAnecdote}>
        <input name='anecdote' />
        <button type='submit'>create</button>
    </form>
    </div>
  )
}

export default AnecdoteForm