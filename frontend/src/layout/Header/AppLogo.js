import React, { useCallback } from 'react';
import { Box, Typography } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';

const AppLogo = ({ mobile }) => {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const display = mobile ? { xs: 'flex', md: 'none' } : { xs: 'none', md: 'flex' };
  const variant = mobile ? 'h5' : 'h6';
  const href = mobile ? '#' : '/#';
  const flexGrow = mobile ? 1 : undefined;

  const gotoHomePage = useCallback(() => {
    if (!mobile && pathname !== '/') navigate('/');
  }, [navigate, pathname, mobile]);

  return (
    <React.Fragment>
      <Box
        component="img"
        sx={{
          display,
          mr: 1,
          height: { xs: 28, sm: 32 },
          '&:hover': { cursor: 'pointer' },
        }}
        alt="gunthy log"
        src="/logos/logo_horizontal.png"
        onClick={gotoHomePage}
      />
      <Typography
        variant={variant}
        noWrap
        component="a"
        href={href}
        sx={{
          mr: 2,
          display,
          flexGrow,
          fontFamily: 'monospace',
          fontWeight: 700,
          letterSpacing: '.3rem',
          color: 'inherit',
          textDecoration: 'none',
        }}
      ></Typography>
    </React.Fragment>
  );
};

export default AppLogo;
