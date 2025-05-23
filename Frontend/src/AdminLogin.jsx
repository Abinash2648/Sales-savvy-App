import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './assets/style.css'; // Same CSS as Customer

export default function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await fetch('http://localhost:9090/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        if (data.role === 'Admin') {
          navigate('/AdminDashboard');
        }  else {
          throw new Error('Access denied: not an admin');
        }
      } else {
        throw new Error(data.error || 'Login failed');
      }
    } catch (err) {
      setError(err.message || "Unexcepted error occurred");
    }
  };

  return (
    <div className="admin-page-container">
      <div className="form-container" >
        <h1 className="form-title">Admin Login</h1>
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleAdminLogin} className="form-content">
          <div className="form-group">
            <label htmlFor="username" className="form-label">Username</label>
            <input
              id="username"
              type="text"
              placeholder="Enter Admin username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label htmlFor="password" className="form-label">Password</label>
            <input
              id="password"
              type="password"
              placeholder="Enter Admin password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="form-input"
            />
          </div>
          <button type="submit" className="form-button">Enter As Admin</button>
        </form>
        <div className="form-footer">
          <a href="/" className="form-link">Not Admin? Login As User!</a>
        </div>
      </div>
    </div>
  );
}
