import axios from 'axios'
const baseUrl = '/api/blogs'

let token = null

const setToken = newToken => {
  token = `bearer ${newToken}`
}

const create = async newObject => {
  const config = {
    headers: { Authorization: token },
  }

  const response = await axios.post(baseUrl, newObject, config)
  return response.data
}

const getAll = async () => {
  const request = await axios.get(baseUrl)
  return request.data
}

const modify = (id, newObject) => {
  const config = {
    headers: { Authorization: token },
  }
  const response = axios.put(`${baseUrl}/${id}`, newObject, config)
  return response.then(response => response.data)
}

const destroy = async (id, user) => {
  console.log(user)
  const config = {
    headers: { Authorization: token },
  }
  const response = await axios.delete(`${baseUrl}/${id}`, config)
  return response.data
}

const functionsToExport = { getAll, setToken, create, modify, destroy }
export default functionsToExport