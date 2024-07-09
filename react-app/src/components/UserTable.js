import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, Button, FormControl, Container, Modal } from 'react-bootstrap';

const API_URL = 'http://localhost:3000/api/users'; // Adjust this URL to match your backend endpoint

const UserTable = () => {
  const [users, setUsers] = useState([]);
  const [editingUserId, setEditingUserId] = useState(null);
  const [userUpdates, setUserUpdates] = useState({});
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userIdToDelete, setUserIdToDelete] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get(API_URL);
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleEdit = (userId) => {
    setEditingUserId(userId);
  };

  const handleChange = (userId, field, value) => {
    setUserUpdates({
      ...userUpdates,
      [userId]: {
        ...userUpdates[userId],
        [field]: value,
      },
    });
  };

  const handleUpdate = async (userId) => {
    try {
      await axios.put(`${API_URL}/${userId}`, userUpdates[userId]);
      fetchUsers();
      setEditingUserId(null);
      setUserUpdates({});
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  const handleShowDeleteModal = (userId) => {
    setUserIdToDelete(userId);
    setShowDeleteModal(true);
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
    setUserIdToDelete(null);
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`${API_URL}/${userIdToDelete}`);
      fetchUsers();
      handleCloseDeleteModal();
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  return (
    <Container>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id}>
              <td>
                {editingUserId === user._id ? (
                  <FormControl
                    type="text"
                    value={userUpdates[user._id]?.name || user.name}
                    onChange={(e) => handleChange(user._id, 'name', e.target.value)}
                  />
                ) : (
                  user.name
                )}
              </td>
              <td>
                {editingUserId === user._id ? (
                  <FormControl
                    type="text"
                    value={userUpdates[user._id]?.email || user.email}
                    onChange={(e) => handleChange(user._id, 'email', e.target.value)}
                  />
                ) : (
                  user.email
                )}
              </td>
              <td>
                {editingUserId === user._id ? (
                  <Button variant="success" onClick={() => handleUpdate(user._id)}>Update</Button>
                ) : (
                  <>
                    <Button variant="warning" onClick={() => handleEdit(user._id)}>Edit</Button>
                    <Button variant="danger" onClick={() => handleShowDeleteModal(user._id)}>Delete</Button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showDeleteModal} onHide={handleCloseDeleteModal}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this user?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseDeleteModal}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default UserTable;
