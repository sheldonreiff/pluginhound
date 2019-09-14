describe('Login', () => {
    it('logs the user in', () => {

        cy.fixture('user').then(user => {
            cy.visit('/')

            cy.get('.navbar-burger')
            .click()

            cy.get('.navbar-item')
            .contains('Login')
            .click()

            cy.get('input[name="email"]')
            .type(user.email)

            cy.get('input[name="password"]')
            .type(123)

            cy.server()
            cy.fixture('login').then(login => {
                cy.route('POST', '/api/auth/login', login)
            });
            cy.route('POST', '/api/me', user)

            cy.get('button')
            .contains('Login')
            .click()

            cy.get('.app-notification')
            .contains("You're logged in!")
        });
    })
})