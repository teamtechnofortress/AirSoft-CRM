import React from 'react'
import { Col, Row, Form, Card, Button, Image,Container,Tab,Tabs,Nav,DropdownButton,ButtonGroup,Dropdown,Spinner } from 'react-bootstrap';


const ShippingAddress = ({shippingData,handleChange,countries}) => {
  return (
    <>
        <Row className="mb-3">
            <Form.Label className="col-sm-4 col-form-label form-label" htmlFor="fullName">Full name</Form.Label>
            <Col sm={4} className="mb-3 mb-lg-0">
              <Form.Control type="text" value={shippingData.shippingfirstname} onChange={handleChange} name="shippingfirstname" placeholder="First name" id="fullName" required />
            </Col>
            <Col sm={4}>
              <Form.Control type="text" value={shippingData.shippinglastname} onChange={handleChange} name="shippinglastname" placeholder="Last name" id="lastName" required />
            </Col>
        </Row>
        <Row className="mb-3">
            <Form.Label className="col-sm-4" htmlFor="shippingcountry">Country / Province</Form.Label>
            <Col sm={4} className="mb-3 mb-lg-0">
              <Form.Select
                   onChange={handleChange}
                   id='shippingcountry'
                   name="shippingcountry"
                   value={shippingData.shippingcountry}
                   required
              >
                <option value="" disabled hidden>Choose...</option>
                {countries.map((country) => (
                    <option key={country.code} value={country.code}>
                        {country.name}
                    </option>
                ))}
              </Form.Select>
            </Col>
            <Col sm={4}>
              <Form.Control type="text" value={shippingData.shippingprovince} onChange={handleChange} name="shippingprovince" placeholder="Enter province" id="countryprovince" required />
            </Col>
        </Row>
        <Row className="mb-3">
            <Form.Label className="col-sm-4 col-form-label form-label" htmlFor="cityzipcode">City / ZipCode</Form.Label>
            <Col sm={4} className="mb-3 mb-lg-0">
              <Form.Control type="text" value={shippingData.shippingcity} onChange={handleChange} name="shippingcity" placeholder="Enter city" id="cityzipcode" required />
            </Col>
            <Col sm={4}>
              <Form.Control type="text" value={shippingData.shippingzipcode} onChange={handleChange} name="shippingzipcode" placeholder="Enter zipcode" id="cityzipcode" required />
            </Col>
        </Row>
        <Row className="mb-3">
            <Form.Label className="col-sm-4 col-form-label form-label" htmlFor="contactinfo">Phone/Company</Form.Label>
            <Col sm={4} className="mb-3 mb-lg-0">
              <Form.Control type="text" value={shippingData.shippingphone} onChange={handleChange} name="shippingphone" placeholder="Enter phone" id="contactinfo" required />
            </Col>
            <Col sm={4} className="mb-3 mb-lg-0">
             <Form.Control type="text" value={shippingData.shippingcompany} onChange={handleChange} name="shippingcompany" placeholder="Enter company" id="contactinfo" />
            </Col>
        </Row>
        <Row className="mb-3">
          <Form.Label className="col-sm-4 col-form-label form-label" htmlFor="Address">Address line 1/2</Form.Label>
          <Col sm={4} className="mb-3 mb-lg-0">
            <Form.Control type="text" value={shippingData.shippingaddressline1} onChange={handleChange} name="shippingaddressline1" placeholder="Enter Address line 1" id="Address" required />
          </Col>
          <Col sm={4}>
            <Form.Control type="text" value={shippingData.shippingaddressline2} onChange={handleChange} name="shippingaddressline2" placeholder="Enter Address line 2" id="Address" />
          </Col>
        </Row>
        {/* <Row className="mb-3">
            <Form.Label className="col-sm-4" htmlFor="country">Address</Form.Label>
            <Col md={8} xs={12}>
              <Form.Control
                  as="textarea"
                  rows={3}
                  value={shippingData.shippingfulladdress} onChange={handleChange}
                  name='shippingfulladdress'
                  placeholder="Enter your full address here..."
                  required
              />
            </Col>
        </Row> */}
    </>

  )
}

export default ShippingAddress