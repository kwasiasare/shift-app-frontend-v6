import React, { useState } from 'react';
import { confirmSignUp } from 'aws-amplify/auth';

const ConfirmSignUpForm = () => {
  const [formData, setFormData] = useState({ email: '', confirmationCode: '' });
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { isSignUpComplete } = await confirmSignUp({
        username: formData.email,
        confirmationCode: formData.confirmationCode,
      });
      setMessage(isSignUpComplete ? 'Signup confirmed!' : 'Retry with a valid code.');
    } catch (error) {
      setMessage(`Confirmation failed: ${error.message}`);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        name="email"
        placeholder="Email"
        value={formData.email}
        onChange={handleChange}
        required
      />
      <input
        type="text"
        name="confirmationCode"
        placeholder="Confirmation Code"
        value={formData.confirmationCode}
        onChange={handleChange}
        required
      />
      <button type="submit">Confirm</button>
      <p>{message}</p>
    </form>
  );
};

export default ConfirmSignUpForm;
