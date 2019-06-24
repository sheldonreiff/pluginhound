import React from 'react';
import { Notification } from 'react-bulma-components';

const LoggedInOnly = props => <Notification variant='danger'>You must be logged in to view this page</Notification>;

export default LoggedInOnly;