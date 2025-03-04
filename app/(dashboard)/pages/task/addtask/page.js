'use client'
// import node module libraries
import React,{useState,useEffect} from 'react'
import useMounted from 'hooks/useMounted';
import axios from 'axios';
import ToastComponent from 'components/toastcomponent';
import { toast } from "react-toastify";
import { Col, Row, Form, Card, Button, Image,Container,Spinner } from 'react-bootstrap';

const AddTask = () => {
  const hasMounted = useMounted();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [user, setUser] = useState([]);
  const [formData, setFormData] = useState({
          taskname: '',
          priorty: '',
          taskdate: '',
          taskstatus: '',
          taskdescription: '',
          taskcomments: '',
          crmuser: '',
  });

  const fetchalluser = async () =>{
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
            // console.log(response.data);
            setUser(response.data.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }finally{
            setLoading(false);
        }
    }
useEffect(() => {
    fetchalluser();
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
        setSubmitting(true);
        const response = await axios.post(`${process.env.NEXT_PUBLIC_HOST}/oldapi/task/add`, formData);
        if (response.data.status === "success") {
          // toast.success("User added successfully!");
          setFormData({
            taskname: '',
            priorty: '',
            taskdate: '',
            taskstatus: '',
            taskdescription: '',
            taskcomments: '',
            crmuser: '',
          });
          toast.success("Task added successfully!");
        } else {
          toast.error("Task Not Added! " + response.data.message);
        }
    } catch (error) {
        console.error('Error adding Task:', error);
        toast.error("Task Not Added! " + (error.response?.data?.message || "Something went wrong."));
    }
    finally{
        setSubmitting(false);
    }
  }

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
          <Col xl={12} lg={12} md={12} xs={12}>
            <Card>
              {/* card body */}
              <Card.Body>
                <div>
                  <div className="mb-6">
                    <h4 className="mb-1">Basic information</h4>
                  </div>
                  {hasMounted && 
                  <Form method="POST" onSubmit={handleSubmit}>
                    <Row className="mb-3">
                      <Form.Label className="col-sm-4 col-form-label form-label" htmlFor="fullName">Task name/Priorty</Form.Label>
                      <Col sm={4} className="mb-3 mb-lg-0">
                        <Form.Control type="text" value={formData.taskname} onChange={handleChange} name="taskname" placeholder="Task name" id="fullName" required />
                      </Col>
                      <Col sm={4}>
                        <Form.Control 
                            as="select" 
                            id="exampleInputrole" 
                            name="priorty" 
                            value={formData.priorty} 
                            onChange={handleChange} 
                            required
                            >
                            <option value="">Task priorty</option> 
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                        </Form.Control>
                        {/* <Form.Control type="text" value={formData.priorty} onChange={handleChange} name="priorty" placeholder="Priorty" id="lastName" required /> */}
                      </Col>
                    </Row>
                    <Row className='mb-3'>
                        <Form.Label className="col-sm-4 col-form-label form-label" htmlFor="taskDate">
                             Status/Task Due-Date
                        </Form.Label>
                        <Col sm={4} className="mb-3 mb-lg-0">
                            <Form.Control 
                                as="select" 
                                id="exampleInputrole" 
                                name="taskstatus" 
                                value={formData.taskstatus} 
                                onChange={handleChange} 
                                required
                                >
                                <option value="">Task status</option> 
                                <option value="todo">To DO</option>
                                <option value="inprogress">IN PROGRESS</option>
                                <option value="inreview">IN REVIEW</option>
                                <option value="onhold">ON HOLD</option>
                                <option value="errorbug">ERROR BUG</option>
                                <option value="complete">COMPLETE</option>
                            </Form.Control>
                        </Col>
                        <Col sm={4}>
                            <Form.Control 
                            type="date" 
                            value={formData.taskdate} 
                            onChange={handleChange} 
                            name="taskdate" 
                            id="taskDate" 
                            required 
                            />
                        </Col>
                    </Row>
                    {/* row */}
                    {/* <Row className="mb-3">
                    <Form.Label className="col-sm-4 col-form-label form-label" htmlFor="email">Email</Form.Label>
                      <Col md={8} xs={12}>
                        <Form.Control type="email" value={formData.email} onChange={handleChange} name="email"  placeholder="Email" id="email" required />
                      </Col>
                    </Row> */}
                    {/* Address Line Two */}
                    {/* <Row className="mb-3">
                      <Form.Label className="col-sm-4" htmlFor="password">Password</Form.Label>
                      <Col md={8} xs={12}>
                        <Form.Control type="password" value={formData.password} onChange={handleChange} name="password" placeholder="Enter Password" id="password" required />
                      </Col>
                    </Row> */}
                    {/* row */}
                    {/* <Row className="mb-3">
                      <Form.Label className="col-sm-4" htmlFor="phone">
                        Phone 
                        {/* <span className="text-muted">(Optional)</span>
                      </Form.Label>
                      <Col md={8} xs={12}>
                        <Form.Control type="text" value={formData.phone} onChange={handleChange} name="phone" placeholder="Enter Phone" id="phone" />
                      </Col>
                    </Row> */}

                    {/* Location */}
                    {/* <Row className="mb-3">
                      <Form.Label className="col-sm-4" htmlFor="country">Location</Form.Label>
                      <Col md={8} xs={12}>
                        <Form.Control as={FormSelect} placeholder="Select Country" id="country" options={countryOptions} />
                      </Col>
                    </Row> */}

                    {/* Address Line One */}
                    <Row className="mb-3">
                        <Form.Label className="col-sm-4 col-form-label form-label" htmlFor="taskDescription">
                            Task Description
                        </Form.Label>
                        <Col md={8} xs={12}>
                            <Form.Control 
                            as="textarea" 
                            rows={4} 
                            value={formData.taskdescription} 
                            onChange={handleChange} 
                            name="taskdescription" 
                            id="taskDescription" 
                            placeholder="Enter task details here..." 
                            required 
                            />
                        </Col>
                    </Row>
                    <Row className="mb-3">
                        <Form.Label className="col-sm-4 col-form-label form-label" htmlFor="taskDescription">
                            Comments 
                        </Form.Label>
                        <Col md={8} xs={12}>
                            <Form.Control 
                            as="textarea" 
                            rows={4} 
                            value={formData.taskcomments} 
                            onChange={handleChange} 
                            name="taskcomments" 
                            id="taskDescription" 
                            placeholder="Enter task Comments here..." 
                            required 
                            />
                        </Col>
                    </Row>
                    {/* Zip code */}
                    <Row className="align-items-center">
                    <Form.Label className="col-sm-4" htmlFor="exampleInputrole">Assinge To</Form.Label>
                        <Col md={8} xs={12}>
                            <Form.Control 
                            as="select" 
                            id="exampleInputrole" 
                            name="crmuser" 
                            value={formData.crmuser} 
                            onChange={handleChange} 
                            required
                            >
                            <option value="">Select user</option> {/* Placeholder option */}
                            {user.map((item) => (
                                <option key={item._id} value={item._id}>{item.firstname + ' ' + item.lastname }</option>
                            ))}
                            </Form.Control>
                        </Col>
                      <Col md={{ offset: 4, span: 8 }} xs={12} className="mt-4">
                        <Button variant="primary" type="submit" disabled={submitting}>
                          {submitting ? (
                            <>
                              <Spinner
                                as="span"
                                animation="border"
                                size="sm"
                                role="status"
                                aria-hidden="true"
                                className="me-2"
                              />
                              Submitting...
                            </>
                          ) : (
                            "Submit"
                          )}
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

export default AddTask