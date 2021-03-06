const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')
const Blog = require('../models/blog')

usersRouter.post('/', async (request, response) => {
  console.log('posting')
  const body = request.body

  //ei luoda käyttäjää, jos salasana puuttuu tai on liian lyhyt
  if (body.password === undefined) {
      return response.status(400).json({ error: 'password missing' })
  } else if (body.password.length < 3) {
      return response.status(400).json({ error: 'password too short (min 3 char)' })
  }

  //tehdään bcryptin avulla passwordHash, joka tallennetaan tietokantaan alkup. salasanan sijasta
  const saltRounds = 10
  const passwordHash = await bcrypt.hash(body.password, saltRounds)

  const user = new User({
    username: body.username,
    name: body.name,
    passwordHash,
  })

  const savedUser = await user.save()

  response.json(savedUser)
})

usersRouter.get('/', async (request, response) => {
    const users = await User
        .find({}).populate('blogs', { url: 1, title: 1, author: 1 }) //näyttää käyttäjän lisäämien blogien tiedot

    response.json(users.map(u => u.toJSON()))
})

module.exports = usersRouter