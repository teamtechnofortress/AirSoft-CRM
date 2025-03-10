import React, { useEffect, useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import axios from "axios";
import { toast } from "react-toastify";

const CustomerAddNotes = ({ customer, crmUser,loginuserid }) => {
  const [show, setShow] = useState(false);
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [todo, setTodo] = useState(false); 
  const [userid, setUserid] = useState(""); // Initialize as empty string

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  // useEffect(() => {
  //   console.log("Selected User ID:", userid);
  // }, [userid]); // Log when `userid` changes

  const handleSaveNote = async () => {
    if (!note.trim()) {
      toast.error("Note cannot be empty!");
      return;
    }
    if (!userid) {
      toast.error("User cannot be empty!");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post("/oldapi/customer/addnote", {
        customerId: customer.id,
        customername: `${customer.first_name} ${customer.last_name}`,
        userid: userid,
        createdby:loginuserid,
        note,
      });
      if (response.data.status === "success") {
        toast.success("Note added successfully!");
        setNote("");
        handleClose();
      } else {
        toast.error("Failed to add note!");
      }
    } catch (error) {
      console.error("Error adding note:", error);
      toast.error("Error adding note!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button variant="link" onClick={handleShow}>
        <i className="fa fa-sticky-note" aria-hidden="true"></i>
      </Button>

      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Add Note for {customer.first_name} {customer.last_name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label>Note</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Enter your note here..."
            />
          </Form.Group>
          <Form.Group controlId="exampleForm.ControlSelect" className="mt-2 d-flex justify-content-start gap-2">
            {/* <Form.Label className="mt-1">Send task to</Form.Label> */}
            <Form.Select 
              className="custom-select-ordernotemodel"
              value={userid}
              onChange={(e) => setUserid(e.target.value)} // Update userid when selection changes
             >
              <option value="">Select User...</option>
              {crmUser.map(user => (
                <option key={user._id} value={user._id}>
                  {user.firstname} {user.lastname} ({user.role.role})
                </option>
              ))}
            </Form.Select>
          </Form.Group>
          <Form.Group controlId="exampleForm.ControlSwitch" className="mt-2 d-flex justify-content-start gap-2">
            <Form.Check 
              type="switch" 
              id="custom-switch" 
              className="custom-switch-ordernotemodel" 
              checked={todo} 
              onChange={() => setTodo(!todo)} 
            />
            <Form.Label>Send task to</Form.Label>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>Cancel</Button>
          <Button variant="primary" onClick={handleSaveNote} disabled={loading}>
            {loading ? "Saving..." : "Save Note"}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default CustomerAddNotes;
