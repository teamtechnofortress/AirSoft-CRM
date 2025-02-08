import React from 'react';
import { Card } from 'react-bootstrap'; // assuming you're using react-bootstrap for Card

const OrderLineItem = ({ item, index }) => {
  return (
    <div>
      <div className="d-flex align-items-center justify-content-start mb-2 gap-2" style={{ paddingLeft: '15px', paddingRight: '15px' }}>
        <div>
          {/* Dynamically set image source */}
          <Card.Img
            variant="top"
            src={item.image || '/images/avatar/avatar-2.jpg'} // Use item image if available
            style={{ height: '85px', width: '85px', objectFit: 'cover' }}
            alt={item.name || "Product Image"}
          />
        </div>
        <div>
          <Card.Subtitle className="mb-3 mt-2" style={{ fontSize: 14 }}>
            {item.name || 'Unknown Product'}
          </Card.Subtitle>

          <Card.Subtitle className="mb-3" style={{ fontSize: 12 }}>
            SKU: {item.sku || 'N/A'}
          </Card.Subtitle>

          <Card.Subtitle className="mb-3" style={{ fontSize: 12 }}>
            {item.price} USD
          </Card.Subtitle>

          <Card.Subtitle style={{ fontSize: 12 }}>
            Quantity: {item.quantity}
          </Card.Subtitle>
        </div>
      </div>
    </div>
  );
};

export default OrderLineItem;
