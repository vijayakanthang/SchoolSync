import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "../styles/Login.css";
import { GoogleLogin } from "@react-oauth/google";

function Register({ role = 'student', onBack }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: role, // Default from props
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const res = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Registration failed");
      } else {
        alert("Registration successful! Please login.");
        navigate('/login');
      }
    } catch (err) {
      setError("Server error");
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
      {onBack && <button className="back-button" onClick={onBack}>⬅ Back</button>}
      <h4 className='registertext'>Register as {role.charAt(0).toUpperCase() + role.slice(1)}</h4>

      <form onSubmit={handleSubmit}>
        <div className='form-fields'>
          <label>Name:</label>
          <input type="text" name="name" placeholder="Full Name" onChange={handleChange} required />
        </div>
        <div className='form-fields'>
          <label>Email:</label>
          <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
        </div>
        <div className='form-fields'>
          <label>Password:</label>
          <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
        </div>
        {!role && (
          <div className='form-fields'>
            <label>Role:</label>
            <select name="role" onChange={handleChange} required>
              <option value="student">Student</option>
              <option value="parent">Parent</option>
              <option value="teacher">Teacher</option>
            </select>
          </div>
        )}
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <input type="submit" value="Register" />
      </form>

      <div className='google-container'>
        <GoogleLogin
          onSuccess={(credentialResponse) => {
            console.log("Google signup success", credentialResponse);
          }}
          onError={() => console.log("Google signup error")}
        />
      </div>
    </div>
  );
}

export default Register;
