import React from 'react';
import { Tag } from 'react-bulma-components';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Popover from 'react-bootstrap/Popover';
import styled from 'styled-components';

const Badge = styled(Tag)`
    grid-area: badge;
    float: right;
`;

const DiscountBadge = props => {

    const discount = Math.round(props.product.discount * 100);

    if(!discount){
        return null;
    }
    return <div>
        <OverlayTrigger
            id={`discountTrigger${props.product.sku}`}
            placement='top'
            overlay={
                <Popover>
                    <Popover.Title>Real Discount</Popover.Title>
                    <Popover.Content>Calculated as a percentage off the average of historical sale prices</Popover.Content>
                </Popover>
            }
            >
            <Badge color='danger' onClick={(e) => e.preventDefault()}>{discount}% off</Badge>
        </OverlayTrigger>
    </div>;
}

export default DiscountBadge;