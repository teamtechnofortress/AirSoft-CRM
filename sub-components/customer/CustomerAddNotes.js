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
      // Prepare API request for adding note
      const addNoteRequest = axios.post("/oldapi/customer/addnote", {
        customerId: customer.id,
        customername: `${customer.first_name} ${customer.last_name}`,
        userid: userid,
        createdby: loginuserid,
        note,
      });
  
      // Prepare API request for adding task (if `todo` is true)
      const addTaskRequest = todo
        ? axios.post(`${process.env.NEXT_PUBLIC_HOST}/oldapi/task/add`, {
            taskdescription: note,
            crmuser: userid,
          })
        : Promise.resolve(null); // If `todo` is false, resolve with null (no API call)
  
      // Send both API requests in parallel
      const [addNoteResponse, addTaskResponse] = await Promise.all([
        addNoteRequest,
        addTaskRequest,
      ]);
  
      // Handle success responses
      if (addNoteResponse.data.status === "success") {
        setUserid('');
        toast.success("Note added successfully!");
      } else {
        toast.error("Failed to add note!");
      }
  
      if (todo && addTaskResponse?.data?.status === "success") {
        setTodo(false);
        setUserid('');
        toast.success("Task added successfully!");
      } else if (todo) {
        toast.error("Failed to add task!");
      }
  
      // Clear input fields and close modal
      setNote("");
      handleClose();
    } catch (error) {
      console.error("Error:", error);
      
      // Handle errors from both APIs
      if (error.response) {
        toast.error(`Error: ${error.response.data.message || "Request failed"}`);
      } else {
        toast.error("An error occurred while saving the note/task.");
      }
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <>
      <Button variant="" onClick={handleShow}>
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
