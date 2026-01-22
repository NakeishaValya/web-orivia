import React from 'react';
import Navbar from '../../components/ui/Navbar.jsx';

const AgentPage = () => {
  return (
    <div>
      <Navbar variant="main" />
      <main style={{ padding: 32 }}>
        <h1>Agent Dashboard</h1>
        <p>Dummy Agent page — linked from Trip button.</p>
      </main>
    </div>
  );
};

export default AgentPage;
