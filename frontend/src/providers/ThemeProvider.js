import React, { useContext, useMemo } from 'react';
import { createTheme, ThemeProvider as MuiThemeProvider } from '@mui/material/styles';

import { PreferencesContext } from './PreferencesProvider';

const ThemeProvider = props => {
  const { theme } = useContext(PreferencesContext);
  const themeObject = useMemo(() => {
    return createTheme({
      palette: {
        mode: theme,
        primary: {
          main: '#efba1b',
        },
        secondary: {
          main: '#B71C1C',
        },
      },
      typography: {
        body2: {
          opacity: 0.7,
        },
        subtitle2: {
          opacity: 0.7,
        },
      },
    });
  }, [theme]);

  return <MuiThemeProvider theme={themeObject}>{props.children}</MuiThemeProvider>;
};

export default ThemeProvider;
