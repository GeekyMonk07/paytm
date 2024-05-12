import React, { useState, useEffect } from 'react';
import axios from 'axios';

export const Balance = () => {
    const [balance, setBalance] = useState(null);

    useEffect(() => {
        const fetchBalance = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    console.log('Token not found.');
                    return;
                }

                const response = await axios.get('http://localhost:4000/api/v1/account/balance', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setBalance(response.data.balance.toFixed(2));

            } catch (error) {
                console.error('Error fetching balance:', error);
            }
        };

        fetchBalance();
    }, []);

    return (
        <div className="flex">
            <div className="font-bold text-lg">Your balance:</div>
            <div className="font-semibold ml-4 text-lg">{balance !== null ? `₹${balance}` : 'Loading...'}</div>
        </div>
    );
};
