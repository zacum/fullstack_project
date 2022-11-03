import * as React from 'react';
import Button from '@mui/material/Button';
import { TextField, FormControlLabel, Checkbox, Link, Grid, Box, Typography, Container } from '@mui/material';
import { Link as RouterLink, Navigate } from 'react-router-dom';

import Copyright from '../../components/Copyright';
import LogoOnly from '../../components/LogoOnly';
import { useDispatch, useSelector } from 'react-redux';
import { selectRegistered, singupAsync } from 'src/features/auth/authSlice';
import { selectValidationErrors } from 'src/features/error/errorSlice';

export default function RegisterPage() {
  const dispatch = useDispatch();
  const registered = useSelector(selectRegistered);
  const errors = useSelector(selectValidationErrors(singupAsync));

  const handleSubmit = event => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    dispatch(
      singupAsync({
        firstName: data.get('firstName'),
        lastName: data.get('lastName'),
        email: data.get('email'),
        password: data.get('password'),
      }),
    );
  };

  if (registered) {
    return <Navigate to="/login" replace />;
  }

  return (
    <Container
      component="main"
      maxWidth="xs"
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        py: 2,
      }}
    >
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <LogoOnly />
        <Typography component="h1" variant="h5">
          Sign up
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                name="firstName"
                required
                fullWidth
                id="firstName"
                label="First Name"
                autoFocus
                autoComplete="firstName"
                error={!!errors?.firstName}
                helperText={errors?.firstName}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                id="lastName"
                label="Last Name"
                name="lastName"
                autoComplete="lastName"
                error={!!errors?.lastName}
                helperText={errors?.lastName}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                type="email"
                autoComplete="email"
                error={!!errors?.email}
                helperText={errors?.email}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="password"
                error={!!errors?.password}
                helperText={errors?.password}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={<Checkbox value="allowExtraEmails" color="primary" />}
                label="I want to receive inspiration, marketing promotions and updates via email."
              />
            </Grid>
          </Grid>
          <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
            Sign Up
          </Button>
          <Grid container justifyContent="flex-end">
            <Grid item>
              <Link to="/login" component={RouterLink} variant="body2">
                Already have an account? Sign in
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
      <Copyright sx={{ mt: 5 }} />
    </Container>
  );
}
