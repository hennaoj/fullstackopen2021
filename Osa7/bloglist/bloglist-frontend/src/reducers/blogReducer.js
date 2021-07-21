import blogService from '../services/blogs'

const reducer = (state = [], action) => {
  console.log('state now: ', state)
  console.log('action', action)
  switch(action.type) {
  case 'INIT_BLOGS':
    return action.data
  case 'NEW_BLOG': {
    return [...state, action.data]
  }
  case 'LIKE': {
    const id = action.data.id
    const blogToChange = state.find(x => x.id === id)
    const changedBlog = {
      ...blogToChange,
      likes: blogToChange.likes + 1
    }
    return state.map(blog =>
      blog.id !== id ? blog : changedBlog)
  }
  default:
    return state
  }
}

export const addBlog = content => {
  //adds a new blog to the db using blogService
  return async dispatch => {
    const newBlog = await blogService.create(content)
    dispatch({
      type: 'NEW_BLOG',
      data: newBlog,
    })
  }
}

export const addLike = blog => {
  //handles the voting of an anecdote using anecdoteService
  const changedBlog = {
    ...blog,
    likes: blog.likes + 1
  }
  return async dispatch => {
    const updatedBlog = await blogService.modify(blog.id, changedBlog)
    dispatch({
      type: 'LIKE',
      data: updatedBlog
    })
  }
}

export const initializeBlogs = () => {
  //fetches the blogs from the db using blogService
  return async dispatch => {
    const blogs = await blogService.getAll()
    dispatch({
      type: 'INIT_BLOGS',
      data: blogs,
    })
  }
}

export default reducer