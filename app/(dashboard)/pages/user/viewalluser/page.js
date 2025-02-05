'use client';
import React,{useState,useEffect} from 'react'
import Link from "next/link";
import axios from 'axios'
import { Col, Row, Form, Card, Button, Image,Container,Table } from 'react-bootstrap';
import ToastComponent from 'components/toastcomponent';
import { toast } from "react-toastify";

const ViewAllUsers = () => {
    const [users, setUsers] = useState([]); 
    const [loading, setLoading] = useState(true);
    
    const fetchallusers = async () => {
      try {
          const response = await axios.get(`${process.env.NEXT_PUBLIC_HOST}/oldapi/user/viewalluser`, {
              headers: {
                  'Content-Type': 'application/json',
                  'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
                  'Pragma': 'no-cache',
                  'Expires': '0',
              },
              params: {
                  _t: new Date().getTime(),  // Force fresh request by appending timestamp
              }
          });
  
          if (response.data.status === "success") {
              setUsers(response.data.data);
          } else if (response.data.status === "tokenerror") {
              router.push(`${process.env.NEXT_PUBLIC_HOST}/login`);
          } else {
              console.log(response.data.message);
          }
  
      } catch (error) {
          console.error('Error fetching data:', error);
      } finally {
          setLoading(false);
      }
  };
  
    useEffect(() => {
        fetchallusers();  
    }, []);

    const handleDelete = async (id) => {
        try {
            if (!confirm("Are you sure you want to delete this user?")) return;
            const response = await axios.delete(`${process.env.NEXT_PUBLIC_HOST}/oldapi/user/deleteuser/${id}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
                    'Pragma': 'no-cache',
                    'Expires': '0',
                },
                params: {
                    _t: new Date().getTime(),  // Force fresh request by appending timestamp
                }
            });
    
            if (response.data.status === "success") {
                fetchallusers();
                toast.success("User deleted successfully!");
            } else if (response.data.status === "tokenerror") {
                router.push(`${process.env.NEXT_PUBLIC_HOST}/login`);
            } else {
                toast.error("Failed to delete user!");
                console.log(response.data.message);
            }
    
        } catch (error) {
          console.error("Error deleting user:", error);
        }
      };
    
    if (loading) return <div>Loading...</div>;


  return (
    <Container fluid className="p-6">
       <ToastComponent />

        <Table className="text-nowrap">
            <thead >
                <tr>
                    <th scope="col">#</th>
                    <th scope="col">Name</th>
                    <th scope="col">Email</th>
                    <th scope="col">Phone</th>
                    <th scope="col">Role</th>
                    <th scope="col">Action</th>
                </tr>
            </thead>
            <tbody>
                {users.length > 0 && (
                  users.map((user, index) => (
                  <tr key={user._id}>
                      <td>{index + 1}</td>
                      <td>{user.firstname+ ' ' + user.lastname}</td>
                      <td>{user.email}</td>
                      <td>{user.phone}</td>
                      <td>{user.role?.role ?? "admin"}</td>
                      <td>
                        <Link href={`/pages/user/edituser/${user._id}`} passHref>
                         <Button variant="outline-primary" className="me-1">Edit</Button>
                        </Link>
                        <Button
                            variant="outline-danger"
                            className="me-1"
                            onClick={() => handleDelete(user._id)}
                            >
                            Delete
                        </Button>
                      </td>
                  </tr>
                  ))
                )}
            </tbody>
        </Table>
    </Container>
  )
}

export default ViewAllUsers