import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import { Navigate, Route, Routes } from 'react-router-dom';

import MainLayout from './layout/MainLayout';
import LoginPage from './views/auth/LoginPage';
import EasyEditPage from './views/easy-edit';
import RegisterPage from './views/auth/RegisterPage';
import ForgotPasswordPage from './views/auth/ForgotPasswordPage';
import ResetPassword from './views/auth/ResetPasswordPage';

function App() {
  return (
    <React.Fragment>
      <CssBaseline />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/" element={<MainLayout />}>
          <Route path="/" element={<div>Home Page</div>} />
          <Route path="/easy-edit" element={<EasyEditPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </React.Fragment>
  );
}

export default App;
