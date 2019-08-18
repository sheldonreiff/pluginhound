import React from 'react';
import { connect }  from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Notification, Tag, Heading, Button } from 'react-bulma-components';
import { SizeMe } from 'react-sizeme';
import { ScaleLoader, ClipLoader } from 'react-spinners';
import styled from 'styled-components';
import { LineChart , CartesianGrid, XAxis, YAxis, Tooltip, Legend, Line } from 'recharts';
import 'react-dates/initialize';
import { DateRangePicker } from 'react-dates';
import 'react-dates/lib/css/_datepicker.css';
import WhenAuthenticated from '../helpers/WhenAuthenticated';

import Alerts from '../Alerts/Alerts';
import DiscountBadge from './DiscountBadge';

import { getProduct, getProductHistory, setProduct } from '../../actions/product';
import { loadAlerts, newAlert, deleteAlert, upsertAlert } from '../../actions/alerts';

const ProductContainer = styled.div`
    display: block;
`;

const LoaderContainer = styled.div`
    height: 300px;
    display: flex;
    justify-content: center;
    align-items: center;
`;

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

const ProductMetaContainer = styled.div`
    display: flex;
    justify-content: space-between;
`;

const ProductMetaContainerLeft = styled.div`
    margin: -10px;
    display: flex;
    & > * {
        margin: 10px;
    }
`;

const ProductHistoryContainer = styled.div`
    margin-top: 30px;
    display: flex;
    flex-direction: column;
    align-items: center;
`;

const HistoryControlsContainer = styled.div`
    margin-top: 20px;
`;

const BackIcon = styled.span`
    display: inline-block;
    margin-bottom: 15px;
    cursor: pointer;
    font-size: 1.5rem;
`;

const AlertsContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    margin: -10px;
    & > * {
        margin: 10px;
    }
`;

class Product extends React.Component{
    constructor(){
        super();

        this.state = {
            focusedInput: null
        }
    }

    componentWillMount(){
        this.props.setProduct(this.props.match.params.sku);
    }

    componentDidMount(){
        this.props.getProduct();
        this.props.getProductHistory();
    }

    handleDateChange = ({ start, end }) => {
        this.props.getProductHistory({ start, end });
    }

    handleNewAlert = () => {
        const { product, newAlert } = this.props;
        newAlert({ view: 'product', sku: product.sku });
    }

    render(){
        const { product, productHistory, status, historyStatus, message, start, end, history, alerts, alertsLoadStatus, userStatus } = this.props;

        return <SizeMe>
            {({ size }) =>
                <ProductContainer>
                    <BackIcon className='icon-arrow-left2' onClick={history.goBack} />
                    {status === 'DONE' &&
                        <React.Fragment>
                            <h2 className='title is-3'>{product.name}</h2>

                            <ProductMetaContainer>
                                <ProductMetaContainerLeft>
                                    <Heading subtitle>${product.sale_price}</Heading>
                                    <DiscountBadge product={product} />
                                    <ProductType type={product.type} />
                                    <h6 className='subtitle is-6'>{product.category}</h6>
                                </ProductMetaContainerLeft>
                                <a href={product.url} target='_blank'>View on Waves</a>
                            </ProductMetaContainer>

                            <ProductHistoryContainer>
                                {historyStatus === 'PROGRESS' &&
                                    <LoaderContainer>
                                        <ScaleLoader
                                            sizeUnit={"px"}
                                            size={75}
                                            color='lightgray'
                                            loading={true}
                                        />
                                    </LoaderContainer>
                                }
                                
                                {historyStatus === 'DONE' &&
                                    <LineChart
                                        width={size.width}
                                        height={300} data={productHistory}
                                        margin={{top: 5, right: 30, left: 20, bottom: 5}}
                                    >
                                        <CartesianGrid strokeDasharray="3 3"/>
                                        <XAxis dataKey="date"/>
                                        <YAxis/>
                                        <Tooltip/>
                                        <Legend />
                                        <Line 
                                            name="Sale Price"
                                            dataKey="sale_price"
                                            fill="#8884d8"
                                        />
                                        <Line 
                                            name="MSRP"
                                            dataKey="msrp"
                                            fill="lightgreen"
                                        />
                                    </LineChart>
                                }

                                <HistoryControlsContainer>
                                    <DateRangePicker
                                        startDate={start}
                                        startDateId="product_start_date"
                                        endDate={end}
                                        endDateId="product_end_date" 
                                        onDatesChange={( { startDate, endDate } ) => this.handleDateChange({ start: startDate, end: endDate })}
                                        focusedInput={this.state.focusedInput}
                                        onFocusChange={focusedInput => this.setState({ focusedInput })}
                                        enableOutsideDays={false}
                                        isOutsideRange={(date) => false}
                                        withPortal={size.width <= 600 ? true : false}
                                        numberOfMonths={size.width <= 600 ? 1 : 2}
                                        showClearDates
                                        readOnly
                                    />
                                </HistoryControlsContainer>
                            </ProductHistoryContainer>

                            <WhenAuthenticated>
                                <Heading size={4}>Alerts</Heading>
                                <AlertsContainer>

                                    <Alerts
                                        view='product'
                                        sku={this.props.match.params.sku}
                                    />
                            
                                    <Button color='dark' onClick={this.handleNewAlert}>+</Button>
                                </AlertsContainer>
                            </WhenAuthenticated>

                        </React.Fragment>
                    }

                    {status === 'PROGRESS' &&
                        <LoaderContainer>
                            <ClipLoader
                                sizeUnit={"px"}
                                size={40}
                                color='lightgray'
                                loading={true}
                            />
                        </LoaderContainer>
                    }

                    {status === 'ERROR' &&
                        <Notification
                            color='danger'
                        >{message}</Notification>
                    }
                </ProductContainer>
            }   
        </SizeMe>;
    }
}

const mapStateToProps = state => ({
    product: state.product.product,
    productHistory: state.product.productHistory,
    status: state.product.productLoadStatus,
    historyStatus: state.product.productHistoryLoadStatus,
    message: state.product.productMessage,
    start: state.product.historyParams.start,
    end: state.product.historyParams.end,
    alerts: state.product.alerts,
    alertsLoadStatus: state.product.alertsLoadStatus,
    userStatus: state.user.status,
});

const mapDispatchToProps = {
    getProduct,
    getProductHistory,
    setProduct,
    loadAlerts,
    newAlert,
    deleteAlert,
    upsertAlert,
};

export default withRouter(
    connect(mapStateToProps, mapDispatchToProps)(Product)
);