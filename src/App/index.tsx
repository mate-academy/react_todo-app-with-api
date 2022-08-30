import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
// Hooks
import { useAppDispatch } from 'hooks/useAppDispatch';
// Async
import { checkIsAuthorization } from 'store/auth/authAsync';
// Selectors
import { selectIsAuthorization } from 'store/auth/authSelectors';
// Components
import NavBar from 'components/NavBar';
import Notifications from 'components/Notifications';
import { LinearProgress } from '@mui/material';
import AppRouting from './App.routing';
// MUI

const App: React.FC = () => {
  const dispatch = useAppDispatch();

  const isAuthorization: boolean | null = useSelector(selectIsAuthorization);

  useEffect(() => {
    dispatch(checkIsAuthorization({}));
    // eslint-disable-next-line
  }, []);

  if (isAuthorization === null) {
    return <LinearProgress />;
  }

  return (
    <>
      <NavBar />
      <AppRouting />
      <Notifications />
    </>
  );
};

export default App;
