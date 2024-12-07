import React, { useEffect, useState } from 'react';
import { db } from '../Services/Firebase.config'; 
import { collection, addDoc, deleteDoc, doc, getDocs, updateDoc } from 'firebase/firestore';
import './UserManagement.css';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [user, setUser] = useState({ username: '', role: '' });
    const [editingUser, setEditingUser] = useState(null);
    const [error, setError] = useState('');
    const [showForm, setShowForm] = useState(false); 

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, 'users'));
                const userList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setUsers(userList);
            } catch (err) {
                setError('Failed to fetch users');
            }
        };

        fetchUsers();
    }, []);

    const addUser = async (e) => {
        e.preventDefault();
        if (!user.username || !user.role) {
            alert('Please fill in all fields.');
            return;
        }

        try {
            await addDoc(collection(db, 'users'), user);
            setUsers([...users, { ...user, id: Date.now() }]);
            setUser({ username: '', role: '' }); 
            setShowForm(false); 
        } catch (err) {
            setError('Failed to add user');
        }
    };

    const editUser = (usr) => {
        setEditingUser(usr);
        setUser({ username: usr.username, role: usr.role });
        setShowForm(true); 
    };

    const saveUser = async (e) => {
        e.preventDefault();
        if (!user.username || !user.role) {
            alert('Please fill in all fields.');
            return;
        }

        try {
            await updateDoc(doc(db, 'users', editingUser.id), user);
            setUsers(users.map(usr => (usr.id === editingUser.id ? { ...usr, ...user } : usr)));
            setUser({ username: '', role: '' }); 
            setEditingUser(null); 
            setShowForm(false); 
        } catch (err) {
            setError('Failed to update user');
        }
    };

    // Delete a user from Firestore
    const deleteUser = async (id) => {
        try {
            await deleteDoc(doc(db, 'users', id));
            setUsers(users.filter(u => u.id !== id));
        } catch (err) {
            setError('Failed to delete user');
        }
    };

    return (
        <div className="user-management">
            <h2>User Management</h2>

            
            <button className="add-user-button" onClick={() => setShowForm(true)}>Add User</button>

            {/* Show form only when 'showForm' is true */}
            {showForm && (
                <form onSubmit={editingUser ? saveUser : addUser} className={`user-form ${showForm ? 'show' : ''}`}>
                    <input
                        type="text"
                        placeholder="Username"
                        value={user.username}
                        onChange={(e) => setUser({ ...user, username: e.target.value })}
                        required
                        className="input-field"
                    />
                    <input
                        type="text"
                        placeholder="Role"
                        value={user.role}
                        onChange={(e) => setUser({ ...user, role: e.target.value })}
                        required
                        className="input-field"
                    />
                    <button type="submit">{editingUser ? 'Save Changes' : 'Add User'}</button>
                    <button type="button" onClick={() => setShowForm(false)}>Cancel</button> {/* Optional Cancel button */}
                </form>
            )}

            {error && <p className="error">{error}</p>}

            <table className="user-table">
                <thead>
                    <tr>
                        <th>Username</th>
                        <th>Role</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((usr) => (
                        <tr key={usr.id}>
                            <td>{usr.username}</td>
                            <td>{usr.role}</td>
                            <td>
                                <button onClick={() => editUser(usr)}>Edit</button>
                                <button onClick={() => deleteUser(usr.id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default UserManagement;
