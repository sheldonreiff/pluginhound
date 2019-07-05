import React from 'react';
import { connect } from 'react-redux';
import { Form, Button } from 'react-bulma-components';
import history from '../../history';

import { search } from '../../actions/products';

class Search extends React.Component{
    constructor(){
        super();

        this.initialState = {
            query: ''
        }

        this.state = this.initialState;
    }

    componentDidUpdate = prevProps => {
        if(this.props.query != prevProps.query){
            this.setState({ query: this.props.query });
        }
    }

    handleChange = ({ field, value }) => {
        this.setState({
            [field]: value
        });
    }

    handleSubmit = (e) => {
        e.preventDefault();

        const { query } = this.state;
        
        this.props.search(query);

        history.push('/search');
    }

    render(){
        const { query } = this.state;

        return <form onSubmit={(e) => this.handleSubmit(e)}>
            <Form.Field className='has-addons'>
                <Form.Control>
                    <Form.Input
                        type="text"
                        placeholder="Plugin or bundle"
                        value={query}
                        onChange={(e) => this.handleChange({ field: 'query', value: e.target.value })}
                    />
                </Form.Control>
                <Form.Control>
                    <Button>
                        Search
                    </Button>
                </Form.Control>
            </Form.Field>
        </form>;
    }
}

const mapDispatchToProps = {
    search
};

const mapStateToProps = state => ({
    query: state.products.query
});

export default connect(mapStateToProps, mapDispatchToProps)(Search);