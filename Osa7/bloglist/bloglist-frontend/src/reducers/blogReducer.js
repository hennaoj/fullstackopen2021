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
  case 'REMOVE': {
    const id = action.data.id
    var filtered = state.filter(function(blog){
      return blog.id !== id
    })
    return filtered
  }
  case 'COMMENT': {
    console.log(action.data)
    const id = action.data.id
    return state.map(blog =>
      blog.id !== id ? blog : action.data)
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

export const addComments = (blog, comment) => {
  const changedBlog = {
    ...blog,
    comments: blog.comments.concat(comment)
  }
  return async dispatch => {
    const updatedBlog = await blogService.comment(blog.id, changedBlog)
    dispatch({
      type: 'COMMENT',
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

export const removeBlog = blog => {
  return async dispatch => {
    await blogService.destroy(blog.id)
    dispatch({
      type: 'REMOVE',
      data: blog
    })
  }
}

export default reducer