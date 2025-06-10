# Digital E-Gram Panchayat

[![React](https://img.shields.io/badge/React-18.2.0-blue.svg)](https://reactjs.org/)
[![Firebase](https://img.shields.io/badge/Firebase-9.23.0-orange.svg)](https://firebase.google.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4.1-blue.svg)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

A comprehensive digital platform for Gram Panchayat services management, enabling citizens to apply for various government services online while providing administrative tools for staff and officers to manage applications efficiently.

## 🚀 Features

### For Citizens (Users)
- **Service Applications**: Apply for various panchayat services online
- **Application Tracking**: Real-time status updates for submitted applications
- **Document Management**: Upload and manage required documents
- **Service Directory**: Browse available services with detailed information
- **User Dashboard**: Personalized dashboard with quick actions and recent activities

### For Staff
- **Application Management**: Review and process citizen applications
- **Status Updates**: Update application status and add remarks
- **Document Verification**: Review uploaded documents
- **Dashboard Analytics**: View workload statistics and pending tasks
- **Application History**: Track all processed applications

### For Admin/Officers
- **Complete System Management**: Full control over the platform
- **User Management**: Manage citizens, staff, and officer accounts
- **Service Management**: Create, update, and manage available services
- **Application Oversight**: Monitor all applications across the system
- **Analytics Dashboard**: Comprehensive statistics and reporting
- **System Configuration**: Configure platform settings and parameters

## 🛠️ Technology Stack

### Frontend
- **React 18.2.0**: Modern React with hooks and functional components
- **React Router DOM 6.22.1**: Client-side routing and navigation
- **Tailwind CSS 3.4.1**: Utility-first CSS framework for styling
- **Framer Motion 11.18.2**: Smooth animations and transitions
- **Heroicons 2.2.0**: Beautiful SVG icons
- **React Icons 5.0.1**: Additional icon library
- **React Toastify 10.0.4**: Toast notifications (configured for minimal intrusion)

### Backend & Database
- **Firebase 9.23.0**: Complete backend-as-a-service platform
- **Firestore**: NoSQL document database for data storage
- **Firebase Authentication**: Secure user authentication and authorization
- **Firebase Storage**: File storage for document uploads
- **Firebase Security Rules**: Comprehensive access control

### Development Tools
- **Create React App**: Project setup and build tools
- **PostCSS & Autoprefixer**: CSS processing and vendor prefixing
- **ESLint**: Code linting and quality assurance

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v14.0.0 or higher) - [Download here](https://nodejs.org/)
- **npm** (v6.0.0 or higher) or **yarn** (v1.22.0 or higher)
- **Git** for version control
- **Firebase Account** - [Create here](https://console.firebase.google.com/)

## 🔧 Installation & Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd digital-e-gram-panchayat
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
```

### 3. Firebase Project Setup

1. **Create a Firebase Project**:
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Click "Create a project"
   - Follow the setup wizard

2. **Enable Required Services**:
   - **Authentication**: Enable Email/Password provider
   - **Firestore Database**: Create in production mode
   - **Storage**: Enable for document uploads

3. **Get Firebase Configuration**:
   - Go to Project Settings → General
   - Scroll to "Your apps" section
   - Click on the web app icon or "Add app"
   - Copy the configuration object

### 4. Environment Configuration

Create a `.env.local` file in the root directory:

```env
REACT_APP_FIREBASE_API_KEY=your-api-key
REACT_APP_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your-project-id
REACT_APP_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
REACT_APP_FIREBASE_APP_ID=your-app-id
```

> ⚠️ **Important**: Never commit the `.env.local` file to version control. It's already included in `.gitignore`.

### 5. Firestore Security Rules

Deploy the included security rules to your Firestore database:

```bash
# Install Firebase CLI (if not already installed)
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize Firebase in your project
firebase init firestore

# Deploy security rules
firebase deploy --only firestore:rules
```

### 6. Start Development Server

```bash
npm start
# or
yarn start
```

The application will be available at `http://localhost:3000`.

## 📁 Project Structure

```
digital-e-gram-panchayat/
├── public/                     # Static files
│   ├── index.html             # Main HTML template
│   └── favicon.ico            # Application icon
├── src/                       # Source code
│   ├── components/            # React components
│   │   ├── admin/            # Admin-specific components
│   │   │   ├── AdminDashboard.js
│   │   │   ├── ApplicationManagement.js
│   │   │   ├── ServiceManagement.js
│   │   │   ├── UserManagement.js
│   │   │   └── DatabaseSetup.js
│   │   ├── auth/             # Authentication components
│   │   │   ├── Login.js
│   │   │   └── Register.js
│   │   ├── common/           # Shared components
│   │   │   ├── ProtectedRoute.js
│   │   │   └── Unauthorized.js
│   │   ├── staff/            # Staff-specific components
│   │   │   ├── StaffDashboard.js
│   │   │   ├── ApplicationManagement.js
│   │   │   └── ReviewApplications.js
│   │   └── user/             # User-specific components
│   │       ├── UserDashboard.js
│   │       ├── ServiceApplication.js
│   │       └── ApplicationStatus.js
│   ├── contexts/             # React Context providers
│   │   └── AuthContext.js    # Authentication context
│   ├── services/             # External service integrations
│   │   └── dataService.js    # Firebase data operations
│   ├── config/               # Configuration files
│   │   └── firebase.js       # Firebase configuration
│   ├── pages/                # Page components
│   ├── hooks/                # Custom React hooks
│   ├── utils/                # Utility functions
│   ├── App.js                # Main application component
│   ├── index.js              # Application entry point
│   └── index.css             # Global styles
├── firestore.rules           # Firestore security rules
├── package.json              # Project dependencies and scripts
├── tailwind.config.js        # Tailwind CSS configuration
├── .env.local               # Environment variables (not in repo)
├── .gitignore               # Git ignore patterns
└── README.md                # This file
```

## 🗄️ Database Schema

### Collections Overview

#### 1. `users` Collection
```javascript
{
  uid: string,              // Firebase Auth UID
  fullName: string,         // User's full name
  email: string,            // Email address
  phone: string,            // Phone number
  role: string,             // 'user' | 'staff' | 'admin'
  createdAt: timestamp,     // Account creation date
  address?: string,         // Optional address
  isActive: boolean         // Account status
}
```

#### 2. `applications` Collection
```javascript
{
  id: string,               // Auto-generated document ID
  userId: string,           // Reference to user
  serviceName: string,      // Name of requested service
  serviceType: string,      // Category of service
  status: string,           // 'pending' | 'under_review' | 'approved' | 'rejected' | 'pending_documents'
  createdAt: timestamp,     // Application submission date
  lastUpdated: timestamp,   // Last modification date
  applicantDetails: {       // Applicant information
    name: string,
    fatherName: string,
    address: string,
    phone: string
  },
  documents?: array,        // Uploaded documents
  remarks?: string          // Staff/admin comments
}
```

#### 3. `services` Collection
```javascript
{
  id: string,               // Auto-generated document ID
  name: string,             // Service name
  description: string,      // Service description
  category: string,         // Service category
  isActive: boolean,        // Service availability
  requiredDocuments: array, // List of required documents
  processingTime: string,   // Expected processing time
  createdAt: timestamp      // Service creation date
}
```

#### 4. `status_logs` Collection
```javascript
{
  applicationId: string,    // Reference to application
  status: string,           // New status
  updatedBy: string,        // User who made the change
  comments: string,         // Change comments
  timestamp: timestamp      // When the change occurred
}
```

## 👥 User Roles & Permissions

### User (Citizen)
- ✅ Register and manage profile
- ✅ Apply for available services
- ✅ Upload required documents
- ✅ Track application status
- ✅ View service details
- ❌ Access admin/staff features

### Staff
- ✅ All user permissions
- ✅ View all applications
- ✅ Update application status
- ✅ Add remarks to applications
- ✅ Review documents
- ❌ Manage users or services

### Admin/Officer
- ✅ All staff permissions
- ✅ Manage users (create, update, deactivate)
- ✅ Manage services (create, update, delete)
- ✅ View system analytics
- ✅ Access all administrative features
- ✅ System configuration

## 🚀 Available Scripts

### Development
```bash
npm start          # Start development server
npm test           # Run test suite
npm run build      # Build for production
npm run eject      # Eject from Create React App (irreversible)
```

### Firebase Deployment
```bash
firebase deploy    # Deploy to Firebase Hosting
firebase deploy --only firestore:rules  # Deploy only security rules
firebase deploy --only storage         # Deploy only storage rules
```

## 🔐 Security Features

### Authentication
- **Firebase Authentication**: Secure user registration and login
- **Role-based Access Control**: Different permissions for each user type
- **Protected Routes**: Automatic redirection for unauthorized access
- **Session Management**: Secure session handling and automatic logout

### Data Security
- **Firestore Security Rules**: Comprehensive database access control
- **Input Validation**: Client and server-side validation
- **Document Access Control**: Users can only access their own data
- **Admin Verification**: Administrative actions require proper authentication

### Security Rules Summary
```javascript
// Users can read/write their own data
// Staff can read all applications and users
// Admins have full access to all collections
// All authenticated users can read services
```

## 🔧 Configuration

### Tailwind CSS
The project uses Tailwind CSS for styling. Configuration is in `tailwind.config.js`:

```javascript
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      // Custom theme extensions
    },
  },
  plugins: [],
}
```

### Firebase Configuration
Firebase settings are managed through environment variables and `src/config/firebase.js`.

## 📱 Usage Guide

### For Citizens
1. **Registration**: Create an account with email and password
2. **Service Application**: Browse services and submit applications
3. **Document Upload**: Attach required documents
4. **Status Tracking**: Monitor application progress
5. **Profile Management**: Update personal information

### For Staff
1. **Login**: Access with staff credentials
2. **Application Review**: Review pending applications
3. **Status Updates**: Update application status and add comments
4. **Document Verification**: Verify uploaded documents
5. **Dashboard Monitoring**: Track workload and statistics

### For Admins
1. **System Overview**: Monitor overall system health
2. **User Management**: Create and manage user accounts
3. **Service Configuration**: Add, update, or remove services
4. **Application Oversight**: Monitor all applications
5. **Analytics**: View comprehensive system analytics

## 🔄 Development Workflow

### Adding New Features
1. Create feature branch: `git checkout -b feature/new-feature`
2. Implement changes with proper testing
3. Update documentation if needed
4. Submit pull request for review

### Code Standards
- Use functional components with hooks
- Follow React best practices
- Implement proper error handling
- Add comments for complex logic
- Use TypeScript-style prop validation

### Testing
```bash
npm test                    # Run all tests
npm test -- --coverage     # Run tests with coverage report
npm test -- --watch        # Run tests in watch mode
```

## 🚀 Deployment

### Firebase Hosting
1. Build the project: `npm run build`
2. Install Firebase CLI: `npm install -g firebase-tools`
3. Login: `firebase login`
4. Initialize hosting: `firebase init hosting`
5. Deploy: `firebase deploy`

### Environment Variables for Production
Ensure all environment variables are properly set in your hosting environment:
- `REACT_APP_FIREBASE_API_KEY`
- `REACT_APP_FIREBASE_AUTH_DOMAIN`
- `REACT_APP_FIREBASE_PROJECT_ID`
- `REACT_APP_FIREBASE_STORAGE_BUCKET`
- `REACT_APP_FIREBASE_MESSAGING_SENDER_ID`
- `REACT_APP_FIREBASE_APP_ID`

## 🐛 Troubleshooting

### Common Issues

**1. Firebase Permission Denied**
- Ensure Firestore security rules are deployed
- Verify user authentication status
- Check user role permissions

**2. Environment Variables Not Loading**
- Verify `.env.local` file exists and has correct variables
- Restart development server after adding new variables
- Ensure variables start with `REACT_APP_`

**3. Build Failures**
- Clear node_modules and reinstall: `rm -rf node_modules && npm install`
- Check for dependency conflicts
- Verify Node.js version compatibility

**4. Authentication Issues**
- Verify Firebase Auth configuration
- Check if email/password provider is enabled
- Ensure proper error handling in auth components

## 📈 Performance Optimization

### Implemented Optimizations
- **Code Splitting**: Dynamic imports for route-based splitting
- **Lazy Loading**: Components loaded on demand
- **Memoization**: React.memo for expensive components
- **Optimized Images**: Proper image compression and formats
- **Bundle Analysis**: Regular bundle size monitoring

### Firebase Optimizations
- **Firestore Indexing**: Optimized queries with proper indexes
- **Security Rules**: Efficient rule evaluation
- **Storage Rules**: Optimized file access patterns
- **Caching**: Browser and CDN caching strategies

## 🔮 Future Enhancements

### Planned Features
- **Mobile App**: React Native mobile application
- **PWA Support**: Progressive Web App capabilities
- **Real-time Notifications**: Firebase Cloud Messaging integration
- **Advanced Analytics**: Detailed reporting and insights
- **Multi-language Support**: Internationalization (i18n)
- **Document Scanning**: Mobile document capture
- **Digital Signatures**: Electronic signature support
- **Payment Integration**: Online fee payment system

### Technical Improvements
- **TypeScript Migration**: Gradual migration to TypeScript
- **Testing Coverage**: Comprehensive test suite
- **API Integration**: Government API connections
- **Microservices**: Modular backend architecture
- **CI/CD Pipeline**: Automated deployment pipeline

## 🤝 Contributing

We welcome contributions to improve the Digital E-Gram Panchayat platform!

### How to Contribute
1. **Fork the Repository**: Create your own fork
2. **Create Feature Branch**: `git checkout -b feature/amazing-feature`
3. **Make Changes**: Implement your feature or fix
4. **Test Thoroughly**: Ensure all tests pass
5. **Commit Changes**: `git commit -m 'Add amazing feature'`
6. **Push to Branch**: `git push origin feature/amazing-feature`
7. **Create Pull Request**: Submit for review

### Contribution Guidelines
- Follow existing code style and conventions
- Add tests for new features
- Update documentation as needed
- Ensure backward compatibility
- Test across different user roles

### Code of Conduct
- Be respectful and inclusive
- Provide constructive feedback
- Help others learn and grow
- Maintain a professional environment

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

### Getting Help
- **Documentation**: Check this README and inline code comments
- **Issues**: Create a GitHub issue for bugs or feature requests
- **Discussions**: Use GitHub Discussions for questions and ideas

### Contact Information
- **Project Maintainer**: [Your Name/Organization]
- **Email**: [contact@example.com]
- **Project Repository**: [GitHub Repository URL]

## 🙏 Acknowledgments

- **Create React App**: For the excellent development setup
- **Firebase**: For providing comprehensive backend services
- **Tailwind CSS**: For the utility-first CSS framework
- **React Community**: For continuous innovation and support
- **Open Source Contributors**: For inspiring this project

---

**Made with ❤️ for Digital India Initiative**

> This project aims to digitize government services and make them accessible to every citizen, contributing to the vision of Digital India.

## 📊 Dashboard Features

### Dynamic Data Integration
All dashboards now display real-time data from Firebase:

- **Admin Dashboard**: Total applications (6), pending (2), approved (2), total users, services, and staff counts
- **Staff Dashboard**: Total applications, pending review, processed today, and pending documents
- **User Dashboard**: Quick actions and recent activities (statistics section removed for cleaner UI)

### Sample Data Initialization
The system automatically creates sample data when collections are empty:
- 6 sample applications with varied statuses
- Sample users with different roles
- Sample services (Birth Certificate, Ration Card, Property Tax, etc.)
- User-specific sample applications for testing

### Security Implementation
Comprehensive Firestore security rules ensure:
- Users can only access their own applications and data
- Staff can read all applications and users
- Admins have full access to all collections
- All authenticated users can read services

### Recent Updates
- Removed intrusive toast notifications across all dashboards
- Eliminated debug information and loading states
- Streamlined user dashboard by removing statistics section
- Enhanced error handling with console logging
- Implemented comprehensive data service with Firebase integration 