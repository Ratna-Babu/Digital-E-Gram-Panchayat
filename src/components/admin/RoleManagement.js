import React, { useState, useEffect } from 'react';
import { db } from '../../config/firebase';
import { collection, query, getDocs, doc, updateDoc, where } from 'firebase/firestore';
import {
  Box,
  Button,
  Container,
  Heading,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  useToast,
  Select,
  Input,
  FormControl,
  FormLabel,
  VStack,
  HStack,
  Text,
  Badge,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from '@chakra-ui/react';

const RoleManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchEmail, setSearchEmail] = useState('');
  const [selectedRole, setSelectedRole] = useState('staff');
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  // Fetch all users
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('role', 'in', ['staff', 'officer', 'user', 'admin']));
      const querySnapshot = await getDocs(q);
      
      const usersData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      setUsers(usersData);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch users',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Handle role update
  const handleRoleUpdate = async (userId, newRole) => {
    try {
      setLoading(true);
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, {
        role: newRole,
        updatedAt: new Date().toISOString()
      });

      toast({
        title: 'Success',
        description: 'User role updated successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      // Refresh users list
      fetchUsers();
    } catch (error) {
      console.error('Error updating role:', error);
      toast({
        title: 'Error',
        description: 'Failed to update user role',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle user search
  const handleSearch = async () => {
    if (!searchEmail) {
      toast({
        title: 'Error',
        description: 'Please enter an email to search',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      setLoading(true);
      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('email', '==', searchEmail.toLowerCase()));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        toast({
          title: 'Not Found',
          description: 'No user found with this email',
          status: 'warning',
          duration: 3000,
          isClosable: true,
        });
        return;
      }

      const userData = querySnapshot.docs[0].data();
      const userId = querySnapshot.docs[0].id;

      // Update role for the found user
      await handleRoleUpdate(userId, selectedRole);
      onClose();
      setSearchEmail('');
    } catch (error) {
      console.error('Error searching user:', error);
      toast({
        title: 'Error',
        description: 'Failed to search user',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case 'admin':
        return 'red';
      case 'staff':
        return 'blue';
      case 'officer':
        return 'green';
      case 'user':
        return 'gray';
      default:
        return 'gray';
    }
  };

  return (
    <Container maxW="container.xl" py={5}>
      <VStack spacing={5} align="stretch">
        <HStack justify="space-between">
          <Heading size="lg">Role Management</Heading>
          <Button colorScheme="blue" onClick={onOpen}>
            Add Staff/Officer
          </Button>
        </HStack>

        <Box overflowX="auto">
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>Name</Th>
                <Th>Email</Th>
                <Th>Current Role</Th>
                <Th>Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {users.map((user) => (
                <Tr key={user.id}>
                  <Td>{user.name}</Td>
                  <Td>{user.email}</Td>
                  <Td>
                    <Badge colorScheme={getRoleBadgeColor(user.role)}>
                      {user.role}
                    </Badge>
                  </Td>
                  <Td>
                    <Select
                      value={user.role}
                      onChange={(e) => handleRoleUpdate(user.id, e.target.value)}
                      isDisabled={loading || user.role === 'admin'}
                      width="150px"
                    >
                      <option value="user">User</option>
                      <option value="staff">Staff</option>
                      <option value="officer">Officer</option>
                    </Select>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>

        {/* Add New Staff/Officer Modal */}
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Add Staff/Officer</ModalHeader>
            <ModalBody>
              <VStack spacing={4}>
                <FormControl isRequired>
                  <FormLabel>User Email</FormLabel>
                  <Input
                    type="email"
                    value={searchEmail}
                    onChange={(e) => setSearchEmail(e.target.value)}
                    placeholder="Enter user email"
                  />
                </FormControl>
                <FormControl isRequired>
                  <FormLabel>Select Role</FormLabel>
                  <Select
                    value={selectedRole}
                    onChange={(e) => setSelectedRole(e.target.value)}
                  >
                    <option value="staff">Staff</option>
                    <option value="officer">Officer</option>
                  </Select>
                </FormControl>
              </VStack>
            </ModalBody>
            <ModalFooter>
              <Button variant="ghost" mr={3} onClick={onClose}>
                Cancel
              </Button>
              <Button
                colorScheme="blue"
                onClick={handleSearch}
                isLoading={loading}
              >
                Add Role
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </VStack>
    </Container>
  );
};

export default RoleManagement; 