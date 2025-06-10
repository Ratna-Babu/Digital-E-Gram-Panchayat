import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Heading,
  Text,
  Button,
  Container,
  VStack,
} from '@chakra-ui/react';

const Unauthorized = () => {
  const navigate = useNavigate();

  return (
    <Container maxW="container.md" py={10}>
      <VStack spacing={6} textAlign="center">
        <Heading size="xl">Access Denied</Heading>
        <Text fontSize="lg" color="gray.600">
          You don't have permission to access this page.
        </Text>
        <Box>
          <Button
            colorScheme="blue"
            onClick={() => navigate(-1)}
            mr={4}
          >
            Go Back
          </Button>
          <Button
            colorScheme="gray"
            onClick={() => navigate('/login')}
          >
            Login
          </Button>
        </Box>
      </VStack>
    </Container>
  );
};

export default Unauthorized; 