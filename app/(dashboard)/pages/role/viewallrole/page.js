'use client';
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router';
import axios from 'axios';
import { Col, Row, Form, Card, Button, Image,Container,Table,Badge,Spinner } from 'react-bootstrap';
import ToastComponent from 'components/toastcomponent';
import { toast } from "react-toastify";
import Link from 'next/link';
import { set } from 'date-fns';


const ViewallRole = () => {
    const [roles, setRole] = useState([]); 
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

    const fetchallrole = async () => {
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_HOST}/oldapi/userrole/getallrole`, {
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

            // console.log('API response:',response.data.data);

            if (response.data.status === "success") {
                setRole(response.data.data); 
              } else if (response.data.status === "tokenerror") { 
                // router.push(`${process.env.NEXT_PUBLIC_HOST}/login`);
              } else {
                console.log(response.data.message); 
              }

        } catch (error) {
            console.error('Error fetching data:', error);
        }
        finally{
            setLoading(false);
        }
    };
    useEffect(() => {
        tokedecodeapi();
        fetchallrole();  
    }, []);

    const handleDelete = async (id) => {
        
        if (!confirm("Are you sure you want to delete this role?")) return;
      
        try {
          setLoading(true);
          const response = await axios.delete(
            `${process.env.NEXT_PUBLIC_HOST}/oldapi/userrole/deleterole/${id}`,
            {
              headers: {
                "Content-Type": "application/json",
                "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
                Pragma: "no-cache",
                Expires: "0",
              },
              params: {
                _t: new Date().getTime(), // Force fresh request by appending timestamp
              },
            }
          );
      
          if (response.data.status === "success") {
            fetchallrole();
            toast.success(response.data.message || "Role deleted successfully!");
           // setRole((prevRoles) => prevRoles.filter((role) => role._id !== id)); // Update state
          } else {
            toast.error(response.data.message || "Failed to delete role!");
          }
        } catch (error) {
          console.error("Error deleting role:", error);
      
          // If error is from API response
          if (error.response) {
            console.log("Server Error Response:", error.response);
      
            const message = error.response.data?.message || "Something went wrong!";
      
            if (error.response.status === 400) {
              toast.error(message); // Role is assigned to users
            } else if (error.response.status === 404) {
              toast.error("Role not found!");
            } else if (error.response.status === 401) {
              toast.error("Session expired. Please log in again.");
            } else {
              toast.error(message);
            }
          } else {
            // Network error or unexpected issue
            toast.error("A network error occurred. Please try again.");
          }
        }finally{
            setLoading(false);
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
                    <th scope="col">Role</th>
                    <th scope="col">Permission</th>
                    {["67b46c417b14d62c9c5850db", "67b46c477b14d62c9c5850dd"].some(permission => 
                        permissionList.includes(permission)) ? (
                        <th scope="col">Action</th>
                    ) : (
                        <th></th>
                    )}
                </tr>
            </thead>
            <tbody>
                {roles.length > 0 && (
                    roles.map((role, index) => (
                    <tr key={role._id}>
                        <th scope="row">{index + 1}</th>
                        <td>{role.role}</td>
                        <td>
                        <div className="d-flex flex-wrap gap-2">
                            {role.permissions.map((permission) => (
                            <Badge key={permission._id} pill bg="info">
                                {permission.permission}
                            </Badge>
                            ))}
                        </div>
                        </td>
                        <td>
                            {permissionList.includes("67b46c417b14d62c9c5850db") && (
                                <Link href={`/pages/role/editrole/${role._id}`} passHref>
                                    <Button variant="outline-primary" className="me-1">Edit</Button>
                                </Link>
                            )}
                            {permissionList.includes("67b46c477b14d62c9c5850dd") && (
                                <Button
                                    variant="outline-danger"
                                    className="me-1"
                                    onClick={() => handleDelete(role._id)}
                                    >
                                    Delete
                                </Button>
                            )}
                        </td>
                    </tr>
                    ))
                )}
            </tbody>
        </Table>
    </Container>
  )
}

export default ViewallRole