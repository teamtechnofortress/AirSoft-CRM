"use client";
import React, { useState, useEffect } from "react";
import { Container, Row, Col, ListGroup, Card, Spinner, Form, Button, Badge } from "react-bootstrap";
import axios from "axios";

const InternalMessages = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [msgLoading, setMsgLoading] = useState(false);
  const [currentUserID, setCurrentUserID] = useState(null);

  useEffect(() => {
    const fetchCurrentUserID = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_HOST}/oldapi/tokendecodeapi`);
        if (response.data?.data) {
          setCurrentUserID(response.data.data.userid);
          console.log(response.data.data.userid);
        }
      } catch (error) {
        console.error("Error fetching user ID:", error);
      }
    };

    fetchCurrentUserID();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_HOST}/oldapi/messages/userwithmessages`);
      if (response.data.status === "success") {
        setUsers(response.data.data.users); // Ensure response structure
        console.log("Fetched Unread Messages:", response.data.data.messages);
        // const usersWithMessages = users.map(user => ({
        //   ...user,
        //   messages: messages.filter(msg => msg.receiverId === user._id) // Assign only relevant messages
        // }));
  
        // console.log("Updated Users with Messages:", usersWithMessages);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };
  useEffect(() => {
    fetchUsers().finally(() => setLoading(false)); // Fetch users when component mounts
  }, []);

  useEffect(() => {
    if (selectedUser && currentUserID) {
      setMsgLoading(true);
      fetchMessages(); // Fetch messages when user changes
      fetchUsers();
      fetchMessages().finally(() => setMsgLoading(false));
    }
  }, [selectedUser, currentUserID]);
  
  const fetchMessages = async () => {
    

    if (!selectedUser || !currentUserID) return;
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_HOST}/oldapi/messages/fetchmessage?senderId=${currentUserID}&receiverId=${selectedUser._id}`
      );
  
      const fetchedMessages = Array.isArray(response.data.messages) 
        ? response.data.messages.filter(msg => msg !== null && msg !== undefined) 
        : [];
  
      setMessages(fetchedMessages);
      await markMessagesAsSeen(fetchedMessages);
     

    } catch (error) {
      console.error("Error fetching messages:", error);
      setMessages([]); // Ensure messages is always an array
    }
  };
  //
  const markMessagesAsSeen = async (msgs) => {
    console.log(msgs);
    if (!msgs || msgs.length === 0) return;
    console.log(currentUserID);
  
    const unseenMessages = msgs.filter(msg => msg.receiverId === currentUserID && msg.seen === '0');

    console.log(unseenMessages);
    const messageIds =  unseenMessages.map(msg => msg._id);
    console.log(messageIds);
    if (unseenMessages.length > 0) {

      try {
        const response = await axios.post(`${process.env.NEXT_PUBLIC_HOST}/oldapi/messages/markseen`, {
          messageIds: messageIds,
        });
        await fetchUsers();
        console.log(response);
      } catch (error) {
        console.error("Error marking messages as seen:", error);
      }
    }
  };

  //  // Count unread messages for a user
  //  const getUnreadMessagesCount = (userId) => {
  //   return messages.filter((msg) => msg && msg.receiverId === userId && msg.seen === '0').length;
  // };

  const sendMessage = async () => {
    if (!newMessage.trim() || !currentUserID || !selectedUser) return;
    setSending(true);
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_HOST}/oldapi/messages/addmessage`, {
        message: newMessage,
        senderId: currentUserID,
        receiverId: selectedUser._id,
      });
  
      setMessages((prevMessages) => [...prevMessages, response.data.data]); // Optimistic UI update
      setNewMessage("");
  
      await fetchMessages(); // Fetch latest messages after sending
       await fetchUsers();
    } catch (error) {
      console.error("Error sending message:", error);
    }
    setSending(false);
  };
  

  return (
    <Container fluid className="p-1" style={{ height: "100vh" }}>
      <Row className="h-100" style={{ backgroundColor: "white" }}>
        {/* Users List with Unread Messages Count */}
        <Col md={3} className="border-end" style={{ overflowY: "auto", height: "100%" }}>
  <h5 className="p-3">CRM Users</h5>
  {loading ? (
    <div className="d-flex justify-content-center">
      <Spinner animation="border" variant="primary" />
    </div>
  ) : (
    <ListGroup>
      {Array.isArray(users) && users.length > 0 ? (
        users.map((user) => {
          return (
            <ListGroup.Item
              key={user._id}
              action
              active={selectedUser?._id === user._id}
              onClick={() => setSelectedUser(user)}
              className="d-flex justify-content-between align-items-center"
            >
              <div>
                <strong>{user.firstname} {user.lastname}</strong>
                <br />
                <small>{user.email}</small>
              </div>

              {/* ✅ Only show unread count if the current user is the receiver */}
              {user._id === currentUserID ? null : user.unreadCount > 0 && (
                <Badge bg="danger">{user.unreadCount}</Badge>
              )}
            </ListGroup.Item>
          );
        })
      ) : (
        <p>No users available</p>
      )}
    </ListGroup>
  )}
</Col>





        {/* Chat Box */}
        <Col md={9} className="d-flex flex-column">
          {selectedUser ? (
            <Card style={{ minHeight: "80vh" }}>
              <Card.Header>Chat with {selectedUser.firstname} {selectedUser.lastname}</Card.Header>
              <Card.Body className="d-flex flex-column justify-content-between">
                {/* Messages */}
                <div style={{ flex: 1, overflowY: "auto", padding: "10px", maxHeight: "80vh" }}>
                  {msgLoading ? (
                    <div className="d-flex justify-content-center">
                      <Spinner animation="border" variant="primary" />
                    </div>
                  ) : messages.length > 0 ? (
                    messages.map((msg, index) =>
                      msg ? ( // Ensure msg is not undefined/null
                        <div key={index} className={`d-flex ${msg.senderId === currentUserID ? "justify-content-end" : "justify-content-start"}`}>
                          <div className={`p-2 rounded ${msg.senderId === currentUserID ? "bg-primary text-white" : "bg-light text-dark"} mb-3`} style={{ maxWidth: "60%" }}>
                            {msg.message}
                            <div className="small text-black text-end">
                              {msg.sentAt ? new Date(msg.sentAt).toLocaleTimeString() : ""}
                            </div>
                          </div>
                        </div>
                      ) : null
                    )
                  ) : (
                    <p className="text-muted text-center">No messages yet.</p>
                  )}
                </div>


                {/* Message Input */}
                <Form className="d-flex">
                  <Form.Control
                    type="text"
                    placeholder="Type a message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    disabled={sending}
                  />
                  <Button variant="primary" onClick={sendMessage} disabled={sending} className="ms-2">
                    {sending ? "Sending..." : "Send"}
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          ) : (
            <div className="d-flex align-items-center justify-content-center h-100">
              <p>Select a user to start chatting.</p>
            </div>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default InternalMessages;
