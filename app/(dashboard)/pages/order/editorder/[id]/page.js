'use client'
// import node module libraries
import React,{useState,useEffect} from 'react'
import useMounted from 'hooks/useMounted';
import axios from 'axios';
import ToastComponent from 'components/toastcomponent';
import { toast } from "react-toastify";
import { Col, Row, Form, Card, Button, Image,Container,Tab,Tabs,Nav,DropdownButton,ButtonGroup,Dropdown,Spinner } from 'react-bootstrap';
import ExistingCustomerOrOrder from '/sub-components/order/addorder/Existing-customer-or-order.js'
import ProductsModel from '/sub-components/order/editOrderModel.js'
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
  const [products, setProducts] = useState([]);
  const [productLoading, setProductLoading] = useState(true);

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
         shippingcompany: '',
         shippingcountry: '',
         shippingcustomernote: '',
         shippingprovince: '',
         shippingphone: '',
         shippingcity: '',
         shippingzipcode: '',
         shippingaddressline1: '',
         shippingaddressline2: '',
         shippingfulladdress: '',
   });
   const [formData, setFormData] = useState({
         firstname: '',
         lastname: '',
         email: '',
         country: '',
         company: '',
         tranctionid: '',
        //  customernote: '',
         province: '',
         phone: '',
         city: '',
         zipcode: '',
         addressline1: '',
         addressline2: '',
         fulladdress: '',
   });

  const fetchorder = async (orderid) => {
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_HOST}/oldapi/woocommerce/order/getsingelorder`, { id: orderid });
    
      if (response.status === 200 && response.data) {
            console.log(response.data.data);
            const order = response.data.data;
            setFetchedproduct(order);
        
            const lineItems = order.line_items || [];

            const selected = lineItems.map(item => ({
              id: item.variation_id && item.variation_id !== 0 ? item.variation_id : item.product_id,
              product_id: item.product_id,
              variation_id: item.variation_id,
              name: item.name,
              parent_name: item.parent_name || '',
              quantity: item.quantity,
              price: item.price,
              sku: item.sku,
              images: {
                src: item.image || '/fallback.jpg',
                alt: item.name || 'Product image',
              }, // wrap as array if needed
              meta_data: item.meta_data || [],
            }));
            console.log(selected);
          
            setSelectedProducts(selected);


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
            shippingcompany: response.data.data.shipping.company || '',
            shippingprovince: response.data.data.shipping.state || '',
            shippingphone: response.data.data.shipping.phone || '',
            shippingcustomernote: response.data.data.customer_note || '',
            shippingcity: response.data.data.shipping.city || '',
            shippingzipcode: response.data.data.shipping.postcode || '',
            shippingaddressline1: response.data.data.shipping.address_1 || '',
            shippingaddressline2: response.data.data.shipping.address_2 || '',
            // shippingfulladdress: `${response.data.data.shipping.address_1 || ''}, ${response.data.data.shipping.address_2 || ''}`,
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
            company: response.data.data.billing.company || '',
            addressline1: response.data.data.billing.address_1 || '',
            addressline2: response.data.data.billing.address_2 || '',
            tranctionid: response.data.data.transaction_id || '',
            // customernote: response.data.data.customer_note || '',
            // fulladdress:`${response.data.data.billing.address_1 || ''}, ${response.data.data.billing.address_2 || ''}`,
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

  //
  const fetchAllProductsVariations = async (id) => {
    try {
      
        setLoading(true);
        console.log(`Fetching variations for product ID: ${id}`);
        
        const response = await axios.post(`${process.env.NEXT_PUBLIC_HOST}/oldapi/woocommerce/productvariations`, { id });

        if (response.data?.data?.length > 0) {
            console.log(`Variations for product ${id}:`, response.data.data);

            const variationsWithIDs = response.data.data.map((variation, index) => ({
                ...variation,
                id: variation.id || `${id}-var-${index}` 
            }));

            setProducts(prevProducts =>
                prevProducts.map(product =>
                    product.id === id
                        ? { ...product, variations: variationsWithIDs }
                        : product
                )
            );
        } else {
            console.warn(`No variations found for product ID: ${id}`);
        }
    } catch (error) {
        console.error("Error fetching variations:", error.message);
    } finally {
        setLoading(false);
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

  // const fetchAllProducts = async () => {
  //   try {
  //     const response = await axios.get(`${process.env.NEXT_PUBLIC_HOST}/oldapi/woocommerce/getallproduct`);
  //     if (response.data?.data) {
  //       const allProducts = response.data.data;
  
  //       const productsWithVariations = await Promise.all(
  //         allProducts.map(async (product) => {
  //           if (product.variations) {
  //             const variationResponse = await axios.post(
  //               `${process.env.NEXT_PUBLIC_HOST}/oldapi/woocommerce/productvariations`,
  //               { id: product.id }
  //             );
  //             const variations = variationResponse.data?.data || [];
  //             return {
  //               ...product,
  //               variations: variations.map((v, index) => ({
  //                 ...v,
  //                 id: v.id || `${product.id}-var-${index}`,
  //               })),
  //             };
  //           }
  //           return product;
  //         })
  //       );
  
  //       setProducts(productsWithVariations);
  //     }
  //   } catch (error) {
  //     console.error("Error fetching products:", error.message);
  //   } finally {
  //     setProductLoading(false);
  //   }
  // };
  
  // useEffect(() => {
  //   const selected = [];

  //   console.log(productIds);

  //   const initializeSelectedProducts = async () => {
  //     if (productIds.length === 0 || products.length === 0) return;
  
  
  //     for (const pid of productIds) {
  //       const parent = pid.parent_id
  //         ? products.find(p => p.id === pid.parent_id)
  //         : products.find(p => p.id === pid.product_id);
  
  //       if (!parent) continue;
  
  //       if (pid.parent_id && parent.variations?.length > 0) {
  //         const variation = parent.variations.find(v => v.id === pid.product_id);
  //         if (variation) {
  //           selected.push({
  //             ...variation,
  //             parent_id: parent.id,
  //             parent_name: parent.name,
  //           });
  //         }
  //       } else {
  //         selected.push(parent);
  //       }
  //     }
  //     console.log(selected);
  //     setSelectedProducts(selected);
  //   };
  
  //   initializeSelectedProducts();
  // }, [productIds, products]);
  
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
        // fetchAllProducts(),
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
     const updatedCart = selectedProducts.map(product => {
    const data = product.data || product; // support both formats
    const isVariation = !!data.parent_id;

    const matchedCartItem = productIds.find(item => item.product_id === data.id);

    return {
      id: data.id,
      variation_id: isVariation ? data.id : 0,
      product_id: isVariation ? data.parent_id : data.id,
      quantity: matchedCartItem ? matchedCartItem.quantity : product.quantity || 1,
      price: parseFloat(data.price) || 0
    };
  });
  
    setCart(updatedCart);
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
      const selected = JSON.parse(value);
      const { method_id, method_title, raw_cost } = selected;
    
      const qty = cart.reduce((sum, item) => sum + item.quantity, 0);
      const cost = cart.reduce((sum, item) => sum + item.quantity * item.price, 0);
    
      let calculatedCost = raw_cost
        ?.replace(/\[qty\]/gi, qty)
        ?.replace(/\[cost\]/gi, cost.toFixed(2));
    
      try {
        calculatedCost = Function(`return (${calculatedCost})`)();
      } catch (err) {
        calculatedCost = 0;
      }
    
      setOrderData((prevData) => ({
        ...prevData,
        shippingmethodid: method_id,
        shippingmethodtitle: method_title,
        shipping_cost: calculatedCost.toFixed(2)
      }));
    }else if (name === "orderstatus") {
      setOrderData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    } else if (name === "shippingfirstname" || name === "shippinglastname" || name === "shippingcountry" || name === "shippingprovince" || name === "shippingcity" || name === "shippingzipcode" || name === "shippingfulladdress" || name === "shippingphone" || name === "shippingcompany" || name === "shippingaddressline1"  || name === "shippingaddressline2" || name === "shippingcustomernote") {
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

  const updatePrice = (productId, newPrice) => {
    const parsedPrice = parseFloat(newPrice);
    const price = isNaN(parsedPrice) ? 0 : parsedPrice;
  
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === productId ? { ...item, price } : item
      )
    );
  
    setSelectedProducts((prevSelected) =>
      prevSelected.map((item) =>
        item.id === productId ? { ...item, price } : item
      )
    );
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
      customer_note: shippingData.shippingcustomernote ||  fetchedproduct?.customer_note || "", 
      transaction_id: formData.tranctionid || fetchedproduct?.tranctionid ||  "", 
      set_paid: fetchedproduct?.set_paid || false,
      billing: {
        first_name: formData.firstname || fetchedproduct?.billing?.first_name || "",
        last_name: formData.lastname || fetchedproduct?.billing?.last_name || "",
        address_1: formData.addressline1 || fetchedproduct?.billing?.address_1 || "",
        address_2: formData.addressline2 || fetchedproduct?.billing?.address_2 || "",
        city: formData.city || fetchedproduct?.billing?.city || "",
        state: formData.province || fetchedproduct?.billing?.state || "",
        postcode: formData.zipcode || fetchedproduct?.billing?.postcode || "",
        country: formData.country || fetchedproduct?.billing?.country || "",
        company: formData.company ||  fetchedproduct?.billing?.company || "",
        email: formData.email || fetchedproduct?.billing?.email || "",
        phone: formData.phone || fetchedproduct?.billing?.phone || "",
      },
      shipping: {
        first_name: isShippingEnabled
          ? formData.firstname
          : shippingData.shippingfirstname ?? fetchedproduct?.shipping?.first_name ?? "",

        last_name: isShippingEnabled
          ? formData.lastname
          : shippingData.shippinglastname ?? fetchedproduct?.shipping?.last_name ?? "",
      
        address_1: isShippingEnabled
          ? formData.addressline1 ?? ""
          : shippingData.shippingaddressline1 ?? fetchedproduct?.shipping?.address_1 ?? "",
      
        address_2: isShippingEnabled
          ? formData.addressline2 ?? ""
          : shippingData.shippingaddressline2 ?? fetchedproduct?.shipping?.address_2 ?? "",
      
        city: isShippingEnabled
          ? formData.city
          : shippingData.shippingcity ?? fetchedproduct?.shipping?.city ?? "",
      
        company: isShippingEnabled
          ? formData.company
          : shippingData.shippingcompany ?? fetchedproduct?.shipping?.company ?? "",
      
        state: isShippingEnabled
          ? formData.province
          : shippingData.shippingprovince ?? fetchedproduct?.shipping?.state ?? "",
      
        postcode: isShippingEnabled
          ? formData.zipcode
          : shippingData.shippingzipcode ?? fetchedproduct?.shipping?.postcode ?? "",
      
        country: isShippingEnabled
          ? formData.country
          : shippingData.shippingcountry ?? fetchedproduct?.shipping?.country ?? ""
      },   
      line_items: [
        // Update existing products
        ...fetchedproduct?.line_items?.map(existingItem => {
          const updatedItem = cart.find(cartItem => {
            const isVariation = existingItem.variation_id && existingItem.variation_id !== 0;
            return isVariation
              ? cartItem.id === existingItem.variation_id
              : cartItem.id === existingItem.product_id;
          });
      
          if (updatedItem) {
            return {
              id: existingItem.id,
              product_id: existingItem.product_id,
              variation_id: existingItem.variation_id || 0,
              quantity: updatedItem.quantity,
              price: updatedItem.price, // ✅ use updated price from cart
              total: (updatedItem.price * updatedItem.quantity).toFixed(2),
            };
          }
      
          // Product removed from cart: set quantity to 0
          return {
            id: existingItem.id,
            product_id: existingItem.product_id,
            variation_id: existingItem.variation_id || 0,
            quantity: 0,
          };
        }),
      
        // Add new products
        ...cart.filter(cartItem => {
          const alreadyExists = fetchedproduct?.line_items?.some(existingItem => {
            const isVariation = existingItem.variation_id && existingItem.variation_id !== 0;
            return isVariation
              ? existingItem.variation_id === cartItem.id
              : existingItem.product_id === cartItem.id;
          });
          return !alreadyExists;
        }).map(newItem => ({
          product_id: newItem.variation_id !== 0 ? newItem.variation_id : newItem.id,
          variation_id: newItem.variation_id || 0,
          quantity: newItem.quantity,
          price: newItem.price,
          total: (newItem.price * newItem.quantity).toFixed(2),
        }))
      ],
      //Preserve shipping methods safely
      shipping_lines: fetchedproduct?.shipping_lines?.map(line => ({
        id: line.id, 
        method_id: orderData.shippingmethodid?.toLowerCase().replace(/\s+/g, "_") || line.method_id || "free_shipping",
        method_title: orderData.shippingmethodtitle || line.method_title || "Free Shipping",
        total: orderData.shipping_cost || line.total || "0.00",
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
  // console.log("Cart contents:", cart);
  const totalPrice = cart.reduce((sum, item) => {
    const price = parseFloat(item.price) || 0;
    const quantity = parseInt(item.quantity) || 0;
    return sum + price * quantity;
  }, 0);

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
                      <Form.Select
                          id="shippingmethod"
                          name="shippingmethod"
                          value={
                            orderData.shippingmethodid && orderData.shippingmethodtitle
                              ? JSON.stringify({
                                  method_id: orderData.shippingmethodid,
                                  method_title: orderData.shippingmethodtitle,
                                  raw_cost: shippingmethods.find(m => m.method_id === orderData.shippingmethodid)?.settings?.cost?.value || "0"
                                })
                              : ""
                          }
                          onChange={handleChange}
                          required
                        >
                          <option value="" disabled hidden>Choose...</option>
                          {shippingmethods.map((shippingmethod) => (
                            <option
                              key={shippingmethod.id}
                              value={JSON.stringify({
                                method_id: shippingmethod.method_id,
                                method_title: shippingmethod.title,
                                raw_cost: shippingmethod.settings?.cost?.value || "0"
                              })}
                            >
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
                        <ProductsModel setSelectedProducts={setSelectedProducts} selectedProducts={selectedProducts}  productIds={productIds} products={products}
                            setProducts={setProducts}
                            loading={productLoading}
                            setLoading={setProductLoading}
                             />
                      </Col>
                    </Row>
                    {selectedProducts.length > 0 && (
                        <Row className="mb-3 d-flex align-items-center justify-content-start">
                          <Col md={4} xs={12}>
                            <h5 className="mb-3 mt-2"></h5>
                          </Col>
                          <Col md={8} xs={12}>
                            <Card style={{ width: "100%" }}>
                              <Card.Body style={{ padding: "0px" }}>
                                <div className="d-flex align-items-center justify-content-between" style={{ padding: '15px' }}>
                                  <Card.Title>Product</Card.Title>
                                </div>
                                <div className='' style={{ backgroundColor: '#eceef0' }}></div>
                                <hr />

                                {selectedProducts.map((product, index) => {
                                  console.log(product);
                                  const data = product.data || product;
                                  const quantity = product.quantity || 1;
                                  const cartItem = cart.find((item) => item.id === data.id) || { quantity: 1 };
                                  const isVariation = data.parent_id !== undefined && data.parent_id !== null;

                                  return (
                                    <div
                                      key={index}
                                      className="d-flex align-items-center justify-content-between mb-2 gap-2"
                                      style={{ paddingLeft: '15px', paddingRight: '15px' }}
                                    >
                                      <div className='d-flex align-items-center justify-content-start gap-2'>
                                        <div>
                                          <i
                                            className="fas fa-times"
                                            onClick={() => removeproduct(data.id)}
                                            style={{ cursor: "pointer" }}
                                          ></i>
                                        </div>
                                        <div className='d-flex align-items-center justify-content-start gap-2'>
                                          <div>
                                          <Card.Img
                                              variant="top"
                                              src={
                                                data.type === 'variation'
                                                  ? (typeof data.image === 'string'
                                                      ? data.image
                                                      : data.image?.src || data.image?.[0]?.src || "/fallback.jpg")
                                                  : (typeof data.images === 'string'
                                                      ? data.images
                                                      : data.images?.src || data.images?.[0]?.src || "/fallback.jpg")
                                              }
                                              alt={
                                                data.type === 'variation'
                                                  ? (typeof data.image === 'string'
                                                      ? data.name
                                                      : data.image?.alt || data.image?.[0]?.alt || "Product Image")
                                                  : (typeof data.images === 'string'
                                                      ? data.name
                                                      : data.images?.alt || data.images?.[0]?.alt || "Product Image")
                                              }
                                              style={{ height: '85px', width: '85px', objectFit: 'cover' }}
                                            />
                                          </div>
                                          <div>
                                            <Card.Subtitle className="mb-2 mt-2" style={{ fontSize: 14 }}>
                                              {isVariation
                                                ? `${data.parent_name || "Product"} - ${data.name || data.description}`
                                                : data.name || "Unknown"}
                                            </Card.Subtitle>

                                            <Card.Subtitle className="mb-2 mt-2" style={{ fontSize: 12 }}>
                                              SKU: {data.sku || "N/A"}
                                            </Card.Subtitle>

                                            {/* <Card.Subtitle className="mb-2 mt-2" style={{ fontSize: 12 }}>
                                            {parseFloat(data.price).toFixed(2)} GBP
                                            </Card.Subtitle> */}

                                            <Card.Subtitle className="mb-2 mt-2" style={{ fontSize: 12 }}>
                                              Quantity: {quantity}
                                            </Card.Subtitle>

                                            <Card.Subtitle className="mb-3 mt-2" style={{ fontSize: 12 }}>
                                              Price: 
                                              <input
                                                type="text"
                                                value={parseFloat(data.price).toFixed(2)}
                                                onChange={(e) => updatePrice(product.id, e.target.value)}
                                                style={{ marginLeft: 5, width: 70 }}
                                              /> 
                                              GBP
                                            </Card.Subtitle>
                                          </div>
                                        </div>
                                      </div>

                                      <div className="d-flex align-items-center gap-2">
                                        <i
                                          className="fe fe-plus"
                                          onClick={() => updateQuantity(data.id, data.price, 1)}
                                          style={{ cursor: "pointer" }}
                                        ></i>
                                        <span style={{ fontSize: 14 }}>{cartItem.quantity}</span>
                                        <i
                                          className="fe fe-minus"
                                          onClick={() => updateQuantity(data.id, data.price, -1)}
                                          style={{ cursor: "pointer" }}
                                        ></i>
                                      </div>
                                    </div>
                                  );
                                })}

                                <hr />
                                <div
                                  className="d-flex align-items-center justify-content-between mb-3"
                                  style={{ paddingLeft: '15px', paddingRight: '15px' }}
                                >
                                  <div>
                                    <Card.Subtitle className="mb-1 mt-1" style={{ fontSize: 13 }}>
                                      Quantity: {totalQuantity}
                                    </Card.Subtitle>
                                  </div>
                                  <div>
                                    <Card.Subtitle className="mb-1 mt-1" style={{ fontSize: 13 }}>
                                      Total: {totalPrice.toFixed(2)} £
                                    </Card.Subtitle>
                                  </div>
                                </div>
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
                        <ExistingCustomerOrOrder orders={orders} customers={customers} setFormData={setFormData} setShippingData={setShippingData}  />
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
                    <Row className="mb-3">
                      <Form.Label className="col-sm-4 col-form-label form-label" htmlFor="companyinfo">Company info</Form.Label>
                      <Col sm={4} className="mb-3 mb-lg-0">
                        <Form.Control type="text" value={formData.company} onChange={handleChange} name="company" placeholder="Enter company" id="companyinfo" />
                      </Col>
                      <Col sm={4}>
                        {/* <Form.Control type="email" value={formData.email} onChange={handleChange} name="email" placeholder="Enter email" id="companyinfo" required /> */}
                      </Col>
                    </Row>
                    <Row className="mb-3">
                      <Form.Label className="col-sm-4 col-form-label form-label" htmlFor="Address">Address line 1/2</Form.Label>
                      <Col sm={4} className="mb-3 mb-lg-0">
                        <Form.Control type="text" value={formData.addressline1} onChange={handleChange} name="addressline1" placeholder="Enter Address line 1" id="Address" required />
                      </Col>
                      <Col sm={4}>
                        <Form.Control type="text" value={formData.addressline2} onChange={handleChange} name="addressline2" placeholder="Enter Address line 2" id="Address"  />
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
                      <Form.Label className="col-sm-4" htmlFor="countryprovince">Country / State</Form.Label>
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
                        <Form.Control type="text" value={formData.province} onChange={handleChange} name="province" placeholder="Enter State" id="countryprovince" required />
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
                    <Row className="mb-3">
                      <Form.Label className="col-sm-4 col-form-label form-label" htmlFor="TranscationID/Note">Transcation ID</Form.Label>
                      <Col sm={4} className="mb-3 mb-lg-0">
                        <Form.Control type="text" value={formData.tranctionid} onChange={handleChange} name="tranctionid" placeholder="Enter Transcation ID" id="TranscationID/Note"  />
                      </Col>
                      <Col sm={4}>
                        {/* <Form.Control type="text" value={formData.customernote} onChange={handleChange} name="customernote" placeholder="Enter Note" id="TranscationID/Note"  /> */}
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
                    {/* <Row className="mb-3">
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
                    </Row> */}
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