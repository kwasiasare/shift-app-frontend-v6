import React, { useState } from 'react';
import { signIn } from 'aws-amplify/auth';

const SignInForm = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await signIn({
        username: formData.email,
        password: formData.password,
      });
      setMessage('Sign-in successful!');
    } catch (error) {
      setMessage(`Sign-in failed: ${error.message}`);
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
      <button type="submit">Sign In</button>
      <p>{message}</p>
    </form>
  );
};

export default SignInForm;
