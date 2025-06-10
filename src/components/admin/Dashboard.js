import React from 'react';
import { Box, Container, Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react';
import ServiceManagement from './ServiceManagement';
import RoleManagement from './RoleManagement';

const AdminDashboard = () => {
  return (
    <Container maxW="container.xl" py={5}>
      <Tabs isFitted variant="enclosed">
        <TabList mb="1em">
          <Tab>Services</Tab>
          <Tab>Role Management</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <ServiceManagement />
          </TabPanel>
          <TabPanel>
            <RoleManagement />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Container>
  );
};

export default AdminDashboard; 