import React from 'react';
import { Form } from 'react-bulma-components';
import styled from 'styled-components';

const AlertsForm = styled.form`
    display: flex;
    flex-wrap: wrap;
    margin: 20px -10px;
    & > * {
        margin: 10px;
    }
`;

class Alert extends React.Component{
    render(){
        return <AlertsForm>

            Alert me by email when

            <Form.Select
                
            >
                <option value='decrease'>the price decreases by</option>
                <option value='less_than'>the price is or is less than</option>
                <option value='any_change'>the price changes at all</option>
            </Form.Select>

            <Form.Field>
                <Form.Input type='number' style={{ maxWidth: '100px' }} />
            </Form.Field>

            <Form.Select
                
            >
                <option value='unit'>dollars</option>
                <option value='percent'>percent</option>
            </Form.Select>

            <Form.Field>
                <a class='delete' />
            </Form.Field>
            
        </AlertsForm>;
    }
}

export default Alert;