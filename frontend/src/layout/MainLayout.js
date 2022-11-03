import React from 'react';
import { Toolbar, Fab } from '@mui/material/';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

import Header from './Header';
import ScrollTop from '../components/ScrollTop';
import { Navigate, Outlet } from 'react-router-dom';
import NotificationBar from '../components/NotificationBar';
import { useSelector } from 'react-redux';
import { selectToken } from 'src/features/auth/authSlice';

const MainLayout = props => {
  const token = useSelector(selectToken);

  if (token === null) {
    return <Navigate to={'/login'} replace />;
  }

  return (
    <>
      <Header />
      <Toolbar id="back-to-top-anchor" />
      <NotificationBar />
      <Outlet />
      <ScrollTop {...props}>
        <Fab size="small" aria-label="scroll back to top">
          <KeyboardArrowUpIcon />
        </Fab>
      </ScrollTop>
    </>
  );
};

export default MainLayout;
