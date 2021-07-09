import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { addVote } from '../reducers/anecdoteReducer'
import { setNotification } from '../reducers/notificationReducer'

const AnecdoteList = () => {
  const dispatch = useDispatch()
  const anecdotes = useSelector(({anecdotes,filter}) => {
    return anecdotes.filter(anecdote => 
      anecdote.content.toLowerCase().includes(filter.toLowerCase())
    )
  })
  anecdotes.sort((a,b) => b.votes-a.votes)

  const vote = (anecdote) => {
    console.log('vote', anecdote.id)
    dispatch(addVote(anecdote))
    dispatch(setNotification(`you voted '${anecdote.content}'`, 4))
  }

  return (
    <div>
      {anecdotes.map(anecdote =>
        <div key={anecdote.id}>
          <div>
            {anecdote.content}
          </div>
          <div>
            has {anecdote.votes}
            <button onClick={() => vote(anecdote)}>vote</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default AnecdoteList