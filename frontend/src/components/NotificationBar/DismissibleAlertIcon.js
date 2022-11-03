import React from 'react';
import { Box } from '@mui/material';
import { makeStyles } from '@mui/styles';

const useStyle = makeStyles({
  icon: {
    boxSizing: 'border-box',
    margin: 0,
    minWidth: 0,
    color: ' rgb(240, 185, 11)',
    fontSize: '20px',
    fill: 'rgb(240, 185, 11)',
    width: '1em',
    height: '1em',
  },
});

const DismissibleAlertIcon = () => {
  const classes = useStyle();
  return (
    <Box component={'svg'} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" className={classes.icon}>
      <path
        d="M12.867 18.47l5.13-.94L15.517 4l-5.18.95-3.25 3.94-4.85.89.5 2.71-1.97.36.36 1.97 1.97-.36.44 2.42 1.97-.36.79 4.28 1.97-.36-.79-4.28.98-.18 4.41 2.49zm-5.76-4.28l-1.97.36-.58-3.17 3.61-.66 3.25-3.92 2.5-.46 1.76 9.59-2.46.45-4.4-2.51-1.71.32zM22.871 8.792l-2.99.55.362 1.967 2.99-.55-.362-1.967zM19.937 13.183l-1.135 1.647 2.503 1.725 1.135-1.646-2.503-1.726zM19.006 4.052l-1.725 2.503 1.646 1.135 1.726-2.503-1.647-1.135z"
        fill="currentColor"
      ></path>
    </Box>
  );
};

export default DismissibleAlertIcon;
