const handleLike = (blog) => {
    //adds a like to a blog based on its id and uses blogService to update the blog
    const id = blog.id

    const blogObject = {
      title: blog.title,
      author: blog.author,
      user: blog.user.id,
      url: blog.url,
      likes: blog.likes+1
    }
    blogService
      .modify(id,blogObject).then(returnedBlog => {
        const newList = blogs.map(blog => blog.id !== id ? blog : returnedBlog)
        setBlogs(newList)
      })
    setTimeout(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs.sort((a,b) => b.likes-a.likes ))
    )
  }, 300)
}