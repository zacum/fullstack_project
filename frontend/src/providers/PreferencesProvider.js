import React, { createContext, useCallback, useMemo, useState } from 'react';

export const PreferencesContext = createContext({
  theme: 'dark',
  toggleTheme: () => {},
});

const initTheme = localStorage.getItem('_theme_name') || 'dark';

export default function PreferencesProvider(props) {
  const [theme, setTheme] = useState(initTheme);

  const toggleTheme = useCallback(() => {
    setTheme(prevTheme => {
      const newTheme = prevTheme === 'light' ? 'dark' : 'light';
      localStorage.setItem('_theme_name', newTheme);
      return newTheme;
    });
  }, []);

  const preferences = useMemo(() => {
    return {
      theme,
      toggleTheme,
    };
  }, [theme, toggleTheme]);

  return <PreferencesContext.Provider value={preferences}>{props.children}</PreferencesContext.Provider>;
}
