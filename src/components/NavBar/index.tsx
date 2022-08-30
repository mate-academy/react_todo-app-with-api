import React from 'react';
import { useSelector } from 'react-redux';
// Selectors
import {
  AppBar, Toolbar, Box, Typography,
} from '@mui/material';
import { selectIsAuthorization } from '../../store/auth/authSelectors';
// Mui
// components
import UserMenu from './UserMenu';

const NavBar:React.FC = () => {
  // State
  const isAuthorization:boolean | null = useSelector(selectIsAuthorization);

  return (
    <AppBar position="relative" elevation={0} sx={{ background: 'linear-gradient(315deg, #3D98BF 0%, #53B8E0 100%)' }}>
      <Toolbar>
        <Typography sx={{ fontSize: '24px' }}>Todos List</Typography>
        <Box flexGrow={1} />
        <Box sx={{ display: 'flex', gap: 2 }}>
          {isAuthorization && <UserMenu />}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default NavBar;
