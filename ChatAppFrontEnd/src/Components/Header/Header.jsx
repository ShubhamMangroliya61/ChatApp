import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import Logo from '../../assets/ChatLogo.png';
import { useDispatch } from 'react-redux';
import { logout } from '../../redux/slice/AuthSlice';
import connection from '../../helpers/ChatService'
import { UserData, useSelectorUserDataState } from '../../redux/slice/UserSlice';
import { Regex } from '../../constatns/Regex';

const ResponsiveAppBar = ({ showProfile, setUserId }) => {
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const { isError, ErrorMessage, isLoading, user } = useSelectorUserDataState();
  const dispatch = useDispatch();
  const userId = localStorage.getItem("userId");
  
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const LogoutHandler = () => {
    connection.stop();
    dispatch(logout());
  };

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        if (userId) {
          await dispatch(UserData());
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    fetchData();
  }, []);

  return (
    <AppBar position="static" sx={{ backgroundColor: '#ddd6fe', color: '#000000' }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="#app-bar-with-responsive-menu"
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },

              textDecoration: 'none',
            }}
          >
            <img src={Logo} alt="Logo" className="w-14" />
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <img src={Logo} alt="Logo" className="w-14" />
          </Box>

          <Typography
            variant="h5"
            noWrap
            component="a"
            href="#app-bar-with-responsive-menu"
            sx={{
              mr: 2,
              display: { xs: 'flex', md: 'none' },
              flexGrow: 1,
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.1    rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            <div className='font-serif text-xxl font-bold text-indigo-600 text-center'>
              ChatApp
            </div>
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            <Typography variant="h5" noWrap sx={{ color: 'inherit' }}>
              <div className='font-serif text-xxl font-bold text-indigo-600 text-center'>
                ChatApp
              </div>
            </Typography>
          </Box>

          <Box sx={{ flexGrow: 0 }} className="flex">
            <Tooltip title="Open Menu">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar alt="Avatar"
                  src={user.profilePictureName
                    ? `data:image/jpeg;base64,${user.profilePictureName
                    }` : `data:image/jpeg;base64,${Regex.profile}`}
                />
              </IconButton>
            </Tooltip>
            <Box sx={{ display: { xs: 'none', lg: 'flex' } }} className="ms-3">
              <span className='flex flex-col'>
                <b>{user.userName}</b>
                <span>{user.name}</span>
              </span>
            </Box>
            <Menu
              sx={{ mt: '40px' }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              <MenuItem onClick={() => {
                showProfile(true);
                setUserId(userId);
                handleCloseUserMenu();
              }}>
                <Typography textAlign="center" sx={{ color: 'inherit' }}>
                  Profile
                </Typography>
              </MenuItem>

              <MenuItem onClick={LogoutHandler}>
                <Typography textAlign="center" sx={{ color: 'inherit' }}>
                  LogOut
                </Typography>
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default ResponsiveAppBar;
