import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import userService from '../services/users'

const User = () => {
  const [ users, setUsers ] = useState(null)

  const getUsers = async () => {
    const userList = await userService.getAll()
    userList.sort((a,b) => b.blogs.length-a.blogs.length)
    setUsers(userList)
  }

  useEffect(() => {
    getUsers()
  }, [])

  const id = useParams().id
  if (!users) {
    return null
  }
  const user = users.find(user => user.id === id)

  return (
    <div>
      <h2>{user.name}</h2>
      <h3>added blogs</h3>
      <ul>
        {user.blogs.map(blog =>
          <li key={blog.id}>{blog.title}</li>
        )}
      </ul>
    </div>
  )
}

export default User