import { Col, Row, Card, Accordion, Nav, Tab, Tabs, Container,Button,Spinner,ListGroup,ListGroupItem,DropdownButton,ButtonGroup,Dropdown,Modal} from 'react-bootstrap';
import React, { useEffect,useState,Fragment } from 'react';


const OrderModelAddress = ({order}) => {
    const [modaladdressShow, setModaladdressShow] = React.useState(false);
    
    function MyVerticallyCenteredaddressModal(props) {
        return (
          <Modal
            {...props}            
            aria-labelledby="contained-modal-title-vcenter"
            centered
            contentClassName="custom-modal-content"
          >
            <Modal.Header closeButton className='border-0'> 
              <div className='d-flex justify-content-center align-items-center'>
                <Modal.Title id="contained-modal-title-vcenter">
                    Contact customer
                    <p style={{ color:' #788589',margin: '0px',fontSize: '13px', }}>order #{order.number}</p>
                </Modal.Title>
              </div>
            </Modal.Header>
            <Modal.Body>
              <Row>  
              <Col xl={12} lg={12} md={12} sm={12}>
                    {/* <div id="accordion-example" className="mb-4">
                        <h3>Example</h3>
                        <p>
                            Click the accordions below to expand/collapse the accordion
                            content.
                        </p>
                    </div> */}
                    <Tab.Container id="tab-container-1" defaultActiveKey="shippingaddress">
                        <Card style={{ boxShadow: 'none' }}>
                            <Card.Header className="border-bottom-0 p-0 ">
                                <Nav className="nav-lb-tab">
                                    <Nav.Item>
                                        <Nav.Link eventKey="shippingaddress" className="mb-sm-3 mb-md-0">
                                            Shipping address
                                        </Nav.Link>
                                    </Nav.Item>
                                     <Nav.Item>
                                        <Nav.Link eventKey="billingaddress" className="mb-sm-3 mb-md-0">
                                            Billing address
                                        </Nav.Link>
                                    </Nav.Item>
                                  {/*  <Nav.Item>
                                        <Nav.Link eventKey="outofstock" className="mb-sm-3 mb-md-0">
                                            Out OF Stock
                                        </Nav.Link>
                                    </Nav.Item>
                                    <Nav.Item>
                                        <Nav.Link eventKey="backorder" className="mb-sm-3 mb-md-0">
                                            Back Order
                                        </Nav.Link>
                                    </Nav.Item> */}
                                </Nav>
                            </Card.Header>
                            <Card.Body className="p-0">
                                <Tab.Content style={{ backgroundColor:' rgb(231 235 239)'}}>
                                    <Tab.Pane eventKey="shippingaddress" className="">
                                        <div style={{display:'grid',gap:'10px'}} >
                                            <div style={{backgroundColor:'#ffffff',padding:'20px 0px 20px 13px',borderRadius:'0px 0px 10px 10px'}}>
                                                <h5 style={{fontSize:'13px'}}>
                                                  {`${order.shipping?.address_1}, , ${order.shipping?.country}, ${order.shipping?.state}, ${order.shipping?.city} ${order.shipping?.postcode}`}
                                                </h5>
                                            </div>
                                            <div style={{backgroundColor:'#ffffff',padding:'15px 0px 7px 13px',borderRadius:'10px 10px 10px 10px'}}>
                                                <p style={{marginBottom:'8px',fontSize:'13px'}}>Phone number:</p>
                                                <h5>
                                                    {/* {order.shipping?.phone || 'N/A'} */}
                                                    {order.billing?.phone 
                                                        ? order.billing.phone 
                                                        : order.shipping?.phone 
                                                        ? order.shipping.phone 
                                                        : 'N/A'}
                                                </h5>
                                            </div>
                                            <div style={{backgroundColor:'#ffffff',padding:'15px 0px 7px 13px',borderRadius:'10px 10px 10px 10px'}}>
                                                <p style={{marginBottom:'8px',fontSize:'13px'}}>Email:</p>
                                                <h5>
                                                    {order.billing?.email 
                                                        ? order.billing.email 
                                                        : order.shipping?.email 
                                                        ? order.shipping.email 
                                                        : 'N/A'}
                                                </h5>
                                            </div>
                                        </div>
                                    </Tab.Pane>
                                    <Tab.Pane eventKey="billingaddress" className="react-code">
                                        <div style={{display:'grid',gap:'10px'}} >
                                            <div style={{backgroundColor:'#ffffff',padding:'20px 0px 20px 13px',borderRadius:'0px 0px 10px 10px'}}>
                                                <h5 style={{fontSize:'13px'}}>
                                                 {`${order.billing?.address_1}, , ${order.billing?.country}, ${order.billing?.state}, ${order.billing?.city} ${order.billing?.postcode}`}
                                                </h5>
                                            </div>
                                            <div style={{backgroundColor:'#ffffff',padding:'15px 0px 7px 13px',borderRadius:'10px 10px 10px 10px'}}>
                                                <p style={{marginBottom:'8px',fontSize:'13px'}}>Phone number:</p>
                                                <h5>
                                                    {/* {order.billing?.phone || 'N/A'} */}
                                                    {order.billing?.phone 
                                                        ? order.billing.phone 
                                                        : order.shipping?.phone 
                                                        ? order.shipping.phone 
                                                        : 'N/A'}
                                                </h5>
                                            </div>
                                            <div style={{backgroundColor:'#ffffff',padding:'15px 0px 7px 13px',borderRadius:'10px 10px 10px 10px'}}>
                                                <p style={{marginBottom:'8px',fontSize:'13px'}}>Email:</p>
                                                <h5>
                                                    {order.billing?.email 
                                                    ? order.billing.email 
                                                    : order.shipping?.email 
                                                    ? order.shipping.email 
                                                    : 'N/A'}
                                                </h5>
                                            </div>
                                        </div>
                                    </Tab.Pane>
                                </Tab.Content>
                            </Card.Body>
                        </Card>
                    </Tab.Container>
                </Col>
              </Row>
            </Modal.Body>
            <Modal.Footer className='border-0'>
              <Button onClick={props.onHide}>Close</Button>
            </Modal.Footer>
          </Modal>
        );
    }
  return (
    <Fragment> 
        <Button variant="" onClick={() => setModaladdressShow(true)}>
            <i className="fa fa-phone" aria-hidden="true" style={{transform: "rotate(100deg)"}}></i> 
        </Button>
        <MyVerticallyCenteredaddressModal show={modaladdressShow} onHide={() => setModaladdressShow(false)} />
    </Fragment>
  )
}

export default OrderModelAddress