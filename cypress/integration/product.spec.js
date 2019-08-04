describe('Product page', () => {

    const visitProduct = () => {
        cy.server()
        cy.route('GET', `api/product/abc`, 'fixture:product')
        cy.visit('product/abc')
        return cy.fixture('product')
    }
    

    it('displays a product title', () => {
        visitProduct()

        cy.fixture('product').then(product => {
            cy.get('h2.title')
            .should(($h2) => {
                expect($h2.text()).to.equal(product.data.name);
            })
        })
    })

    it('displays product metadata', () => {
        visitProduct()

        cy.fixture('product').then(product => {
            cy.get('span.tag')
            .should(($span) => {
                expect($span.text()).to.be.equal(product.data.type);
            })

            cy.get('h6.subtitle')
            .should(($h6) => {
                expect($h6.text()).to.equal(product.data.category);
            })
        })
    })
})