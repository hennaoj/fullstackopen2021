import React, { useState } from 'react'
import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import LoginForm from './components/LoginForm'
import SetBirth from './components/SetBirth'
import Recommended from './components/Recommended'
import { useApolloClient, useSubscription } from '@apollo/client'
import { BOOK_ADDED, ALL_BOOKS, ALL_AUTHORS } from './queries'

const App = () => {
  const [page, setPage] = useState('authors')
  const [token, setToken] = useState(null)
  const client = useApolloClient()

  const logout = () => {
    setToken(null)
    localStorage.clear()
    client.resetStore()
  }

  const updateCacheWith = (addedBook) => {
    const includedIn = (set, object) => 
      set.map(p => p.id).includes(object.id)  

    //lisätään kirja, jos sitä ei ole jo välimuistissa
    const bookDataInStore = client.readQuery({ query: ALL_BOOKS })
    if (!includedIn(bookDataInStore.allBooks, addedBook)) {
      client.writeQuery({
        query: ALL_BOOKS,
        data: { allBooks: bookDataInStore.allBooks.concat(addedBook) }
      })
    }
    //lisätään kirjailija, jos sitä ei ole jo välimuistissa
    const authorDataInStore = client.readQuery({ query: ALL_AUTHORS })
    if (!includedIn(authorDataInStore.allAuthors, addedBook.author)) {
      client.writeQuery({
        query: ALL_AUTHORS,
        data: { allAuthors: authorDataInStore.allAuthors.concat(addedBook.author) }
      })
    }
  }

  //päivitetään välimuisti, jos kirja lisätty
  useSubscription(BOOK_ADDED, {
    onSubscriptionData: ({ subscriptionData }) => {
      const addedBook = subscriptionData.data.bookAdded
      setTimeout(function() {
        window.alert(`${addedBook.title} added`)
        }, 100)
      updateCacheWith(addedBook)
    }
  })

  return (
    <div>
      <div>
        <button onClick={() => setPage('authors')}>authors</button>
        <button onClick={() => setPage('books')}>books</button>
        {token ?
        <>
          <button onClick={() => setPage('add')}>add book</button>
          <button onClick={() => setPage('recommended')}>recommended</button>
          <button onClick={logout}>logout</button>
        </>
        :
          <button onClick={() => setPage('login')}>login</button>
        }
      </div>

      <Authors
        show={page === 'authors'}
      />

      <Books
        show={page === 'books'}
      />

      <NewBook
        show={page === 'add'}
      />

      <LoginForm
        show={page === 'login'} setToken={setToken} setPage={setPage}
      />

      {token &&
        <SetBirth 
          show={page === 'authors'} 
        />
      }

      <Recommended
        show={page === 'recommended'}
      />

    </div>
  )
}

export default App