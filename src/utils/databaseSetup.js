import { db } from '../config/firebase';
import { doc, collection, setDoc } from 'firebase/firestore';

// Function to set up the basic database structure
export async function setupDatabase() {
  try {
    // Create users collection with a sample document
    await setDoc(doc(collection(db, 'users'), 'admin'), {
      role: 'admin',
      name: 'Admin User',
      email: 'admin@example.com',
      createdAt: new Date().toISOString()
    });

    console.log('Database structure set up successfully');
    return true;
  } catch (error) {
    console.error('Error setting up database:', error);
    return false;
  }
}

// Function to add a new user
export async function addUser(userData) {
  try {
    await setDoc(doc(collection(db, 'users'), userData.uid), {
      ...userData,
      createdAt: new Date().toISOString()
    });
    return true;
  } catch (error) {
    console.error('Error adding user:', error);
    return false;
  }
}

// Function to add a new service
export async function addService(serviceData) {
  try {
    await setDoc(doc(collection(db, 'services'), serviceData.id), {
      ...serviceData,
      createdAt: new Date().toISOString()
    });
    return true;
  } catch (error) {
    console.error('Error adding service:', error);
    return false;
  }
}

// Function to add a new application
export async function addApplication(applicationData) {
  try {
    const applicationRef = doc(collection(db, 'applications'));
    await setDoc(applicationRef, {
      ...applicationData,
      status: 'pending',
      createdAt: new Date().toISOString()
    });
    return true;
  } catch (error) {
    console.error('Error adding application:', error);
    return false;
  }
}

// Function to update application status
export async function updateApplicationStatus(applicationId, newStatus, remarks = '') {
  try {
    // Update the application status
    await setDoc(doc(db, 'applications', applicationId), {
      status: newStatus,
      updatedAt: new Date().toISOString(),
      remarks: remarks
    }, { merge: true });

    // Add a status log entry
    const logRef = doc(collection(db, 'status_logs'));
    await setDoc(logRef, {
      applicationId,
      status: newStatus,
      remarks,
      timestamp: new Date().toISOString()
    });

    return true;
  } catch (error) {
    console.error('Error updating application status:', error);
    return false;
  }
} 