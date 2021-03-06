import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { connect } from 'react-redux';
const isTouchDevice = require('is-touch-device');

import { logout } from '../../actions/user';

const Greeting = styled.span`
    display: block;
    font-size: .8rem;
`;

class SignInOut extends React.Component {
    constructor(){
        super();
        
        this.state = {
            hovered: false
        };
    }

    toggleHover = (hover) => {
        this.setState({ hover });
    }

    render(){

        const isTouch = isTouchDevice();

        const { hover } = this.state;
        const { name, logout } = this.props;

        return <div
            onMouseEnter={() => this.toggleHover(true)}
            onMouseLeave={() => this.toggleHover(false)}
        >
            {!hover && name &&
                <div id='name-badge' onClick={logout}>
                    <Greeting>Hi</Greeting>
                    <span>{name}</span>
                    {isTouch &&
                        <span>(logout)</span>
                    }
                </div>
            }
            {hover &&
                <div onClick={logout}>
                    <Greeting>Time to go?</Greeting>
                    <span>Sign Out</span>
                </div>
            }
            
        </div>;
    }
    
}

const mapDisptachToProps = {
    logout
}

const mapStateToProps = state => ({
    name: state.user.me.first_name
});

export default connect(mapStateToProps, mapDisptachToProps)(SignInOut);