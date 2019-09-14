import React from 'react';
import { Tag } from 'react-bulma-components';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const Badge = styled(Tag)`
    text-transform: capitalize;
    opacity: .8;
`;

const ProductTypeBadge = props => {
    let color = 'black';
    if(props.type === 'plugin'){
        color = 'info';
    }else if(props.type === 'bundle'){
        color = 'warning';
    }

    return <Badge
            color={color}
            className='productTypeBadge'
        >
        {props.type}
    </Badge>;
}

ProductTypeBadge.propTypes = {
    type: PropTypes.oneOf(['plugin', 'bundle']).isRequired,
}

export default ProductTypeBadge;