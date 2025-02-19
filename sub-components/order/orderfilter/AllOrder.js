import React, { useEffect,useState } from 'react'
import OrderLineItem from '/sub-components/order/OrderLineItem.js'
import OrderModelAddress from '/sub-components/order/OrderModelAddress.js'
import OrderAllNotes from '/sub-components/order/OrderAllNotes.js'
import OrderModelNote from '/sub-components/order/OrderModelNote.js'
import { Col, Row, Card, Accordion, Nav, Tab, Tabs, Container,Button,Spinner,ListGroup,ListGroupItem,DropdownButton,ButtonGroup,Dropdown,Modal} from 'react-bootstrap';
import moment from 'moment';
import ToastComponent from 'components/toastcomponent';
import { toast } from "react-toastify";
import axios from 'axios';
import Link from 'next/link';



const AllOrder = ({orders,handleorderStatusChange,fetchAllOrders}) => {
    const [toastMessage, setToastMessage] = useState(false);
    const [loading, setLoading] = useState(false);
    // const [modalOrderAllNotesShow, setModalOrderAllNotesShow] = React.useState(false);
    const [notesMap, setNotesMap] = useState({});
    

    useEffect(() => {
      if (toastMessage == "Note added successfully!") {
          toast.success(toastMessage);
          setToastMessage(false);
      }else{
        toast.error(toastMessage);
        setToastMessage(false);
      }
    }, [toastMessage]);
    

    const getTimeAgo = (dateString) => {
        const timeAgo = moment.utc(dateString).local().fromNow(); // Convert UTC to local time
        // console.log('Time Ago:', timeAgo);
        return timeAgo;
    };

    // const handleorderStatusChange = async (newStatus,id) => {
    //     try {
    //         console.log('New Status:', newStatus);
    //         console.log('New id:', id);
    //         setLoading(true);
    //         const response = await axios.post(`${process.env.NEXT_PUBLIC_HOST}/oldapi/woocommerce/order/orderstatuschnage`,{status: newStatus, id: id});
    //         if (response.data.status === "success") {
    //             // Handle successful response (e.g., show a message or reset the form)
    //             toast.success("Order status chnage successfully!");
    //             // console.log('Role added successfully', response.data);
    //         } else {
    //             toast.error("Order status not chnage Added!");
    //             console.log('Error:', response.data.message);
    //         }
    //     } catch (error) {
    //       console.error("Error submitting form:", error)
    //     }finally{
    //         setLoading(false);
    //     }
    // };

    const handleStatusChange = (newStatus, orderId) => {
        handleorderStatusChange(newStatus, orderId);
    };

    const fetchNotes = async (orderId) => {
        try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_HOST}/oldapi/woocommerce/note/getallnote`, { orderid: orderId });
            if (response.status === 200) {
                // console.log("Notes fetched successfully:", response.data.data);
                return response.data.data;
            } else {
                console.error("Error fetching notes:", response.data.message);
                return [];
            }
        } catch (error) {
            console.error("Error fetching notes:", error);
            return [];
        }
    };

    useEffect(() => {
        const fetchAllNotes = async () => {
            const notesData = {};
            for (const order of orders) {
                notesData[order.id] = await fetchNotes(order.id);
            }
            setNotesMap(notesData);
        };

        fetchAllNotes();
    }, [orders]);

    const deleteorder = async (id) => { 
        try {
            // console.log('New id:', id);
            setLoading(true);
            const response = await axios.post(`${process.env.NEXT_PUBLIC_HOST}/oldapi/woocommerce/order/deleteorder`,{id});
        //    console.log('Response:', response.data);
            if (response.data.status === 'success') {
                await fetchAllOrders();
                toast.success("Order deleted successfully!");
            } else {
                toast.error("Order not delete!");
                console.log('Error:', response.data.message);
            }
        } catch (error) {
            console.error("Error submitting form:", error)
        }finally{
            setLoading(false);
        }
    };
    const duplicateorder = async (id) => {
        try {
            // console.log('New id:', id);
            setLoading(true);
            const response = await axios.post(`${process.env.NEXT_PUBLIC_HOST}/oldapi/woocommerce/order/duplicateorder`,{id: id});
        //    console.log('Response:', response.data);
        //    console.log('Response:', response.data.data);
        //    console.log('Response:', response.data.status);
            if (response.data.status === 'success') {
                // Handle successful response (e.g., show a message or reset the form)
                await fetchAllOrders();
                toast.success("Order duplicate successfully!");
                // console.log('Role added successfully', response.data);
            } else {
                toast.error("Order not duplicate!");
                console.log('Error:', response.data.message);
            }
        } catch (error) {
            console.error("Error submitting form:", error)
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
    <Row>
        {orders.map((order) => (
         
            <Col key={order.id} md={4} sm={6} xs={12} className="mb-4">
                <Card style={{ width: "100%" }}>
                    <Card.Body style={{padding:'0px'}}>
                        <div className="d-flex align-items-center justify-content-between" style={{ paddingLeft: '15px', paddingRight: '15px',paddingTop:'15px'  }}>
                            <div>
                                <Card.Title>
                                    {order.billing?.first_name || order.billing?.last_name 
                                        ? `${order.billing?.first_name || ''} ${order.billing?.last_name || ''}`.trim() 
                                        : 'Unknown'}
                                        {/* {order.id} */}
                                </Card.Title>
                                <Card.Subtitle className="" style={{fontSize: 12,}}># {order.number}</Card.Subtitle>
                            </div>
                            <div>
                               {/* <Card.Title style={{
                                }}>
                                    {order.status === "on-hold" ? "On-hold" : order.status === "processing" ? "Processing" : order.status ===  "pending" ? "Pending" : order.status === "cancelled" ? 'Cancelled' : order.status === 'completed' ? 'Completed' : order.status === "refunded" ? 'Refunded' : order.status === 'failed' ? 'Failed' : order.status === 'trash' ? 'Trash' : order.status
                                    }
                                </Card.Title> */}
                                <select 
                                    value={order.status} 
                                    onChange={(e) => handleStatusChange(e.target.value,order.id)}
                                    style={{
                                        padding: '5px 5px',
                                        fontSize: '13px',
                                        borderRadius: '6px',
                                        border: '1px solid rgb(193, 193, 193)',
                                    }}
                                >
                                    <option value="on-hold">On-hold</option>
                                    <option value="processing">Processing</option>
                                    <option value="pending">Pending</option>
                                    <option value="cancelled">Cancelled</option>
                                    <option value="completed">Completed</option>
                                    <option value="refunded">Refunded</option>
                                    <option value="failed">Failed</option>
                                    <option value="trash">Trash</option>
                                </select>
                                 {/* <Card.Subtitle className="mb-2 text-muted">Pending Payment</Card.Subtitle> */}
                            </div>
                        </div>
                        <div className='' style={{backgroundColor:'#eceef0'}}>
                            <Card.Subtitle className="mb-3 mt-2" style={{fontSize: 12,padding:'5px 5px 5px 15px'}}>
                                {
                                  getTimeAgo(order.date_created)
                                }
                                {/* {order.date_created} */}
                            </Card.Subtitle>
                        </div>
                        {order.line_items.map((item, index) => (
                             <OrderLineItem key={index} item={item} index={index} />
                        ))}
                        {/* <div className="d-flex align-items-center justify-content-start mb-2 gap-2" style={{ paddingLeft: '15px', paddingRight: '15px'}}>
                            <div>
                                <Card.Img 
                                    variant="top" 
                                    src="/images/avatar/avatar-2.jpg?text=Image Placeholder" 
                                    style={{ height: "85px", width: "85px", objectFit: "cover" }} 
                                />
                            </div>
                            <div>
                                <Card.Subtitle className="mb-3 mt-2" style={{fontSize: 14,}}>Teseter Name Products</Card.Subtitle>
                                <Card.Subtitle className="mb-3" style={{fontSize: 12,}}>SKU: N/A 123</Card.Subtitle>
                                <Card.Subtitle className="mb-3" style={{fontSize: 12,}}>123.34 USD</Card.Subtitle>
                                <Card.Subtitle className="" style={{fontSize: 12,}}>Quantity: 1233</Card.Subtitle>
                            </div>
                        </div>      
                        <hr />
                        <div className="d-flex align-items-center justify-content-start mb-2 gap-2" style={{ paddingLeft: '15px', paddingRight: '15px' }}>
                            <div>
                                <Card.Img 
                                    variant="top" 
                                    src="/images/avatar/avatar-2.jpg?text=Image Placeholder" 
                                    style={{ height: "85px", width: "85px", objectFit: "cover" }} 
                                />
                            </div>
                            <div>
                                <Card.Subtitle className="mb-3 mt-2" style={{fontSize: 14,}}>Teseter Name Products</Card.Subtitle>
                                <Card.Subtitle className="mb-3" style={{fontSize: 12,}}>SKU: N/A 123</Card.Subtitle>
                                <Card.Subtitle className="mb-3" style={{fontSize: 12,}}>123.34 USD</Card.Subtitle>
                                <Card.Subtitle className="" style={{fontSize: 12,}}>Quantity: 1233</Card.Subtitle>
                            </div>
                        </div>       */}
                        <hr />
                        <div className="d-flex align-items-center justify-content-between" style={{ paddingLeft: '15px', paddingRight: '15px'}}>
                            <div></div>
                            <div>
                                <Card.Subtitle className="mb-1 mt-1" style={{fontSize: 13,}}>Total: {order.total} $</Card.Subtitle>
                            </div>
                        </div>
                        <div className='' style={{backgroundColor:'#eceef0'}}>
                            <Card.Subtitle className="mb-1 mt-1" style={{fontSize: 12,padding:'5px 5px 5px 15px'}}>{order.payment_method_title ? order.payment_method_title : 'No payment method specified'}</Card.Subtitle>
                        </div>
                        {/* <div className="d-flex align-items-center justify-content-between" style={{ paddingLeft: '15px', paddingRight: '15px'}}>
                            //   <Card.Text className="mb-0 me-3">type</Card.Text> 
                            //   <Card.Text className=''>product</Card.Text> 
                            <div>
                                <Card.Subtitle className="mb-3 mt-3" style={{fontSize: 13,}}>Total: 1234 USD</Card.Subtitle>
                                <Card.Subtitle className="" style={{fontSize: 13,}}>Cash On Delivery</Card.Subtitle>
                            </div>
                            <div className="">
                                //  <DropdownButton
                                //     as={ButtonGroup}
                                //     id="dropdown-button-drop-up"
                                //     drop="up"
                                //     variant=""
                                //     title={<i className="fa fa-ellipsis-h" aria-hidden="true" style={{ fontSize: '20px' }}></i>}
                                //     className="me-1 mb-2 mb-lg-0 dropup-orderaction"
                                //     style={{padding:0,border:'none',backgroundColor: 'transparent',}}
                                // >
                                //     <Dropdown.Item eventKey="1">Edit order</Dropdown.Item>
                                //     <Dropdown.Item eventKey="2">Show notes</Dropdown.Item>
                                //     <Dropdown.Item eventKey="3">Address detail</Dropdown.Item>
                                //     <Dropdown.Item eventKey="4">Custom fields</Dropdown.Item>
                                //     <Dropdown.Item eventKey="5">Share order</Dropdown.Item>
                                //     <Dropdown.Item eventKey="6">Duplicate order</Dropdown.Item>
                                //     <Dropdown.Divider />
                                //     <Dropdown.Item eventKey="7" className='text-danger'>Delete order</Dropdown.Item>
                                // </DropdownButton> 
                            </div>
                        </div> */}
                        <div className="d-flex align-items-center justify-content-between" style={{ paddingLeft: 'px', paddingRight: 'px',paddingBottom:'px' }}>
                            <div className="d-flex align-items-center justify-content-between" >
                                <OrderModelAddress order={order} />
                                <OrderModelNote order={order} setToast={setToastMessage} />
                            </div>
                            <div className="">
                                <DropdownButton
                                    as={ButtonGroup}
                                    id="dropdown-button-drop-up"
                                    drop="up"
                                    variant=""
                                    title={<i className="fa fa-ellipsis-h" aria-hidden="true" style={{ fontSize: '20px' }}></i>}
                                    className="me-1 mb-2 mb-lg-0 dropup-orderaction"
                                    style={{padding:0,border:'none',backgroundColor: 'transparent',}}
                                >
                                    <Dropdown.Item as="a" href={`/pages/order/editorder/${order.id}`}>
                                        Edit order
                                    </Dropdown.Item>
                                    <Dropdown.Item eventKey="2">
                                     <OrderAllNotes notes={notesMap[order.id] || []} />
                                    </Dropdown.Item>
                                    <Dropdown.Item eventKey="4">Custom fields</Dropdown.Item>
                                    <Dropdown.Item eventKey="6" onClick={() => duplicateorder(order.id)}>Duplicate order</Dropdown.Item>
                                    <Dropdown.Divider />
                                    <Dropdown.Item eventKey="7" className='text-danger' onClick={() => deleteorder(order.id)} >Delete order</Dropdown.Item>
                                </DropdownButton>
                            </div>
                        </div>
                        
                    {/* <Button variant="primary">View Product</Button> */}
                    </Card.Body>
                </Card>
            </Col>
        ))}
    </Row>
  )
}

export default AllOrder