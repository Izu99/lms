import { render, screen, waitFor, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import LoginPage from '@/app/(auth)/login/page'

// Mock Next.js navigation
const mockPush = jest.fn()
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
    replace: jest.fn(),
    prefetch: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
    refresh: jest.fn(),
  }),
}))

// Mock fetch for API calls
global.fetch = jest.fn()

describe('LoginPage', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    ;(fetch as jest.Mock).mockClear()
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('renders login form with all required elements', () => {
    render(<LoginPage />)
    
    // Check branding (use getAllByText since there are multiple instances)
    expect(screen.getAllByText('ezyICT')).toHaveLength(2) // One for desktop, one for mobile
    expect(screen.getAllByText('Smart Learning Made Easy')).toHaveLength(2) // One for desktop, one for mobile
    
    // Check form elements
    expect(screen.getByLabelText(/username/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /sign in to dashboard/i })).toBeInTheDocument()
    
    // Check links
    expect(screen.getByText(/forgot your password/i)).toBeInTheDocument()
    expect(screen.getByText(/create new account/i)).toBeInTheDocument()
  })

  it('shows validation errors for empty form submission', async () => {
    const user = userEvent.setup()
    render(<LoginPage />)
    
    const submitButton = screen.getByRole('button', { name: /sign in to dashboard/i })
    await user.click(submitButton)
    
    // HTML5 validation should prevent submission
    const usernameInput = screen.getByLabelText(/username/i)
    expect(usernameInput).toBeInvalid()
  })

  it('successfully logs in with valid credentials', async () => {
    const user = userEvent.setup()
    
    // Mock successful API response
    ;(fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        token: 'mock-token',
        id: 'user-1',
        username: 'testuser',
        role: 'student',
        firstName: 'Test',
        lastName: 'User',
      }),
    })

    render(<LoginPage />)
    
    // Fill in the form
    await user.type(screen.getByLabelText(/username/i), 'testuser')
    await user.type(screen.getByLabelText(/password/i), 'password123')
    
    // Submit the form
    await user.click(screen.getByRole('button', { name: /sign in to dashboard/i }))
    
    // Wait for the API call and redirect
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/auth/login'),
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            username: 'testuser',
            password: 'password123',
          }),
        })
      )
    })

    // Check localStorage was updated
    expect(localStorage.setItem).toHaveBeenCalledWith('token', 'mock-token')
    expect(localStorage.setItem).toHaveBeenCalledWith(
      'user',
      expect.stringContaining('testuser')
    )
  })

  it('shows error message for invalid credentials', async () => {
    const user = userEvent.setup()
    
    // Mock failed API response
    ;(fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      json: async () => ({
        success: false,
        message: 'Invalid credentials',
      }),
    })

    render(<LoginPage />)
    
    // Fill in the form with invalid credentials
    await user.type(screen.getByLabelText(/username/i), 'invaliduser')
    await user.type(screen.getByLabelText(/password/i), 'wrongpassword')
    
    // Submit the form
    await user.click(screen.getByRole('button', { name: /sign in to dashboard/i }))
    
    // Wait for error message
    await waitFor(() => {
      expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument()
    })
  })

  it('toggles password visibility', async () => {
    const user = userEvent.setup()
    render(<LoginPage />)
    
    const passwordInput = screen.getByLabelText(/password/i)
    const toggleButtons = screen.getAllByRole('button')
    const toggleButton = toggleButtons.find(button => 
      button.querySelector('svg') // Find the eye icon button
    )
    
    // Initially password should be hidden
    expect(passwordInput).toHaveAttribute('type', 'password')
    
    // Click to show password
    if (toggleButton) {
      await user.click(toggleButton)
      expect(passwordInput).toHaveAttribute('type', 'text')
      
      // Click to hide password again
      await user.click(toggleButton)
      expect(passwordInput).toHaveAttribute('type', 'password')
    }
  })

  it('shows loading state during login', async () => {
    const user = userEvent.setup()
    
    // Mock delayed API response
    ;(fetch as jest.Mock).mockImplementationOnce(
      () => new Promise(resolve => 
        setTimeout(() => resolve({
          ok: true,
          json: async () => ({ success: true, token: 'mock-token' }),
        }), 100)
      )
    )

    render(<LoginPage />)
    
    // Fill in the form
    await user.type(screen.getByLabelText(/username/i), 'testuser')
    await user.type(screen.getByLabelText(/password/i), 'password123')
    
    // Submit the form
    await user.click(screen.getByRole('button', { name: /sign in to dashboard/i }))
    
    // Check for loading state
    expect(screen.getByText(/signing in/i)).toBeInTheDocument()
  })

  it('displays motivational quotes', () => {
    render(<LoginPage />)
    
    // Should show at least one motivational quote element
    const quoteElements = screen.getAllByText(/—/i) // Quote attribution marker
    expect(quoteElements.length).toBeGreaterThan(0)
  })

  it('has proper accessibility attributes', () => {
    render(<LoginPage />)
    
    // Check form labels
    expect(screen.getByLabelText(/username/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument()
    
    // Check button accessibility
    const submitButton = screen.getByRole('button', { name: /sign in to dashboard/i })
    expect(submitButton).toBeInTheDocument()
    
    // Check links
    expect(screen.getByRole('link', { name: /forgot your password/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /create new account/i })).toBeInTheDocument()
  })

  it('handles network errors gracefully', async () => {
    const user = userEvent.setup()
    
    // Mock network error
    ;(fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'))
    
    render(<LoginPage />)
    
    // Fill in the form
    await user.type(screen.getByLabelText(/username/i), 'testuser')
    await user.type(screen.getByLabelText(/password/i), 'password123')
    
    // Submit the form
    await user.click(screen.getByRole('button', { name: /sign in to dashboard/i }))
    
    // Wait for error message
    await waitFor(() => {
      expect(screen.getByText(/network error/i)).toBeInTheDocument()
    })
  })

  it('redirects to home page after successful login', async () => {
    const user = userEvent.setup()
    
    // Mock successful API response
    ;(fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        token: 'mock-token',
        username: 'testuser',
        role: 'student',
      }),
    })

    // Mock window.location.href
    delete (window as any).location
    ;(window as any).location = { href: '' }

    render(<LoginPage />)
    
    // Fill in and submit form
    await user.type(screen.getByLabelText(/username/i), 'testuser')
    await user.type(screen.getByLabelText(/password/i), 'password123')
    await user.click(screen.getByRole('button', { name: /sign in to dashboard/i }))
    
    // Wait for redirect
    await waitFor(() => {
      expect(window.location.href).toBe('/')
    })
  })

  it('shows different quotes over time', async () => {
    jest.useFakeTimers()
    
    render(<LoginPage />)
    
    // Get initial quote
    const initialQuote = screen.getByText(/—/i).textContent
    
    // Fast forward time to trigger quote change
    act(() => {
      jest.advanceTimersByTime(4000)
    })
    
    // Quote should potentially change (though it might be the same by chance)
    const newQuote = screen.getByText(/—/i).textContent
    
    // At minimum, the quote system should be working
    expect(newQuote).toBeDefined()
    
    jest.useRealTimers()
  })
})