import React from 'react';
import { Tile, Heading, Image, Tag } from 'react-bulma-components';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { darken } from 'polished';
import { Link } from 'react-router-dom';

const ParentTile = styled(Tile)`
    max-width: 350px;
`;

const ChildTile = styled(Tile)`
    display: grid;
    grid-template-areas:
    "title title title"
    "thumbnail thumbnail price";
    grid-gap: .5rem;

    &:hover {
        background: ${darken(.1, 'white')};
        cursor: pointer;
    }
`;

const PriceContainer = styled.div`
    grid-area: price;
`;

const ProductTile = props => {

    const { product } = props;

    return <Link to={`/product/${product.sku}`} data-sku={product.sku}>
        <ParentTile kind='parent'>
            <ChildTile renderAs="article" kind="child" className='box'>
                <Heading style={{gridArea: 'title'}} size={5} className='product-title'>{product.name}</Heading>
                <PriceContainer>
                    <Heading subtitle>${product.sale_price}</Heading>
                    <Tag color='danger' style={{gridArea: 'badge'}} >{Math.round(product.discount * 100)}% off</Tag>
                </PriceContainer>
                <Image size={96} style={{gridArea: 'thumbnail'}} src={product.thumbnail_url} />
            </ChildTile>
        </ParentTile>
    </Link>
};

ProductTile.propTypes = {
    product: PropTypes.object.isRequired,
}

export default ProductTile;