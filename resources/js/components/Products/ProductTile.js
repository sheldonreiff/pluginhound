import React from 'react';
import { Heading, Image, Box, Tag } from 'react-bulma-components';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { darken } from 'polished';
import { Link } from 'react-router-dom';
import DiscountBadge from '../Product/DiscountBadge';
const isTouchDevice = require('is-touch-device');
import ProductTypeBadge from '../Product/ProductTypeBadge';
import Price from '../Product/Price';

const ProductLink = styled(Link)`
    display: flex;
    align-items: stretch;
`;

const ProductTileContainer = styled(Box)`
    display: grid;
    grid-template-areas:
    "title title title"
    "thumbnail meta price";
    grid-gap: .5rem;

    &:hover {
        background: ${props => props.isTouchDevice ? '' : darken(.1, 'white')};
        cursor: pointer;
    }
    width: 100%;
    max-width: 500px;
`;

const SaleContainer = styled.div`
    grid-area: price;
`;

const PriceContainer = styled(Heading)`
    text-align: right;
`;

const MetaContainer = styled.div`
    grid-area: meta;
`;

const ProductTile = props => {

    const { product } = props;

    return <ProductLink to={`/product/${product.sku}`} data-sku={product.sku}>
        <ProductTileContainer isTouchDevice={isTouchDevice()}>
            <Heading style={{gridArea: 'title'}} size={5} className='product-title'>{product.name}</Heading>
            <MetaContainer>
                <ProductTypeBadge 
                    type={product.type}
                />
            </MetaContainer>
            <SaleContainer>
                <PriceContainer subtitle>
                    <Price price={product.sale_price} />
                </PriceContainer>
                <DiscountBadge product={product} />
            </SaleContainer>
            <Image size={96} style={{gridArea: 'thumbnail'}} src={product.thumbnail_url} />
        </ProductTileContainer>
    </ProductLink>
};

ProductTile.propTypes = {
    product: PropTypes.object.isRequired,
}

export default ProductTile;