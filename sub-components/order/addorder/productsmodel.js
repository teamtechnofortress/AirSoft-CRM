import { Col, Row, Form, Card, Nav, Tab, Button, Modal } from "react-bootstrap";
import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";

const MyVerticallyCenteredModal = ({ show, onHide, products, loading, setSelectedProducts, selectedProducts,setModalShow }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [tempSelectedProducts, setTempSelectedProducts] = useState([]);

  useEffect(() => {
    if (show) {
      setTempSelectedProducts(selectedProducts); // Preserve selected products on open
    }
  }, [show, selectedProducts]);

  // useEffect(()=>{
  //   console.log(tempSelectedProducts);

  // },[tempSelectedProducts])

  const displayedProducts = useMemo(() => {
    if (!searchTerm.trim()) return products;
    return products.filter(
      (product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.price.toString().includes(searchTerm)
    );
  }, [searchTerm, products]);

  const handleProductSelect = (product) => {
    // console.log(product);
    setTempSelectedProducts((prevSelected) => {
      const isAlreadySelected = prevSelected.some((p) => p.id === product.id);
      return isAlreadySelected ? prevSelected.filter((p) => p.id !== product.id) : [...prevSelected, product];
    });

  };

  const handleConfirmSelection = () => {
    // console.log("Selected Products:", tempSelectedProducts);
    setSelectedProducts(tempSelectedProducts);
    setModalShow(false);
  };

  return (
    <Modal show={show} onHide={onHide} centered contentClassName="custom-modal-content">
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
                        <p>Loading...</p>
                      ) : displayedProducts.length > 0 ? (
                        displayedProducts.map((product) => (
                          <div key={product.id} className="d-flex justify-content-between align-items-center mb-2 gap-2 px-3">
                            <div className="d-flex align-items-center mb-2 gap-2 px-3">
                                <div>
                                    <Card.Img
                                    variant="top"
                                    src={product.images?.[0]?.src || "https://via.placeholder.com/150"}
                                    alt={product.images?.[0]?.alt || "Product Image"}
                                    style={{ height: "85px", width: "85px", objectFit: "cover" }}
                                    />
                                </div>
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
  console.log(productIds);

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
      <Button variant="" onClick={() => setModalShow(true)}>
        <h5 className="mb-3 mt-2">Select Products</h5>
      </Button>
      <MyVerticallyCenteredModal
        setModalShow={setModalShow}
        show={modalShow}
        onHide={handleClose}
        products={products}
        loading={loading}
        setSelectedProducts={setSelectedProducts}
        selectedProducts={selectedProducts}
      />
    </>
  );
};

export default ProductsModel;
