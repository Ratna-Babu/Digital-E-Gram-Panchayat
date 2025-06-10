import React, { useEffect } from 'react';
import { Outlet, Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  Flex,
  HStack,
  Link,
  IconButton,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useDisclosure,
  useColorModeValue,
  Stack,
  Text,
} from '@chakra-ui/react';
import { HamburgerIcon, CloseIcon } from '@chakra-ui/icons';
import { useAuth } from '../../contexts/AuthContext';

const NavLink = ({ children, to }) => (
  <Link
    as={RouterLink}
    px={2}
    py={1}
    rounded={'md'}
    _hover={{
      textDecoration: 'none',
      bg: useColorModeValue('gray.200', 'gray.700'),
    }}
    to={to}
  >
    {children}
  </Link>
);

const Layout = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Redirect from root path based on user role
    if (location.pathname === '/') {
      if (user.role === 'user') {
        navigate('/services/apply');
      } else if (['admin', 'officer'].includes(user.role)) {
        navigate('/admin/services');
      } else if (user.role === 'staff') {
        navigate('/staff/applications');
      }
    }
  }, [location.pathname, user.role, navigate]);

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const getNavLinks = () => {
    const links = [];

    if (user.role === 'user') {
      links.push(
        { text: 'Apply for Service', to: '/services/apply' },
        { text: 'My Applications', to: '/applications/status' }
      );
    }

    if (['admin', 'officer'].includes(user.role)) {
      links.push({ text: 'Manage Services', to: '/admin/services' });
    }

    if (['staff', 'admin', 'officer'].includes(user.role)) {
      links.push({ text: 'Manage Applications', to: '/staff/applications' });
    }

    return links;
  };

  return (
    <Box>
      <Box bg={useColorModeValue('gray.100', 'gray.900')} px={4}>
        <Flex h={16} alignItems={'center'} justifyContent={'space-between'}>
          <IconButton
            size={'md'}
            icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
            aria-label={'Open Menu'}
            display={{ md: 'none' }}
            onClick={isOpen ? onClose : onOpen}
          />
          <HStack spacing={8} alignItems={'center'}>
            <Box>
              <Text fontSize="lg" fontWeight="bold">
                E-Gram Panchayat
              </Text>
            </Box>
            <HStack
              as={'nav'}
              spacing={4}
              display={{ base: 'none', md: 'flex' }}>
              {getNavLinks().map((link) => (
                <NavLink key={link.to} to={link.to}>
                  {link.text}
                </NavLink>
              ))}
            </HStack>
          </HStack>
          <Flex alignItems={'center'}>
            <Menu>
              <MenuButton
                as={Button}
                rounded={'full'}
                variant={'link'}
                cursor={'pointer'}
                minW={0}>
                {user.name || user.email}
              </MenuButton>
              <MenuList>
                <MenuItem onClick={handleSignOut}>Sign Out</MenuItem>
              </MenuList>
            </Menu>
          </Flex>
        </Flex>

        {isOpen ? (
          <Box pb={4} display={{ md: 'none' }}>
            <Stack as={'nav'} spacing={4}>
              {getNavLinks().map((link) => (
                <NavLink key={link.to} to={link.to}>
                  {link.text}
                </NavLink>
              ))}
            </Stack>
          </Box>
        ) : null}
      </Box>

      <Box p={4}>
        <Outlet />
      </Box>
    </Box>
  );
};

export default Layout; 