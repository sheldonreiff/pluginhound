import React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { ClipLoader } from 'react-spinners';
import { Tile } from 'react-bulma-components';

import ProductTile from './ProductTile';

import { loadAllProducts } from '../../actions/products';

// const ProductGrid = styled.div`
//     display: grid;
//     grid-gap: 1rem;
//     grid-template-columns: repeat(auto-fit, minmax(200px, 500px));
// `;

const LoaderContainer = styled.div`
    height: 300px;
    display: flex;
    justify-content: center;
    align-items: center;
`;

class Product extends React.Component{

    componentWillMount(){
        console.log('will mount')
    }

    componentDidMount(){
        console.log('did mount')
        this.props.loadAllProducts();
    }

    render(){

        const { products, status } = this.props;

        return <React.Fragment>
            {status === 'SUCCESS' &&
                <Tile kind="ancestor">
                    {products.map(product => {
                        return <ProductTile
                            key={product.sku}
                            sku={product.sku}
                            name={product.name}
                            sale_price={product.sale_price}
                            thumbnail={product.thumbnail_url}
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

const mapStateToProps = state => ({
    products: state.products.products,
    status: state.products.loadStatus,
});

const mapDispatchToProps = {
    loadAllProducts,
};

export default connect(mapStateToProps, mapDispatchToProps)(Product);