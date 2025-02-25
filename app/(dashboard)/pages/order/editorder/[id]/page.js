'use client'
// import node module libraries
import React,{useState,useEffect} from 'react'
import useMounted from 'hooks/useMounted';
import axios from 'axios';
import ToastComponent from 'components/toastcomponent';
import { toast } from "react-toastify";
import { Col, Row, Form, Card, Button, Image,Container,Tab,Tabs,Nav,DropdownButton,ButtonGroup,Dropdown,Spinner } from 'react-bootstrap';
import ExistingCustomerOrOrder from '/sub-components/order/addorder/Existing-customer-or-order.js'
import ProductsModel from '/sub-components/order/addorder/productsmodel.js'
import ShippingAddress from '/sub-components/order/addorder/shippingaddress.js'
import Link from 'next/link';



const EditOrder = ({params}) => {
  const { id } = params;

  // console.log(id);
  const hasMounted = useMounted();

  const [selectedProducts, setSelectedProducts] = useState([]);
  const [cart, setCart] = useState([]);
  // console.log("Selected product:",selectedProducts);
  // console.log("Selected cart:",cart);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [customers, setCustomers] = useState([]);
  const [orders, setOrder] = useState([]);
  const [paymentgateways, setPaymentgateway] = useState([]);
  const [shippingmethods, setShippingmethods] = useState([]);
  const [isShippingEnabled, setIsShippingEnabled] = useState(true);
  const [productIds, setProductIds] = useState([]);
  const [fetchedproduct, setFetchedproduct] = useState([]);

  // console.log("customers",customers);
  // console.log("orders",orders);

  // console.log("paymentgateways",paymentgateways);
  // console.log("setShippingmethods",setShippingmethods);

  // console.log("paymentgateways",paymentgateways);
  // console.log("shippingmethods",shippingmethods);

 

  const [orderData, setOrderData] = useState({
        orderstatus: '',
        paymentmethodtitle: '',
        paymentmethodid: '',
        shippingmethodid: '',
        shippingmethodtitle: '',
  });

  const [shippingData, setShippingData] = useState({
        shippingfirstname: '',
        shippinglastname: '',
        shippingemail: '',
        shippingcountry: '',
        shippingprovince: '',
        shippingphone: '',
        shippingcity: '',
        shippingzipcode: '',
        shippingfulladdress: '',
  });
  const [formData, setFormData] = useState({
        firstname: '',
        lastname: '',
        email: '',
        country: '',
        province: '',
        phone: '',
        city: '',
        zipcode: '',
        fulladdress: '',
  });

  const fetchorder = async (orderid) => {
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_HOST}/oldapi/woocommerce/order/getsingelorder`,{id:orderid});
      // console.log(response.status);
      setFetchedproduct(response.data.data);
      if (response.status === 200 && response.data) {
          // console.log('api response:',response.data);


          // const fetchedProductIds = response.data.data.line_items.map(item => item.product_id); 

          // setProductIds(fetchedProductIds);

          const fetchedProductIds = response.data.data.line_items.map(item => ({
            product_id: item.product_id,
            quantity: item.quantity
          }));
          // console.log('fetchedProductIds line 89:',fetchedProductIds.product_id);

          setProductIds(fetchedProductIds);

          // console.log('fetchedProductIds line 89:',fetchedProductIds);


          setOrderData({
            orderstatus: response.data.data.status || 'pending',
            paymentmethodtitle:response.data.data.payment_method_title || '',
            paymentmethodid:response.data.data.payment_method || '',
            shippingmethodid: response.data.data.shipping_lines?.[0]?.method_id || "",
            shippingmethodtitle: response.data.data.shipping_lines?.[0]?.method_title || "",
          });
          setShippingData({
            shippingfirstname: response.data.data.shipping.first_name || '',
            shippinglastname: response.data.data.shipping.last_name || '',
            shippingcountry: response.data.data.shipping.country || '',
            shippingprovince: response.data.data.shipping.state || '',
            shippingphone: response.data.data.shipping.phone || '',
            shippingcity: response.data.data.shipping.city || '',
            shippingzipcode: response.data.data.shipping.postcode || '',
            shippingfulladdress: `${response.data.data.shipping.address_1 || ''}, ${response.data.data.shipping.address_2 || ''}`,
          });
          setFormData({
            firstname:response.data.data.billing.first_name || '',
            lastname: response.data.data.billing.last_name || '',
            email: response.data.data.billing.email || '',
            country: response.data.data.billing.country || '',
            province: response.data.data.billing.state || '',
            phone: response.data.data.billing.phone || '',
            city: response.data.data.billing.city || '',
            zipcode: response.data.data.billing.postcode || '',
            fulladdress:`${response.data.data.billing.address_1 || ''}, ${response.data.data.billing.address_2 || ''}`,
          });
      } else {
        console.error("Unexpected API Response:", response.data);
      }
    } catch (error) {
      console.error("Error fetching data:", error.message);
    } finally {
      // setLoading(false);
    }
  };

  useEffect(() => {
    // console.log("Shipping Data:", orderData);
    // console.log("fetchedproduct Data:", fetchedproduct);
  }, [orderData,fetchedproduct]);
  

  // console.log("Updated formData:", formData);

  const fetchAllCustomer = async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_HOST}/oldapi/woocommerce/customer/getallcustomer`);
      if (response.data && response.data.data) {
        setCustomers(response.data.data);
      } else {
        console.error("Unexpected API Response:", response.data);
      }
    } catch (error) {
      console.error("Error fetching data:", error.message);
    } finally {
      // setLoading(false);
    }
  };
  const fetchAllPaymentgateway = async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_HOST}/oldapi/woocommerce/paymentgateway/getallpaymentgateway`);
      if (response.data && response.data.data) {
        setPaymentgateway(response.data.data);
      } else {
        console.error("Unexpected API Response:", response.data);
      }
    } catch (error) {
      console.error("Error fetching data:", error.message);
    } finally {
      // setLoading(false);
    }
  };
  const fetchAllShippingmethods = async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_HOST}/oldapi/woocommerce/shippingmethods/getallshippingmethods`);
      if (response.data && response.data.data) {
        // console.log(response.data.data);
        setShippingmethods(response.data.data);
      } else {
        console.error("Unexpected API Response:", response.data);
      }
    } catch (error) {
      console.error("Error fetching data:", error.message);
    } finally {
      // setLoading(false);
    }
  };

  const fetchAllOrder = async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_HOST}/oldapi/woocommerce/order/getallorder`);
      if (response.data && response.data.data) {
        setOrder(response.data.data);
      } else {
        console.error("Unexpected API Response:", response.data);
      }
    } catch (error) {
      console.error("Error fetching data:", error.message);
    } finally {
      // setLoading(false);
    }
  };

  // const runallfuntion = async () => {
  //   try {
  //     await fetchorder(id);
  //     await fetchAllCustomer();
  //     await fetchAllOrder();
  //     await fetchAllPaymentgateway();
  //     await fetchAllShippingmethods();
  //   } catch (error) {
  //     console.error("Error fetching data:", error.message);
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  
  // useEffect(() => {
  //   setLoading(true);
  //   runallfuntion();
  //   setLoading(false);
  // }, [id]);







  const runallfuntion = async () => {
    try {
      setLoading(true);
      await Promise.all([
        fetchorder(id),
        fetchAllCustomer(),
        fetchAllOrder(),
        fetchAllPaymentgateway(),
        fetchAllShippingmethods(),
      ]);
  
      // console.log("All API calls completed successfully.");
    } catch (error) {
      console.error("Error fetching data:", error.message);
    } finally {
      setLoading(false);
    }
  };
  
  // Call function when the component loads or `id` changes
  useEffect(() => {
    runallfuntion();
  }, [id]);
  

  // useEffect(() => {
   

  //   setCart(selectedProducts.map(product => ({
  //     id: product.id,
  //     quantity: productInCart ? productInCart.quantity : 1, // Default quantity set to 1
  //     price: product.price
  //   })));
    
  //   console.log("Selected product:",selectedProducts);
  //   console.log("Selected cart:",cart);
  //   console.log("Selected cart:",productIds);

  // }, [selectedProducts]);

  useEffect(() => {
    setCart(
      selectedProducts.map(product => {
        const productInCart = productIds.find(item => item.product_id === product.id);
        // console.log(product.id);
        // console.log(product.product_id);
        return {
          id: product.id,
          quantity: productInCart ? productInCart.quantity : 1, // Default quantity is 1 if not found
          price: product.price
        };
      })
    );
    //    console.log("Selected product:",selectedProducts);
    // console.log("Selected cart:",cart);
    // console.log("Selected cart:",productIds);
  }, [selectedProducts, productIds]);
  


  // useEffect(() => {
  //   console.log("Updated formData:", formData);
    // console.log("Updated orderData:", shippingData);
  // }, [formData,orderData]);
  





  // const emptylineitems = async () =>{

  //   console.log('fetchedproduct line 275:', fetchedproduct?.line_items);

  //   const Data = {
  //     // total:0,
  //     line_items: fetchedproduct?.line_items?.map((item) => ({
  //       id: item.id,
  //       quantity: 0,
  //     })) || [], 
  //     shipping_lines:[],
  //   };
    
    
  //   console.log('fetchedproduct line 282:', Data);
  //   // return;


  //   try {
  //     // const response = await axios.post(`${process.env.NEXT_PUBLIC_HOST}/oldapi/woocommerce/order/updateorder`, Data,id);
  //     const response = await axios.post(
  //         `${process.env.NEXT_PUBLIC_HOST}/oldapi/woocommerce/order/updateorder`, 
  //         { Data, id } 
  //     );
  //   console.log('fetchedproduct line 282:', response.data);
  //   console.log('fetchedproduct line 282:', response.data.data);


  //     if (response.data.status === "success") {
  //         // Handle successful response (e.g., show a message or reset the form)
  //         // toast.success("Order updated successfully!");
  //         return;
  //         // console.log('Role added successfully', response.data);
  //     } else {
  //         console.log('Error:', response.data.message);
  //     }
  // } catch (error) {
  //   console.error("Error submitting form:", error)
  // }

  // }

  const handleChange = (event) => {
    const { name, value } = event.target;
    // console.log(`${name}: ${value}`);
    if (name === "paymentmethod") {
      const [id, title] = value.split("|"); // Extract ID and Title
      setOrderData((prevData) => ({
        ...prevData,
        paymentmethodid: id, // Set ID separately
        paymentmethodtitle: title, // Set Title separately
      }));
    } else if (name === "shippingmethod") {
      const [id, title] = value.split("|"); // Extract ID and Title
      setOrderData((prevData) => ({
        ...prevData,
        shippingmethodid: id,
        shippingmethodtitle: title, 
      }));
    } else if (name === "orderstatus") {
      setOrderData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    } else if (name === "shippingfirstname" || name === "shippinglastname" || name === "shippingcountry" || name === "shippingprovince" || name === "shippingcity" || name === "shippingzipcode" || name === "shippingfulladdress" || name === "shippingphone") {
      setShippingData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (event) => {  
    event.preventDefault();
    // console.log("formData at submit:", formData);
    // console.log("formData at submit:", cart);
    // console.log("formData at submit:", fetchedproduct);
    
    // Create API payload
    if (!cart || cart.length === 0) {
      alert("Your cart is empty. Please add items before proceeding.");
      return; // Stop execution
    }
    setSubmitting(true);

    // emptylineitems();


    // const Data = {
    //   payment_method: orderData.paymentmethodid || fetchedproduct.payment_method,
    //   payment_method_title: orderData.paymentmethodtitle || fetchedproduct.payment_method_title, 
    //   set_paid: false,
    //   // total:cart.reduce(
    //   //     (sum, item) => sum + item.quantity * parseFloat(item.price),
    //   //     0
    //   //   ),
    //   billing: {
    //     first_name: formData.firstname || "",
    //     last_name: formData.lastname || "",
    //     address_1: formData.fulladdress?.split(",")[0] || "",
    //     address_2: formData.fulladdress?.split(",").slice(1).join(", ") || "",
    //     city: formData.city || "",
    //     state: formData.province || "",
    //     postcode: formData.zipcode || "",
    //     country: formData.country || "",
    //     email: formData.email || "",
    //     phone: formData.phone || "",
    //   },
    //   shipping: {
    //     first_name: isShippingEnabled ? formData.firstname : shippingData.shippingfirstname,
    //     last_name: isShippingEnabled ? formData.lastname : shippingData.shippinglastname,
    //     address_1: isShippingEnabled 
    //         ? formData.fulladdress?.split(",")[0] || "" 
    //         : shippingData.shippingfulladdress?.split(",")[0] || "",
    //     address_2: isShippingEnabled 
    //         ? formData.fulladdress?.split(",").slice(1).join(", ") || "" 
    //         : shippingData.shippingfulladdress?.split(",").slice(1).join(", ") || "",
    //     city: isShippingEnabled ? formData.city : shippingData.shippingcity,
    //     state: isShippingEnabled ? formData.province : shippingData.shippingprovince,
    //     postcode: isShippingEnabled ? formData.zipcode : shippingData.shippingzipcode,
    //     country: isShippingEnabled ? formData.country : shippingData.shippingcountry,
    //   },
    //   line_items: cart.map((item) => ({
    //     product_id: item.id,
    //     quantity: item.quantity,
    //   })),
    //   shipping_lines: fetchedproduct?.shipping_lines?.map((line) => ({
    //     id: line.id, // Preserve existing ID
    //     method_id: orderData.shippingmethodid?.toLowerCase().replace(/\s+/g, "_") || "free_shipping",
    //     method_title: orderData.shippingmethodtitle || "Free Shipping",
    //   })) || [],
    //   // total_price: cart.reduce(
    //   //   (sum, item) => sum + item.quantity * parseFloat(item.price),
    //   //   0
    //   // ),
    //   // total_quantity: cart.reduce((sum, item) => sum + item.quantity, 0),
    // };

    // const Data = {
    //   payment_method: orderData.paymentmethodid || fetchedproduct?.payment_method || "",
    //   payment_method_title: orderData.paymentmethodtitle || fetchedproduct?.payment_method_title || "",
    //   set_paid: fetchedproduct?.set_paid || false,
    
    //   billing: {
    //     first_name: formData.firstname || fetchedproduct?.billing?.first_name || "",
    //     last_name: formData.lastname || fetchedproduct?.billing?.last_name || "",
    //     address_1: formData.fulladdress?.split(",")[0] || fetchedproduct?.billing?.address_1 || "",
    //     address_2: formData.fulladdress?.split(",").slice(1).join(", ") || fetchedproduct?.billing?.address_2 || "",
    //     city: formData.city || fetchedproduct?.billing?.city || "",
    //     state: formData.province || fetchedproduct?.billing?.state || "",
    //     postcode: formData.zipcode || fetchedproduct?.billing?.postcode || "",
    //     country: formData.country || fetchedproduct?.billing?.country || "",
    //     email: formData.email || fetchedproduct?.billing?.email || "",
    //     phone: formData.phone || fetchedproduct?.billing?.phone || "",
    //   },
    
    //   shipping: {
    //     first_name: isShippingEnabled ? formData.firstname : fetchedproduct?.shipping?.first_name || "",
    //     last_name: isShippingEnabled ? formData.lastname : fetchedproduct?.shipping?.last_name || "",
    //     address_1: isShippingEnabled
    //       ? formData.fulladdress?.split(",")[0] || ""
    //       : fetchedproduct?.shipping?.address_1 || "",
    //     address_2: isShippingEnabled
    //       ? formData.fulladdress?.split(",").slice(1).join(", ") || ""
    //       : fetchedproduct?.shipping?.address_2 || "",
    //     city: isShippingEnabled ? formData.city : fetchedproduct?.shipping?.city || "",
    //     state: isShippingEnabled ? formData.province : fetchedproduct?.shipping?.state || "",
    //     postcode: isShippingEnabled ? formData.zipcode : fetchedproduct?.shipping?.postcode || "",
    //     country: isShippingEnabled ? formData.country : fetchedproduct?.shipping?.country || "",
    //   },
    
    //   // ✅ Ensure price and total calculation is correct
    //   line_items: [
    //     ...fetchedproduct?.line_items?.map(existingItem => {
    //       const updatedItem = cart.find(cartItem => cartItem.id === existingItem.product_id);
    //       if (updatedItem) {
    //         return { 
    //           id: existingItem.id, // Keep WooCommerce order line item ID
    //           product_id: existingItem.product_id,
    //           quantity: updatedItem.quantity,
    //           variation_id: existingItem.variation_id || 0,
    //           price: existingItem.price, // ✅ Keep original price
    //           subtotal: (existingItem.price * updatedItem.quantity).toFixed(2), // ✅ Ensure correct subtotal
    //           total: (existingItem.price * updatedItem.quantity).toFixed(2), // ✅ Ensure correct total
    //         };
    //       }
    //       return existingItem; // Keep original if not updated
    //     }).filter(item => item.quantity > 0), // Prevent items with quantity 0
    
    //     // Add new products that aren't in `fetchedproduct.line_items`
    //     ...cart.filter(cartItem => !fetchedproduct?.line_items?.some(existingItem => existingItem.product_id === cartItem.id))
    //       .map(newItem => ({
    //         product_id: newItem.id,
    //         quantity: newItem.quantity,
    //         variation_id: newItem.variation_id || 0,
    //         price: newItem.price, // ✅ Ensure correct price is sent for new products
    //         subtotal: (newItem.price * newItem.quantity).toFixed(2), // ✅ Ensure correct subtotal
    //         total: (newItem.price * newItem.quantity).toFixed(2), // ✅ Ensure correct total
    //       }))
    //   ],
    
    //   // ✅ Preserve shipping methods safely
    //   shipping_lines: fetchedproduct?.shipping_lines?.map(line => ({
    //     id: line.id, // Preserve existing ID
    //     method_id: orderData.shippingmethodid?.toLowerCase().replace(/\s+/g, "_") || line.method_id || "free_shipping",
    //     method_title: orderData.shippingmethodtitle || line.method_title || "Free Shipping",
    //   })) || [],
    
    //   // ✅ Preserve order status
    //   status: fetchedproduct?.status || "pending",
    // };
    
    const Data = {
      payment_method: orderData.paymentmethodid || fetchedproduct?.payment_method || "",
      payment_method_title: orderData.paymentmethodtitle || fetchedproduct?.payment_method_title || "",
      set_paid: fetchedproduct?.set_paid || false,
    
      billing: {
        first_name: formData.firstname || fetchedproduct?.billing?.first_name || "",
        last_name: formData.lastname || fetchedproduct?.billing?.last_name || "",
        address_1: formData.fulladdress?.split(",")[0] || fetchedproduct?.billing?.address_1 || "",
        address_2: formData.fulladdress?.split(",").slice(1).join(", ") || fetchedproduct?.billing?.address_2 || "",
        city: formData.city || fetchedproduct?.billing?.city || "",
        state: formData.province || fetchedproduct?.billing?.state || "",
        postcode: formData.zipcode || fetchedproduct?.billing?.postcode || "",
        country: formData.country || fetchedproduct?.billing?.country || "",
        email: formData.email || fetchedproduct?.billing?.email || "",
        phone: formData.phone || fetchedproduct?.billing?.phone || "",
      },
    
      shipping: {
        first_name: isShippingEnabled ? formData.firstname : fetchedproduct?.shipping?.first_name || "",
        last_name: isShippingEnabled ? formData.lastname : fetchedproduct?.shipping?.last_name || "",
        address_1: isShippingEnabled
          ? formData.fulladdress?.split(",")[0] || ""
          : fetchedproduct?.shipping?.address_1 || "",
        address_2: isShippingEnabled
          ? formData.fulladdress?.split(",").slice(1).join(", ") || ""
          : fetchedproduct?.shipping?.address_2 || "",
        city: isShippingEnabled ? formData.city : fetchedproduct?.shipping?.city || "",
        state: isShippingEnabled ? formData.province : fetchedproduct?.shipping?.state || "",
        postcode: isShippingEnabled ? formData.zipcode : fetchedproduct?.shipping?.postcode || "",
        country: isShippingEnabled ? formData.country : fetchedproduct?.shipping?.country || "",
      },
    
      line_items: [
        // Update existing products (if found in cart)
        ...fetchedproduct?.line_items?.map(existingItem => {
          const updatedItem = cart.find(cartItem => cartItem.id === existingItem.product_id);
          if (updatedItem) {
            return { 
              id: existingItem.id, 
              product_id: existingItem.product_id,
              quantity: updatedItem.quantity,
              variation_id: existingItem.variation_id || 0,
              price: existingItem.price, 
              subtotal: (existingItem.price * updatedItem.quantity).toFixed(2), 
              total: (existingItem.price * updatedItem.quantity).toFixed(2), 
            };
          }
          // If product is missing in `cart`, set `quantity: 0` to remove it
          return { 
            id: existingItem.id,
            product_id: existingItem.product_id,
            quantity: 0 
          };
        }),
    
        // Add new products that aren't in `fetchedproduct.line_items`
        ...cart.filter(cartItem => !fetchedproduct?.line_items?.some(existingItem => existingItem.product_id === cartItem.id))
          .map(newItem => ({
            product_id: newItem.id,
            quantity: newItem.quantity,
            variation_id: newItem.variation_id || 0,
            price: newItem.price,
            subtotal: (newItem.price * newItem.quantity).toFixed(2), 
            total: (newItem.price * newItem.quantity).toFixed(2), 
          }))
      ],
    
      //Preserve shipping methods safely
      shipping_lines: fetchedproduct?.shipping_lines?.map(line => ({
        id: line.id, 
        method_id: orderData.shippingmethodid?.toLowerCase().replace(/\s+/g, "_") || line.method_id || "free_shipping",
        method_title: orderData.shippingmethodtitle || line.method_title || "Free Shipping",
      })) || [],
    
      status: fetchedproduct?.status || "pending",
    };
    
    // console.log("Data:", Data);
    // setSubmitting(false);
    // return;

    try {
      // const response = await axios.post(`${process.env.NEXT_PUBLIC_HOST}/oldapi/woocommerce/order/updateorder`, Data,id);
      const response = await axios.post(
          `${process.env.NEXT_PUBLIC_HOST}/oldapi/woocommerce/order/updateorder`, 
          { Data, id } 
      );

      if (response.data.status === "success") {

          // Handle successful response (e.g., show a message or reset the form)
          toast.success("Order updated successfully!");
          // console.log('Role added successfully', response.data);
          setSubmitting(false);


      } else {
          toast.error("Order Not updated!");
          console.log('Error:', response.data.message);
      }
  } catch (error) {
    console.error("Error submitting form:", error)
  }finally{
    setSubmitting(false);
  }
  // console.log("Order Data:", Data);
  }

  const countries = [
    { code: "AF", name: "Afghanistan" },
    { code: "AL", name: "Albania" },
    { code: "DZ", name: "Algeria" },
    { code: "AD", name: "Andorra" },
    { code: "AO", name: "Angola" },
    { code: "AR", name: "Argentina" },
    { code: "AM", name: "Armenia" },
    { code: "AU", name: "Australia" },
    { code: "AT", name: "Austria" },
    { code: "AZ", name: "Azerbaijan" },
    { code: "BH", name: "Bahrain" },
    { code: "BD", name: "Bangladesh" },
    { code: "BY", name: "Belarus" },
    { code: "BE", name: "Belgium" },
    { code: "BZ", name: "Belize" },
    { code: "BJ", name: "Benin" },
    { code: "BT", name: "Bhutan" },
    { code: "BO", name: "Bolivia" },
    { code: "BA", name: "Bosnia and Herzegovina" },
    { code: "BW", name: "Botswana" },
    { code: "BR", name: "Brazil" },
    { code: "BN", name: "Brunei" },
    { code: "BG", name: "Bulgaria" },
    { code: "BF", name: "Burkina Faso" },
    { code: "BI", name: "Burundi" },
    { code: "KH", name: "Cambodia" },
    { code: "CM", name: "Cameroon" },
    { code: "CA", name: "Canada" },
    { code: "CV", name: "Cape Verde" },
    { code: "CF", name: "Central African Republic" },
    { code: "TD", name: "Chad" },
    { code: "CL", name: "Chile" },
    { code: "CN", name: "China" },
    { code: "CO", name: "Colombia" },
    { code: "KM", name: "Comoros" },
    { code: "CG", name: "Congo" },
    { code: "CD", name: "Congo (Democratic Republic)" },
    { code: "CR", name: "Costa Rica" },
    { code: "HR", name: "Croatia" },
    { code: "CU", name: "Cuba" },
    { code: "CY", name: "Cyprus" },
    { code: "CZ", name: "Czech Republic" },
    { code: "DK", name: "Denmark" },
    { code: "DJ", name: "Djibouti" },
    { code: "DO", name: "Dominican Republic" },
    { code: "EC", name: "Ecuador" },
    { code: "EG", name: "Egypt" },
    { code: "SV", name: "El Salvador" },
    { code: "GQ", name: "Equatorial Guinea" },
    { code: "ER", name: "Eritrea" },
    { code: "EE", name: "Estonia" },
    { code: "ET", name: "Ethiopia" },
    { code: "FI", name: "Finland" },
    { code: "FR", name: "France" },
    { code: "GA", name: "Gabon" },
    { code: "GM", name: "Gambia" },
    { code: "GE", name: "Georgia" },
    { code: "DE", name: "Germany" },
    { code: "GH", name: "Ghana" },
    { code: "GR", name: "Greece" },
    { code: "GT", name: "Guatemala" },
    { code: "GN", name: "Guinea" },
    { code: "GY", name: "Guyana" },
    { code: "HT", name: "Haiti" },
    { code: "HN", name: "Honduras" },
    { code: "HU", name: "Hungary" },
    { code: "IS", name: "Iceland" },
    { code: "IN", name: "India" },
    { code: "ID", name: "Indonesia" },
    { code: "IR", name: "Iran" },
    { code: "IQ", name: "Iraq" },
    { code: "IE", name: "Ireland" },
    { code: "IL", name: "Israel" },
    { code: "IT", name: "Italy" },
    { code: "JP", name: "Japan" },
    { code: "JO", name: "Jordan" },
    { code: "KZ", name: "Kazakhstan" },
    { code: "KE", name: "Kenya" },
    { code: "KP", name: "North Korea" },
    { code: "KR", name: "South Korea" },
    { code: "KW", name: "Kuwait" },
    { code: "LA", name: "Laos" },
    { code: "LV", name: "Latvia" },
    { code: "LB", name: "Lebanon" },
    { code: "LY", name: "Libya" },
    { code: "LT", name: "Lithuania" },
    { code: "LU", name: "Luxembourg" },
    { code: "MG", name: "Madagascar" },
    { code: "MY", name: "Malaysia" },
    { code: "MV", name: "Maldives" },
    { code: "ML", name: "Mali" },
    { code: "MT", name: "Malta" },
    { code: "MX", name: "Mexico" },
    { code: "MD", name: "Moldova" },
    { code: "MN", name: "Mongolia" },
    { code: "ME", name: "Montenegro" },
    { code: "MA", name: "Morocco" },
    { code: "MZ", name: "Mozambique" },
    { code: "MM", name: "Myanmar" },
    { code: "NP", name: "Nepal" },
    { code: "NL", name: "Netherlands" },
    { code: "NZ", name: "New Zealand" },
    { code: "NI", name: "Nicaragua" },
    { code: "NG", name: "Nigeria" },
    { code: "NO", name: "Norway" },
    { code: "OM", name: "Oman" },
    { code: "PK", name: "Pakistan" },
    { code: "PA", name: "Panama" },
    { code: "PE", name: "Peru" },
    { code: "PH", name: "Philippines" },
    { code: "PL", name: "Poland" },
    { code: "PT", name: "Portugal" },
    { code: "QA", name: "Qatar" },
    { code: "RO", name: "Romania" },
    { code: "RU", name: "Russia" },
    { code: "SA", name: "Saudi Arabia" },
    { code: "SN", name: "Senegal" },
    { code: "RS", name: "Serbia" },
    { code: "SG", name: "Singapore" },
    { code: "ZA", name: "South Africa" },
    { code: "ES", name: "Spain" },
    { code: "SE", name: "Sweden" },
    { code: "CH", name: "Switzerland" },
    { code: "TH", name: "Thailand" },
    { code: "TN", name: "Tunisia" },
    { code: "TR", name: "Turkey" },
    { code: "UA", name: "Ukraine" },
    { code: "AE", name: "United Arab Emirates" },
    { code: "GB", name: "United Kingdom" },
    { code: "US", name: "United States" },
    { code: "VN", name: "Vietnam" },
    { code: "ZW", name: "Zimbabwe" }
  ];

  const removeproduct = (productId) => {
    // Remove from selectedProducts
    setSelectedProducts((prevSelected) => 
      prevSelected.filter((product) => product.id !== productId)
    );
  
    // Remove from cart
    setCart((prevCart) => 
      prevCart.filter((item) => item.id !== productId)
    );
  };
    
  // Function to handle quantity updates
  const updateQuantity = (productId, productPrice, change) => {
      setCart((prevCart) => {
        const existingProduct = prevCart.find((item) => item.id === productId);

        if (existingProduct) {
          // Update existing product quantity
          return prevCart.map((item) =>
            item.id === productId
              ? { ...item, quantity: Math.max(1, item.quantity + change) }
              : item
          );
        } else {
          // Add new product to cart
          return [...prevCart, { id: productId, quantity: Math.max(1, change), price: productPrice }];
        }
      });
  };

  // Calculate total quantity and price
  const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce((sum, item) => sum + item.quantity * item.price, 0);

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
                    <h4 className="mb-1">Order information</h4>
                  </div>
                  {hasMounted && 
                  <Form method="POST" onSubmit={handleSubmit}>
                    {/* row */}
                    {/* <Row className="mb-3">
                       <Form.Label className="col-sm-4 col-form-label form-label" htmlFor="orderstatus">Order Status</Form.Label>
                      <Col md={8} xs={12}>
                        <Form.Select id='orderstatus' name='orderstatus' value={orderData.orderstatus} onChange={handleChange} required>
                            <option value="" disabled hidden>Choose...</option>
                            <option value="pending">Pending payment</option>
                            <option value="processing">Processing</option>
                            <option value="on-hold">On hold</option>
                            <option value="completed">Completed</option>
                            <option value="cancelled">Cancelled</option>
                            <option value="refunded">Refunded</option>
                            <option value="failed">Failed</option>
                            <option value="trash">Draft</option>
                        </Form.Select>
                      </Col>
                    </Row> */}
                    <Row className="mb-3">
                       <Form.Label className="col-sm-4 col-form-label form-label" htmlFor="shippingmethod">Shipping Method</Form.Label>
                      <Col md={8} xs={12}>
                        <Form.Select id='shippingmethod' name='shippingmethod'
                               value={orderData.shippingmethodid && orderData.shippingmethodtitle ? `${orderData.shippingmethodid}|${orderData.shippingmethodtitle}` : ""} 
                               onChange={handleChange} required>
                            <option value="" disabled hidden>Choose...</option>
                            {shippingmethods
                            .map((shippingmethod) => (
                              <option key={shippingmethod.id} value={`${shippingmethod.id}|${shippingmethod.title}`}>
                                {shippingmethod.title}
                              </option>
                          ))}
                            
                        </Form.Select>
                      </Col>
                    </Row>
                    <Row className="mb-3">
                       <Form.Label className="col-sm-4 col-form-label form-label" htmlFor="paymentmethod">Payment Method</Form.Label>
                      <Col md={8} xs={12}>
                      <Form.Select 
                        id="paymentmethod" 
                        name="paymentmethod" 
                        value={orderData.paymentmethodid && orderData.paymentmethodtitle ? `${orderData.paymentmethodid}|${orderData.paymentmethodtitle}` : ""} 
                        onChange={handleChange} 
                        required
                      >
                        <option value="" disabled hidden>Choose...</option> {/* Now this works correctly */}
                        {paymentgateways
                          .filter((paymentmethod) => paymentmethod.enabled)
                          .map((paymentmethod) => (
                            <option key={paymentmethod.id} value={`${paymentmethod.id}|${paymentmethod.title}`}>
                              {paymentmethod.title}
                            </option>
                          ))}
                      </Form.Select>
                      </Col>
                    </Row>
                    <Row className="mb-3 d-flex align-items-center justify-content-start">
                      <Col md={4} xs={12}>
                           <h5 className="mb-3 mt-2">Product items</h5>
                      </Col>
                      <Col md={4} xs={12}>
                        <ProductsModel setSelectedProducts={setSelectedProducts} selectedProducts={selectedProducts}  productIds={productIds} />
                      </Col>
                    </Row>
                    { selectedProducts.length > 0 && (
                      <Row className="mb-3 d-flex align-items-center justify-content-start">
                        <Col md={4} xs={12}>
                            <h5 className="mb-3 mt-2"></h5>
                        </Col>
                        <Col md={8} xs={12}>
                          <Card style={{ width: "100%" }}>
                            <Card.Body style={{padding:'0px'}}>
                                <div className="d-flex align-items-center justify-content-between" style={{ paddingLeft: '15px', paddingRight: '15px',paddingTop:'15px'  }}>
                                    <div>
                                        <Card.Title>
                                            Product
                                        </Card.Title>
                                        {/* <Card.Subtitle className="" style={{fontSize: 12,}}># {'1233'}</Card.Subtitle> */}
                                    </div>
                                    <div>
                                      <Card.Title style={{
                                        }}>
                                            {/* {"on-hold" } */}
                                        </Card.Title>
                                    </div>
                                </div>
                                <div className='' style={{backgroundColor:'#eceef0'}}>
                                    {/* <Card.Subtitle className="mb-3 mt-2" style={{fontSize: 12,padding:'5px 5px 5px 15px'}}>
                                        {
                                          "time"
                                        }
                                    </Card.Subtitle> */}
                                </div>
                                <hr/>
                                {selectedProducts.map((product, index) => {
                                  const cartItem = cart.find((item) => item.id === product.id) || { quantity: 0 };
                              
                                  return(
                                  <div key={index} className="d-flex align-items-center justify-content-between mb-2 gap-2" style={{ paddingLeft: '15px', paddingRight: '15px' }}>
                                    <div className='d-flex align-items-center justify-content-start gap-2'>
                                      <div>
                                        <i className="fas fa-times" onClick={() => removeproduct(product.id)} style={{ cursor: "pointer" }}></i>
                                      </div>
                                      <div className='d-flex align-items-center justify-content-start gap-2'>
                                        <div>
                                          {/* Dynamically set image source */}
                                          {/* <Card.Img
                                            variant="top"
                                            src={'/images/avatar/avatar-2.jpg'} // Use item image if available
                                            alt={"Product Image"}
                                          /> */}
                                          <Card.Img 
                                            variant="top" 
                                            src={product.images.length > 0 ? product.images[0].src : "https://via.placeholder.com/150"} 
                                            alt={product.images.length > 0 ? product.images[0].alt : "Product Image"} 
                                            style={{ height: '85px', width: '85px', objectFit: 'cover' }}
                                          />
                                        </div>
                                        <div>
                                          <Card.Subtitle className="mb-3 mt-2" style={{ fontSize: 14 }}>
                                            {product.name || "Unknown"}
                                          </Card.Subtitle>
                                    
                                          <Card.Subtitle className="mb-3" style={{ fontSize: 12 }}>
                                            SKU: {product.sku || "N/A"}
                                          </Card.Subtitle>
                                    
                                          <Card.Subtitle className="mb-3" style={{ fontSize: 12 }}>
                                            {product.price} USD
                                          </Card.Subtitle>
                                    
                                          <Card.Subtitle style={{ fontSize: 12 }}>
                                            Quantity: {"87"}
                                          </Card.Subtitle>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="d-flex align-items-center gap-2">
                                      <i className="fe fe-plus" onClick={() => updateQuantity(product.id, product.price, 1)} style={{ cursor: "pointer" }}></i>
                                      <span style={{ fontSize: 14 }}>{cartItem.quantity}</span>
                                      <i className="fe fe-minus" onClick={() => updateQuantity(product.id, product.price, -1)} style={{ cursor: "pointer" }}></i>
                                    </div>                                
                                  </div>
                                );
                                })}
                                <hr />
                                <div className="d-flex align-items-center justify-content-between mb-3" style={{ paddingLeft: '15px', paddingRight: '15px'}}>
                                    <div>
                                       <Card.Subtitle className="mb-1 mt-1" style={{fontSize: 13,}}>Quantity: {totalQuantity}</Card.Subtitle>
                                    </div>
                                    <div>
                                        <Card.Subtitle className="mb-1 mt-1" style={{fontSize: 13,}}>Total: {totalPrice} $</Card.Subtitle>
                                    </div>
                                </div>
                                <div className='' style={{backgroundColor:'#eceef0'}}>
                                    {/* <Card.Subtitle className="mb-1 mt-1" style={{fontSize: 12,padding:'5px 5px 5px 15px'}}>{'No payment method specified'}</Card.Subtitle> */}
                                </div>
                              
                                {/* <div className="d-flex align-items-center justify-content-between" style={{ paddingLeft: 'px', paddingRight: 'px',paddingBottom:'px' }}>
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
                                            <Dropdown.Item eventKey="1">Edit order</Dropdown.Item>
                                            <Dropdown.Item eventKey="2">Show notes</Dropdown.Item>
                                            <Dropdown.Item eventKey="4">Custom fields</Dropdown.Item>
                                            <Dropdown.Item eventKey="6">Duplicate order</Dropdown.Item>
                                            <Dropdown.Divider />
                                            <Dropdown.Item eventKey="7" className='text-danger'>Delete order</Dropdown.Item>
                                        </DropdownButton>
                                    </div>
                                </div> */}
                                
                            </Card.Body>
                        </Card>
                        </Col>
                      </Row>
                    )}
                    <Row className="mb-3 d-flex align-items-center justify-content-start">
                      <Col md={4} xs={12}>
                           <h5 className="mb-3 mt-2">Billing information</h5>
                      </Col>
                      <Col md={4} xs={12}>
                        <ExistingCustomerOrOrder orders={orders} customers={customers} setFormData={setFormData} />
                      </Col>
                    </Row>
                    <Row className="mb-3">
                      <Form.Label className="col-sm-4 col-form-label form-label" htmlFor="fullName">Full name</Form.Label>
                      <Col sm={4} className="mb-3 mb-lg-0">
                        <Form.Control type="text" value={formData.firstname} onChange={handleChange} name="firstname" placeholder="First name" id="fullName" required />
                      </Col>
                      <Col sm={4}>
                        <Form.Control type="text" value={formData.lastname} onChange={handleChange} name="lastname" placeholder="Last name" id="lastName" required />
                      </Col>
                    </Row>
                    {/* Address Line Two */}
                    {/* <Row className="mb-3">
                      <Form.Label className="col-sm-4" htmlFor="country">Country</Form.Label>
                      <Col md={8} xs={12}>
                        <Form.Select onChange={(e) => onChange(e.target.value)}>
                            <option value="">Choose...</option>
                            {countries.map((country) => (
                                <option key={country.code} value={country.code}>
                                    {country.name}
                                </option>
                            ))}
                        </Form.Select>
                      </Col>
                    </Row> */}
                    <Row className="mb-3">
                      <Form.Label className="col-sm-4" htmlFor="countryprovince">Country / Province</Form.Label>
                      <Col sm={4} className="mb-3 mb-lg-0">
                        <Form.Select
                             onChange={handleChange}
                             name="country"
                             value={formData.country}
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
                        <Form.Control type="text" value={formData.province} onChange={handleChange} name="province" placeholder="Enter province" id="countryprovince" required />
                      </Col>
                    </Row>
                    <Row className="mb-3">
                      <Form.Label className="col-sm-4 col-form-label form-label" htmlFor="cityzipcode">City / ZipCode</Form.Label>
                      <Col sm={4} className="mb-3 mb-lg-0">
                        <Form.Control type="text" value={formData.city} onChange={handleChange} name="city" placeholder="Enter city" id="cityzipcode" required />
                      </Col>
                      <Col sm={4}>
                        <Form.Control type="text" value={formData.zipcode} onChange={handleChange} name="zipcode" placeholder="Enter zipcode" id="cityzipcode" required />
                      </Col>
                    </Row>
                    <Row className="mb-3">
                      <Form.Label className="col-sm-4 col-form-label form-label" htmlFor="contactinfo">Contact info</Form.Label>
                      <Col sm={4} className="mb-3 mb-lg-0">
                        <Form.Control type="text" value={formData.phone} onChange={handleChange} name="phone" placeholder="Enter phone" id="contactinfo" required />
                      </Col>
                      <Col sm={4}>
                        <Form.Control type="email" value={formData.email} onChange={handleChange} name="email" placeholder="Enter email" id="contactinfo" required />
                      </Col>
                    </Row>
                    {/* row */}
                    {/* <Row className="mb-3">
                      <Form.Label className="col-sm-4" htmlFor="phone">Phone 
                        // <span className="text-muted">(Optional)</span> 
                      </Form.Label>
                      <Col md={8} xs={12}>
                        <Form.Control type="text" value={formData.phone} onChange={handleChange} name="phone" placeholder="Enter Phone" id="phone" />
                      </Col>
                    </Row> */}

                    {/* Location */}
                    <Row className="mb-3">
                      <Form.Label className="col-sm-4" htmlFor="country">Address</Form.Label>
                      <Col md={8} xs={12}>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            value={formData.fulladdress} onChange={handleChange}
                            name='fulladdress'
                            placeholder="Enter your full address here..."
                            required
                        />
                      </Col>
                    </Row>
                    {/* Address Line One */}
                    {/* <Row className="mb-3">
                      <Form.Label className="col-sm-4" htmlFor="addressLine">Address line 1</Form.Label>
                      <Col md={8} xs={12}>
                        <Form.Control type="text" placeholder="Enter Address line 1" id="addressLine" required />
                      </Col>
                    </Row> */}
                    <Row className="mb-3 d-flex align-items-center justify-content-start">
                      <Col md={4} xs={12}>
                           <h5 className="mb-3 mt-2">Shipping information</h5>
                      </Col>
                      <Col md={4} xs={12}>
                        {/* <ShippingAddress setShippingData={setShippingData} handleChange={handleChange} countries={countries} /> */}
                        <Form.Check 
                            type="switch"
                            id="custom-switch"
                            label="Same as Billing"
                            checked={isShippingEnabled}
                            className="custom-switch-billingaddress"
                            onChange={(e) => setIsShippingEnabled(e.target.checked)}
                        />
                        {/* <Form.Label className="text-muted mt-1" style={{ fontSize: '14px' }}>
                           Same as Billing
                        </Form.Label> */}
                      </Col>
                    </Row>
                    {
                      !isShippingEnabled && (
                        console.log(shippingData),
                        <ShippingAddress shippingData={shippingData} handleChange={handleChange} countries={countries} />
                      )}
                    {/* Zip code */}
                    <Row className="align-items-center">
                    {/* <Form.Label className="col-sm-4" htmlFor="exampleInputrole">Role</Form.Label> */}
                      {/* <Col md={8} xs={12}>
                        <Form.Control 
                          as="select" 
                          id="exampleInputrole" 
                          name="role" 
                          value={formData.role} 
                          onChange={handleChange} 
                          required
                        >
                          <option value="">Select Role</option> 
                          {userRole.map((role) => (
                            <option key={role._id} value={role._id}>{role.role}</option>
                          ))}
                        </Form.Control>
                        </Col> */}
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

export default EditOrder