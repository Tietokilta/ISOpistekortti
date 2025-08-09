import React from 'react';
import logoutService from '../services/logout.js'

export function Logout({ setLogin }) {
  const handleLogout = async () => {
    await logoutService.logoutPost()
    console.log('User logged out');
    setLogin(true);
  }

  const handleChangePassword = async () => {
    console.log("changing password")
  }

  return (
    <div className="flex flex-col absolute top-4 right-4 space-y-4">
      <button
        onClick={handleLogout}
        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
      >
        Logout
      </button>
      <button
        onClick={handleChangePassword}
        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
      >
        Change password
      </button>
    </div>
  );
}