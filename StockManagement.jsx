import React, { useEffect, useState } from 'react';
import { db } from '../Services/Firebase.config'; 
import { collection, addDoc, deleteDoc, doc, getDocs, updateDoc } from 'firebase/firestore';
import './StockManagement.css';

const StockManagement = () => {
    const [stockItems, setStockItems] = useState([]);
    const [item, setItem] = useState({ name: '', quantity: '' });
    const [editingItem, setEditingItem] = useState(null);
    const [error, setError] = useState('');
    const [showForm, setShowForm] = useState(false);

    useEffect(() => {
        const fetchStockItems = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, 'stock'));
                const stockList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setStockItems(stockList);
            } catch (err) {
                setError('Failed to fetch stock items');
            }
        };

        fetchStockItems();
    }, []);

    const addStockItem = async (e) => {
        e.preventDefault();
        if (!item.name || !item.quantity) {
            alert('Please fill in all fields.');
            return;
        }

        try {
            await addDoc(collection(db, 'stock'), item);
            setStockItems([...stockItems, item]);
            setItem({ name: '', quantity: '' });
            setShowForm(false); 
        } catch (err) {
            setError('Failed to add stock item');
        }
    };

    const editStockItem = (stock) => {
        setEditingItem(stock);
        setItem({ name: stock.name, quantity: stock.quantity });
        setShowForm(true); 
    };

    const saveStockItem = async (e) => {
        e.preventDefault();
        if (!item.name || !item.quantity) {
            alert('Please fill in all fields.');
            return;
        }

        try {
            await updateDoc(doc(db, 'stock', editingItem.id), item);
            setStockItems(stockItems.map((stock) => (stock.id === editingItem.id ? { ...stock, ...item } : stock)));
            setItem({ name: '', quantity: '' });
            setEditingItem(null);
            setShowForm(false); 
        } catch (err) {
            setError('Failed to update stock item');
        }
    };

    const deleteStockItem = async (id) => {
        try {
            await deleteDoc(doc(db, 'stock', id));
            setStockItems(stockItems.filter(stock => stock.id !== id));
        } catch (err) {
            setError('Failed to delete stock item');
        }
    };

    return (
        <div className="stock-management">
            <h2>Stock Management</h2>

            {/* "Add Item" button at the top-right corner */}
            <button className="add-item-button" onClick={() => setShowForm(true)}>Add Item</button>

            {/* Show form only when 'showForm' is true */}
            {showForm && (
                <form onSubmit={editingItem ? saveStockItem : addStockItem} className={`stock-form ${showForm ? 'show' : ''}`}>
                    <input 
                        type="text" 
                        placeholder="Item Name" 
                        value={item.name} 
                        onChange={(e) => setItem({ ...item, name: e.target.value })} 
                        required 
                        className="short-input"
                    />
                    <input 
                        type="number" 
                        placeholder="Qty" 
                        value={item.quantity} 
                        onChange={(e) => setItem({ ...item, quantity: e.target.value })} 
                        required 
                        className="short-input"
                    />
                    <button type="submit">{editingItem ? 'Save Changes' : 'Add Item'}</button>
                    <button type="button" onClick={() => setShowForm(false)}>Cancel</button> {/* Optional Cancel button */}
                </form>
            )}

            {error && <p className="error">{error}</p>}

            <div className="table-container">
                <table className="stock-table">
                    <thead>
                        <tr>
                            <th>Item Name</th>
                            <th>Quantity</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {stockItems.map((stock) => (
                            <tr key={stock.id}>
                                <td>{stock.name}</td>
                                <td>{stock.quantity}</td>
                                <td>
                                    <button onClick={() => editStockItem(stock)}>Edit</button>
                                    <button onClick={() => deleteStockItem(stock.id)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default StockManagement;
