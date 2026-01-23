import React from 'react';
import Navbar from '../../components/ui/Navbar.jsx';

const HomePage = () => {
  return (
    <div>
      <Navbar variant="main" />
      <main style={{ padding: 32 }}>
        <h1>Home</h1>
        <p>Dummy home page — you reached it after login.</p>
      </main>
    </div>
  );
};

export default HomePage;
