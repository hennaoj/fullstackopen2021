import axios from 'axios'

const baseUrl = 'http://localhost:3001/anecdotes'

const getAll = async () => {
  //fetches all the anecdotes in database
  const response = await axios.get(baseUrl)
  return response.data
}

const createNew = async (content) => {
  //creates a new anecdote with 0 votes
    const object = { content, votes: 0 }
    const response = await axios.post(baseUrl, object)
    return response.data
}

const voteAnecdote = async (anecdote) => {
  //adds a vote to an anecdote based on its id
    const object = { content: anecdote.content, votes: anecdote.votes + 1, id: anecdote.id}
    const response = await axios.put(`${baseUrl}/${anecdote.id}`, object)
    return response.data
}

const toExport = { getAll, createNew, voteAnecdote }
export default toExport