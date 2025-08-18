import React from 'react';
import { useState } from "react";
import logoutService from '../services/logout.js'
import passwordService from '../services/password.js'

export function Logout({ setLogin }) {
  const [showInput, setShowInput] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogout = async () => {
    await logoutService.logoutPost()
    console.log('User logged out');
    setLogin(true);
  }

  const handleSavePassword = async () => {
    setError("")
    result = await passwordService.changePassword(newPassword)
      .then(result => {
        if (result.status === 200) {
          // assuming tasks are in result.data
          console.log("success")
        }
        else if (result.status === 422) {
          console.warn('Unexpected status:', result.status);
        }
      })
      .catch(error => {
        console.log(error.response.data.details)
        setError(error.response.data.details)
      });

    setShowInput(false);
    setNewPassword("");
  }

  return (
    <div className="flex flex-col right-4 space-y-4">
      <button
        onClick={handleLogout}
        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
      >
        Logout
      </button>
      <div className="flex flex-col gap-2 w-64">
        {!showInput ? (
          <button
            onClick={() => setShowInput(true)}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Change password
          </button>
        ) : (
          <>
            <input
              type="password"
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="bg-white rounded shadow-md border rounded px-3 py-2 w-full"
            />
            {error && (
              <p className="text-red-500 text-sm mt-1">{error}</p>
            )}
            <div className="flex gap-2">
              <button
                onClick={handleSavePassword}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              >
                Save
              </button>
              <button
                onClick={() => setShowInput(false)}
                className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}