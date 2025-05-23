import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function RegistrationPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate(); // Hook for navigation

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    // Simple frontend validation
    if (!username || !email || !password || !role) {
      setError("All fields are required.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("http://localhost:9090/api/users/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, email, password, role }),
      });

      const data = await response.json();
      setLoading(false);

      if (response.ok) {
        console.log("User registered successfully:", data);
        navigate("/"); // Redirect to home/login page
      } else {
        throw new Error(data.error || "Registration failed");
      }
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <div className="form-container">
        <h1 className="form-title">Register</h1>
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleSignUp} className="form-content">
          <div className="form-group">
            <label htmlFor="username" className="form-label">Username</label>
            <input
              id="username"
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="email" className="form-label">Email</label>
            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">Password</label>
            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="role" className="form-label">Role</label>
            <select
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              required
              className="form-select"
            >
              <option value="" disabled>Select your role</option>
              <option value="Customer">Customer</option>
            </select>
          </div>

          <button type="submit" className="form-button" disabled={loading}>
            {loading ? "Registering..." : "Sign Up"}
          </button>
        </form>

        <p className="form-footer">
          Already a user? <a href="/" className="form-link">Log in here</a>
        </p>
      </div>
    </div>
  );
}
