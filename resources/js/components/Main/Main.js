import React from 'react';

import { Notify } from 'react-redux-notify';


class Main extends React.Component{
    render(){
        return <div>
            <Notify 
                position='BottomRight'
            />
        </div>;
    }
}

export default Main;