import React from 'react'
import { addAnecdote } from '../reducers/anecdoteReducer'
import { setNotification } from '../reducers/notificationReducer'
import { connect } from 'react-redux'

const AnecdoteForm = (props) => {
  //form for creating a new anecdote

  const createAnecdote = async (event) => {
    //uses addAnecdote to add the anecdote to the db
    event.preventDefault()
    const content = event.target.anecdote.value
    console.log(`you added '${content}'`)
    event.target.anecdote.value = ''
    props.addAnecdote(content)
    props.setNotification(`you added '${content}'`, 5) //sets notification for 5 seconds
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

export default connect(null,{addAnecdote, setNotification})(AnecdoteForm)