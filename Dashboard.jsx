import React, { useEffect, useState } from 'react';
import { db } from '../Services/Firebase.config'; 
import { collection, getDocs } from 'firebase/firestore';
import './Dashboard.css'; 

const Dashboard = () => {
    const [userCount, setUserCount] = useState(0);
    const [stockCount, setStockCount] = useState(0);
    const [productCount, setProductCount] = useState(0);
    const [recentUsers, setRecentUsers] = useState([]);
    const [recentStockItems, setRecentStockItems] = useState([]);
    const [recentProducts, setRecentProducts] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const userSnapshot = await getDocs(collection(db, 'users'));
                const stockSnapshot = await getDocs(collection(db, 'stock'));
                const productSnapshot = await getDocs(collection(db, 'products'));

                setUserCount(userSnapshot.docs.length);
                setStockCount(stockSnapshot.docs.length);
                setProductCount(productSnapshot.docs.length);

                setRecentUsers(userSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })).slice(0, 5));
                setRecentStockItems(stockSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })).slice(0, 5));
                setRecentProducts(productSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })).slice(0, 5));
            } catch (err) {
                console.error('Error fetching data:', err);
            }
        };

        fetchData();
    }, []);

    return (
        <div className="dashboard">
            <h1>Dashboard Overview</h1>
            <div className="dashboard-cards">
                <div className="card">
                    <h2>Users</h2>
                    <p>{userCount}</p>
                </div>
                <div className="card">
                    <h2>Stock Items</h2>
                    <p>{stockCount}</p>
                </div>
                <div className="card">
                    <h2>Products</h2>
                    <p>{productCount}</p>
                </div>
            </div>

            <div className="table-container">
                <h2>Recent Users</h2>
                <table>
                    <thead>
                        <tr>
                            <th>Username</th>
                            <th>Role</th>
                        </tr>
                    </thead>
                    <tbody>
                        {recentUsers.map(user => (
                            <tr key={user.id}>
                                <td>{user.username}</td>
                                <td>{user.role}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <h2>Recent Stock Items</h2>
                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Quantity</th>
                        </tr>
                    </thead>
                    <tbody>
                        {recentStockItems.map(item => (
                            <tr key={item.id}>
                                <td>{item.name}</td>
                                <td>{item.quantity}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <h2>Recent Products</h2>
                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Price</th>
                        </tr>
                    </thead>
                    <tbody>
                        {recentProducts.map(product => (
                            <tr key={product.id}>
                                <td>{product.name}</td>
                                <td>{product.price}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <footer className="footer">
                <p>&copy; 2024 Teboho Moloi. All rights reserved.</p>
            </footer>
        </div>
    );
};

export default Dashboard;
