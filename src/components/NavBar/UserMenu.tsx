import React, { useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
// Selectors
import { selectCurrentUser } from 'store/users/usersSelectors';
// Actions
import { usersActions } from 'store/users/usersSlice';
// Services
import StorageService from 'services/StorageService';
// mui
import {
  Box, ListItemIcon, Menu, MenuItem, Typography,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
// import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import { authActions } from '../../store/auth/authSlice';

const UserMenu:React.FC = () => {
  const dispatch = useDispatch();
  const menuRef = useRef();
  const [openMenu, setOpenMenu] = useState(false);

  const handleToggleMenu = () => {
    setOpenMenu(!openMenu);
  };

  const currentUser = useSelector(selectCurrentUser);

  const signOut = () => {
    StorageService.removeCurrentUserId();
    dispatch(authActions.setAuthorization(false));
    dispatch(usersActions.removeCurrentUser());
  };

  return (
    <>
      <Box
        onClick={handleToggleMenu}
        sx={{
          display: 'flex', gap: 1, alignItems: 'center', cursor: 'pointer', color: '#fff',
        }}
      >
        <AccountCircleOutlinedIcon />
        <Typography variant="h6" sx={{ display: { xs: 'none', sm: 'inline-flex' } }}>
          {currentUser?.name}
        </Typography>
        <Box ref={menuRef}>
          <ExpandMoreIcon sx={{ display: { xs: 'none', sm: 'inline-flex' } }} />
        </Box>
      </Box>

      <Menu
        anchorEl={menuRef.current}
        id="account-menu"
        open={openMenu}
        onClose={handleToggleMenu}
        PaperProps={{
          elevation: 0,
          sx: {
            minWidth: '160px',
            overflow: 'visible',
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
            mt: 1.5,
            '&:before': {
              content: '""',
              display: 'block',
              position: 'absolute',
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: 'background.paper',
              transform: 'translateY(-50%) rotate(45deg)',
              zIndex: 0,
            },
          },
        }}
      >
        <MenuItem onClick={signOut}>
          <ListItemIcon>
            <LogoutOutlinedIcon />
          </ListItemIcon>
          Sign out
        </MenuItem>
      </Menu>
    </>
  );
};

export default UserMenu;
