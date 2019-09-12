import React from 'react';
import { Tag } from 'react-bulma-components';
import PropTypes from 'prop-types';

const Price = props => {
    return <React.Fragment>
        {props.price
            ? `$${props.price}`
            : <Tag color='light'>FREE</Tag>
        }
    </React.Fragment>;
}

Price.propTypes = {
    price: PropTypes.number,
}

export default Price;