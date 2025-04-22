import React from 'react';

export function Logout({ setLogin }) {
  const handleLogout = () => {
    // Clear user session (example)
    localStorage.removeItem('token'); // or whatever you store
    console.log('User logged out');
    setLogin(true);
    // Redirect if needed
    window.location.href = '/';
  };

  return (
    <div className="absolute top-4 right-4">
      <button 
        onClick={handleLogout} 
        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
      >
        Logout
      </button>
    </div>
  );
}