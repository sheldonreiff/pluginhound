import React from 'react';
import { Heading, Content } from 'react-bulma-components';
import styled from 'styled-components';

const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
`;

const Body = styled.div`
    max-width: 1000px;
`;

const About = props => <Container>
    <Content>
        <Heading size={2}>About</Heading>
        <Body>
            <p>
                This is a hobby project. I created this partly out of my own frustation with buying Waves plugins - never sure whether I was paying a good price.
                And, also, as an opportunity to improve my skills and try out some technologies that I haven't had the chance to use at in my professional work as a software developer.
            </p>
        </Body>
    </Content>
</Container>;

export default About;