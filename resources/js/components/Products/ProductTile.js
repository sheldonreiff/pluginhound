import React from 'react';
import { Heading, Image, Tag, Box } from 'react-bulma-components';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { darken } from 'polished';
import { Link } from 'react-router-dom';
import DiscountBadge from '../Product/DiscountBadge';
const isTouchDevice = require('is-touch-device');

const ProductLink = styled(Link)`
    display: flex;
    align-items: stretch;
`;

const ProductTileContainer = styled(Box)`
    display: grid;
    grid-template-areas:
    "title title title"
    "thumbnail thumbnail price";
    grid-gap: .5rem;

    &:hover {
        background: ${props => props.isTouchDevice ? '' : darken(.1, 'white')};
        cursor: pointer;
    }
    width: 100%;
`;

const PriceContainer = styled.div`
    grid-area: price;
`;

const Price = styled(Heading)`
    text-align: right;
`;

const ProductTile = props => {

    const { product } = props;

    return <ProductLink to={`/product/${product.sku}`} data-sku={product.sku}>
        <ProductTileContainer isTouchDevice={isTouchDevice()}>
            <Heading style={{gridArea: 'title'}} size={5} className='product-title'>{product.name}</Heading>
            <PriceContainer>
                <Price subtitle>${product.sale_price}</Price>
                <DiscountBadge product={product} />
            </PriceContainer>
            <Image size={96} style={{gridArea: 'thumbnail'}} src={product.thumbnail_url} />
        </ProductTileContainer>
    </ProductLink>
};

ProductTile.propTypes = {
    product: PropTypes.object.isRequired,
}

export default ProductTile;