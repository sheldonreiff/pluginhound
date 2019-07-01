import React from 'react';
import { connect }  from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Notification, Tag } from 'react-bulma-components';

import { getProduct, getProductHistory } from '../../actions/product';

const ProductType = props => {
    let color = 'black';
    if(props.type === 'plugin'){
        color = 'info';
    }else if(props.type === 'bundle'){
        color = 'warning';
    }

    return <Tag
        color={color}
        style={{textTransform: 'capitalize'}}
    >{props.type}</Tag>;
}

class Product extends React.Component{

    componentWillMount(){
        this.props.getProduct(this.props.match.params.sku);
        this.props.getProductHistory(this.props.match.params.sku);
    }

    render(){
        const { product, history, status, message } = this.props;

        return <div>
            {status === 'DONE' &&
                <React.Fragment>
                    <h2 class='title is-3'>{product.name}</h2>
                    <ProductType type={product.type} />
                    <h6 class='subtitle is-6'>{product.category}</h6>
                </React.Fragment>
            }
            {status === 'ERROR' &&
                <Notification
                    color='danger'
                >{message}</Notification>
            }
            
        </div>;
    }
}

const mapStateToProps = state => ({
    product: state.product.product,
    history: state.product.productHistory,
    status: state.product.productLoadStatus,
    message: state.product.productMessage,
});

const mapDispatchToProps = {
    getProduct,
    getProductHistory,
};

export default withRouter(
    connect(mapStateToProps, mapDispatchToProps)(Product)
);