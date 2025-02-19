import { Button, Modal, Form } from "react-bootstrap";
import React, { useState, Fragment, memo } from "react";
import axios from "axios";


// Memoized Modal Component
const MyVerticallyCenterednoteModal = memo(({ show, onHide, noteText, setNoteText, sendToCustomer, setSendToCustomer, handleSubmit, loading, order }) => {
  return (
    <Modal show={show} onHide={onHide} aria-labelledby="contained-modal-title-vcenter" centered>
      <Form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}> {/* Form wraps the entire modal */}
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Add note
            <p style={{ color: "#788589", margin: "0px", fontSize: "13px" }}>order #{order.number}</p>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group controlId="exampleForm.ControlTextarea">
            <Form.Control 
              as="textarea" 
              rows={4} 
              placeholder="Type here..." 
              value={noteText} 
              onChange={(e) => setNoteText(e.target.value)} 
              required 
            />
          </Form.Group>
          <Form.Group controlId="exampleForm.ControlSwitch" className="mt-2 d-flex justify-content-start gap-2">
            <Form.Check 
              type="switch" 
              id="custom-switch" 
              className="custom-switch-ordernotemodel" 
              checked={sendToCustomer} 
              onChange={() => setSendToCustomer(!sendToCustomer)} 
            />
            <Form.Label>Send the note to the customer as well</Form.Label>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button type="submit" disabled={loading}>{loading ? "Submitting..." : "Submit"}</Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
});

const OrderModelNote = ({ order,setToast }) => {
  const [modalnoteShow, setModalnoteShow] = useState(false);
  const [noteText, setNoteText] = useState(""); 
  const [sendToCustomer, setSendToCustomer] = useState(true); 
  const [ordernumber, setOrdernumber] = useState(order.number); 
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!noteText.trim()) {
      alert("Please enter a note before submitting.");
      return;
    }
    setLoading(true);
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_HOST}/oldapi/woocommerce/note/addnote`, {
        orderid: ordernumber,
        note: noteText,
        sendToCustomer,
      });

      if(response.data.status === "error") {
        setLoading(false);
        setToast("Note Not added!");
        return;
      }
      
      setModalnoteShow(false);
      setNoteText(""); 
      setSendToCustomer(false); 
      setLoading(false);
      setToast("Note added successfully!");
      return;

    } catch (error) {
      console.error("Error submitting note:", error);
      setLoading(false);
      setToast("Note Not added!");
      return;
    }
  };

  return (
    <>
      <Fragment>
        <Button variant="" onClick={() => setModalnoteShow(true)}>
          <i className="fa fa-sticky-note" aria-hidden="true"></i>
        </Button>
        <MyVerticallyCenterednoteModal 
          show={modalnoteShow} 
          onHide={() => setModalnoteShow(false)} 
          noteText={noteText} 
          setNoteText={setNoteText} 
          sendToCustomer={sendToCustomer} 
          setSendToCustomer={setSendToCustomer} 
          handleSubmit={handleSubmit} 
          loading={loading} 
          order={order} 
        />
      </Fragment>
    </>
  );
};

export default OrderModelNote;
