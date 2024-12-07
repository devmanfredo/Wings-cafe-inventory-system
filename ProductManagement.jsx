import React, { useEffect, useState } from 'react';
import { db } from '../Services/Firebase.config'; 
import { collection, addDoc, deleteDoc, doc, getDocs, updateDoc } from 'firebase/firestore';
import './ProductManagement.css';

const ProductManagement = () => {
    const [products, setProducts] = useState([]);
    const [product, setProduct] = useState({ id: '', name: '', description: '', category: '', price: '', quantity: '' });
    const [error, setError] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [showForm, setShowForm] = useState(false); 

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, 'products'));
                const productList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setProducts(productList);
            } catch (err) {
                setError('Failed to fetch products');
            }
        };

        fetchProducts();
    }, []);

    const addProduct = async (e) => {
        e.preventDefault();
        if (!product.name || !product.price) {
            alert('Please fill in all required fields.');
            return;
        }

        try {
            const docRef = await addDoc(collection(db, 'products'), product);
            setProducts([...products, { ...product, id: docRef.id }]);
            setProduct({ name: '', description: '', category: '', price: '', quantity: '' });
            setShowForm(false); 
        } catch (err) {
            setError('Failed to add product');
        }
    };

    const editProduct = async (e) => {
        e.preventDefault();
        if (!product.name || !product.price) {
            alert('Please fill in all required fields.');
            return;
        }

        try {
            await updateDoc(doc(db, 'products', product.id), {
                name: product.name,
                description: product.description,
                category: product.category,
                price: product.price,
                quantity: product.quantity,
            });

            const updatedProducts = products.map(p =>
                p.id === product.id ? { ...p, ...product } : p
            );
            setProducts(updatedProducts);
            setProduct({ name: '', description: '', category: '', price: '', quantity: '' });
            setIsEditing(false);
            setShowForm(false); 
        } catch (err) {
            setError('Failed to update product');
        }
    };

    const deleteProduct = async (id) => {
        try {
            await deleteDoc(doc(db, 'products', id));
            setProducts(products.filter(prod => prod.id !== id));
        } catch (err) {
            setError('Failed to delete product');
        }
    };

    const handleEditClick = (prod) => {
        setProduct(prod);
        setIsEditing(true);
        setShowForm(true); 
    };

    return (
        <div className="product-management">
            <h2>Product Management</h2>

            {/* Add Product button at the top-right corner */}
            <button className="add-product-button" onClick={() => setShowForm(true)}>Add Product</button>

            {/* Show form only when 'showForm' is true */}
            {showForm && (
                <form onSubmit={isEditing ? editProduct : addProduct} className={`product-form ${showForm ? 'show' : ''}`}>
                    <input 
                        type="text" 
                        placeholder="Name" 
                        value={product.name} 
                        onChange={(e) => setProduct({ ...product, name: e.target.value })} 
                        required 
                        className="input-field"
                    />
                    <input 
                        type="text" 
                        placeholder="Description" 
                        value={product.description} 
                        onChange={(e) => setProduct({ ...product, description: e.target.value })} 
                        className="input-field"
                    />
                    <input 
                        type="text" 
                        placeholder="Category" 
                        value={product.category} 
                        onChange={(e) => setProduct({ ...product, category: e.target.value })} 
                        className="input-field"
                    />
                    <input 
                        type="number" 
                        placeholder="Price" 
                        value={product.price} 
                        onChange={(e) => setProduct({ ...product, price: e.target.value })} 
                        required 
                        className="input-field"
                    />
                    <input 
                        type="number" 
                        placeholder="Qty" 
                        value={product.quantity} 
                        onChange={(e) => setProduct({ ...product, quantity: e.target.value })} 
                        className="input-field"
                    />
                    <button type="submit" className="submit-button">{isEditing ? 'Update Product' : 'Add Product'}</button>
                    <button type="button" onClick={() => setShowForm(false)} className="submit-button">Cancel</button> {/* Optional Cancel button */}
                </form>
            )}

            {error && <p className="error">{error}</p>}

            <div className="table-container">
                <table className="product-table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Description</th>
                            <th>Category</th>
                            <th>Price</th>
                            <th>Quantity</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map((prod) => (
                            <tr key={prod.id}>
                                <td>{prod.name}</td>
                                <td>{prod.description}</td>
                                <td>{prod.category}</td>
                                <td>{prod.price}</td>
                                <td>{prod.quantity}</td>
                                <td>
                                    <button onClick={() => handleEditClick(prod)} className="edit-button">Edit</button>
                                    <button onClick={() => deleteProduct(prod.id)} className="delete-button">Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ProductManagement;
