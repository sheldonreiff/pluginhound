import React from 'react';
import styled from 'styled-components';
import { Heading } from 'react-bulma-components';

const NotFoundMessage = styled(Heading)`
    margin-top: 40px;
`;

const NotFound = props => <NotFoundMessage size={3}>Hmm... this page can't be found</NotFoundMessage>;

export default NotFound;