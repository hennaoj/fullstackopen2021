import { useQuery } from '@apollo/client'
import React from 'react'

import { ALL_BOOKS, FAVORITE_GENRE } from '../queries'

const Recommended = (props) => {
  const result = useQuery(ALL_BOOKS)
  const favResult = useQuery(FAVORITE_GENRE)
  
  if (!props.show) {
    return null
  }

  if (result.loading || favResult.loading)  {
    return <div>loading...</div>
  }

  var books = result.data.allBooks
  var genre = favResult.data.me.favoriteGenre
  //console.log(genre)

  books = books.filter(book => book.genres.includes(genre))

  return (
    <div>
      <h2>recommended books</h2>
      {genre && <p>books in you favorite genre <b>{genre}</b></p>}
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
    </div>
  )
}

export default Recommended