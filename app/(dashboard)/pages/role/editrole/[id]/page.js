'use client'
// import node module libraries
import React, { useEffect,useState } from 'react'
import useMounted from 'hooks/useMounted';
import { Col, Row, Form, Card, Button, Image,Container,Spinner } from 'react-bootstrap';
import axios from 'axios';
import ToastComponent from 'components/toastcomponent';
import { toast } from "react-toastify";
import { useParams } from 'next/navigation';




const EditRole = () => {
  const { id } = useParams();
  const hasMounted = useMounted();
  const [loading, setLoading] = useState(true);
  const [permissions, setPermissions] = useState([]);
  const [role, setRole] = useState('');
  const [selectedPermissions, setSelectedPermissions] = useState([]);
  const [error, setError] = useState(false);
  
  


  const fetchallpermissions = async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_HOST}/oldapi/permission/getallpermission`, {
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
      // console.log(response.data);

      if(response.data.status === "success"){
          setPermissions(response.data.data);
      }else{
          console.log(response.data.message);
      }

    } catch (error) {
      console.error('Error fetching data:', error);
    }finally{
     
    }
  };
  const fetchrole = async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_HOST}/oldapi/userrole/getrole/${id}`);
      // console.log(response.data);
        
      if(response.data.status === "success"){
        setRole(response.data.data.role);
        setSelectedPermissions(response.data.data.permissions.map(p => p._id));
      }else{
          console.log(response.data.message);
      }

    } catch (error) {
      console.error('Error fetching data:', error);
    }finally{
      
    }
  };

  // Use useEffect to call the function
  useEffect(() => {
    fetchallpermissions();
    fetchrole();
    setLoading(false);
  }, []);


  const handleChange = (event) => {
      const { name, value, checked, type } = event.target;

      if (type === 'checkbox') {
          // If the target is a checkbox, update the selectedPermissions array
          if (checked) {
              setSelectedPermissions([...selectedPermissions, value]);
          } else {
              setSelectedPermissions(selectedPermissions.filter(id => id !== value));
          }
      } else if (type === 'text') {
          // If the target is the role input, update the role state
          setRole(value);
      }
  };

  const handleSubmit = async (event) => {
      event.preventDefault();

      if (selectedPermissions.length === 0) { 
        setError(true);
        return; 
      }
      setError(false);

      // Create the payload to send to the API
      const data = {
          role,
          permission: selectedPermissions
      };
      try {
          const response = await axios.put(`${process.env.NEXT_PUBLIC_HOST}/oldapi/userrole/updaterole/${id}`, data);
          if (response.data.status === "success") {
              // Handle successful response (e.g., show a message or reset the form)
              toast.success("Role updated successfully!");
              // setSelectedPermissions([]);
              // setRole('');
              // console.log('Role added successfully', response.data);
          } else {
              toast.error("Role Not updated!");
              console.log('Error:', response.data.message);
          }
      } catch (error) {
        console.error("Error submitting form:", error.response?.data || error)
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

      <Row className="mb-8">
          {/* <Col xl={3} lg={4} md={12} xs={12}>
            <div className="mb-4 mb-lg-0">
              <h4 className="mb-1">General Setting</h4>
              <p className="mb-0 fs-5 text-muted">Profile configuration settings </p>
            </div>
          </Col> */}
          <Col xl={12} lg={12} md={12} xs={12}>
            <Card>
              {/* card body */}
              <Card.Body>
                <div className=" mb-6">
                  {/* <h4 className="mb-1">General Settings</h4> */}
                </div>
                {/* <Row className="align-items-center mb-8">
                  <Col md={3} className="mb-3 mb-md-0">
                    <h5 className="mb-0">Avatar</h5>
                  </Col>
                  <Col md={9}>
                    <div className="d-flex align-items-center">
                      <div className="me-3">
                        <Image src="/images/avatar/avatar-5.jpg" className="rounded-circle avatar avatar-lg" alt="" />
                      </div>
                      <div>
                        <Button variant="outline-white" className="me-2" type="submit">Change </Button>
                        <Button variant="outline-white" type="submit">Remove </Button>
                      </div>
                    </div>
                  </Col>
                </Row> */}
                {/* col */}
                {/* <Row className="mb-8">
                  <Col md={3} className="mb-3 mb-md-0">
                    //  heading 
                    <h5 className="mb-0">Cover photo</h5>
                  </Col>
                  <Col md={9}>
                    //  dropzone input  
                    <div>
                      {hasMounted && <Form action="#" className="dropzone mb-3 py-10 border-dashed">
                        <DropFiles />
                      </Form>}
                      <Button variant="outline-white" type="submit">Change </Button>
                    </div>
                  </Col>
                </Row> */}
                <div>
                  <div className="mb-6">
                    <h4 className="mb-1">Update Role</h4>
                  </div>
                  {hasMounted && 
                  <Form onSubmit={handleSubmit}>
                    <Row className="mb-3">
                      <Form.Label className="col-sm-4 col-form-label form-label" htmlFor="roleName">Role Name</Form.Label>
                      <Col md={8} xs={12}>
                        <Form.Control type="text" placeholder="Role name" name='role' value={role} onChange={handleChange}  id="roleName" required />
                      </Col>
                    </Row>
                    {/* row */}
                    <Row className="mb-3">
                    <Form.Label className="col-sm-4 col-form-label form-label" htmlFor="permission">Permission</Form.Label>
                    <Col md={8} xs={12}>
                    {permissions.reduce((rows, permission, index) => {
                          if (index % 3 === 0) {
                              rows.push([]);
                          }
                          rows[rows.length - 1].push(permission);
                          return rows;
                      }, []).map((row, rowIndex) => (
                          <Row key={rowIndex} className="mb-2">
                              {row.map((permission) => (
                                  <Col key={permission._id} md={4} xs={12}>
                                      <Form.Check 
                                          type="checkbox" 
                                          label={permission.permission} 
                                          name={permission.permission} 
                                          value={permission._id} 
                                          onChange={handleChange} 
                                          checked={selectedPermissions.includes(permission._id)}
                                       />
                                  </Col>
                              ))}
                          </Row>
                      ))}
                      {error && <p className="text-danger">At least one permission must be selected.</p>}


                      {/* {permissions.map((permission, index) => (
                          <div key={index}>
                              <input 
                                  className="form-check-input"
                                  type="checkbox" 
                                  id={permission._id} 
                                  name={permission.permission} 
                                  value={permission._id} 
                              />
                              <label htmlFor={permission._id}>{permission.permission}</label>
                          </div>
                      ))} */}
                    </Col>
                    </Row>
                    {/* Zip code */}
                    <Row className="align-items-center">
                      <Col md={{ offset: 4, span: 8 }} xs={12} className="mt-4">
                        <Button variant="primary" type="submit">
                          Update
                        </Button>
                      </Col>
                    </Row>
                  </Form>
                  }
                </div>
              </Card.Body>
            </Card>
          </Col>
      </Row>
    </Container>
  )
}

export default EditRole