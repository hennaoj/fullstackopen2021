import React, { useState } from 'react'

const Button = (props) => {
  return (
    <button onClick={props.handleClick}>
      {props.text}
    </button>
  )
}

const Maximum = (props) => {
  let i = props.votes.indexOf(Math.max(...props.votes))
  return (
    <div>
      <p>{props.list[i]}</p>
      <p>has {props.votes[i]} votes</p>
      </div>
  )
}

const App = () => {
  const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when dianosing patients.'
  ]

  
  const [votes, setVotes] = useState(Array(anecdotes.length).fill(0))
   
  const [selected, setSelected] = useState(0)
  var index = Math.floor(Math.random() * anecdotes.length)

  const handleVote = () => {
    const votesCopy = [...votes]
    votesCopy[selected] += 1
    setVotes(votesCopy)
  }


  return (
    <div>
      <h2>Anecdote of the day</h2>
      {anecdotes[selected]}
      <p>has {votes[selected]} votes</p>
      <br></br>
      <Button text={'vote'} handleClick={handleVote}/>
      <Button text={'next anecdote'} handleClick={() => setSelected(index)}/>
      <h2>Anecdote with most votes</h2>
      <Maximum list={anecdotes} votes={votes} />
    </div>
  )
}

export default App
