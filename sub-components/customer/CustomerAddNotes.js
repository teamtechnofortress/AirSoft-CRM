"use client";
import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import axios from "axios";
import { toast } from "react-toastify";

const CustomerAddNotes = ({ customer }) => {
  const [show, setShow] = useState(false);
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleSaveNote = async () => {
    if (!note.trim()) {
      toast.error("Note cannot be empty!");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post("/oldapi/customer/addnote", {
        customerId: customer.id,
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
      <Button variant="link" onClick={handleShow}>Add Note</Button>

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
                onChange={(e) => {
                    console.log("Typed value:", JSON.stringify(e.target.value)); // Check for spaces
                    setNote(e.target.value);
                }}
                placeholder="Enter your note here..."
                />
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
