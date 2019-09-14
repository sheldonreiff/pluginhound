import React from 'react';
import { Tag } from 'react-bulma-components';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Popover from 'react-bootstrap/Popover';
import styled from 'styled-components';
const isTouchDevice = require('is-touch-device');

const Badge = styled(Tag)`
    grid-area: badge;
    float: right;
`;

const DiscountBadge = props => {

    const discount = Math.round(props.product.discount * 100);

    if(!discount){
        return null;
    }

    const discountDisplay = discount >= 0
    ? <Badge color='danger' onClick={(e) => e.preventDefault()} className='discountBadge'>{discount}% off</Badge>
    : <Badge color='dark' onClick={(e) => e.preventDefault()} className='discountBadge'>{discount * -1}% increase</Badge>;

    return <div>
        <OverlayTrigger
            id={`discountTrigger${props.product.sku}`}
            placement='top'
            trigger={isTouchDevice() ? 'click' : 'hover'}
            overlay={
                <Popover>
                    <Popover.Title>Real Discount</Popover.Title>
                    <Popover.Content>Calculated as a percentage difference from the average of historical sale prices</Popover.Content>
                </Popover>
            }
        >
            {discountDisplay}
        </OverlayTrigger>
    </div>;
}

export default DiscountBadge;