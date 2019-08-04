describe('Registration', () => {

    const openRegistrationModal = () => {
        cy.visit('/')

        cy.get('.navbar-burger')
        .click()

        cy.get('.navbar-item')
        .contains('Register')
        .click()
    }

    it('opens the registration modal', () => {

        openRegistrationModal()

        cy.get('button')
        .contains('Register')
        .should('be.visible')
    })

    it('accepts input', () => {

        openRegistrationModal()

        const newUser = {
            firstName: 'John',
            lastName: 'Smith',
            email: 'john@example.com',
            password: 'sdlfjdslf34reuei2@',
        }

        cy.get('input[name="firstName"]')
        .type(newUser.firstName)
        .should('have.value', newUser.firstName)

        cy.get('input[name="lastName"]')
        .type(newUser.lastName)
        .should('have.value', newUser.lastName)

        cy.get('input[name="email"]')
        .type(newUser.email)
        .should('have.value', newUser.email)

        cy.get('input[name="password"]')
        .type(newUser.password)
        .should('have.value', newUser.password)

        cy.get('input[name="confirmPassword"]')
        .type(newUser.password)
        .should('have.value', newUser.password)

        cy.server()
        cy.route('POST', '/api/auth/register', [])

        cy.get('button')
        .contains('Register')
        .click()

        cy.get('div')
        .contains('Thanks for signing up!')
    })
})