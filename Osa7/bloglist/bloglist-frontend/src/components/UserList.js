import React, { useState, useEffect } from 'react'
import userService from '../services/users'
import { Link } from 'react-router-dom'

const UserList = () => {
  const [ users, setUsers ] = useState(null)

  const getUsers = async () => {
    const userList = await userService.getAll()
    userList.sort((a,b) => b.blogs.length-a.blogs.length)
    setUsers(userList)
  }

  useEffect(() => {
    getUsers()
  }, [])

  console.log(users)

  if (!users) {
    return null
  }
  return (
    <div>
      <h2>Users</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>blogs created</th>
          </tr>
          {users.map(user =>
            <tr key={user.id}>
              <td><Link to={`/users/${user.id}`}>{user.name}</Link></td>
              <td>{user.blogs.length}</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}

export default UserList