const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')
const { request } = require('express')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog
    .find({}).populate('user', { username: 1, name:1 })

  response.json(blogs.map(blog => blog.toJSON()))
})

blogsRouter.post('/', async (request, response, next) => {
  const body = request.body

  const decodedtoken = jwt.verify(request.token, process.env.SECRET)

  //varmistetaan tokenin oikeellisuus
  if (!request.token || !decodedtoken.id) {
    return response.status(401).json({error: 'token missing or invalid'})
  }

  //haetaan käyttäjä id:n avulla
  const user = await User.findById(decodedtoken.id)

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
    user: user
  })

  //tallennetaan blogi tietokantaan
  const savedBlog = await blog.save()

  //lisätään blogi myös käyttäjän tietoihin ja tallennetaan käyttäjä
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()
  response.json(savedBlog.toJSON())
})

blogsRouter.delete('/:id', async (request, response) => {
  const blog = await Blog.findById(request.params.id)
  const user = request.user
  const token = request.token

  if (!token || !user) {
    return response.status(401).json({error: 'token missing or invalid'})
  } else if (blog.user._id.toString() !== user.id) { //varmistetaan, että token ja blogin lisännyt käyttäjä mätsäävät
    return response.status(401).json({error: 'token does not match the user'})
  }

  //poistetaan blogi tietokannasta
  await Blog.findByIdAndRemove(request.params.id)
  response.status(204).end()
})

blogsRouter.put('/:id', async (request, response, next) => {
  const body = request.body

  const blogToUpdate = await Blog.findById(request.params.id)
  

  if (body.likes) {
    blogToUpdate.likes = body.likes
  }

  if (body.url) {
    blogToUpdate.url = body.url
  }

  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blogToUpdate, { new: true })
  response.json(updatedBlog)
})

blogsRouter.post('/:id', async (request, response, next) => {
  const body = request.body
  console.log(body)

  const blogToUpdate = await Blog.findById(request.params.id)

  if (body.comments) {
    console.log('adding comment')
    blogToUpdate.comments = body.comments
  }

  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blogToUpdate, { new: true })
  response.json(updatedBlog)
})

module.exports = blogsRouter