import { Col, Row, Card, Accordion, Nav, Tab, Tabs, Container,Button,Spinner,ListGroup,ListGroupItem,DropdownButton,ButtonGroup,Dropdown,Modal} from 'react-bootstrap';
import React, { useEffect,useState,Fragment } from 'react';


const OrderAllCustomfields = ({fields}) => {
    const [modalOrderAllNotesShow, setModalOrderAllNotesShow] = useState(false);
    
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
                    Custom fields
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
                                            Fields
                                        </Nav.Link>
                                    </Nav.Item>
                                </Nav>
                            </Card.Header>
                            <Card.Body className="p-0"  style={{ maxHeight: '335px', overflowY: 'auto' }}>
                                <Tab.Content style={{ backgroundColor:' rgb(231 235 239)'}}>
                                    <Tab.Pane eventKey="shippingaddress" className="">
                                        <div style={{display:'grid',gap:'10px'}} >
                                            {
                                                fields.map((item, index) => (
                                                    // console.log(item),
                                                    <div key={index} style={{backgroundColor:'#ffffff',padding:'15px 0px 7px 13px',borderRadius:'10px 10px 10px 10px'}} className='mt-2'>
                                                        <p style={{marginBottom:'8px',fontSize:'13px'}}>Key: {item.key}</p>
                                                        <p style={{marginBottom:'8px',fontSize:'13px'}}>value: {item.value}</p>
                                                    </div>
                                                ))
                                            }
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
        <a onClick={() => setModalOrderAllNotesShow(true)}>
            Custom fields
        </a>
        <MyVerticallyCenteredaddressModal show={modalOrderAllNotesShow} onHide={() => setModalOrderAllNotesShow(false)} />
    </Fragment>
  )
}

export default OrderAllCustomfields;