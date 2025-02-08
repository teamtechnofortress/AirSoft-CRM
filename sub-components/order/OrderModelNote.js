import { Col, Row, Card, Accordion, Nav, Tab, Tabs, Container,Button,Spinner,ListGroup,ListGroupItem,DropdownButton,ButtonGroup,Dropdown,Modal,Form} from 'react-bootstrap';
import React, { useEffect,useState,Fragment } from 'react';


const OrderModelNote = ({order}) => {
    const [modalnoteShow, setModalnoteShow] = React.useState(false);
    const [isEnabled, setIsEnabled] = useState(false);
    
    function MyVerticallyCenterednoteModal(props) {
        return (
          <Modal
            {...props}            
            aria-labelledby="contained-modal-title-vcenter"
            centered
          >
            <Modal.Header closeButton>
              <Modal.Title id="contained-modal-title-vcenter">
                Add note
                <p style={{ color:' #788589',margin: '0px',fontSize: '13px', }}>order #{order.number}</p>
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form.Group controlId="exampleForm.ControlTextarea">
              {/* <Form.Label>Enter your tex  t</Form.Label> */}
              <Form.Control
                as="textarea"
                rows={4}
                placeholder="Type here..."
              />
            </Form.Group>
            <Form.Group controlId="exampleForm.ControlSwitch" className='mt-2 d-flex justify-content-start gap-2'>
              <Form.Check
                type="switch"
                id="custom-switch"
                className="custom-switch-ordernotemodel"
                checked={isEnabled}
              />
              <Form.Label>Send the note to the customer as well</Form.Label>
            </Form.Group>
            {/* <Form.Label>Send the note to the customer as well</Form.Label>
            <Form.Check
              type="switch"
              id="custom-switch"
              className="custom-switch-ordernotemodel"
            /> */}
            </Modal.Body>
            <Modal.Footer>
              <Button onClick={props.onHide}>Submit</Button>
            </Modal.Footer>
          </Modal>
        );
    }
  return (
    <Fragment> 
        <Button variant="" onClick={() => setModalnoteShow(true)}>
        <i className="fa fa-sticky-note" aria-hidden="true"></i>
        </Button>
        <MyVerticallyCenterednoteModal show={modalnoteShow} onHide={() => setModalnoteShow(false)} />
    </Fragment>
  )
}

export default OrderModelNote