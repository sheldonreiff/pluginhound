import React from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import styled from 'styled-components';
import { ClipLoader } from 'react-spinners';

const getUserStatus = state => state.user.status;

const LoaderContainer = styled.div`
    height: 300px;
    display: flex;
    justify-content: center;
    align-items: center;
`;

export const isAuthenticated = createSelector(
    [getUserStatus],
    (userStatus) => {
        return userStatus === 'LOGGED_IN';
    }
)

const WhenAuthenticated = props => {

    if(props.status === 'LOGGED_IN'){
        return props.children;
    }

    if(props.status === 'VERIFYING'){
        return <LoaderContainer>
            <ClipLoader
                sizeUnit={"px"}
                size={40}
                color='lightgray'
                loading={true}
            />
        </LoaderContainer>;
    }

    return props.else;
}

WhenAuthenticated.defaultProps = {
    else: null,
};

const mapStateToProps = state => ({
    status: state.user.status
});

export default connect(mapStateToProps)(WhenAuthenticated);