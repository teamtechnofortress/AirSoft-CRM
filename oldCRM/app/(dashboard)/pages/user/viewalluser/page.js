'use client';
import React,{useState,useEffect} from 'react'
import axios from 'axios'
import { Col, Row, Form, Card, Button, Image,Container,Table } from 'react-bootstrap';

const ViewAllUsers = () => {
    const [users, setUsers] = useState([]); 
    const [loading, setLoading] = useState(true);
    const fetchallusers = async () => {
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_HOST}/api/user/viewalluser`);
                // console.log(response.data);
            if (response.data.status === "success") {
                setUsers(response.data.data); 
              } else if (response.data.status === "tokenerror") { 
                router.push(`${process.env.NEXT_PUBLIC_HOST}/login`);
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
        fetchallusers();  
    }, []);
    
    if (loading) return <div>Loading...</div>;


  return (
    <Container fluid className="p-6">
        <Table className="text-nowrap">
            <thead >
                <tr>
                    <th scope="col">#</th>
                    <th scope="col">Name</th>
                    <th scope="col">Email</th>
                    <th scope="col">Phone</th>
                    <th scope="col">Role</th>
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
                      <td>{user.role?.role ?? ""}</td>
                  </tr>
                  ))
                )}
            </tbody>
        </Table>
    </Container>
  )
}

export default ViewAllUsers