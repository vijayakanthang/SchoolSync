import React, { useEffect, useState } from 'react';

function HomePage() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  return (
    <div style={{ padding: "2rem", fontSize: "1.2rem" }}>
      {user ? (
        <>
          <h2>Welcome, {user.name}!</h2>
          <p>You are logged in as <strong>{user.role}</strong>.</p>
        </>
      ) : (
        <p>Loading user info...</p>
      )}
    </div>
  );
}

export default HomePage;
