# Contributing to Digital E-Gram Panchayat

Thank you for your interest in contributing to the Digital E-Gram Panchayat project! We welcome contributions from the community and are grateful for any help you can provide.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [How to Contribute](#how-to-contribute)
- [Development Process](#development-process)
- [Pull Request Process](#pull-request-process)
- [Coding Standards](#coding-standards)
- [Testing Guidelines](#testing-guidelines)
- [Issue Reporting](#issue-reporting)
- [Feature Requests](#feature-requests)
- [Community](#community)

## 🤝 Code of Conduct

This project and everyone participating in it is governed by our [Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code.

## 🚀 Getting Started

### Prerequisites

Before you begin contributing, make sure you have:

- **Node.js** (v14.0.0 or higher)
- **npm** (v6.0.0 or higher) or **yarn**
- **Git** for version control
- **Firebase Account** for testing
- Basic knowledge of **React**, **Firebase**, and **Tailwind CSS**

### Setting Up Development Environment

1. **Fork the Repository**
   ```bash
   # Click the "Fork" button on GitHub to create your copy
   ```

2. **Clone Your Fork**
   ```bash
   git clone https://github.com/YOUR_USERNAME/digital-e-gram-panchayat.git
   cd digital-e-gram-panchayat
   ```

3. **Add Upstream Remote**
   ```bash
   git remote add upstream https://github.com/ORIGINAL_OWNER/digital-e-gram-panchayat.git
   ```

4. **Install Dependencies**
   ```bash
   npm install
   ```

5. **Set Up Environment Variables**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your Firebase configuration
   ```

6. **Start Development Server**
   ```bash
   npm start
   ```

## 🛠️ How to Contribute

### Types of Contributions

We welcome various types of contributions:

- **🐛 Bug Reports**: Help us identify and fix bugs
- **✨ Feature Requests**: Suggest new features or improvements
- **📖 Documentation**: Improve our documentation
- **🔧 Code Contributions**: Submit bug fixes or new features
- **🎨 UI/UX Improvements**: Enhance user experience
- **🔒 Security**: Report security vulnerabilities
- **🧪 Testing**: Add or improve tests

### Before You Start

1. **Check Existing Issues**: Look through existing issues to avoid duplicates
2. **Discuss Major Changes**: For significant changes, create an issue to discuss first
3. **Read Documentation**: Familiarize yourself with the project structure and codebase

## 🔄 Development Process

### Branching Strategy

We use **Git Flow** branching model:

- `main`: Production-ready code
- `develop`: Integration branch for features
- `feature/*`: Feature development branches
- `bugfix/*`: Bug fix branches
- `hotfix/*`: Critical production fixes

### Workflow

1. **Create a Branch**
   ```bash
   git checkout develop
   git pull upstream develop
   git checkout -b feature/your-feature-name
   ```

2. **Make Changes**
   - Write clean, maintainable code
   - Follow our coding standards
   - Add tests for new features
   - Update documentation as needed

3. **Commit Changes**
   ```bash
   git add .
   git commit -m "feat: add user profile management feature"
   ```

4. **Keep Your Branch Updated**
   ```bash
   git fetch upstream
   git rebase upstream/develop
   ```

5. **Push Changes**
   ```bash
   git push origin feature/your-feature-name
   ```

## 📝 Pull Request Process

### Before Submitting

- [ ] Code follows project coding standards
- [ ] All tests pass
- [ ] Documentation is updated
- [ ] Commit messages follow convention
- [ ] Branch is up to date with develop

### Submitting a Pull Request

1. **Create Pull Request**
   - Go to your fork on GitHub
   - Click "New Pull Request"
   - Select `develop` as the base branch
   - Provide a clear title and description

2. **Pull Request Template**
   ```markdown
   ## Description
   Brief description of changes

   ## Type of Change
   - [ ] Bug fix
   - [ ] New feature
   - [ ] Documentation update
   - [ ] Performance improvement
   - [ ] Other (specify)

   ## Testing
   - [ ] Tested locally
   - [ ] Added/updated tests
   - [ ] All tests pass

   ## Screenshots (if applicable)
   Add screenshots for UI changes

   ## Checklist
   - [ ] Code follows style guidelines
   - [ ] Self-review completed
   - [ ] Documentation updated
   - [ ] No merge conflicts
   ```

### Review Process

1. **Automated Checks**: All CI/CD checks must pass
2. **Code Review**: At least one maintainer review required
3. **Testing**: Manual testing if needed
4. **Approval**: Maintainer approval required
5. **Merge**: Squash and merge to develop

## 🎯 Coding Standards

### React Component Guidelines

```javascript
// Use functional components with hooks
import React, { useState, useEffect } from 'react';

const ComponentName = ({ prop1, prop2 }) => {
  const [state, setState] = useState(initialValue);

  useEffect(() => {
    // Effect logic
  }, [dependencies]);

  return (
    <div className="component-wrapper">
      {/* Component JSX */}
    </div>
  );
};

export default ComponentName;
```

### File Structure

- **Components**: Use PascalCase (`UserDashboard.js`)
- **Utilities**: Use camelCase (`dataService.js`)
- **Constants**: Use UPPER_SNAKE_CASE
- **CSS Classes**: Use kebab-case or Tailwind utilities

### Code Style

- **Indentation**: 2 spaces
- **Quotes**: Single quotes for JavaScript, double quotes for JSX
- **Semicolons**: Always use semicolons
- **Line Length**: Max 100 characters
- **Comments**: Use JSDoc for functions

### Commit Message Convention

We follow **Conventional Commits** specification:

```
type(scope): description

[optional body]

[optional footer(s)]
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

**Examples:**
```bash
feat(auth): add user registration functionality
fix(dashboard): resolve data loading issue
docs(readme): update installation instructions
style(components): improve button styling
```

## 🧪 Testing Guidelines

### Test Structure

```javascript
import { render, screen, fireEvent } from '@testing-library/react';
import ComponentName from './ComponentName';

describe('ComponentName', () => {
  test('renders correctly', () => {
    render(<ComponentName />);
    expect(screen.getByText('Expected Text')).toBeInTheDocument();
  });

  test('handles user interaction', () => {
    render(<ComponentName />);
    fireEvent.click(screen.getByRole('button'));
    expect(/* assertion */).toBe(/* expected */);
  });
});
```

### Testing Requirements

- **Unit Tests**: All utility functions
- **Component Tests**: All React components
- **Integration Tests**: Critical user flows
- **E2E Tests**: Main application workflows

### Running Tests

```bash
npm test                    # Run all tests
npm test -- --coverage     # Run with coverage
npm test -- --watch        # Watch mode
```

## 🐛 Issue Reporting

### Bug Reports

When reporting bugs, please include:

1. **Clear Title**: Descriptive summary of the issue
2. **Environment**: OS, browser, Node.js version
3. **Steps to Reproduce**: Detailed steps
4. **Expected Behavior**: What should happen
5. **Actual Behavior**: What actually happens
6. **Screenshots**: If applicable
7. **Additional Context**: Any relevant information

### Bug Report Template

```markdown
**Bug Description**
A clear description of the bug.

**To Reproduce**
1. Go to '...'
2. Click on '...'
3. Scroll down to '...'
4. See error

**Expected Behavior**
What you expected to happen.

**Screenshots**
Add screenshots if applicable.

**Environment:**
- OS: [e.g., Windows 10]
- Browser: [e.g., Chrome 91]
- Node.js: [e.g., 14.17.0]

**Additional Context**
Any other context about the problem.
```

## 💡 Feature Requests

### Before Requesting

- Check if feature already exists
- Search existing feature requests
- Consider if it fits project scope

### Feature Request Template

```markdown
**Feature Description**
Clear description of the feature.

**Problem Statement**
What problem does this solve?

**Proposed Solution**
How should this work?

**Alternatives Considered**
Other solutions you've considered.

**Additional Context**
Screenshots, mockups, or examples.
```

## 🏷️ Labels and Tags

We use the following labels for issues and PRs:

### Type Labels
- `bug`: Something isn't working
- `enhancement`: New feature or request
- `documentation`: Documentation improvements
- `good first issue`: Good for newcomers
- `help wanted`: Extra attention needed

### Priority Labels
- `priority: high`: Critical issues
- `priority: medium`: Important issues
- `priority: low`: Nice to have

### Status Labels
- `status: in progress`: Currently being worked on
- `status: blocked`: Blocked by dependencies
- `status: review needed`: Ready for review

## 🌟 Recognition

Contributors will be recognized in:

- **README.md**: Contributors section
- **Release Notes**: Major contributions
- **GitHub**: Contributor badge
- **Social Media**: Feature announcements

## 📞 Getting Help

### Communication Channels

- **GitHub Issues**: Bug reports and feature requests
- **GitHub Discussions**: Questions and general discussion
- **Email**: [maintainer@example.com] for sensitive issues

### Response Times

- **Issues**: Within 2-3 business days
- **Pull Requests**: Within 3-5 business days
- **Security Issues**: Within 24 hours

## 🎓 Learning Resources

### Recommended Reading

- [React Documentation](https://reactjs.org/docs)
- [Firebase Documentation](https://firebase.google.com/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Git Best Practices](https://www.atlassian.com/git/tutorials/comparing-workflows)

### Project-Specific Resources

- [Architecture Overview](docs/ARCHITECTURE.md)
- [API Documentation](docs/API.md)
- [Deployment Guide](docs/DEPLOYMENT.md)

---

## 🙏 Thank You

Thank you for contributing to Digital E-Gram Panchayat! Your contributions help make government services more accessible to citizens across India.

**Happy Coding! 🚀** 