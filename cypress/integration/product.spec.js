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
            cy.get('.product .title')
            .should(($title) => {
                expect($title.text()).to.equal(product.data.name);
            })
        })
    })

    it('displays product metadata', () => {
        visitProduct()

        cy.fixture('product').then(product => {
            cy.get('.productTypeBadge')
            .should(($productTypeBadge) => {
                expect($productTypeBadge.text()).to.be.equal(product.data.type);
            })

            cy.get('.product .category')
            .should(($category) => {
                expect($category.text()).to.equal(product.data.category);
            })

            cy.get('.discountBadge')
            .should(($discountBadge) => {
                expect($discountBadge.text()).to.contain( Math.round(product.data.discount * 100) );
            })
        })
    })
})