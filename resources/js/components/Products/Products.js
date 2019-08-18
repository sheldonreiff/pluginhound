import React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { ClipLoader } from 'react-spinners';
import { Heading } from 'react-bulma-components';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';

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
    grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
`;

const SearchQuery = styled.span`
    font-style: italic;
    margin-bottom: 20px;
    display: block;
`;



class Product extends React.Component{

    static propTypes = {
        view: PropTypes.string.isRequired
    }

    componentDidMount(){
        this.props.loadProducts(this.props.view);
    }

    render(){

        const { products, title, query, status, view } = this.props;

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
                <MainGrid kind="ancestor">
                    {products.map(product => {
                        return <ProductTile
                            key={product.sku}
                            product={product}
                        />;
                    })}
                    
                </MainGrid>
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
});

const mapDispatchToProps = {
    loadProducts,
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Product));