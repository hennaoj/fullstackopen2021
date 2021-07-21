describe('Blog app', function() {
  beforeEach(function() {
    cy.request('POST', 'http://localhost:3001/api/testing/reset')
    const user = {
        name: 'Matti Luukkainen',
        username: 'mluukkai',
        password: 'hello'
    }
    cy.request('POST', 'http://localhost:3001/api/users/', user)
    cy.visit('http://localhost:3000')
  })

  it('Login form is shown', function() {
    cy.contains('login')
    cy.contains('username')
    cy.contains('password')
  })

  describe('Login', function() {
    it('succeeds with correct credentials', function () {
        cy.login({ username: 'mluukkai', password: 'hello' })
        cy.contains('Matti Luukkainen logged in')
    })

    it('fails with wrong password', function() {
        cy.contains('login').click()
        cy.get('#username').type('mluukkai')
        cy.get('#password').type('wrong')
        cy.get('#login-button').click()

        cy.contains('wrong username or password')
        cy.get('html').should('not.contain', 'Matti Luukkainen logged in')
    })
  })

  describe('When logged in', function() {
      beforeEach(function() {
        cy.login({  username: 'mluukkai', password: 'hello' })
      })

      it('A blog can be created', function() {
        cy.createBlog({ title: 'Cypress 101', author: 'Blogger NN', url: 'www.cy101.com' })
        cy.contains('Cypress 101 by Blogger NN')
      })

      it('A blog can be liked', function() {
        cy.createBlog({ title: 'Cypress 101', author: 'Blogger NN', url: 'www.cy101.com' })
        cy.get('#blog')
          .contains('view').click()
        cy.contains('like').click()
        cy.contains('likes: 1')
      })

      it('user can remove a blog they added', function() {
        cy.createBlog({ title: 'Cypress 101', author: 'Blogger NN', url: 'www.cy101.com' })
        cy.get('#blog')
          .contains('view').click()
        cy.contains('remove').click()
        cy.get('html').should('not.contain', 'www.cy101.com')
      })

      it.only('blogs are sorted by likes', function() {
        cy.createBlog({ title: 'blog with least likes', author: '3rd', url: 'www.numberthree.com' })
        cy.createBlog({ title: 'blog with most likes', author: '1st', url: 'www.numberone.com' })
        cy.createBlog({ title: 'middleground', author: '2nd', url: 'www.numbertwo.com' })
        
        cy.contains('blog with most likes')
          .contains('view').click()
          .parent()
          .find('#like').as('firstbutton')
        
          cy.contains('middleground')
          .contains('view').click()
          .parent()
          .find('#like').as('middlebutton')
        
          cy.contains('blog with least likes')
          .contains('view').click()
          .parent()
          .find('#like').as('lastbutton')
        
        cy.get('@firstbutton').click()
        cy.wait(1000)
        cy.get('@middlebutton').click()
        cy.wait(1000)
        cy.get('@lastbutton').click()
        cy.wait(1000)
        cy.get('@firstbutton').click()
        cy.wait(1000)
        cy.get('@middlebutton').click()
        cy.wait(1000)
        cy.get('@firstbutton').click()
        cy.wait(1000)

        cy.get('.blog').eq(0).contains('blog with most likes').should('exist')
        cy.get('.blog').eq(2).contains('blog with least likes').should('exist')
      })
  })
})