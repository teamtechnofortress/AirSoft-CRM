import React, { useEffect,useState } from 'react'
import OrderLineItem from '/sub-components/order/OrderLineItem.js'
import OrderModelAddress from '/sub-components/order/OrderModelAddress.js'
import OrderAllNotes from '/sub-components/order/OrderAllNotes.js'
import OrderModelNote from '/sub-components/order/OrderModelNote.js'
import OrderAllCustomfields from '/sub-components/order/OrderAllCustomfields.js'
import { Col, Row, Card, Accordion, Nav, Tab, Tabs, Container,Button,Spinner,ListGroup,ListGroupItem,DropdownButton,ButtonGroup,Dropdown,Modal,Form} from 'react-bootstrap';
import moment from 'moment';
import ToastComponent from 'components/toastcomponent';
import { toast } from "react-toastify";
import axios from 'axios';
import Link from 'next/link';



const AllOrder = ({orders,handleorderStatusChange,fetchAllOrders,status,customerid}) => {
    const [toastMessage, setToastMessage] = useState(false);
    const [loading, setLoading] = useState(false);
    // const [modalOrderAllNotesShow, setModalOrderAllNotesShow] = React.useState(false);
    const [notesMap, setNotesMap] = useState({});
    const [searchTerm, setSearchTerm] = useState("");
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
    useEffect(()=>{
        tokedecodeapi();
    },[]);

    useEffect(() => {
      if (toastMessage == "Note added successfully!") {
          fetchAllNotes();
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

    const fetchAllNotes = async () => {
        const notesData = {};
        for (const order of orders) {
            notesData[order.id] = await fetchNotes(order.id);
        }
        setNotesMap(notesData);
    };
    // useEffect(() => {
    //     fetchAllNotes();
    // }, [orders]);

    const deleteorder = async (id) => { 
        try {
            // console.log('New id:', id);
            setLoading(true);
            const response = await axios.post(`${process.env.NEXT_PUBLIC_HOST}/oldapi/woocommerce/order/deleteorder`,{id});
        //    console.log('Response:', response.data);
            if (response.data.status === 'success') {
                // await fetchAllOrders();
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

    const filteredorders = orders.filter(order => 
        `${order.number}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
         order.line_items.some(item => item.name.toLowerCase().includes(searchTerm.toLowerCase())) ||  // Fix for line_items.name
        `${order.total}`.toLowerCase().includes(searchTerm.toLowerCase()) || 
        `${order.billing?.first_name || ''} ${order.billing?.last_name || ''}`.toLowerCase().includes(searchTerm.toLowerCase())
    );   


  if (loading) return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
          <Spinner animation="border" variant="primary" role="status">
              <span className="visually-hidden">Loading...</span>
          </Spinner>
      </div>
  );


//   {products?.filter(product => product.status === 'pending').map((product) => (


  return (
    <Row>
        {/* <Form.Group className="mb-3">
                <Form.Control 
                    type="text" 
                    placeholder="Search by order number or name or price..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
        </Form.Group> */}
    
        {/* {
            filteredorders
                .filter(order => order.customer_id === Number(customerid))
                .forEach(order => console.log(order))
        } */}


        {
            filteredorders?.length > 0 ? (
                filteredorders
                    ?.filter(order => 
                        (status === "all" || order.status === status) &&
                        (!Number(customerid) || order.customer_id === Number(customerid))
                    ).length > 0 ? (
                    filteredorders
                        .filter(order => 
                            (status === "all" || order.status === status) &&
                            (!Number(customerid) || order.customer_id === Number(customerid)) 
                        )
                        .map((order) => (
                        <Col key={order.id} md={4} sm={6} xs={12} className="mb-4">
                            <Card style={{ width: "100%" }}>
                            <Card.Body style={{ padding: "0px" }}>
                                <div className="d-flex align-items-center justify-content-between" style={{ padding: "15px" }}>
                                <div>
                                    <Card.Title>
                                    {order.billing?.first_name || order.billing?.last_name
                                        ? `${order.billing?.first_name || ""} ${order.billing?.last_name || ""}`.trim()
                                        : "Unknown"}
                                    </Card.Title>
                                    <Card.Subtitle style={{ fontSize: 12 }}># {order.number}</Card.Subtitle>
                                </div>
                                <div>
                                    <select
                                    value={order.status}
                                    onChange={(e) => handleStatusChange(e.target.value, order.id)}
                                    style={{
                                        padding: "5px",
                                        fontSize: "13px",
                                        borderRadius: "6px",
                                        border: "1px solid rgb(193, 193, 193)",
                                    }}
                                    >
                                    <option value="on-hold">On-hold</option>
                                    <option value="processing">Processing</option>
                                    <option value="pending">Pending</option>
                                    <option value="cancelled">Cancelled</option>
                                    <option value="completed">Completed</option>
                                    <option value="refunded">Refunded</option>
                                    <option value="failed">Failed</option>
                                    <option value="checkout-draft">Draft</option>
                                    </select>
                                </div>
                                </div>
            
                                <div style={{ backgroundColor: "#eceef0" }}>
                                <Card.Subtitle className="mb-3 mt-2" style={{ fontSize: 12, padding: "5px 15px" }}>
                                    {getTimeAgo(order.date_created)}
                                </Card.Subtitle>
                                </div>
            
                                {order.line_items.map((item, index) => (
                                <OrderLineItem key={index} item={item} index={index} />
                                ))}
            
                                <hr />
            
                                <div className="d-flex align-items-center justify-content-between" style={{ padding: "15px" }}>
                                <div></div>
                                <div>
                                    <Card.Subtitle className="mb-1 mt-1" style={{ fontSize: 13 }}>
                                    Total: {order.total} $
                                    </Card.Subtitle>
                                </div>
                                </div>
            
                                <div style={{ backgroundColor: "#eceef0" }}>
                                <Card.Subtitle className="mb-1 mt-1" style={{ fontSize: 12, padding: "5px 15px" }}>
                                    {order.payment_method_title ? order.payment_method_title : "No payment method specified"}
                                </Card.Subtitle>
                                </div>
            
                                <div className="d-flex align-items-center justify-content-between">
                                <div className="d-flex align-items-center">
                                    <OrderModelAddress order={order} />
                                    <OrderModelNote order={order} setToast={setToastMessage} />
                                </div>
            
                                <div>
                                    <DropdownButton
                                    as={ButtonGroup}
                                    id="dropdown-button-drop-up"
                                    drop="up"
                                    variant=""
                                    title={<i className="fa fa-ellipsis-h" aria-hidden="true" style={{ fontSize: "20px" }}></i>}
                                    className="me-1 mb-2 mb-lg-0 dropup-orderaction"
                                    style={{ padding: 0, border: "none", backgroundColor: "transparent" }}
                                    >
                                    {permissionList.includes("67b46cd67b14d62c9c5850eb") && (
                                        <Dropdown.Item as="a" href={`/pages/order/editorder/${order.id}`}>
                                        Edit order
                                        </Dropdown.Item>
                                    )}
                                    <Dropdown.Item eventKey="2">
                                        <OrderAllNotes notes={notesMap[order.id] || []} />
                                    </Dropdown.Item>
                                    <Dropdown.Item eventKey="4">
                                        <OrderAllCustomfields fields={order.meta_data || []} />
                                    </Dropdown.Item>
                                    <Dropdown.Item eventKey="6" onClick={() => duplicateorder(order.id)}>
                                        Duplicate order
                                    </Dropdown.Item>
                                    {permissionList.includes("67b46ce07b14d62c9c5850ed") && (
                                        <>
                                        <Dropdown.Divider />
                                        <Dropdown.Item eventKey="7" className="text-danger" onClick={() => deleteorder(order.id)}>
                                            Delete order
                                        </Dropdown.Item>
                                        </>
                                    )}
                                    </DropdownButton>
                                </div>
                                </div>
                            </Card.Body>
                            </Card>
                        </Col>
                        ))
                    ) : (
                    <p className="text-center">No order found.</p>
                    )
                ) : (
                    <p className="text-center">No order found.</p>
                )
            
        }

    </Row>
  )
}

export default AllOrder