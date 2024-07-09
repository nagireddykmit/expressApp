import React from 'react';
import UserTable from './components/UserTable';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { Container } from 'react-bootstrap';

const App = () => {
  return (
    <div className="App">
        <h1>User Management</h1>
      <main>
        <Container>
          <UserTable />
        </Container>
      </main>
    </div>
  );
};

export default App;
