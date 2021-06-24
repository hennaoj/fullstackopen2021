const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')

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

test('blogs can be added to the database', async () => {
    const newBlog = {
        title: "TDD harms architecture",
        author: "Robert C. Martin",
        url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
        likes: 0
      }
    
    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(200)
      .expect('Content-Type', /application\/json/)
    
    const blogsAtEnd = await Blog.find({})
    const blogsAtEndJSON = blogsAtEnd.map(blog => blog.toJSON())

    expect(blogsAtEndJSON).toHaveLength(initialBlogs.length + 1)

    const titles = blogsAtEndJSON.map(r => r.title)

    expect(titles).toContain(newBlog.title)
})

test('if likes of added blog is not defined, it is set to 0', async () => {
    const newBlog = {
        title: "Type wars",
        author: "Robert C. Martin",
        url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html"
    } 

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await Blog.find({})
    const blogsAtEndJSON = blogsAtEnd.map(blog => blog.toJSON())

    var length = blogsAtEndJSON.length

    expect(blogsAtEndJSON[length - 1].likes).toEqual(0)
    
})

test('if blog to be added has no title, responded with 400', async () => {
    const newBlog = {
        author: "Robert C. Martin",
        url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
        likes: 7
    } 

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(400)
    
})

test('if blog to be added has no url, responded with 400', async () => {
    const newBlog = {
        title: "Dummy blog",
        author: "Robert C. Martin",
        likes: 7
    } 

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(400)
    
})

afterAll(() => {
  mongoose.connection.close()
})