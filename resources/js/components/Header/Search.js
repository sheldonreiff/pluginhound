import React from 'react';
import { connect } from 'react-redux';
import { Form, Button } from 'react-bulma-components';
import history from '../../history';
import styled from 'styled-components';
import PropTypes from 'prop-types';

import { updateQuery, loadProducts } from '../../actions/products';

const StyledForm = styled.form`
    margin: 0;
`;

class Search extends React.Component{

    static propTypes = {
        onSearch: PropTypes.func.isRequired,
    }

    handleSubmit = (e) => {
        e.preventDefault();
        
        this.props.loadProducts({ view: 'search', reload: true });

        history.push('/search');

        this.props.onSearch();

        e.target.blur();
    }

    render(){
        const { query, updateQuery } = this.props;

        return <StyledForm onSubmit={(e) => this.handleSubmit(e)}>
            <Form.Field className='has-addons'>
                <Form.Control>
                    <Form.Input
                        type="text"
                        placeholder="Plugin or bundle"
                        value={query}
                        onChange={(e) => updateQuery(e.target.value)}
                    />
                </Form.Control>
                <Form.Control>
                    <Button>
                        Search
                    </Button>
                </Form.Control>
            </Form.Field>
        </StyledForm>;
    }
}

const mapDispatchToProps = {
    updateQuery,
    loadProducts
};

const mapStateToProps = state => ({
    query: state.products.views.search.query
});

export default connect(mapStateToProps, mapDispatchToProps)(Search);