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
      console.log("Modal Opened, Checking for Variations...", products);
        setTempSelectedProducts(selectedProducts);
        if (!products || products.length === 0) {
          console.warn("⚠️ No products available when modal opened.");
          return;
      }
        products.forEach(product => {

          console.log(`Product: ${product.name}, ID: ${product.id}, has_variations: ${product.has_variations}`);
            if (product.has_variations ) {
                fetchAllProductsVariations(product.id);
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
    console.log(searchTerm);
    if (filteredCache[searchTerm]) {
      setProducts(filteredCache[searchTerm]);
      return;
    }
    try {
       setLoading(true);
      const response = await axios.get(`${process.env.NEXT_PUBLIC_HOST}/oldapi/woocommerce/filterproducts`, { params: { search: searchTerm } });
      if (response.data?.data) {
        console.log(response.data.data);
        setProducts(response.data.data);
        setFilteredCache(prevCache => ({ ...prevCache, [searchTerm]: response.data.data }));
      }
    } catch (error) {
      toast.error("Failed to fetch products!");
     } 
    finally {
      setLoading(false);
    }
  };
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
        const isAlreadySelected = prevSelected.some(p => p.id === (variation ? variation.id : product.id));

        if (isAlreadySelected) {
            return prevSelected.filter(p => p.id !== (variation ? variation.id : product.id));
        }

        return variation ? [...prevSelected, variation] : [...prevSelected, product];
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
                                                                        {product.price} USD
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
                                                                            <span style={{ fontSize: 14 }}>{variation.name || "Variation"}</span>
                                                                            <span style={{ fontSize: 12, marginLeft: 10 }}>
                                                                                Price: {variation.price || variation.regular_price} USD
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
  // console.log(productIds);

  useEffect(() => {
    if (productIds && products.length > 0) {
      const selectedProductsFiltered = products.filter(product =>
        productIds.some(item => item.product_id === product.id)
      );
      setSelectedProducts(selectedProductsFiltered); 
      // console.log(selectedProductsFiltered);
    }
  }, [products, productIds]);


  const fetchAllProducts = async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_HOST}/oldapi/woocommerce/getallproduct`);
      if (response.data && response.data.data) {
        setProducts(response.data.data);
        console.log(response.data.data);
      } else {
        console.error("Unexpected API Response:", response.data);
      }
    } catch (error) {
      console.error("Error fetching data:", error.message);
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
