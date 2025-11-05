# ezyICT Frontend Testing Suite

A comprehensive testing suite for the ezyICT learning management system frontend, built with modern testing practices and real-world scenarios.

## 🏗️ Architecture

### Testing Stack
- **Jest**: Test runner and assertion library
- **React Testing Library**: Component testing utilities
- **MSW (Mock Service Worker)**: API mocking
- **User Event**: User interaction simulation
- **JSDOM**: DOM environment for Node.js

### Folder Structure
```
src/__tests__/
├── components/           # UI component tests
├── features/            # Feature-specific tests
│   ├── auth/           # Authentication tests
│   ├── student/        # Student dashboard tests
│   ├── teacher/        # Teacher dashboard tests
│   └── papers/         # Paper attempt tests
├── hooks/              # Custom hook tests
├── integration/        # End-to-end integration tests
├── mocks/              # Mock implementations
│   ├── handlers.ts     # MSW API handlers
│   ├── server.ts       # MSW server setup
│   └── AuthProvider.tsx # Mock auth provider
├── utils/              # Testing utilities
│   └── test-utils.tsx  # Custom render functions
├── setup.ts            # Test environment setup
└── README.md           # This file
```

## 🚀 Getting Started

### Installation
```bash
# Install testing dependencies
npm install --save-dev @testing-library/react @testing-library/jest-dom @testing-library/user-event jest jest-environment-jsdom @types/jest msw whatwg-fetch
```

### Running Tests
```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run tests for CI/CD
npm run test:ci

# Run specific test suite
npm test auth
npm test components
npm test student
npm test teacher
npm test papers
npm test hooks
npm test integration
```

## 📋 Test Categories

### 1. Component Tests (`components/`)
Tests for individual UI components focusing on:
- Rendering behavior
- User interactions
- Props handling
- Accessibility
- Responsive design

**Example:**
```typescript
// Navbar.test.tsx
it('renders ezyICT branding', () => {
  render(<Navbar user={mockStudentUser} />)
  
  expect(screen.getByText('ezyICT')).toBeInTheDocument()
  expect(screen.getByText('Smart Learning Made Easy')).toBeInTheDocument()
})
```

### 2. Authentication Tests (`features/auth/`)
Comprehensive authentication flow testing:
- Login/logout functionality
- Form validation
- Error handling
- Token management
- Role-based access

**Example:**
```typescript
// LoginPage.test.tsx
it('successfully logs in with valid credentials', async () => {
  const user = userEvent.setup()
  render(<LoginPage />)
  
  await user.type(screen.getByLabelText(/username/i), 'student1')
  await user.type(screen.getByLabelText(/password/i), 'password123')
  await user.click(screen.getByRole('button', { name: /sign in/i }))
  
  await waitFor(() => {
    expect(mockPush).toHaveBeenCalledWith('/')
  })
})
```

### 3. Dashboard Tests (`features/student/`, `features/teacher/`)
Role-specific dashboard functionality:
- Data loading and display
- User information
- Navigation
- Responsive behavior
- Error states

### 4. Paper Attempt Tests (`features/papers/`)
Complex paper-taking functionality:
- Timer management
- Question navigation
- Answer selection
- Auto-save
- Submission process

### 5. Hook Tests (`hooks/`)
Custom React hooks testing:
- State management
- Side effects
- Error handling
- Cleanup

### 6. Integration Tests (`integration/`)
End-to-end user flows:
- Complete authentication flows
- Cross-component interactions
- API integration
- State persistence

## 🛠️ Testing Utilities

### Custom Render Function
```typescript
import { render, mockStudentUser } from '../utils/test-utils'

// Renders component with all necessary providers
render(<MyComponent />, { user: mockStudentUser })
```

### Mock Data
```typescript
import { mockStudentUser, mockTeacherUser } from '../utils/test-utils'

// Pre-configured user objects for testing
const student = mockStudentUser
const teacher = mockTeacherUser
```

### Local Storage Mocking
```typescript
import { mockLocalStorage } from '../utils/test-utils'

// Set authenticated user
mockLocalStorage.setAuthenticatedUser(mockStudentUser)

// Clear authentication
mockLocalStorage.clearAuth()
```

## 🎯 Testing Best Practices

### 1. Test Structure
```typescript
describe('ComponentName', () => {
  beforeEach(() => {
    resetAllMocks()
  })

  it('should describe what it tests', async () => {
    // Arrange
    const user = userEvent.setup()
    render(<Component />)
    
    // Act
    await user.click(screen.getByRole('button'))
    
    // Assert
    expect(screen.getByText('Expected')).toBeInTheDocument()
  })
})
```

### 2. Accessibility Testing
```typescript
it('has proper accessibility attributes', () => {
  render(<Component />)
  
  // Check ARIA labels
  expect(screen.getByLabelText(/username/i)).toBeInTheDocument()
  
  // Check roles
  expect(screen.getByRole('button')).toBeInTheDocument()
  
  // Check keyboard navigation
  expect(screen.getByRole('navigation')).toBeInTheDocument()
})
```

### 3. Error Handling
```typescript
it('handles API errors gracefully', async () => {
  // Mock API error
  server.use(
    http.get('/api/data', () => {
      return HttpResponse.json(
        { message: 'Server error' },
        { status: 500 }
      )
    })
  )
  
  render(<Component />)
  
  await waitFor(() => {
    expect(screen.getByText(/error/i)).toBeInTheDocument()
  })
})
```

### 4. Responsive Testing
```typescript
it('is responsive on mobile devices', () => {
  // Mock mobile viewport
  Object.defineProperty(window, 'innerWidth', {
    writable: true,
    configurable: true,
    value: 375,
  })
  
  render(<Component />)
  
  expect(screen.getByTestId('mobile-menu')).toBeInTheDocument()
})
```

## 🔒 Security Testing

### Sensitive Data Checks
- No passwords in localStorage
- No tokens in console logs
- Proper data sanitization
- XSS prevention

### Running Security Tests
```bash
npm run test:security
```

## 📊 Coverage Requirements

### Minimum Coverage Thresholds
- **Branches**: 80%
- **Functions**: 80%
- **Lines**: 80%
- **Statements**: 80%

### Coverage Reports
```bash
# Generate coverage report
npm run test:coverage

# View HTML report
open coverage/lcov-report/index.html
```

## 🚨 Common Issues & Solutions

### 1. Timer Tests
```typescript
beforeEach(() => {
  jest.useFakeTimers()
})

afterEach(() => {
  jest.runOnlyPendingTimers()
  jest.useRealTimers()
})

it('handles timer correctly', () => {
  render(<TimerComponent />)
  
  act(() => {
    jest.advanceTimersByTime(1000)
  })
  
  expect(screen.getByText('59:59')).toBeInTheDocument()
})
```

### 2. Async Operations
```typescript
it('handles async data loading', async () => {
  render(<AsyncComponent />)
  
  // Wait for loading to complete
  await waitFor(() => {
    expect(screen.queryByText('Loading...')).not.toBeInTheDocument()
  })
  
  expect(screen.getByText('Data loaded')).toBeInTheDocument()
})
```

### 3. Form Testing
```typescript
it('validates form input', async () => {
  const user = userEvent.setup()
  render(<FormComponent />)
  
  const input = screen.getByLabelText(/email/i)
  await user.type(input, 'invalid-email')
  await user.click(screen.getByRole('button', { name: /submit/i }))
  
  expect(screen.getByText(/invalid email/i)).toBeInTheDocument()
})
```

## 🔄 Continuous Integration

### GitHub Actions Example
```yaml
name: Frontend Tests
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run test:ci
      - run: npm run test:coverage
```

## 📚 Resources

- [React Testing Library Docs](https://testing-library.com/docs/react-testing-library/intro/)
- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [MSW Documentation](https://mswjs.io/docs/)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)

## 🤝 Contributing

### Adding New Tests
1. Follow the existing folder structure
2. Use descriptive test names
3. Include accessibility tests
4. Add error handling tests
5. Maintain coverage thresholds

### Test Naming Convention
```typescript
// ✅ Good
it('shows error message when login fails')
it('redirects to dashboard after successful login')
it('disables submit button while loading')

// ❌ Bad
it('test login')
it('check button')
it('works correctly')
```

### Mock Guidelines
- Keep mocks simple and focused
- Use MSW for API mocking
- Mock external dependencies
- Avoid mocking internal components

---

**Happy Testing! 🧪✨**

*Built with ❤️ for ezyICT - Smart Learning Made Easy*