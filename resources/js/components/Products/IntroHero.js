import React from 'react';
import { Tile, Heading, Container, Hero } from 'react-bulma-components';
import styled from 'styled-components';

const StyledHero = styled(Hero)`
    margin-bottom: 20px;
`;

const IntroHero = props => <StyledHero color='info' gradient>
    <Hero.Body>
    <Container>
        <Heading subtitle size={3}>Save on Waves bundles and plugins!</Heading>

        <Heading subtitle size={5}>If you've ever shopped for Waves plugins you probably know that the prices change dramatically on a frequent basis.</Heading>
        
        <p>Know when you're getting a good deal:</p>
        <ul>
            <li>✅ See historical prices</li>
            <li>✅ Set custom price-change alerts</li>
            <li>✅ Find the "Real Discount" - calulated as a percentage off the average historical price</li>
        </ul>
    </Container>
    </Hero.Body>
</StyledHero>;

export default IntroHero;