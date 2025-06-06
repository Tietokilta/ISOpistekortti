import React from 'react';
import logoutService from '../services/logout.js'

export function Logout({ setLogin }) {
  const handleLogout = async () => {
    await logoutService.logoutPost()
    console.log('User logged out');
    setLogin(true);
  }

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