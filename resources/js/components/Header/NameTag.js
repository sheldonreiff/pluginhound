import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

const MainRectangle = styled.span`
    background: gray;
    border-radius: 10px;
    height: 60px;
    width: ${props => props.width}px;
    position: relative;
`;

const getTextLength = (name) => {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    context.font = '16px BlinkMacSystemFont';        
    return context.measureText(`${name}✨`).width;
};

const NameArea = styled.span`
    position: absolute;
    bottom: 7.5px;
    left: 5px;
    width: ${props => props.width};
    background: white;
    color: black;
    text-align: center;
`;

const Hello = styled.span`
    font-size: 12px;
    color: white;
    text-align: center;
    position: absolute;
    top: 5px;
    width: 100%;
`;

const NameTag = props => {
    const nameWidth = getTextLength(props.name);
    return <MainRectangle width={nameWidth + 20}>
        <Hello>HELLO</Hello>
        <NameArea width={nameWidth + 10}>{props.name}✨</NameArea>
    </MainRectangle>;
}

NameTag.propTypes = {
    name: PropTypes.string.isRequired
};

export default NameTag;
