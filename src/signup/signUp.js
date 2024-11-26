import React, { useState } from 'react';
import { signUp } from 'aws-amplify/auth';

const SignUpForm = () => {
  const [formData, setFormData] = useState({ email: '', password: '', phone: '' });
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { isSignUpComplete } = await signUp({
        username: formData.email,
        password: formData.password,
        options: {
          userAttributes: {
            email: formData.email,
            phone_number: formData.phone,
          },
        },
      });
      setMessage(isSignUpComplete ? 'Sign up successful!' : 'Confirm your email.');
    } catch (error) {
      setMessage(`Sign up failed: ${error.message}`);
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
        type="password"
        name="password"
        placeholder="Password"
        value={formData.password}
        onChange={handleChange}
        required
      />
      <input
        type="text"
        name="phone"
        placeholder="Phone Number"
        value={formData.phone}
        onChange={handleChange}
        required
      />
      <button type="submit">Sign Up</button>
      <p>{message}</p>
    </form>
  );
};

export default SignUpForm;
