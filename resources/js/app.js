require('./bootstrap');

import React, { Component } from 'react';
import ReactDOM from 'react-dom';

// route components
import Home from './components/Home';

class App extends Component
{
    render(){
        return (
            <Home />
        );
    }
}

if (document.getElementById('root')) {
    ReactDOM.render(<App />, document.getElementById('root'));
}
