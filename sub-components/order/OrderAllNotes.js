import { Col, Row, Card, Accordion, Nav, Tab, Tabs, Container,Button,Spinner,ListGroup,ListGroupItem,DropdownButton,ButtonGroup,Dropdown,Modal} from 'react-bootstrap';
import React, { useEffect,useState,Fragment } from 'react';


const OrderAllNotes = ({ notes, orderId, fetchNotes, handleFetchNotes }) => {
    const [modalOrderAllNotesShow, setModalOrderAllNotesShow] = useState(false);
    const [loadingNotes, setLoadingNotes] = useState(false);
    const [localNotes, setLocalNotes] = useState(notes);
  
    useEffect(() => {
      // Re-sync notes if updated externally
      setLocalNotes(notes);
    }, [notes]);
  
    const handleOpen = async () => {
      if (!notes || notes.length === 0) {
        setLoadingNotes(true);
        const fetchedNotes = await fetchNotes(orderId);
        setLocalNotes(fetchedNotes);
        setLoadingNotes(false);
      }
      setModalOrderAllNotesShow(true);
    };
  
    function MyVerticallyCenteredaddressModal(props) {
      return (
        <Modal
          {...props}
          aria-labelledby="contained-modal-title-vcenter"
          centered
          contentClassName="custom-modal-content"
        >
          <Modal.Header closeButton className="border-0">
            <div className="d-flex justify-content-center align-items-center">
              <Modal.Title id="contained-modal-title-vcenter">Order Notes</Modal.Title>
            </div>
          </Modal.Header>
          <Modal.Body>
            <Row>
              <Col xl={12}>
                <Tab.Container id="tab-container-1" defaultActiveKey="shippingaddress">
                  <Card style={{ boxShadow: "none" }}>
                    <Card.Header className="border-bottom-0 p-0">
                      <Nav className="nav-lb-tab">
                        <Nav.Item>
                          <Nav.Link eventKey="shippingaddress" className="mb-sm-3 mb-md-0">
                            Notes
                          </Nav.Link>
                        </Nav.Item>
                      </Nav>
                    </Card.Header>
                    <Card.Body className="p-0" style={{ maxHeight: "335px", overflowY: "auto" }}>
                      <Tab.Content style={{ backgroundColor: "rgb(231 235 239)" }}>
                        <Tab.Pane eventKey="shippingaddress">
                          <div style={{ display: "grid", gap: "10px" }}>
                            {loadingNotes ? (
                              <p style={{ fontSize: "13px" }}>Loading notes...</p>
                            ) : localNotes?.length > 0 ? (
                              localNotes.map((note, index) => (
                                <div
                                  key={index}
                                  style={{
                                    backgroundColor: "#ffffff",
                                    padding: "15px 0px 7px 13px",
                                    borderRadius: "10px",
                                  }}
                                  className="mt-2"
                                >
                                  <p style={{ marginBottom: "8px", fontSize: "13px" }}>{note.note}</p>
                                </div>
                              ))
                            ) : (
                              <p style={{ fontSize: "13px" }}>No notes available.</p>
                            )}
                          </div>
                        </Tab.Pane>
                      </Tab.Content>
                    </Card.Body>
                  </Card>
                </Tab.Container>
              </Col>
            </Row>
          </Modal.Body>
          <Modal.Footer className="border-0">
            <Button onClick={props.onHide}>Close</Button>
          </Modal.Footer>
        </Modal>
      );
    }
  
    return (
      <>
        <a onClick={handleOpen} style={{ cursor: "pointer" }}>
          Show notes
        </a>
        <MyVerticallyCenteredaddressModal
          show={modalOrderAllNotesShow}
          onHide={() => setModalOrderAllNotesShow(false)}
        />
      </>
    );
  };
  

export default OrderAllNotes;