const _ = require('lodash')
const blog = require('../models/blog')

const dummy = (blogs) => {
    return 1
}

const totalLikes = (blogs) => {
    var total = 0
    blogs.map(blog => {
        total = total + blog.likes
    })
    
    return total
}

const favoriteBlog = (blogs) => {
    var favorite = {}
    var maxLikes = 0
    blogs.map(blog => {
        if (blog.likes > maxLikes) {
            favorite = {title: blog.title, author: blog.author, likes: blog.likes}
            maxLikes = blog.likes
        }
    })
    
    return favorite
}

const mostBlogs = (blogs) => {
    var blogger = {}
    var most = 0
    
    const allAuthors = blogs.map(blog => blog.author)
    const uniqueAuthors = _.uniq(allAuthors)

    uniqueAuthors.map(uniqAuthor => {
        var blogs = 0
        allAuthors.map(author => {
            if (author === uniqAuthor) {
                blogs = blogs + 1
                //console.log(blogs)
            }
        })
        if (blogs > most) {
            most = blogs
            blogger = {author: uniqAuthor, blogs: blogs}
            //console.log(blogger)
        }
    })
    return blogger
}

const mostLikes = (blogs) => {
    var blogger = {}
    var mostLikes = 0
    
    const allAuthors = blogs.map(blog => blog.author)
    const uniqueAuthors = _.uniq(allAuthors)

    uniqueAuthors.map(uniqAuthor => {
        var likes = 0
       blogs.map(blog => {
            if (blog.author === uniqAuthor) {
                likes = likes + blog.likes
                //console.log(likes)
            }
        })
        if (likes > mostLikes) {
            mostLikes = likes
            blogger = {author: uniqAuthor, likes: likes}
            //console.log(blogger)
        }
    })
    return blogger
}

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes
}