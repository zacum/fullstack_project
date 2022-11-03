import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { Link as RouterLink, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import Copyright from '../../components/Copyright';
import LogoOnly from '../../components/LogoOnly';
import { selectToken, signinAsync } from 'src/features/auth/authSlice';
import { selectValidationErrors } from 'src/features/error/errorSlice';

export default function LoginPage() {
  const dispatch = useDispatch();
  const token = useSelector(selectToken);
  const validationErrors = useSelector(selectValidationErrors(signinAsync));

  const handleSubmit = event => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    dispatch(
      signinAsync({
        email: data.get('email'),
        password: data.get('password'),
      }),
    );
  };

  if (token !== null) {
    return <Navigate to="/" replace />;
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
          Sign in
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            error={!!validationErrors?.email}
            helperText={validationErrors?.email}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="password"
            error={!!validationErrors?.password}
            helperText={validationErrors?.password}
          />
          <FormControlLabel control={<Checkbox value="remember" color="primary" />} label="Remember me" />
          <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
            Sign In
          </Button>
          <Grid container>
            <Grid item xs>
              <Link to="/forgot-password" component={RouterLink} variant="body2">
                Forgot password?
              </Link>
            </Grid>
            <Grid item>
              <Link to="/register" component={RouterLink} variant="body2">
                {"Don't have an account? Sign Up"}
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
      <Copyright sx={{ mt: 8, mb: 4 }} />
    </Container>
  );
}
