import { useQuery } from '@apollo/client'
import React, { useState } from 'react'

import { ALL_BOOKS } from '../queries'

const Books = (props) => {
  const [genre, setGenre] = useState(null)
  const result = useQuery(ALL_BOOKS)
  
  if (!props.show) {
    return null
  }

  if (result.loading)  {
    return <div>loading...</div>
  }

  var books = result.data.allBooks
  const genres = []
  books.map(book => book.genres.filter(genre => {
      if (!genres.includes(genre)) {
        genres.push(genre)
        return genre 
      }
      return null
    })
  )

  if (genre) {
    books = books.filter(book => book.genres.includes(genre))
  }

  return (
    <div>
      <h2>books</h2>
      {genre && <p>in genre <b>{genre}</b></p>}
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>
              author
            </th>
            <th>
              published
            </th>
          </tr>
          {books.map(a =>
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          )}
        </tbody>
      </table>
      <div>
        {genres.map(genre => <button key={genre} onClick={() => setGenre(genre)}>{genre}</button>)}
        <button key={'allGenres'} onClick={() => setGenre(null)}>all genres</button>
      </div>
    </div>
  )
}

export default Books