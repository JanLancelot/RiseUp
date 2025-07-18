import { useEffect, useState } from 'react';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import './usermang.css';
import { db } from '../../../../../backend/config/firebase';
import { FaUsers } from "react-icons/fa6";

function UserManagement() {
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, 'users_info'));
                const usersData = querySnapshot.docs
                    .map(doc => ({ id: doc.id, ...doc.data() }))
                    .filter(user => user.role === 'client');

                setUsers(usersData);
                setFilteredUsers(usersData);
            } catch (err) {
                console.error('Error fetching users:', err);
            }
        };

        fetchUsers();
    }, []);

    const handleSearch = () => {
        const query = searchQuery.toLowerCase();
        const filtered = users.filter(user =>
            user.fullname?.toLowerCase().includes(query) ||
            user.username?.toLowerCase().includes(query) ||
            user.sectionYear?.toLowerCase().includes(query)
        );
        setFilteredUsers(filtered);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    return (
        <div className="adn-user-management">
            <h2 className="adn-user-management-title">
                <FaUsers className='adn-icon-title-btn' /> User Management
            </h2>
             <input
                type="text"
                placeholder="Search by Full Name, Username, or Section & Year"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                className="adn-search-input"
            />
            <div className="adn-table-wrapper">
                <table className="adn-user-table">
                    <thead>
                        <tr>
            
                            <th>UID</th>
                            <th>Full Name</th>
                            <th>Email</th>
                            <th>Username</th>
                            <th>Section & Year</th>
                            <th>Parish</th>
                            <th>Municipality</th>
                            <th>Created At</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredUsers.map((user) => (
                            <tr key={user.id}>
                                <td>{user.id}</td>
                                <td>{user.fullname || 'N/A'}</td>
                                <td>{user.email || 'N/A'}</td>
                                <td>{user.username || 'N/A'}</td>
                                <td>{user.section && user.year ? `${user.section} - ${user.year}` : 'N/A'}</td>
                                <td>{user.parish || 'N/A'}</td>
                                <td>{user.municipality || 'N/A'}</td>
                                <td>{user.createdAt ? new Date(user.createdAt.seconds * 1000).toLocaleDateString() : 'N/A'}</td>
                                <td>
                                    <div className='adn-table-btn-group'>
                                        <button className="adn-edit-btn">Edit</button>
                                        <button className="adn-delete-btn">Delete</button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default UserManagement;