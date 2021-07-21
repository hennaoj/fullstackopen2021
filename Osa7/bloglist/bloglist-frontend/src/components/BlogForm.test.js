import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, fireEvent } from '@testing-library/react'
import BlogForm from './BlogForm'

test('new blog is created with correct input', () => {

  const mockHandler = jest.fn()

  const component = render(
    <BlogForm createBlog={mockHandler} />
  )

  const author = component.container.querySelector('#author')
  const title = component.container.querySelector('#title')
  const url = component.container.querySelector('#url')
  const form = component.container.querySelector('form')

  fireEvent.change(author, {
    target: { value: 'Test Person' }
  })
  fireEvent.change(title, {
    target: { value: 'Testing Blog Creation' }
  })
  fireEvent.change(url, {
    target: { value: 'www.test.com' }
  })

  fireEvent.submit(form)
  //component.debug()


  const blog = { title: 'Testing Blog Creation', author: 'Test Person', url: 'www.test.com' }

  expect(mockHandler.mock.calls[0][0].title).toBe(blog.title)
  expect(mockHandler.mock.calls[0][0].author).toBe(blog.author)
  expect(mockHandler.mock.calls[0][0].url).toBe(blog.url)

})