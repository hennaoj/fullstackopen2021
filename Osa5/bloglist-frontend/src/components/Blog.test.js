import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, fireEvent } from '@testing-library/react'
import Blog from './Blog'

test('renders content', () => {
  const blog = {
    title: 'Component testing is done with react-testing-library',
    author: 'TKTL',
    url: 'www.testi.fi',
    likes: 300
  }

  const component = render(
    <Blog blog={blog} />
  )

  //component.debug()

  expect(component.container).toHaveTextContent(
    'Component testing is done with react-testing-library'
  )

  expect(component.container).toHaveTextContent(
    'TKTL'
  )

  expect(component.container).not.toHaveTextContent(
    'www.testi.fi'
  )

  expect(component.container).not.toHaveTextContent(
    'likes'
  )
})

test('clicking the view button makes url and likes visible', async () => {
  const blog = {
    title: 'Component testing is done with react-testing-library',
    author: 'TKTL',
    url: 'www.testi.fi',
    likes: 300,
    user: { name: 'Testaaja', username: 'supertester', id: '23232' }
  }

  const user = {
    name: 'Testaaja',
    username: 'supertester',
    id: '23232'
  }

  const component = render(
    <Blog blog={blog} user={user} />
  )

  const button = component.getByText('view')
  fireEvent.click(button)

  expect(component.container).toHaveTextContent(
    'www.testi.fi', 'likes', 'Component testing is done with react-testing-library by TKTL'
  )

  //component.debug()

})

test('clicking the like button twice calls event handler twice', async () => {
  const blog = {
    title: 'Component testing is done with react-testing-library',
    author: 'TKTL',
    url: 'www.testi.fi',
    likes: 300,
    user: { name: 'Testaaja', username: 'supertester', id: '23232' }
  }

  const user = {
    name: 'Testaaja',
    username: 'supertester',
    id: '23232'
  }

  const mockHandler = jest.fn()

  const component = render(
    <Blog blog={blog} user={user} handleLike={mockHandler} />
  )

  const viewButton = component.getByText('view')
  fireEvent.click(viewButton)

  const button = component.getByText('like')
  fireEvent.click(button)
  fireEvent.click(button)

  expect(mockHandler.mock.calls).toHaveLength(2)
})