import React, { useState, useEffect } from 'react';
import './myprofile.css';
import Axios from 'axios';
import { getSession, errorResponse } from './main'; // Assuming these are defined in main.js

const myprofile = () => {
  // State variables to store user information
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

  // Function to fetch user profile information
  const profileInfo = () => {
    const url = "http://localhost:5000/myprofile/info";
    Axios.post(url, { emailid: getSession("sid") })
      .then(response => loadInfo(response.data))
      .catch(error => errorResponse(error));
  }

  // Function to handle the response from fetching user profile information
  const loadInfo = (data) => {
    // Update the state variables with the fetched user information
    setFirstName(data.firstName);
    setLastName(data.lastName);
    setEmail(data.email);
    setContactNumber(data.contactNumber);
    // Add more set functions as per your API response structure
  }

  useEffect(() => {
    // Fetch user profile information when the component mounts
    profileInfo();
  }, []); 

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      
      const url = "http://localhost:5000/myprofile/update";
      const response = await Axios.post(url, {
        emailid: getSession("sid"),
        firstName,
        lastName,
        email,
        contactNumber,
        currentPassword,
        newPassword,
        confirmNewPassword
      });

      console.log('Profile updated successfully:', response.data);

      // Reset the form fields
      setFirstName('');
      setLastName('');
      setEmail('');
      setContactNumber('');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmNewPassword('');

      // Fetch updated user profile information
      profileInfo();

    } catch (error) {
      errorResponse(error);
    }
  };

  return (
    <div>
      <h1>Profile Page</h1>
      <form onSubmit={handleSubmit}>
        {/* Form fields for user profile information */}
        <div>
          <label htmlFor="firstName">First Name:</label>
          <input type="text" id="firstName" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
        </div>
        <div>
          <label htmlFor="lastName">Last Name:</label>
          <input type="text" id="lastName" value={lastName} onChange={(e) => setLastName(e.target.value)} />
        </div>
        <div>
          <label htmlFor="email">Email:</label>
          <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div>
          <label htmlFor="contactNumber">Contact Number:</label>
          <input type="text" id="contactNumber" value={contactNumber} onChange={(e) => setContactNumber(e.target.value)} />
        </div>
        <div>
          <label htmlFor="currentPassword">Current Password:</label>
          <input type="password" id="currentPassword" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} />
        </div>
        <div>
          <label htmlFor="newPassword">New Password:</label>
          <input type="password" id="newPassword" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
        </div>
        <div>
          <label htmlFor="confirmNewPassword">Confirm New Password:</label>
          <input type="password" id="confirmNewPassword" value={confirmNewPassword} onChange={(e) => setConfirmNewPassword(e.target.value)} />
        </div>
        <button type="submit">Update Profile</button>
      </form>
    </div>
  );
};

export default myprofile;
