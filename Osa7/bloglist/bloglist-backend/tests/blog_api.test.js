const bcrypt = require('bcrypt')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')
const User = require('../models/user')

const initialBlogs = [
    {
        title: "React patterns",
        author: "Michael Chan",
        url: "https://reactpatterns.com/",
        likes: 8
      },
      {
        title: "Go To Statement Considered Harmful",
        author: "Edsger W. Dijkstra",
        url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
        likes: 10
      }
]
beforeEach(async () => {
  await Blog.deleteMany({})
  let blogObject = new Blog(initialBlogs[0])
  await blogObject.save()
  blogObject = new Blog(initialBlogs[1])
  await blogObject.save()
})

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('the correct amount of blogs are returned', async () => {
    const response = await api.get('/api/blogs')
  
    expect(response.body).toHaveLength(initialBlogs.length)
})

test('the blog identifier is id not _id', async () => {
    const response = await api.get('/api/blogs')
    expect(response.body[0].id).toBeDefined()
})

describe('blog adding', () => {
  beforeEach(async () => {
    //luodaan testikäyttäjä ennen jokaista testiä
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('hello', 10)
    const user = new User({ username: 'root',name: 'Tester', passwordHash })

    await user.save()
  })
  test('blogs can be added to the database', async () => {
      const newBlog = {
          title: "TDD harms architecture",
          author: "Robert C. Martin",
          url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
          likes: 0
        }

      //logataan testikäyttäjä sisään ja talletetaan saatu token
      const user = {username: 'root', password: 'hello'}
      const response = await api
        .post('/api/login')
        .send(user)
      const token = ('bearer ' + response.body.token)


      //lisätään uusi blogi tokenin avulla
      await api
        .post('/api/blogs')
        .send(newBlog)
        .set({Authorization: token})
        .expect(200)
        .expect('Content-Type', /application\/json/)
      
      const blogsAtEnd = await Blog.find({})
      const blogsAtEndJSON = blogsAtEnd.map(blog => blog.toJSON())

      //tarkistetaan, että blogilista on kasvanut yhdellä
      expect(blogsAtEndJSON).toHaveLength(initialBlogs.length + 1)

      const titles = blogsAtEndJSON.map(r => r.title)

      //tarkastetaan, että uuden blogin nimi löytyy tietokannan listalta
      expect(titles).toContain(newBlog.title)
  })

  test('if likes of added blog is not defined, it is set to 0', async () => {
      const newBlog = {
          title: "Type wars",
          author: "Robert C. Martin",
          url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html"
      } 

      //logataan testikäyttäjä sisään ja talletetaan saatu token
      const user = {username: 'root', password: 'hello'}
      const response = await api
        .post('/api/login')
        .send(user)
      const token = ('bearer ' + response.body.token)

      //lisätään uusi blogi tokenin avulla
      await api
        .post('/api/blogs')
        .send(newBlog)
        .set({Authorization: token})
        .expect(200)
        .expect('Content-Type', /application\/json/)

      const blogsAtEnd = await Blog.find({})
      const blogsAtEndJSON = blogsAtEnd.map(blog => blog.toJSON())

      var length = blogsAtEndJSON.length

      //tarkistetaan, että tietokannan viimeisen (eli lisätyn) blogin tykkäyksien määrä on 0
      expect(blogsAtEndJSON[length - 1].likes).toEqual(0)
      
  })

  test('if blog to be added has no title, responded with 400', async () => {
      const newBlog = {
          author: "Robert C. Martin",
          url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
          likes: 7
      } 

      //logataan testikäyttäjä sisään ja talletetaan saatu token
      const user = {username: 'root', password: 'hello'}
      const response = await api
        .post('/api/login')
        .send(user)
      const token = ('bearer ' + response.body.token)

      //lisätään uusi blogi tokenin avulla
      await api
        .post('/api/blogs')
        .send(newBlog)
        .set({Authorization: token})
        .expect(400)
      
  })

  test('if blog to be added has no url, responded with 400', async () => {
      const newBlog = {
          title: "Dummy blog",
          author: "Robert C. Martin",
          likes: 7
      }
      
      //logataan testikäyttäjä sisään ja talletetaan saatu token
      const user = {username: 'root', password: 'hello'}
      const response = await api
        .post('/api/login')
        .send(user)
      const token = ('bearer ' + response.body.token)

      //lisätään uusi blogi tokenin avulla
      await api
        .post('/api/blogs')
        .send(newBlog)
        .set({Authorization: token})
        .expect(400)
      
  })
})

describe('user/username will not be added', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('hello', 10)
    const user = new User({ username: 'root',name: 'Tester', passwordHash })

    await user.save()
  })

  test('if the username is already taken', async () => {
    const usersAtStart = await User.find({})

    const newUser = {
      username: 'root',
      name: 'Superuser',
      password: 'salasana'
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)
    
    expect(result.body.error).toContain('`username` to be unique')

    const usersAtEnd = await User.find({})

    expect(usersAtEnd).toHaveLength(usersAtStart.length)

  })

  test('if the username is shorter than 3 letters', async () => {
    const usersAtStart = await User.find({})

    const newUser = {
      username: 'rt',
      name: 'Short',
      password: 'hello'
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)
    
    expect(result.body.error).toContain('User validation failed: username')
    expect(result.body.error).toContain(`is shorter than the minimum`)

    const usersAtEnd = await User.find({})

    expect(usersAtEnd).toHaveLength(usersAtStart.length)

  })

  test('if the username is not defined', async () => {
    const usersAtStart = await User.find({})

    const newUser = {
      name: 'Nousername',
      password: 'hello'
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)
    
    expect(result.body.error).toContain('User validation failed: username')
    expect(result.body.error).toContain('is required')

    const usersAtEnd = await User.find({})

    expect(usersAtEnd).toHaveLength(usersAtStart.length)

  })

  test('if the password is not defined', async () => {
    const usersAtStart = await User.find({})

    const newUser = {
      username: 'nopassword',
      name: 'foobar'
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)
    
    expect(result.body.error).toContain('password missing')

    const usersAtEnd = await User.find({})

    expect(usersAtEnd).toHaveLength(usersAtStart.length)

  })

  test('if the password is shorter than 3 letters', async () => {
    const usersAtStart = await User.find({})

    const newUser = {
      username: 'shortpassword',
      name: 'foobar',
      password: 'no'
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)
    
    expect(result.body.error).toContain('password too short')

    const usersAtEnd = await User.find({})

    expect(usersAtEnd).toHaveLength(usersAtStart.length)

  })

})

afterAll(() => {
  mongoose.connection.close()
})