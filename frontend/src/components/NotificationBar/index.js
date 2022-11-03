import React, { useEffect, useState } from 'react';
import { makeStyles } from '@mui/styles';
import { IconButton } from '@mui/material';
import { Clear } from '@mui/icons-material';

import AlertIcon from './DismissibleAlertIcon';
import storage from '../../utils/storage';

const useStyle = makeStyles({
  root: {
    backgroundColor: 'rgb(60, 38, 1)',
    display: 'flex',
    height: 36,
    padding: '0px 28px',
    alignItems: 'center',
  },
  icon: {
    marginRight: 10,
    height: 20,
  },
  content: {
    margin: 0,
    minWidth: 0,
    display: 'inline-block',
    color: 'rgb(184 184 184)',
    fontSize: '14px',
  },
  viewMore: {
    marginLeft: 10,
    color: 'rgb(240, 185, 11)',
    textDecoration: 'none',
    cursor: 'pointer',
    fontSize: '14px',
    display: 'flex',
    alignItems: 'center',
  },
  moreArrow: {
    margin: '2px 0px 0px 4px',
    minWidth: '0px',
    color: 'rgb(240, 185, 11)',
    fontSize: '12px',
    fill: 'rgb(240, 185, 11)',
    width: '1em',
    height: '1em',
  },
});

function NotificationBar() {
  const classes = useStyle();
  const [mainAlert, setMainAlert] = useState();
  const isMobile = window.innerWidth <= 960;

  const [display, setDisplay] = useState(true);

  const handleClose = () => {
    storage.set('mainAlert', mainAlert.message);
    setDisplay(false);
  };

  useEffect(() => {
    setMainAlert({
      message:
        'Introducing Gunbot news! New upgrades, new features and new community events will be announced on this channel.',
      link: 'https://gunthy.org',
    });
  }, []);

  useEffect(() => {
    const message = storage.get('mainAlert');
    setDisplay(mainAlert && message !== mainAlert.message);
  }, [mainAlert]);

  return (
    <>
      {mainAlert && display && !isMobile && (
        <div className={classes.root}>
          <div className={classes.icon}>
            <AlertIcon />
          </div>
          <div style={{ flex: 'auto', display: 'flex' }}>
            <div className={classes.content}>{mainAlert?.message}</div>
            <a className={classes.viewMore} href={mainAlert?.link} target={'_blank'} rel="noreferrer">
              {'View More '}
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="none" className={classes.moreArrow}>
                <path d="M8.825 8L3.95 12.95 5 14l6-6-6-6-1.05 1.05L8.825 8z" fill="currentColor"></path>
              </svg>
            </a>
          </div>
          <IconButton style={{ padding: 4 }} onClick={handleClose}>
            <Clear color="inherit" fontSize="small" />
          </IconButton>
        </div>
      )}
    </>
  );
}

export default NotificationBar;
