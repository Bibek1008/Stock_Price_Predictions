import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Box, Card, CardContent, Typography, TextField, Button, Grid, Alert } from '@mui/material';
import axios from 'axios';
const API_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5001';

const Auth = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = location.state?.from || '/';
  const [mode, setMode] = useState('login');
  const [loginForm, setLoginForm] = useState({ identifier: '', password: '' });
  const [signupForm, setSignupForm] = useState({ username: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleLogin = async () => {
    setError('');
    setSuccess('');
    try {
      const res = await axios.post(`${API_URL}/api/auth/login`, loginForm);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;
      window.dispatchEvent(new Event('authChanged'));
      setSuccess('Logged in successfully');
      navigate(redirectTo);
    } catch (e) {
      setError(e.response?.data?.error || e.message);
    }
  };

  const handleSignup = async () => {
    setError('');
    setSuccess('');
    try {
      const res = await axios.post(`${API_URL}/api/auth/signup`, signupForm);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;
      window.dispatchEvent(new Event('authChanged'));
      setSuccess('Account created successfully');
      navigate(redirectTo);
    } catch (e) {
      setError(e.response?.data?.error || e.message);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                {mode === 'login' ? 'Sign In' : 'Sign Up'}
              </Typography>
              {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
              {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
              {mode === 'login' ? (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <TextField label="Email or Username" value={loginForm.identifier} onChange={(e) => setLoginForm({ ...loginForm, identifier: e.target.value })} />
                  <TextField label="Password" type="password" value={loginForm.password} onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })} />
                  <Button variant="contained" onClick={handleLogin}>Sign In</Button>
                  <Button variant="text" onClick={() => setMode('signup')}>Create an account</Button>
                </Box>
              ) : (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <TextField label="Username" value={signupForm.username} onChange={(e) => setSignupForm({ ...signupForm, username: e.target.value })} />
                  <TextField label="Email" value={signupForm.email} onChange={(e) => setSignupForm({ ...signupForm, email: e.target.value })} />
                  <TextField label="Password" type="password" value={signupForm.password} onChange={(e) => setSignupForm({ ...signupForm, password: e.target.value })} />
                  <Button variant="contained" onClick={handleSignup}>Sign Up</Button>
                  <Button variant="text" onClick={() => setMode('login')}>Already have an account?</Button>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Auth;