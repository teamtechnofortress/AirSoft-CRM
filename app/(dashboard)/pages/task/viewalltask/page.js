'use client';
import React,{useState,useEffect} from 'react'
import Link from "next/link";
import axios from 'axios'
import { Col, Row, Form, Card, Button, Image,Container,Table,Spinner } from 'react-bootstrap';
import ToastComponent from 'components/toastcomponent';
import { toast } from "react-toastify";

const ViewAllTasks = () => {
    const [tasks, setTasks] = useState([]); 
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
    
    const fetchalltask = async () => {
      try {
          const response = await axios.get(`${process.env.NEXT_PUBLIC_HOST}/oldapi/task/getall`, {
              headers: {
                  'Content-Type': 'application/json',
                  'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
                  'Pragma': 'no-cache',
                  'Expires': '0',
              },
              params: {
                  _t: new Date().getTime(), 
              }
          });
  
          if (response.data.status === "success") {
              setTasks(response.data.data);
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
        fetchalltask();  
    }, []);

    const handleDelete = async (id) => {
        try {
            if (!confirm("Are you sure you want to delete this task?")) return;
            const response = await axios.delete(`${process.env.NEXT_PUBLIC_HOST}/oldapi/task/delete/${id}`, {
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
    <Container fluid className="p-3" style={{ maxWidth: '100%', overflow: 'auto' }}>
       <ToastComponent />
        <Table className="">
            <thead >
                <tr>
                    <th scope="col">Task Name</th>
                    <th scope="col">Priorty</th>
                    <th scope="col">DueDate</th>
                    <th scope="col">Task Status</th>
                    <th scope="col">Task Description</th>
                    <th scope="col">Task Comments</th>
                    {/* {["67b46c877b14d62c9c5850e3", "67b46c8e7b14d62c9c5850e5"].some(permission => 
                        permissionList.includes(permission)) ? (
                        <th scope="col">Action</th>
                    ) : (
                        <th></th>
                    )} */}
                    <th>Assign to</th>
                    <th>Action</th>

                </tr>
            </thead>
            <tbody>
                {tasks.length > 0 && (
                  tasks.map((task, index) => (
                  <tr key={task._id}>
                      <td>{task.taskname}</td>
                      <td>{task.priorty}</td>
                      <td>
                        {task.taskdate ? new Intl.DateTimeFormat('en-US').format(new Date(task.taskdate)) : "N/A"}
                      </td>
                      <td>{task.taskstatus}</td>
                      <td className="">{task.taskdescription}</td>
                      <td className="">{task.taskcomments}</td>
                      <td>{task.crmuser?.firstname + ' ' + task.crmuser?.lastname  ?? "Unknown"}</td>
                      <td>
                        {/* {permissionList.includes("67b46c877b14d62c9c5850e3") && (
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
                        )} */}
                          <Link href={`/pages/user/edituser/${task._id}`} passHref className='me-2'>
                              {/* <Button variant="outline-primary" className="me-1">Edit</Button> */}
                              <i class="fas fa-edit"></i>
                          </Link>
                          <Link href="#" onClick={(event) => { event.preventDefault(); handleDelete(task._id); }} passHref>
                            <i class="fa fa-trash"></i>
                          </Link>
                      </td>
                  </tr>
                  ))
                )}
            </tbody>
        </Table>
    </Container>
  )
}

export default ViewAllTasks