'use client';
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router';
import axios from 'axios';
import { Col, Row, Form, Card, Button, Image,Container,Table,Badge,Spinner } from 'react-bootstrap';
import ToastComponent from 'components/toastcomponent';
import { toast } from "react-toastify";


const ViewallRole = () => {
    const [roles, setRole] = useState([]); 
    const [loading, setLoading] = useState(true);

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
        fetchallrole();  
    }, []);


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
                    </tr>
                    ))
                )}
            </tbody>
        </Table>
    </Container>
  )
}

export default ViewallRole