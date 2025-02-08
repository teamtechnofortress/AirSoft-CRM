import React from 'react'
import OrderLineItem from '/sub-components/order/OrderLineItem.js'
import OrderModelAddress from '/sub-components/order/OrderModelAddress.js'
import OrderModelNote from '/sub-components/order/OrderModelNote.js'
import { Col, Row, Card, Accordion, Nav, Tab, Tabs, Container,Button,Spinner,ListGroup,ListGroupItem,DropdownButton,ButtonGroup,Dropdown,Modal} from 'react-bootstrap';
import { formatDistanceToNow } from "date-fns";


const AllOrder = ({orders}) => {
    const getTimeAgo = (dateString) => {
        return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    };
  return (
    <Row>
        {orders.map((order) => (
            <Col key={order.id} md={4} sm={6} xs={12} className="mb-4">
                <Card style={{ width: "100%" }}>
                    <Card.Body style={{padding:'0px'}}>
                        <div className="d-flex align-items-center justify-content-between" style={{ paddingLeft: '15px', paddingRight: '15px',paddingTop:'15px'  }}>
                            <div>
                                <Card.Title>
                                    {order.billing?.first_name || order.billing?.last_name 
                                        ? `${order.billing?.first_name || ''} ${order.billing?.last_name || ''}`.trim() 
                                        : 'Unknown'}
                                </Card.Title>
                                <Card.Subtitle className="" style={{fontSize: 12,}}># {order.number}</Card.Subtitle>
                            </div>
                            <div>
                               <Card.Title style={{
                                }}>
                                    {order.status === "on-hold" ? "On-hold" : order.status === "processing" ? "Processing" : order.status ===  "pending" ? "Pending" : order.status === "cancelled" ? 'Cancelled' : order.status === 'completed' ? 'Completed' : order.status === "refunded" ? 'Refunded' : order.status === 'failed' ? 'Failed' : order.status === 'trash' ? 'Trash' : order.status
                                    }
                                </Card.Title>
                                 {/* <Card.Subtitle className="mb-2 text-muted">Pending Payment</Card.Subtitle> */}
                            </div>
                        </div>
                        <div className='' style={{backgroundColor:'#eceef0'}}>
                            <Card.Subtitle className="mb-3 mt-2" style={{fontSize: 12,padding:'5px 5px 5px 15px'}}>
                                {
                                  getTimeAgo(order.date_created)
                                }
                            </Card.Subtitle>
                        </div>
                        {order.line_items.map((item, index) => (
                             <OrderLineItem key={index} item={item} index={index} />
                        ))}
                        {/* <div className="d-flex align-items-center justify-content-start mb-2 gap-2" style={{ paddingLeft: '15px', paddingRight: '15px'}}>
                            <div>
                                <Card.Img 
                                    variant="top" 
                                    src="/images/avatar/avatar-2.jpg?text=Image Placeholder" 
                                    style={{ height: "85px", width: "85px", objectFit: "cover" }} 
                                />
                            </div>
                            <div>
                                <Card.Subtitle className="mb-3 mt-2" style={{fontSize: 14,}}>Teseter Name Products</Card.Subtitle>
                                <Card.Subtitle className="mb-3" style={{fontSize: 12,}}>SKU: N/A 123</Card.Subtitle>
                                <Card.Subtitle className="mb-3" style={{fontSize: 12,}}>123.34 USD</Card.Subtitle>
                                <Card.Subtitle className="" style={{fontSize: 12,}}>Quantity: 1233</Card.Subtitle>
                            </div>
                        </div>      
                        <hr />
                        <div className="d-flex align-items-center justify-content-start mb-2 gap-2" style={{ paddingLeft: '15px', paddingRight: '15px' }}>
                            <div>
                                <Card.Img 
                                    variant="top" 
                                    src="/images/avatar/avatar-2.jpg?text=Image Placeholder" 
                                    style={{ height: "85px", width: "85px", objectFit: "cover" }} 
                                />
                            </div>
                            <div>
                                <Card.Subtitle className="mb-3 mt-2" style={{fontSize: 14,}}>Teseter Name Products</Card.Subtitle>
                                <Card.Subtitle className="mb-3" style={{fontSize: 12,}}>SKU: N/A 123</Card.Subtitle>
                                <Card.Subtitle className="mb-3" style={{fontSize: 12,}}>123.34 USD</Card.Subtitle>
                                <Card.Subtitle className="" style={{fontSize: 12,}}>Quantity: 1233</Card.Subtitle>
                            </div>
                        </div>       */}
                        <hr />
                        <div className="d-flex align-items-center justify-content-between" style={{ paddingLeft: '15px', paddingRight: '15px'}}>
                            <div></div>
                            <div>
                                <Card.Subtitle className="mb-1 mt-1" style={{fontSize: 13,}}>Total: {order.total} $</Card.Subtitle>
                            </div>
                        </div>
                        <div className='' style={{backgroundColor:'#eceef0'}}>
                            <Card.Subtitle className="mb-1 mt-1" style={{fontSize: 12,padding:'5px 5px 5px 15px'}}>{order.payment_method_title ? order.payment_method_title : 'No payment method specified'}</Card.Subtitle>
                        </div>
                        {/* <div className="d-flex align-items-center justify-content-between" style={{ paddingLeft: '15px', paddingRight: '15px'}}>
                            //   <Card.Text className="mb-0 me-3">type</Card.Text> 
                            //   <Card.Text className=''>product</Card.Text> 
                            <div>
                                <Card.Subtitle className="mb-3 mt-3" style={{fontSize: 13,}}>Total: 1234 USD</Card.Subtitle>
                                <Card.Subtitle className="" style={{fontSize: 13,}}>Cash On Delivery</Card.Subtitle>
                            </div>
                            <div className="">
                                //  <DropdownButton
                                //     as={ButtonGroup}
                                //     id="dropdown-button-drop-up"
                                //     drop="up"
                                //     variant=""
                                //     title={<i className="fa fa-ellipsis-h" aria-hidden="true" style={{ fontSize: '20px' }}></i>}
                                //     className="me-1 mb-2 mb-lg-0 dropup-orderaction"
                                //     style={{padding:0,border:'none',backgroundColor: 'transparent',}}
                                // >
                                //     <Dropdown.Item eventKey="1">Edit order</Dropdown.Item>
                                //     <Dropdown.Item eventKey="2">Show notes</Dropdown.Item>
                                //     <Dropdown.Item eventKey="3">Address detail</Dropdown.Item>
                                //     <Dropdown.Item eventKey="4">Custom fields</Dropdown.Item>
                                //     <Dropdown.Item eventKey="5">Share order</Dropdown.Item>
                                //     <Dropdown.Item eventKey="6">Duplicate order</Dropdown.Item>
                                //     <Dropdown.Divider />
                                //     <Dropdown.Item eventKey="7" className='text-danger'>Delete order</Dropdown.Item>
                                // </DropdownButton> 
                            </div>
                        </div> */}
                        <div className="d-flex align-items-center justify-content-between" style={{ paddingLeft: 'px', paddingRight: 'px',paddingBottom:'px' }}>
                            <div>
                                <OrderModelAddress order={order} />
                                <OrderModelNote order={order} />
                            </div>
                            <div className="">
                                <DropdownButton
                                    as={ButtonGroup}
                                    id="dropdown-button-drop-up"
                                    drop="up"
                                    variant=""
                                    title={<i className="fa fa-ellipsis-h" aria-hidden="true" style={{ fontSize: '20px' }}></i>}
                                    className="me-1 mb-2 mb-lg-0 dropup-orderaction"
                                    style={{padding:0,border:'none',backgroundColor: 'transparent',}}
                                >
                                    <Dropdown.Item eventKey="1">Edit order</Dropdown.Item>
                                    <Dropdown.Item eventKey="2">Show notes</Dropdown.Item>
                                    <Dropdown.Item eventKey="3">Address detail</Dropdown.Item>
                                    <Dropdown.Item eventKey="4">Custom fields</Dropdown.Item>
                                    <Dropdown.Item eventKey="5">Share order</Dropdown.Item>
                                    <Dropdown.Item eventKey="6">Duplicate order</Dropdown.Item>
                                    <Dropdown.Divider />
                                    <Dropdown.Item eventKey="7" className='text-danger'>Delete order</Dropdown.Item>
                                </DropdownButton>
                            </div>
                        </div>
                        
                    {/* <Button variant="primary">View Product</Button> */}
                    </Card.Body>
                </Card>
            </Col>
        ))}
    </Row>
  )
}

export default AllOrder