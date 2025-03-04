import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import axios from "axios";
import { toast } from "react-toastify";

const CustomerEditNotes = ({ crmUser, noteid,fetchallnotes }) => {
  const [show, setShow] = useState(false);
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [todo, setTodo] = useState(false);
  const [userid, setUserid] = useState("");
  
  const handleClose = () => setShow(false);

  const handleShow = () => {
    setShow(true);
    fetchnotes(noteid); 
    // console.log(crmUser);
  };

  const fetchnotes = async (id) => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_HOST}/oldapi/customer/getnoteforedit/${id}`
      );
      if (response.data && response.data.data) {
        // console.log(response.data.data);
        // console.log(response.data.data.userid);
        setNote(response.data.data.note);
        setUserid(response.data.data.userid);
      }
    } catch (error) {
      toast.error("Error fetching note!");
    } finally {
    }
  };

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
      const response = await axios.post("/oldapi/customer/updatenote", {
        userid,
        note,
        noteid,
      });
      if (response.data.status === "success") {
        fetchallnotes();
        toast.success("Note updated successfully!");
        setNote("");
        handleClose();
      } else {
        toast.error("Failed to update note!");
      }
    } catch (error) {
      toast.error("Error updating note!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <a variant="link" onClick={handleShow} style={{color: 'white',cursor:'pointer'}} >
        Edit
      </a>
      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton></Modal.Header>
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
          <Form.Group className="mt-2 d-flex justify-content-start gap-2">
            <Form.Select
              className="custom-select-ordernotemodel"
              value={userid}
              onChange={(e) => setUserid(e.target.value)}
            >
              <option value="">Select User...</option>
              {crmUser.map((user) => (
                <option key={user._id} value={user._id}>
                  {user.firstname} {user.lastname} ({user.role.role})
                </option>
              ))}
            </Form.Select>
          </Form.Group>
          <Form.Group className="mt-2 d-flex justify-content-start gap-2">
            <Form.Check
              type="switch"
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

export default CustomerEditNotes;
