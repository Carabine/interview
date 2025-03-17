import { useState, useEffect } from 'react';
import axios from 'axios';

const Orders = ({ userId }) => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                setLoading(true);
                setError(null);
                const response = await axios.get(`http://localhost:3005/orders/${userId}`);
                setOrders(response.data);
            } catch (err) {
                setError('Failed to fetch orders. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        if (userId) {
            fetchOrders();
        }
    }, [userId]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div style={{ color: 'red' }}>{error}</div>;
    }

    return (
        <div>
            <h2>Orders for User {userId}</h2>
            <ul>
                {orders.map(order => (
                    <li key={order.id}>
                        <p>Product: {order.productId}</p>
                        <p>Quantity: {order.quantity}</p>
                        <p>Total Price: {order.totalPrice}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Orders;
