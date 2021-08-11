import React, { useState } from 'react'
import { useMutation, useQuery } from '@apollo/client'

import { CHANGE_BORN, ALL_AUTHORS, ALL_BOOKS } from '../queries'

const SetBirth = (props) => {
  const [author, setAuthor] = useState('')
  const [born, setBorn] = useState('')

  const [ changeBorn ] = useMutation(CHANGE_BORN, {
    refetchQueries: [ { query: ALL_AUTHORS }, { query: ALL_BOOKS }]
  })

  const result = useQuery(ALL_AUTHORS)
  const authors = result.data.allAuthors

  if (!props.show) {
    return null
  }

  const submit = async (event) => {
    event.preventDefault()
    
    changeBorn({ variables: { name: author, setBornTo: parseInt(born) } })

    setAuthor('')
    setBorn('')
  }

  return (
    <div>
      <h3>Set birthyear</h3>
      <form onSubmit={submit}>
        <select value={author} onChange={({ target }) => setAuthor(target.value)}>
          {authors.map(author =>
            <option value={author.name}>{author.name}</option>
          )}
        </select>
        <div>
          born
          <input
            value={born}
            onChange={({ target }) => setBorn(target.value)}
          />
        </div>
        <button type='submit'>update author</button>
      </form>
    </div>
  )
}

export default SetBirth
