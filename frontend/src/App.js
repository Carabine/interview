// Next time I will instantly skip a vacancy where I am asked to complete a to-do list test task for a middle position

import React, { useState } from 'react';
import OrderForm from './OrderForm';
import OrdersTable from './OrdersTable';

const App = () => {
    const [userId, setUserId] = useState('');

    return (
        <div>
            <h1>Order Management System</h1>
            <input
                type="text"
                placeholder="Enter User ID"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
            />
            {userId && <OrderForm userId={userId} />}
            {userId && <OrdersTable userId={userId} />}
        </div>
    );
};

export default App;
