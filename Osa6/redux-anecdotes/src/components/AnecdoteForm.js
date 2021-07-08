import React from 'react'
import { useDispatch } from 'react-redux'
import { addAnecdote } from '../reducers/anecdoteReducer'
import { changeNotification, nullifyNotification } from '../reducers/notificationReducer'

const AnecdoteForm = () => {
  const dispatch = useDispatch()

  const createAnecdote = (event) => {
    event.preventDefault()
    const content = event.target.anecdote.value
    event.target.anecdote.value = ''
    dispatch(addAnecdote(content))
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