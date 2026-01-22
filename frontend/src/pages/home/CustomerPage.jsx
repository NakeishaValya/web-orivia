import React from 'react';
import Navbar from '../../components/ui/Navbar.jsx';

const CustomerPage = () => {
  return (
    <div>
      <Navbar variant="main" />
      <main style={{ padding: 32 }}>
        <h1>Customer Dashboard</h1>
        <p>Dummy Customer page — linked from Explore button.</p>
      </main>
    </div>
  );
};

export default CustomerPage;
