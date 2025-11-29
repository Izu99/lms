import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import RegisterPage from '@/app/(auth)/register/page'

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

// Mock axios for API calls
jest.mock('axios', () => ({
  post: jest.fn(),
  get: jest.fn((url) => {
    if (url.includes('/api/institutes')) {
      return Promise.resolve({ data: { institutes: [{ _id: 'inst1', name: 'Test Institute', location: 'Test Location', isActive: true }] } });
    }
    return Promise.reject(new Error('not found'));
  }),
  isAxiosError: jest.fn(),
}));

import axios from 'axios'
const mockedAxios = axios as jest.Mocked<typeof axios>

describe('RegisterPage', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockedAxios.post.mockClear()
    mockedAxios.isAxiosError.mockClear()
  })

  it('renders register form with all required elements', () => {
    render(<RegisterPage />)
    
    // Check branding (use getAllByText since there are multiple instances)
    expect(screen.getAllByText('ezyICT')).toHaveLength(2) // One for desktop, one for mobile
    expect(screen.getAllByText('Smart Learning Made Easy')).toHaveLength(2) // One for desktop, one for mobile
    
    // Check header
    expect(screen.getByText('Create Account')).toBeInTheDocument()
    expect(screen.getByText('Join our learning community today')).toBeInTheDocument()
    
    // Check step indicator
    expect(screen.getByText('1')).toBeInTheDocument()
    expect(screen.getByText('2')).toBeInTheDocument()
    expect(screen.getByText('3')).toBeInTheDocument()
    
    // Check Step 1 form elements
    expect(screen.getByLabelText(/first name/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/last name/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/username/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/^Password/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument()
    
    // Check navigation
    expect(screen.getByRole('button', { name: /continue/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /sign in instead/i })).toBeInTheDocument()
  })

  it('shows step progress indicator correctly', async () => {
    const user = userEvent.setup()
    render(<RegisterPage />)
    
    // Initially step 1 should be active
    const step1 = screen.getByText('1').closest('div')
    expect(step1).toHaveClass('bg-emerald-500')
    
    // Fill Step 1 and proceed
    await user.type(screen.getByLabelText(/first name/i), 'John')
    await user.type(screen.getByLabelText(/last name/i), 'Doe')
    await user.type(screen.getByLabelText(/username/i), 'johndoe')
    await user.type(screen.getByLabelText(/email/i), 'john.doe@example.com')
    await user.type(screen.getByLabelText(/^Password/i), 'Password123!')
    await user.type(screen.getByLabelText(/confirm password/i), 'Password123!')
    
    await user.click(screen.getByRole('button', { name: /continue/i }))
    
    // Now step 2 should be active
    await waitFor(() => {
      const step2 = screen.getByText('2').closest('div')
      expect(step2).toHaveClass('bg-emerald-500')
    })
  })

  it('validates password confirmation in Step 1', async () => {
    const user = userEvent.setup()
    render(<RegisterPage />)
    
    // Fill form with mismatched passwords
    await user.type(screen.getByLabelText(/first name/i), 'John')
    await user.type(screen.getByLabelText(/last name/i), 'Doe')
    await user.type(screen.getByLabelText(/username/i), 'johndoe')
    await user.type(screen.getByLabelText(/email/i), 'john.doe@example.com')
    await user.type(screen.getByLabelText(/^Password/i), 'Password123!')
    await user.type(screen.getByLabelText(/confirm password/i), 'differentpassword')
    
    await user.click(screen.getByRole('button', { name: /continue/i }))
    
    // Should show alert for password mismatch
    await waitFor(() => {
      expect(screen.getByText('Passwords do not match')).toBeInTheDocument()
    })
  })

  it('navigates through all steps successfully', async () => {
    const user = userEvent.setup()
    render(<RegisterPage />)
    
    // Step 1: Personal Information
    await user.type(screen.getByLabelText(/first name/i), 'John')
    await user.type(screen.getByLabelText(/last name/i), 'Doe')
    await user.type(screen.getByLabelText(/username/i), 'johndoe')
    await user.type(screen.getByLabelText(/email/i), 'john.doe@example.com')
    await user.type(screen.getByLabelText(/^Password/i), 'Password123!')
    await user.type(screen.getByLabelText(/confirm password/i), 'Password123!')
    await user.click(screen.getByRole('button', { name: /continue/i }))
    
    // Step 2: Contact Information
    await waitFor(() => {
      expect(screen.getByLabelText(/address/i)).toBeInTheDocument()
    })
    
    await user.type(screen.getByLabelText(/address/i), '123 Main St')
    await user.type(screen.getByLabelText(/institute/i), 'Test University')
    
    // Select year
    const yearSelect = screen.getByRole('combobox')
    await user.click(yearSelect)
    await user.click(screen.getByText('Grade 12'))
    
    await user.type(screen.getByLabelText(/phone number/i), '1234567890')
    await user.type(screen.getByLabelText(/whatsapp number/i), '1234567890')
    
    await user.click(screen.getByRole('button', { name: /continue/i }))
    
    // Step 3: Additional Information
    await waitFor(() => {
      expect(screen.getByLabelText(/telegram username/i)).toBeInTheDocument()
    })
    
    expect(screen.getByLabelText(/id card image/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /create account/i })).toBeInTheDocument()
  })

  it('allows navigation back to previous steps', async () => {
    const user = userEvent.setup()
    render(<RegisterPage />)
    
    // Go to Step 2
    await user.type(screen.getByLabelText(/first name/i), 'John')
    await user.type(screen.getByLabelText(/last name/i), 'Doe')
    await user.type(screen.getByLabelText(/username/i), 'johndoe')
    await user.type(screen.getByLabelText(/email/i), 'john.doe@example.com')
    await user.type(screen.getByLabelText(/^Password/i), 'Password123!')
    await user.type(screen.getByLabelText(/confirm password/i), 'Password123!')
    await user.click(screen.getByRole('button', { name: /continue/i }))
    
    await waitFor(() => {
      expect(screen.getByLabelText(/address/i)).toBeInTheDocument()
    })
    
    // Click back button (chevron left icon)
    const backButton = screen.getByRole('button', { name: '' }) // Icon button
    await user.click(backButton)
    
    // Should be back to Step 1
    await waitFor(() => {
      expect(screen.getByLabelText(/first name/i)).toBeInTheDocument()
    })
  })

  it('handles file upload in Step 3', async () => {
    const user = userEvent.setup()
    render(<RegisterPage />)
    
    // Navigate to Step 3
    await user.type(screen.getByLabelText(/first name/i), 'John')
    await user.type(screen.getByLabelText(/last name/i), 'Doe')
    await user.type(screen.getByLabelText(/username/i), 'johndoe')
    await user.type(screen.getByLabelText(/email/i), 'john.doe@example.com')
    await user.type(screen.getByLabelText(/^Password/i), 'Password123!')
    await user.type(screen.getByLabelText(/confirm password/i), 'Password123!')
    await user.click(screen.getByRole('button', { name: /continue/i }))
    
    await waitFor(() => {
      expect(screen.getByLabelText(/address/i)).toBeInTheDocument()
    })
    
    await user.type(screen.getByLabelText(/address/i), '123 Main St')
    await user.type(screen.getByLabelText(/institute/i), 'Test University')
    const yearSelect = screen.getByRole('combobox')
    await user.click(yearSelect)
    await user.click(screen.getByText('Grade 12'))
    await user.click(screen.getByRole('button', { name: /continue/i }))
    
    await waitFor(() => {
      expect(screen.getByLabelText(/id card image/i)).toBeInTheDocument()
    })
    
    // Test file upload
    const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' })
    const fileInput = screen.getByLabelText(/id card image/i)
    
    await user.upload(fileInput, file)
    
    // Should show thumbnail or file name
    expect(fileInput.files?.[0]).toBe(file)
  })

  it('successfully submits registration', async () => {
    const user = userEvent.setup()
    
    // Mock successful API response
    mockedAxios.post.mockResolvedValueOnce({
      data: {
        success: true,
        token: 'mock-token',
        id: 'user-1',
        username: 'johndoe',
        role: 'student',
        firstName: 'John',
        lastName: 'Doe',
      },
    })

    // Mock window.location.href
    delete (window as any).location
    ;(window as any).location = { href: '' }

    render(<RegisterPage />)
    
    // Complete all steps
    // Step 1
    await user.type(screen.getByLabelText(/first name/i), 'John')
    await user.type(screen.getByLabelText(/last name/i), 'Doe')
    await user.type(screen.getByLabelText(/username/i), 'johndoe')
    await user.type(screen.getByLabelText(/email/i), 'john.doe@example.com')
    await user.type(screen.getByLabelText(/^Password/i), 'Password123!')
    await user.type(screen.getByLabelText(/confirm password/i), 'Password123!')
    await user.click(screen.getByRole('button', { name: /continue/i }))
    
    // Step 2
    await waitFor(() => {
      expect(screen.getByLabelText(/address/i)).toBeInTheDocument()
    })
    await user.type(screen.getByLabelText(/address/i), '123 Main St')
    await user.type(screen.getByLabelText(/institute/i), 'Test University')
    const yearSelect = screen.getByRole('combobox')
    await user.click(yearSelect)
    await user.click(screen.getByText('Grade 12'))
    await user.click(screen.getByRole('button', { name: /continue/i }))
    
    // Step 3
    await waitFor(() => {
      expect(screen.getByLabelText(/telegram username/i)).toBeInTheDocument()
    })
    await user.type(screen.getByLabelText(/telegram username/i), '@johndoe')
    
    // Add file
    const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' })
    const fileInput = screen.getByLabelText(/id card image/i)
    await user.upload(fileInput, file)
    
    // Submit
    await user.click(screen.getByRole('button', { name: /create account/i }))
    
    // Should call API and redirect
    await waitFor(() => {
      expect(mockedAxios.post).toHaveBeenCalledWith(
        expect.stringContaining('/auth/register'),
        expect.any(FormData),
        expect.objectContaining({
          headers: { 'Content-Type': 'multipart/form-data' },
        })
      )
    })
    
    expect(window.location.href).toBe('/')
  })

  it('shows error message for registration failure', async () => {
    const user = userEvent.setup()
    
    // Mock API error
    mockedAxios.post.mockRejectedValueOnce({
      response: {
        data: {
          error: 'Username already exists',
        },
      },
    })
    mockedAxios.isAxiosError.mockReturnValueOnce(true)

    render(<RegisterPage />)
    
    // Navigate to Step 3 and submit
    await user.type(screen.getByLabelText(/first name/i), 'John')
    await user.type(screen.getByLabelText(/last name/i), 'Doe')
    await user.type(screen.getByLabelText(/username/i), 'existinguser')
    await user.type(screen.getByLabelText(/^Password/i), 'Password123!')
    await user.type(screen.getByLabelText(/confirm password/i), 'Password123!')
    await user.click(screen.getByRole('button', { name: /continue/i }))
    
    await waitFor(() => {
      expect(screen.getByLabelText(/address/i)).toBeInTheDocument()
    })
    await user.type(screen.getByLabelText(/address/i), '123 Main St')
    await user.type(screen.getByLabelText(/institute/i), 'Test University')
    const yearSelect = screen.getByRole('combobox')
    await user.click(yearSelect)
    await user.click(screen.getByText('Grade 12'))
    await user.click(screen.getByRole('button', { name: /continue/i }))
    
    await waitFor(() => {
      expect(screen.getByLabelText(/telegram username/i)).toBeInTheDocument()
    })
    
    const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' })
    const fileInput = screen.getByLabelText(/id card image/i)
    await user.upload(fileInput, file)
    
    await user.click(screen.getByRole('button', { name: /create account/i }))
    
    // Should show error message
    await waitFor(() => {
      expect(screen.getByText(/username already exists/i)).toBeInTheDocument()
    })
  })

  it('shows loading state during registration', async () => {
    const user = userEvent.setup()
    
    // Mock delayed API response
    mockedAxios.post.mockImplementationOnce(
      () => new Promise(resolve => 
        setTimeout(() => resolve({
          data: { success: true, token: 'mock-token' }
        }), 100)
      )
    )

    render(<RegisterPage />)
    
    // Navigate to Step 3 and submit
    await user.type(screen.getByLabelText(/first name/i), 'John')
    await user.type(screen.getByLabelText(/last name/i), 'Doe')
    await user.type(screen.getByLabelText(/username/i), 'johndoe')
    await user.type(screen.getByLabelText(/email/i), 'john.doe@example.com')
    await user.type(screen.getByLabelText(/^Password/i), 'Password123!')
    await user.type(screen.getByLabelText(/confirm password/i), 'Password123!')
    await user.click(screen.getByRole('button', { name: /continue/i }))
    
    await waitFor(() => {
      expect(screen.getByLabelText(/address/i)).toBeInTheDocument()
    })
    await user.type(screen.getByLabelText(/address/i), '123 Main St')
    await user.type(screen.getByLabelText(/institute/i), 'Test University')
    const yearSelect = screen.getByRole('combobox')
    await user.click(yearSelect)
    await user.click(screen.getByText('Grade 12'))
    await user.click(screen.getByRole('button', { name: /continue/i }))
    
    await waitFor(() => {
      expect(screen.getByLabelText(/telegram username/i)).toBeInTheDocument()
    })
    
    const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' })
    const fileInput = screen.getByLabelText(/id card image/i)
    await user.upload(fileInput, file)
    
    await user.click(screen.getByRole('button', { name: /create account/i }))
    
    // Should show loading state
    expect(screen.getByText(/creating account/i)).toBeInTheDocument()
  })

  it('has proper accessibility attributes', () => {
    render(<RegisterPage />)
    
    // Check form labels
    expect(screen.getByLabelText(/first name/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/last name/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/username/i)).toBeInTheDocument()
    
    // Check buttons
    expect(screen.getByRole('button', { name: /continue/i })).toBeInTheDocument()
    
    // Check links
    expect(screen.getByRole('link', { name: /sign in instead/i })).toBeInTheDocument()
  })

  it('displays motivational quotes', () => {
    render(<RegisterPage />)
    
    // Should show at least one motivational quote element
    const quoteElements = screen.getAllByText(/—/i) // Quote attribution marker
    expect(quoteElements.length).toBeGreaterThan(0)
  })

  it('validates required fields in each step', async () => {
    const user = userEvent.setup()
    render(<RegisterPage />)
    
    // Try to proceed from Step 1 without filling required fields
    await user.click(screen.getByRole('button', { name: /continue/i }))
    
    // Should display validation error message
    expect(screen.getByText('First name is required')).toBeInTheDocument()
  })
})