'use client'

import React, { useEffect,useState } from 'react';
import axios from 'axios';

const Home = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    
    const fetchAllProducts = async () => {
        try {
            const response = await axios.get(`http://localhost:3000/api/woocommerce/getallproduct`);
            console.log('API Response:', response.data);
    
            if (response.data && response.data.data) {
                setProducts(response.data.data); // Set products to the state
            } else {
                console.error('Unexpected API Response:', response.data);
            }
        } catch (error) {
            console.error('Error fetching data:', error.message);  // Log the error message
        } finally {
            setLoading(false); // Set loading to false after data fetch
        }
    };

    useEffect(() => {
        fetchAllProducts(); // Fetch products when the component is mounted
    }, [fetchAllProducts]);
    
  return (
    <div>
      <h1>Product List</h1>
      <table border="1" style={{ borderCollapse: "collapse", width: "100%" }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Price</th>
            <th>Stock</th>
            <th>Image</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product,index) => (
            <tr key={product.id || index}>
              <td>{product.id}</td>
              <td>{product.name}</td>
              <td>{product.price}</td>
              <td>{product.stock_status || "Out of stock"}</td>
              <td>
                  {product.images.map((image) => (
                    <img
                      key={image.id}
                      src={image.src }
                      alt={image.alt || "Product Image"}
                      style={{ width: "50px", height: "50px", objectFit: "cover" }}
                    />
                  ))}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Home