const { ApolloServer, gql, UserInputError, ValidationError, AuthenticationError } = require('apollo-server')
require('dotenv').config()

const Book = require('./models/book')
const Author = require('./models/author')
const User = require('./models/user')
const mongoose = require('mongoose')

const MONGODB_URI = process.env.MONGODB_URI

const jwt = require('jsonwebtoken')

const JWT_SECRET = process.env.SECRET

console.log('connecting to', MONGODB_URI)

mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connection to MongoDB:', error.message)
  })

const typeDefs = gql`
  type User {
    username: String!
    favoriteGenre: String!
    id: ID!
  }

  type Token {
    value: String!
  }
  type Author { 
    name: String!
    id: ID!,
    born: Int,
    bookCount: Int
  }
  type Book {
    title: String!,
    published: Int!,
    author: Author!,
    id: ID!,
    genres: [String!]!
  }
  type Query {
    bookCount: Int!,
    authorCount: Int!
    allBooks (author: String, genre: String): [Book!]!,
    allAuthors: [Author!]!
    me: User
  }
  type Mutation {
    addBook(
      title: String!
      author: String!
      published: Int!
      genres: [String!]!
    ): Book
    editAuthor(
      name: String!
      setBornTo: Int!
    ): Author
    createUser(
      username: String!
      favoriteGenre: String!
    ): User
    login(
      username: String!
      password: String!
    ): Token
  }
`

const resolvers = {
  Query: {
    bookCount: () => Book.collection.countDocuments(),
    authorCount: () => Author.collection.countDocuments(),
    allBooks: async (root, args) => {
      const books = await Book.find({}).populate('author')
      //console.log(books)
      if (args.genre) {
        return books.filter(book => book.genres.includes(args.genre))
      }
      return books
    },
    allAuthors: () => {
      return Author.find({})
    },
    me: (root, args, context) => {
      return context.currentUser
    }
  },
  Book: {
    author: (root) => {
      return {
        id: root.author._id,
        name: root.author.name,
        born: root.author.born
      }
    }
  },
  Author: {
    bookCount: async (root) => {
      const books = await Book.find({})
      var bookCount = 0
      books.map(book => {
        if (JSON.stringify(book.author) === JSON.stringify(root.id)) {
          bookCount = bookCount + 1
        }
      })
      return bookCount
    }
  },
  Mutation: {
    addBook: async (root, args, context) => {
      var bookAuthor = await Author.findOne({ name: args.author }) //tarkistetaan, onko kirjailija jo olemassa

      const currentUser = context.currentUser

      if (!currentUser) {
        throw new AuthenticationError('not authenticated')
      }

      if (!bookAuthor) {
        bookAuthor = new Author({name: args.author})
      }
      const book = new Book({title: args.title, author: bookAuthor, published: args.published, genres: args.genres})
      
      try {
        await book.save()
      } catch (error) {
        if (error.name === 'UserInputError') {
          throw new UserInputError(error.message, {
            invalidArgs: args,
          })
        } else if (error.name == 'ValidationError') {
          throw new ValidationError(error.message)
        }
      }

      try {
        await bookAuthor.save()
      } catch (error) {
        await Book.findByIdAndDelete(book.id)
        throw new ValidationError(error.message)
      }
      return book
    },
    editAuthor: async (root, args, context) => {
      const author = await Author.findOne({ name: args.name }) 
      const currentUser = context.currentUser

      if (!currentUser) {
        throw new AuthenticationError('not authenticated')
      }
      
      if (!author) {
        return null
      }
      const replaceAuthor = { name: author.name, _id: author._id, born: args.setBornTo }
      console.log(replaceAuthor)
      await Author.findByIdAndUpdate(author._id, replaceAuthor, { new: true })
      return replaceAuthor
    },
    createUser: (root, args) => {
      const user = new User({ username: args.username, favoriteGenre: args.favoriteGenre  })
  
      return user.save()
        .catch(error => {
          throw new UserInputError(error.message, {
            invalidArgs: args,
          })
        })
    },
    login: async (root, args) => {
      const user = await User.findOne({ username: args.username })
  
      if ( !user || args.password !== 'secret' ) {
        throw new UserInputError("wrong credentials")
      }
  
      const userForToken = {
        username: user.username,
        id: user._id,
      }
  
      return { value: jwt.sign(userForToken, JWT_SECRET) }
    },
  }
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req }) => {
    const auth = req ? req.headers.authorization : null
    if (auth && auth.toLowerCase().startsWith('bearer ')) {
      const decodedToken = jwt.verify(
        auth.substring(7), JWT_SECRET
      )
      const currentUser = await User
        .findById(decodedToken.id).populate('friends')
      return { currentUser }
    }
  }
})

server.listen().then(({ url }) => {
  console.log(`Server ready at ${url}`)
})