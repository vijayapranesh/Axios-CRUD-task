
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

const API_URL = 'https://jsonplaceholder.typicode.com/users';

function App() {
  const [users, setUsers] = useState([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get(API_URL);
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(API_URL, { name, email });
      setUsers([...users, response.data]);
      setName('');
      setEmail('');
    } catch (error) {
      console.error('Error adding user:', error);
    }
  };

  const handleDeleteUser = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      setUsers(users.filter(user => user.id !== id));
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const handleEditUser = (id) => {
    const userToEdit = users.find(user => user.id === id);
    if (userToEdit) {
      setName(userToEdit.name);
      setEmail(userToEdit.email);
      setEditingId(id);
    }
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${API_URL}/${editingId}`, { name, email });
      setUsers(users.map(user =>
        user.id === editingId ? { ...user, name, email } : user
      ));
      setName('');
      setEmail('');
      setEditingId(null);
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  return (
    <div >
      <h2 style={{textAlign:'center',color:'gray'}}> CRUD Operations with Axios</h2>

      <div style={{display:'flex',justifyContent:'center'}}>
        <Form onSubmit={editingId ? handleUpdateUser : handleAddUser} >
          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Name</Form.Label>
            <Form.Control type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)}/>
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Email address</Form.Label>
            <Form.Control type="email" placeholder="Enter email" value={email} onChange={(e) => setEmail(e.target.value)}/>
          </Form.Group>

          <Button variant="primary" type="submit">
            {editingId ? 'Update User' : 'Add User'}
          </Button>
        </Form>
      </div>

      
    
      <div style={{marginTop:'2em'}}>
        <table style={{textAlign:'center' , width:'100%',border:'1px solid black',}}>
          <thead style={{border:'1px solid black',backgroundColor:'#0B5ED7',color:'white'}}>
              <tr>
                <th style={{border:'1px solid black',padding:'1em 0'}}>Name</th>
                <th style={{border:'1px solid black'}}>Email</th>
                <th style={{border:'1px solid black'}}>Action</th>
              </tr>
            </thead>

            <tbody>
            
                {
                  users.map((user,index) => (
                    <tr key={index}>
                      <td style={{border:'1px solid black',padding:'1em 0'}}>{user.name}</td>
                      <td style={{border:'1px solid black'}}>{user.email}</td>
                      <td style={{border:'1px solid black'}}>
                      <Button style={{margin:'0 1em'}} variant="primary" onClick={() => handleEditUser(user.id)}>Edit</Button>
                      <Button variant="warning" onClick={() => handleDeleteUser(user.id)}>Delete</Button>
                      </td>
                    </tr>
                  ))
                }   
                      
            </tbody>
          </table> 
      </div>
    </div>
  );
}

export default App;
