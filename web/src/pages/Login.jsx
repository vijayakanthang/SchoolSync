import React, { useState } from 'react';
import "../styles/Login.css";
import { GoogleLogin } from "@react-oauth/google";
import {jwtDecode} from "jwt-decode";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Login({ role, onBack, onSwitchToRegister }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Login failed");
      } else {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        navigate("/dashboard");
      }
    } catch (err) {
      setError("Server error");
    }
  };

  const handleGoogleLoginSuccess = async (credentialResponse) => {
    try {
      const decoded = jwtDecode(credentialResponse.credential);
      const { name, email, sub } = decoded;

      const res = await axios.post("http://localhost:5000/api/auth/google", {
        name,
        email,
        googleId: sub
      });

      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.user));
        navigate("/dashboard");
      } else {
        setError("Google login failed");
      }
    } catch (error) {
      console.error("Google login error:", error);
      setError("Google login failed");
    }
  };

  const roleColors = {
    student: '#FF7F50',
    parent: '#3E4E88',
    teacher: '#237E6F',
  };

  const borderColor = {
    student: '3px solid #FFD580',
    parent: '3px solid #91A6FF',
    teacher: '3px solid #66C2A5',
  };

  return (
    <div
      className='login-container'
      style={{
        backgroundColor: roleColors[role] || '#fff',
        border: borderColor[role] || 'none'
      }}
    >
      <button className="back-button" onClick={onBack}>⬅ Back</button>

      <form onSubmit={handleSubmit}>
        <div className='form-fields'>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            name="email"
            placeholder='E-mail'
            required
            onChange={handleChange}
          />
        </div>
        <div className='form-fields'>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            name="password"
            placeholder='Password'
            required
            onChange={handleChange}
          />
        </div>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <input type="submit" value="Login" />
      </form>

      <div className='google-container'>
        <GoogleLogin
          onSuccess={handleGoogleLoginSuccess}
          onError={() => {
            console.log("Google login failed");
            setError("Google login failed");
          }}
        />
      </div>

      <p className="switch-text">
        Don’t have an account?{' '}
        <span onClick={onSwitchToRegister} style={{ cursor: 'pointer', textDecoration: 'underline' }}>
          Register here
        </span>
      </p>
    </div>
  );
}

export default Login;
