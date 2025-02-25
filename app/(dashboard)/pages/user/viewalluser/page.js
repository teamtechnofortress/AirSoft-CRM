'use client';
import React,{useState,useEffect} from 'react'
import Link from "next/link";
import axios from 'axios'
import { Col, Row, Form, Card, Button, Image,Container,Table,Spinner } from 'react-bootstrap';
import ToastComponent from 'components/toastcomponent';
import { toast } from "react-toastify";

const ViewAllUsers = () => {
    const [users, setUsers] = useState([]); 
    const [loading, setLoading] = useState(true);
    const [permissionList, setPermissionList] = useState([]);
    
    const tokedecodeapi = async () => {
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_HOST}/oldapi/tokendecodeapi`);
            if (response.data?.data) {
                const permissions = response.data.data.permissions.map(p => p._id);
                // console.log("permissionList fetched successfully:", permissionList);
                setPermissionList(permissions);
                // return response.data.data;
            } else {
                console.error("Error fetching notes:", response.data.message);
                return [];
            }
        } catch (error) {
            console.error("Error fetching notes:", error);
            return [];
        }
    };
    
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
        tokedecodeapi();
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
    
    if (loading) return (
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
            <Spinner animation="border" variant="primary" role="status">
                <span className="visually-hidden">Loading...</span>
            </Spinner>
        </div>
    );


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
                    {["67b46c877b14d62c9c5850e3", "67b46c8e7b14d62c9c5850e5"].some(permission => 
                        permissionList.includes(permission)) ? (
                        <th scope="col">Action</th>
                    ) : (
                        <th></th>
                    )}
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
                        {permissionList.includes("67b46c877b14d62c9c5850e3") && (
                            <Link href={`/pages/user/edituser/${user._id}`} passHref>
                             <Button variant="outline-primary" className="me-1">Edit</Button>
                           </Link>
                        )}
                        {permissionList.includes("67b46c8e7b14d62c9c5850e5") && (
                            <Button
                                variant="outline-danger"
                                className="me-1"
                                onClick={() => handleDelete(user._id)}
                                >
                                Delete
                            </Button>
                        )}
                        {/* <Link href={`/pages/user/edituser/${user._id}`} passHref>
                         <Button variant="outline-primary" className="me-1">Edit</Button>
                        </Link>
                        <Button
                            variant="outline-danger"
                            className="me-1"
                            onClick={() => handleDelete(user._id)}
                            >
                            Delete
                        </Button> */}
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