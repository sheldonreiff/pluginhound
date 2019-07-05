import React from 'react';
import { Tile, Heading, Image } from 'react-bulma-components';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { darken } from 'polished';
import { Link } from 'react-router-dom';

const StyledTile = styled(Tile)`
    &:hover {
        background: ${darken(.1, 'white')};
        cursor: pointer;
    }
`;

const ProductTile = props => <Link to={`/product/${props.sku}`}>
    <Tile kind='parent'>
        <StyledTile renderAs="article" kind="child" className='box'>
            <Heading size={5}>{props.name}</Heading>
            <Heading subtitle>{props.sale_price}</Heading>
            <Image size={96} src={props.thumbnail} />
        </StyledTile>
    </Tile>
</Link>;

ProductTile.propTypes = {
    sku: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    sale_price: PropTypes.number.isRequired,
    thumbnail: PropTypes.string.isRequired,
}

export default ProductTile;