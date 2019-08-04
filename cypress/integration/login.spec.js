describe('Login', () => {
    it('logs the user in', () => {
        
        const user = {
            firstName: 'John',
            lastName: 'Smith',
            email: 'john@example.com',
            password: 123,
        }

        cy.visit('/')

        cy.get('.navbar-burger')
        .click()

        cy.get('.navbar-item')
        .contains('Login')
        .click()

        cy.get('input[name="email"]')
        .type(user.email)

        cy.get('input[name="password"]')
        .type(user.password)

        cy.server()
        cy.route('POST', '/api/auth/login', user)

        cy.get('button')
        .contains('Login')
        .click()

        cy.get('.app-notification')
        .contains("You're logged in!")
    })
})