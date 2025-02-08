'use client'

// import node module libraries
import { Row, Col, Card, Form, Button, Image } from 'react-bootstrap';
import Link from 'next/link';
import { useState } from 'react'
import ToastComponent from 'components/toastcomponent';
import { toast } from "react-toastify";
import { useRouter } from 'next/navigation';
import axios from 'axios'





// import hooks
import useMounted from 'hooks/useMounted';

const SignIn = () => {
  const router = useRouter();

  const hasMounted = useMounted();
  const [formData, setFormData] = useState({
      email: '',
      password: '',
  });

  const auth = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_HOST}/oldapi/login`,formData);
      // console.log('API Response:', response);
      const data = response.data;
        if (data.status === 'Success') {
          // console.log('API Response token:', data.token);
          if (data.token) {
            // Redirect to homepage or dashboard
            toast.success("Login successfully!");
            setTimeout(() => {
              router.refresh();
              router.push(`/`);
            }, 1000);
          }
        } else {
          console.error(data.error);
        }
      } catch (error) {
      console.error('Error fetching data:', error);
      } 
      finally {
      }
  };

const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
};

  return (
    <Row className="align-items-center justify-content-center g-0 min-vh-100">
      <ToastComponent />
      <Col xxl={4} lg={6} md={8} xs={12} className="py-8 py-xl-0">
        {/* Card */}
        <Card className="smooth-shadow-md">
          {/* Card body */}
          <Card.Body className="p-6">
            <div className="mb-4" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
              <Link href="/"><Image src="/images/brand/logo/image.png" style={{ height: '100px', width: '100px', borderRadius: '100%' }}  className="mb-2" alt="" /></Link>
              <p className="mb-6">Please enter your user information.</p>
            </div>
            {/* Form */}
            {hasMounted &&
              <Form  onSubmit={auth} method='POST'>
                {/* Username */}
                <Form.Group className="mb-3" controlId="username">
                  <Form.Label>Email</Form.Label>
                  <Form.Control type="email"  name="email" value={formData.email} onChange={handleChange} placeholder="Enter address here" required />
                </Form.Group>

                {/* Password */}
                <Form.Group className="mb-3" controlId="password">
                  <Form.Label>Password</Form.Label>
                  <Form.Control type="password" name="password" value={formData.password} onChange={handleChange} placeholder="**************" required />
                </Form.Group>

                {/* Checkbox */}
                <div className="d-lg-flex justify-content-between align-items-center mb-4">
                  {/* <Form.Check type="checkbox" id="rememberme">
                    <Form.Check.Input type="checkbox" />
                    <Form.Check.Label>Remember me</Form.Check.Label>
                  </Form.Check> */}
                </div>
                <div>
                  {/* Button */}
                  <div className="d-grid">
                    <Button variant="primary" type="submit">Login</Button>
                  </div>
                  <div className="d-md-flex justify-content-between mt-4">
                    <div className="mb-2 mb-md-0">
                      {/* <Link href="/authentication/sign-up" className="fs-5">Create An Account </Link> */}
                    </div>
                    <div>
                      <Link href="/authentication/forget-password" className="text-inherit fs-5">Forgot your password?</Link>
                    </div>
                  </div>
                </div>
              </Form>}


          </Card.Body>
        </Card>
      </Col>
    </Row>
  )
}


export default SignIn