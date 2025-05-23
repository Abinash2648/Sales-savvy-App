import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import AppRoutes from './Routes'; // This should be your route definitions

function App() {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
}

export default App;
