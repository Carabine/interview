import React, { useState } from 'react';

const OrderForm = ({ userId }) => {
    const [productId, setProductId] = useState('');
    const [quantity, setQuantity] = useState(1);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const response = await fetch('http://localhost:3005/orders', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                userId: userId,
                productId: productId,
                quantity: quantity,
            }),
        });

        const result = await response.json();

        if (!response.ok) {
            alert(result.error);
        } else {
            alert('Order created successfully!');
        }
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Product ID"
                    value={productId}
                    onChange={(e) => setProductId(e.target.value)}
                    required
                />
                <input
                    type="number"
                    placeholder="Quantity"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    required
                />
                <button type="submit">Submit Order</button>
            </form>
        </div>
    );
};

export default OrderForm;
