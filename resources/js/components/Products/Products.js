import React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { ClipLoader } from 'react-spinners';
import { Heading } from 'react-bulma-components';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import Pagination from 'bulma-pagination-react';

import ProductTile from './ProductTile';
import IntroHero from './IntroHero';

import { loadProducts } from '../../actions/products';


const LoaderContainer = styled.div`
    height: 300px;
    display: flex;
    justify-content: center;
    align-items: stretch;
`;

const Message = styled.span`
    color: gray;
`;

const MainGrid = styled.div`
    display: grid!important;
    grid-gap: 15px;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
`;

const SearchQuery = styled.span`
    font-style: italic;
    margin-bottom: 20px;
    display: block;
`;

const StyledPagination = styled(Pagination)`
    margin-top: 20px;
`;


class Product extends React.Component{

    static propTypes = {
        view: PropTypes.string.isRequired
    }

    componentDidMount(){
        const { view } = this.props;

        const perPage = view === 'bestDeals'
        ? 24
        : 12;

        this.props.loadProducts({ view, perPage });
    }

    goToPage = page => {
        const { view, loadProducts } = this.props;

        loadProducts({ view, page, reload: true });
    }

    render(){

        const { products, title, query, status, view, page, pages } = this.props;

        const emptySearchQuery = view === 'search' && query.length === 0;

        return <React.Fragment>

            {view === 'bestDeals' &&
                <IntroHero/>
            }

            <Heading size={2} className='products-heading'>{title}</Heading>

            {view === 'search' && !emptySearchQuery && 
                <SearchQuery>"{query}"</SearchQuery>
            }

            {status === 'DONE' && products.length === 0 &&
                <LoaderContainer>
                    <Message>No products found</Message>
                </LoaderContainer>
            }
            {status === 'DONE' && !emptySearchQuery &&
                <React.Fragment>
                    <MainGrid>
                        {products.map(product => {
                            return <ProductTile
                                key={product.sku}
                                product={product}
                            />;
                        })}
                    </MainGrid>
                    <StyledPagination
                        pages={pages}
                        currentPage={page}
                        onChange={page => this.goToPage(page)}
                    />
                </React.Fragment>
            }

            {emptySearchQuery &&
                <LoaderContainer>
                    <Message>Enter a search query in the search bar</Message>
                </LoaderContainer>
            }

            {status === 'PROGRESS' &&
                <LoaderContainer>
                    <ClipLoader
                        sizeUnit={"px"}
                        size={40}
                        color='lightgray'
                        loading={true}
                    />
                </LoaderContainer>
            }
        </React.Fragment>;
    }
}

const mapStateToProps = (state, ownProps) => ({
    products: state.products.views[ownProps.view].products,
    title: state.products.views[ownProps.view].title,
    query: state.products.views[ownProps.view].query,
    status: state.products.views[ownProps.view].loadStatus,
    page: state.products.views[ownProps.view].page,
    pages: state.products.views[ownProps.view].pages,
});

const mapDispatchToProps = {
    loadProducts,
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Product));