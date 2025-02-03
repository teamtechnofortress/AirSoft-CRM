'use client'
// import node module libraries
import React,{useState,useEffect} from 'react'
import useMounted from 'hooks/useMounted';
import axios from 'axios';
import ToastComponent from 'components/toastcomponent';
import { toast } from "react-toastify";
import { Col, Row, Form, Card, Button, Image,Container } from 'react-bootstrap';

const AddUser = () => {
  const [userRole, setUserRole] = useState([]);
  const [formData, setFormData] = useState({
        firstname: '',
        lastname: '',
        email: '',
        password: '',
        phone: '',
        role: ''
  });

  const fetchallrole = async () =>{
      try {
          const response = await axios.get(`${process.env.NEXT_PUBLIC_HOST}/api/userrole/getallrole`);
          // console.log(response.data);
          setUserRole(response.data.data);
      } catch (error) {
          console.error('Error fetching data:', error);
      }
  }
  useEffect(() => {
      fetchallrole();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData(prevData => ({
        ...prevData,
        [name]: value
    }));
  };

  const handleSubmit = async (event) => {  
    event.preventDefault();
    // console.log(formData);
    try {
        const response = await axios.post(`${process.env.NEXT_PUBLIC_HOST}/api/user/adduser`, formData);
        if (response.data.status === "success") {
          // toast.success("User added successfully!");
          setFormData({
            firstname: '',
            lastname: '',
            email: '',
            password: '',
            phone: '',
            role: ''
          });
          toast.success("User added successfully!");
        } else {
           toast.error("User Not Added!");
        }
    } catch (error) {
        console.error('Error adding user:', error);
        toast.error("An error occurred while adding the user.");
    }
    finally{
    }
  }

  const hasMounted = useMounted();
  const countryOptions = [
    { value: 'India', label: 'India' },
    { value: 'US', label: 'US' },
    { value: 'UK', label: 'UK' },
    { value: 'UAE', label: 'UAE' }
  ];

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
                    <h4 className="mb-1">Basic information</h4>
                  </div>
                  {hasMounted && 
                  <Form method="POST" onSubmit={handleSubmit}>
                    <Row className="mb-3">
                      <Form.Label className="col-sm-4 col-form-label form-label" htmlFor="fullName">Full name</Form.Label>
                      <Col sm={4} className="mb-3 mb-lg-0">
                        <Form.Control type="text" value={formData.firstname} onChange={handleChange} name="firstname" placeholder="First name" id="fullName" required />
                      </Col>
                      <Col sm={4}>
                        <Form.Control type="text" value={formData.lastname} onChange={handleChange} name="lastname" placeholder="Last name" id="lastName" required />
                      </Col>
                    </Row>
                    {/* row */}
                    <Row className="mb-3">
                    <Form.Label className="col-sm-4 col-form-label form-label" htmlFor="email">Email</Form.Label>
                      <Col md={8} xs={12}>
                        <Form.Control type="email" value={formData.email} onChange={handleChange} name="email"  placeholder="Email" id="email" required />
                      </Col>
                    </Row>
                    {/* Address Line Two */}
                    <Row className="mb-3">
                      <Form.Label className="col-sm-4" htmlFor="password">Password</Form.Label>
                      <Col md={8} xs={12}>
                        <Form.Control type="password" value={formData.password} onChange={handleChange} name="password" placeholder="Enter Password" id="password" required />
                      </Col>
                    </Row>
                    {/* row */}
                    <Row className="mb-3">
                      <Form.Label className="col-sm-4" htmlFor="phone">Phone 
                        {/* <span className="text-muted">(Optional)</span> */}
                      </Form.Label>
                      <Col md={8} xs={12}>
                        <Form.Control type="text" value={formData.phone} onChange={handleChange} name="phone" placeholder="Enter Phone" id="phone" />
                      </Col>
                    </Row>

                    {/* Location */}
                    {/* <Row className="mb-3">
                      <Form.Label className="col-sm-4" htmlFor="country">Location</Form.Label>
                      <Col md={8} xs={12}>
                        <Form.Control as={FormSelect} placeholder="Select Country" id="country" options={countryOptions} />
                      </Col>
                    </Row> */}

                    {/* Address Line One */}
                    {/* <Row className="mb-3">
                      <Form.Label className="col-sm-4" htmlFor="addressLine">Address line 1</Form.Label>
                      <Col md={8} xs={12}>
                        <Form.Control type="text" placeholder="Enter Address line 1" id="addressLine" required />
                      </Col>
                    </Row> */}

                    


                    {/* Zip code */}
                    <Row className="align-items-center">
                    <Form.Label className="col-sm-4" htmlFor="exampleInputrole">Role</Form.Label>
                      <Col md={8} xs={12}>
                        <Form.Control 
                          as="select" 
                          id="exampleInputrole" 
                          name="role" 
                          value={formData.role} 
                          onChange={handleChange} 
                          required
                        >
                          <option value="">Select Role</option> {/* Placeholder option */}
                          {userRole.map((role) => (
                            <option key={role._id} value={role._id}>{role.role}</option>
                          ))}
                        </Form.Control>
                        </Col>
                      <Col md={{ offset: 4, span: 8 }} xs={12} className="mt-4">
                        <Button variant="primary" type="submit">
                          Save
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

export default AddUser