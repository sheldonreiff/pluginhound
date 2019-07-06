import React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { ClipLoader } from 'react-spinners';
import { Tile, Heading } from 'react-bulma-components';
import PropTypes from 'prop-types';

import ProductTile from './ProductTile';

import { loadProducts } from '../../actions/products';


const LoaderContainer = styled.div`
    height: 300px;
    display: flex;
    justify-content: center;
    align-items: center;
`;

const Message = styled.span`
    color: gray;
`;

class Product extends React.Component{

    static propTypes = {
        view: PropTypes.string.isRequired
    }

    componentDidMount(){
        this.props.loadProducts(this.props.view);
    }

    render(){

        const { products, title, status } = this.props;

        return <React.Fragment>

            <Heading size={2}>{title}</Heading>

            {status === 'DONE' && products.length === 0 &&
                <LoaderContainer>
                    <Message>No products found</Message>
                </LoaderContainer>
            }
            {status === 'DONE' &&
                <Tile kind="ancestor">
                    {products.map(product => {
                        return <ProductTile
                            key={product.sku}
                            product={product}
                        />;
                    })}
                    
                </Tile>
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
    status: state.products.views[ownProps.view].loadStatus,
});

const mapDispatchToProps = {
    loadProducts,
};

export default connect(mapStateToProps, mapDispatchToProps)(Product);