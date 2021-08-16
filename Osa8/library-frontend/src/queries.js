import { gql } from '@apollo/client'

export const BOOK_ADDED = gql`
  subscription {
    bookAdded {
      id
      title
      author {
        name
        born
        bookCount
        id
      }
      published
      genres
    }
  }
`

export const ALL_AUTHORS = gql`
  query {
    allAuthors {
        name
        born
        bookCount
        id
    }
  }
`

export const ALL_BOOKS = gql`
  query {
    allBooks {
      title
      published
      author {
        name
      }
      id
      genres
    }
  }
`

export const FAVORITE_GENRE = gql`
  query {
    me {
      favoriteGenre
    }
  }
`

export const ADD_BOOK = gql`
  mutation addBook($title: String!, $author: String!, $published: Int!, $genres: [String!]!) {
    addBook(
      title: $title,
      author: $author,
      published: $published,
      genres: $genres
    ) {
      title
      author {
        name
      }
      published
      genres
    }
  }
`

export const CHANGE_BORN = gql`
  mutation editAuthor($name: String!, $setBornTo: Int!) {
    editAuthor(
      name: $name,
      setBornTo: $setBornTo
    ) {
      name
      born
    }
  }
`

export const LOGIN = gql`
  mutation login($username: String!, $password: String!) {
    login(username: $username, password: $password)  {
      value
    }
  }
`