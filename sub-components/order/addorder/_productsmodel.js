import { Col, Row, Form, Card, Nav, Tab, Button, Modal,Spinner } from "react-bootstrap";
import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { toast } from "react-toastify";
const MyVerticallyCenteredModal = ({ show, onHide, products, loading, setSelectedProducts, selectedProducts, setModalShow, setLoading, setProducts, filteredCache, setFilteredCache }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [tempSelectedProducts, setTempSelectedProducts] = useState([]);
  // const [filteredCache, setFilteredCache] = useState({});
  

  useEffect(() => {
    if (show) {
      // console.log("Modal Opened, Checking for Variations...", products);
        setTempSelectedProducts(selectedProducts);
        if (!products || products.length === 0) {
          console.warn("⚠️ No products available when modal opened.");
          return;
      }
        products.forEach(product => {

          // console.log(`Product: ${product.name}, ID: ${product.id}, has_variations: ${product.variations}`);
            if (product.variations ) {
              const response =  fetchAllProductsVariations(product.id);
              // console.log(response.data);
            }
        });
    }
}, [show, selectedProducts]);


  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchTerm) {
        fetchFilteredProducts();
      }
    }, 1000);
    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  const fetchFilteredProducts = async () => {
    // console.log(searchTerm);
    if (filteredCache[searchTerm]) {
      setProducts(filteredCache[searchTerm]);
      return;
    }
  
    try {
      setLoading(true);
  
      const response = await axios.get(`${process.env.NEXT_PUBLIC_HOST}/oldapi/woocommerce/filterproducts`, {
        params: { search: searchTerm }
      });
  
      if (response.data?.data) {
        const filteredProducts = response.data.data;
  
        // 🔁 Fetch variations for variable products
        const productsWithVariations = await Promise.all(
          filteredProducts.map(async (product) => {
            if (product.variations) {
              try {
                const variationResponse = await axios.post(
                  `${process.env.NEXT_PUBLIC_HOST}/oldapi/woocommerce/productvariations`,
                  { id: product.id }
                );
                const variations = variationResponse.data?.data || [];
  
                return {
                  ...product,
                  variations: variations.map((variation, index) => ({
                    ...variation,
                    id: variation.id || `${product.id}-var-${index}`,
                  })),
                };
              } catch (error) {
                console.warn(`Failed to fetch variations for product ${product.id}`, error.message);
                return product; // Return without variations if error occurs
              }
            }
  
            return product; // Return simple product
          })
        );
  
        setProducts(productsWithVariations);
        setFilteredCache((prevCache) => ({ ...prevCache, [searchTerm]: productsWithVariations }));
      }
    } catch (error) {
      toast.error("Failed to fetch products!");
    } finally {
      setLoading(false);
    }
  };
  
  const fetchAllProductsVariations = async (id) => {
    try {
      
        setLoading(true);
        // console.log(`Fetching variations for product ID: ${id}`);
        
        const response = await axios.post(`${process.env.NEXT_PUBLIC_HOST}/oldapi/woocommerce/productvariations`, { id });

        if (response.data?.data?.length > 0) {
            // console.log(`Variations for product ${id}:`, response.data.data);

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





  // useEffect(()=>{
  //   console.log(tempSelectedProducts);

  // },[tempSelectedProducts])

  // const displayedProducts = useMemo(() => {
  //   if (!searchTerm.trim()) return products;
  //   return products.filter(
  //     (product) =>
  //       product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //       product.price.toString().includes(searchTerm)
  //   );
  // }, [searchTerm, products]);

  const handleProductSelect = (product, variation = null) => {
    setTempSelectedProducts((prevSelected) => {
      const idToCheck = variation ? variation.id : product.id;
      const isAlreadySelected = prevSelected.some(p => p.id === idToCheck);
  
      if (isAlreadySelected) {
        return prevSelected.filter(p => p.id !== idToCheck);
      }
  
      if (variation) {
        return [
          ...prevSelected,
          {
            ...variation,
            parent_id: product.id,       // ✅ Add parent product ID
            parent_name: product.name,   // ✅ Add parent product name (optional)
          },
        ];
      }
  
      return [...prevSelected, product];
    });
  };
  


  const handleConfirmSelection = () => {
    // console.log("Selected Products:", tempSelectedProducts);
    setSelectedProducts(tempSelectedProducts);
    setModalShow(false);
  };

  return (
    <Modal show={show} onHide={onHide} centered contentClassName="custom-modal-content"size="lg">
      <Modal.Header closeButton className="border-0">
        <Modal.Title>Select products</Modal.Title>
      </Modal.Header>
      <Modal.Body className="pb-0">
        <Row>
          <Col xl={12}>
            <Form.Control
              type="text"
              placeholder="Search by Name or Price"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="mb-3"
            />
            <Tab.Container id="tab-container-1" defaultActiveKey="customer">
              <Card>
                <Card.Header className="border-bottom-0 p-0">
                  <Nav className="nav-lb-tab">
                    <Nav.Item>
                      <Nav.Link eventKey="customer">Products</Nav.Link>
                    </Nav.Item>
                  </Nav>
                </Card.Header>
                <Card.Body className="p-0">
                  <Tab.Content style={{ height: "350px", overflowY: "scroll" }}>
                  <Tab.Pane eventKey="customer" className="pb-4 p-4">
                                            {loading ? (
                                                <div className="d-flex justify-content-center my-3">
                                                    <Spinner animation="border" variant="primary" />
                                                </div>
                                            ) : products.length > 0 ? (
                                                products.map((product) => (
                                                    <div key={product.id} className="product-container mb-3">
                                                        <div className="d-flex justify-content-between align-items-center mb-2 gap-2 px-3">
                                                            <div className="d-flex align-items-center gap-2">
                                                                <Card.Img
                                                                    variant="top"
                                                                    src={product.images?.[0]?.src || "https://via.placeholder.com/150"}
                                                                    alt={product.images?.[0]?.alt || "Product Image"}
                                                                    style={{ height: "85px", width: "85px", objectFit: "cover" }}
                                                                />
                                                                <div>
                                                                    <Card.Subtitle className="mb-3 mt-2" style={{ fontSize: 14 }}>
                                                                        {product.name || "Unknown Product"}
                                                                    </Card.Subtitle>
                                                                    <Card.Subtitle className="mb-3" style={{ fontSize: 12 }}>
                                                                        SKU: {product.sku || "N/A"}
                                                                    </Card.Subtitle>
                                                                    <Card.Subtitle className="mb-3" style={{ fontSize: 12 }}>
                                                                        {product.price} GBP
                                                                    </Card.Subtitle>
                                                                    <Card.Subtitle style={{ fontSize: 12 }}>
                                                                        {product.stock_status || "Out of stock"}
                                                                    </Card.Subtitle>
                                                                </div>
                                                            </div>
                                                            <div>
                                                                <Form.Check
                                                                    type="checkbox"
                                                                    checked={tempSelectedProducts.some((p) => p.id === product.id)}
                                                                    onChange={() => handleProductSelect(product)}
                                                                />
                                                            </div>
                                                        </div>

                                                        {/* ✅ Variations List */}
                                                        {product.variations && product.variations.length > 0 && (
                                                          
                                                            <div className="variation-container ms-4">
                                                                {product.variations.map((variation, index) => (
                                                                    <div 
                                                                        key={`${product.id}-var-${variation.id || index}`}
                                                                        className="d-flex justify-content-between align-items-center px-4 py-1"
                                                                    >
                                                                        <div>
                                                                        <Card.Img 
                                                                          variant="top"
                                                                          src={variation.image?.src || "https://via.placeholder.com/150"}
                                                                          alt={variation.image?.alt}
                                                                          style={{ height: "35px", width: "35px", objectFit: "cover" }}
                                                                        />
                                                                            <span style={{ fontSize: 14 }}>{variation.name || variation.description}</span>
                                                                            <span style={{ fontSize: 12, marginLeft: 10 }}>
                                                                                Price: {variation.price || variation.sale_price} GBP
                                                                            </span>
                                                                            <span style={{ fontSize: 12, marginLeft: 10 }}>
                                                                                SKU: {variation.sku || "N/A"}
                                                                            </span>
                                                                        </div>
                                                                        <Form.Check
                                                                            type="checkbox"
                                                                            checked={tempSelectedProducts.some((p) => p.id === variation.id)}
                                                                            onChange={() => handleProductSelect(product, variation)}
                                                                        />
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        )}
                                                    </div>
                                                ))
                                            ) : (
                                                <p>No products found.</p>
                                            )}
                                        </Tab.Pane>

                  </Tab.Content>
                </Card.Body>
              </Card>
            </Tab.Container>
          </Col>
        </Row>
      </Modal.Body>
      <Modal.Footer className="border-0">
        <Button onClick={handleConfirmSelection}>Submit</Button>
      </Modal.Footer>
    </Modal>
  );
};

const ProductsModel = ({ setSelectedProducts, selectedProducts,productIds }) => {
  const [modalShow, setModalShow] = useState(false);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filteredCache, setFilteredCache] = useState({});
  const [hasInitializedSelection, setHasInitializedSelection] = useState(false);
  // console.log(productIds);

  useEffect(() => {
    const loadAndSelect = async () => {
      const variationFetches = [];
  
      for (const pid of productIds) {
        const parentProduct = pid.parent_id
          ? products.find(p => p.id === pid.parent_id)
          : products.find(p => p.id === pid.product_id);
  
        if (!parentProduct) continue;
  
        if (pid.parent_id) {
          if (!parentProduct.variations || parentProduct.variations.length === 0) {
            variationFetches.push(fetchAllProductsVariations(parentProduct.id));
          }
        }
      }
  
      await Promise.all(variationFetches);
  
      const selected = [];
  
      for (const pid of productIds) {
        const parentProduct = pid.parent_id
          ? products.find(p => p.id === pid.parent_id)
          : products.find(p => p.id === pid.product_id);
  
        if (!parentProduct) continue;
  
        if (pid.parent_id) {
          const variation = parentProduct.variations?.find(v => v.id === pid.product_id);
          if (variation) {
            selected.push({
              ...variation,
              parent_id: parentProduct.id,
              parent_name: parentProduct.name,
            });
          }
        } else {
          selected.push(parentProduct);
        }
      }
  
      setSelectedProducts(selected);
      setHasInitializedSelection(true); // ✅ prevent future resets
    };
  
    if (
      productIds &&
      products.length > 0 &&
      !hasInitializedSelection // ✅ only run once
    ) {
      loadAndSelect();
    }
  }, [products, productIds, hasInitializedSelection]);
  
  
  


  const fetchAllProducts = async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_HOST}/oldapi/woocommerce/getallproduct`);
      if (response.data?.data) {
        const allProducts = response.data.data;
  
        // Fetch variations for all variable products
        const variationPromises = allProducts.map(async (product) => {
          if (product.variations) {
            const variationResponse = await axios.post(`${process.env.NEXT_PUBLIC_HOST}/oldapi/woocommerce/productvariations`, { id: product.id });
            const variations = variationResponse.data?.data || [];
  
            return {
              ...product,
              variations: variations.map((variation, index) => ({
                ...variation,
                id: variation.id || `${product.id}-var-${index}`
              }))
            };
          }
          return product;
        });
  
        const productsWithVariations = await Promise.all(variationPromises);
        setProducts(productsWithVariations);
      } else {
        console.error("Unexpected API Response:", response.data);
      }
    } catch (error) {
      console.error("Error fetching products:", error.message);
    } finally {
      setLoading(false);
    }
  };
  
  const handleClose = () => {
    setSelectedProducts([]); 
    setModalShow(false); 
  };

  useEffect(() => {
    fetchAllProducts();
  }, []);

  return (
    <>
      <Button variant="outline-primary" onClick={() => setModalShow(true)}>
        Select Products
      </Button>
      <MyVerticallyCenteredModal
        show={modalShow}
        onHide={() => setModalShow(false)}
        products={products}
        loading={loading}
        setLoading={setLoading} // ✅ Now correctly passed
        setProducts={setProducts}
        setSelectedProducts={setSelectedProducts}
        selectedProducts={selectedProducts}
        setModalShow={setModalShow}
        filteredCache={filteredCache}
        setFilteredCache={setFilteredCache}
      />
    </>
  );
};

export default ProductsModel;
