import React from 'react';
import { Hero } from 'react-bulma-components';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

const Content = styled(Hero.Footer)`
    padding: 10px;
    display: flex;
    justify-content: center;
    flex-shrink: 0;
    margin: -10px;
    & > *{
        margin: 0 10px;
    }
`;

const Footer = props => <Content>
    <small>Not affiliated with waves.com or Waves Inc.</small>
    <Link to='/about'>About</Link>
</Content>;

export default Footer;