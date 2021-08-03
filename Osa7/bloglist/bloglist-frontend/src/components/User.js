import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import userService from '../services/users'
import { Table } from 'react-bootstrap'

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
      <h3>Added Blogs</h3>
      <Table striped borderless='true'>
        <tbody>
          {user.blogs.map(blog =>
            <tr key={blog.id}><td>{blog.title}</td></tr>
          )}
        </tbody>
      </Table>
    </div>
  )
}

export default User