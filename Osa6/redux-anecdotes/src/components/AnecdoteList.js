import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { addVote } from '../reducers/anecdoteReducer'
import { setNotification } from '../reducers/notificationReducer'

const AnecdoteList = () => {
  //lists the anecdotes in vote order and handles the voting 

  const dispatch = useDispatch()
  const anecdotes = useSelector(({anecdotes,filter}) => {
    return anecdotes.filter(anecdote => //if filter is set returns only the anecdotes that include the filter string
      anecdote.content.toLowerCase().includes(filter.toLowerCase())
    )
  })

  anecdotes.sort((a,b) => b.votes-a.votes) //puts the anecdotes in order by votes

  const vote = (anecdote) => {
    //when the vote button is pressed handles the vote using addVote and sets the correct notification for 5 seconds
    console.log('vote', anecdote.id)
    dispatch(addVote(anecdote))
    dispatch(setNotification(`you voted '${anecdote.content}'`, 5))
  }

  return (
    <div>
      {anecdotes.map(anecdote => //mapping the anecdotes to show the content and votes of each
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