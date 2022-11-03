import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { checkAuthAsync, selectAuthStatus, selectToken, setStatus } from 'src/features/auth/authSlice';

const AuthProvider = props => {
  const dispatch = useDispatch();
  const token = useSelector(selectToken);
  const status = useSelector(selectAuthStatus);

  useEffect(() => {
    if (token !== null) {
      dispatch(checkAuthAsync());
    } else {
      dispatch(setStatus('idle'));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (status === 'auth_check') {
    return null;
  }

  return <>{props.children}</>;
};

export default AuthProvider;
