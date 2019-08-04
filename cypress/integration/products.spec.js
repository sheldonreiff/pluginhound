describe('Products grid', () => {
    [
        {
            title: 'All Products',
            url: 'all-products',
            apiQueryString: '',
        },
        {
            title: 'Top Deals',
            url: '/',
            apiQueryString: '?bestDeals=true',
        },
    ].forEach(view => {
        it('displays products', () => {
            cy.server()
            cy.route('GET', `api/products${view.apiQueryString}`, 'fixture:products')
            cy.visit(view.url)
    
            cy.get('.products-heading')
            .should(($h2) => {
                expect($h2.text()).to.equal(view.title);
            })
    
            cy.fixture('products').then((products) => {
                products.data.forEach(product => {
                    cy.get(`[data-sku="${product.sku}"]`)
                    .within(() => {
                        cy.get('.product-title')
                        .contains(product.name)
    
                        cy.get('div')
                        .contains(product.sale_price)
                    })
                })
            })
        })
    })
})