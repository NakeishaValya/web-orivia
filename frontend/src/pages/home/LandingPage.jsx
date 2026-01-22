import React from 'react';
import Navbar from '../../components/ui/Navbar.jsx';

const LandingPage = () => {
  return (
    <div>
      <Navbar variant="landing" />
      <main style={{ padding: 32 }}>
        <h1>Welcome to ORIVIA</h1>
        <p>This is a dummy landing page. Click Login to go to the login screen.</p>
      </main>
    </div>
  );
};

export default LandingPage;
