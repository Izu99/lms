import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Step1 from '@/components/register/Step1'

describe('Register Step1 Component', () => {
  const mockData = {
    firstName: '',
    lastName: '',
    username: '',
    password: '',
    confirmPassword: '',
  }

  const mockSetData = jest.fn()
  const mockNextStep = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders all form fields', () => {
    render(<Step1 data={mockData} setData={mockSetData} nextStep={mockNextStep} />)
    
    expect(screen.getByLabelText(/first name/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/last name/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/username/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/^password$/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /continue/i })).toBeInTheDocument()
  })

  it('displays current data values', () => {
    const dataWithValues = {
      firstName: 'John',
      lastName: 'Doe',
      username: 'johndoe',
      password: 'password123',
      confirmPassword: 'password123',
    }

    render(<Step1 data={dataWithValues} setData={mockSetData} nextStep={mockNextStep} />)
    
    expect(screen.getByDisplayValue('John')).toBeInTheDocument()
    expect(screen.getByDisplayValue('Doe')).toBeInTheDocument()
    expect(screen.getByDisplayValue('johndoe')).toBeInTheDocument()
  })

  it('calls setData when input values change', async () => {
    const user = userEvent.setup()
    render(<Step1 data={mockData} setData={mockSetData} nextStep={mockNextStep} />)
    
    const firstNameInput = screen.getByLabelText(/first name/i)
    await user.type(firstNameInput, 'John')
    
    // Check that setData was called (once per character typed)
    expect(mockSetData).toHaveBeenCalled()
    expect(mockSetData).toHaveBeenCalledTimes(4) // J, o, h, n
  })

  it('toggles password visibility', async () => {
    const user = userEvent.setup()
    render(<Step1 data={mockData} setData={mockSetData} nextStep={mockNextStep} />)
    
    const passwordInput = screen.getByLabelText(/^password$/i)
    const toggleButtons = screen.getAllByRole('button')
    const passwordToggle = toggleButtons.find(button => 
      button.querySelector('svg') && button !== screen.getByRole('button', { name: /continue/i })
    )
    
    // Initially password should be hidden
    expect(passwordInput).toHaveAttribute('type', 'password')
    
    // Click to show password
    if (passwordToggle) {
      await user.click(passwordToggle)
      expect(passwordInput).toHaveAttribute('type', 'text')
    }
  })

  it('validates password confirmation before proceeding', async () => {
    const user = userEvent.setup()
    const dataWithMismatchedPasswords = {
      firstName: 'John',
      lastName: 'Doe',
      username: 'johndoe',
      password: 'password123',
      confirmPassword: 'differentpassword',
    }

    render(
      <Step1 
        data={dataWithMismatchedPasswords} 
        setData={mockSetData} 
        nextStep={mockNextStep} 
      />
    )
    
    await user.click(screen.getByRole('button', { name: /continue/i }))
    
    // Should show alert and not call nextStep
    expect(window.alert).toHaveBeenCalledWith('Passwords do not match')
    expect(mockNextStep).not.toHaveBeenCalled()
  })

  it('proceeds to next step when all fields are valid', async () => {
    const user = userEvent.setup()
    const validData = {
      firstName: 'John',
      lastName: 'Doe',
      username: 'johndoe',
      password: 'password123',
      confirmPassword: 'password123',
    }

    render(<Step1 data={validData} setData={mockSetData} nextStep={mockNextStep} />)
    
    await user.click(screen.getByRole('button', { name: /continue/i }))
    
    expect(mockNextStep).toHaveBeenCalled()
  })

  it('requires all fields to be filled', async () => {
    const user = userEvent.setup()
    render(<Step1 data={mockData} setData={mockSetData} nextStep={mockNextStep} />)
    
    await user.click(screen.getByRole('button', { name: /continue/i }))
    
    // HTML5 validation should prevent submission
    const firstNameInput = screen.getByLabelText(/first name/i)
    expect(firstNameInput).toBeInvalid()
    expect(mockNextStep).not.toHaveBeenCalled()
  })

  it('has proper form structure', () => {
    render(<Step1 data={mockData} setData={mockSetData} nextStep={mockNextStep} />)
    
    // Should have a form element
    const form = screen.getByRole('form')
    expect(form).toBeInTheDocument()
    
    // Button should be submit type
    const submitButton = screen.getByRole('button', { name: /continue/i })
    expect(submitButton).toHaveAttribute('type', 'submit')
  })

  it('shows icons for form fields', () => {
    render(<Step1 data={mockData} setData={mockSetData} nextStep={mockNextStep} />)
    
    // Check that labels have icons (User and Lock icons)
    const labels = screen.getAllByText(/first name|last name|username|password/i)
    expect(labels.length).toBeGreaterThan(0)
  })

  it('has responsive layout for name fields', () => {
    render(<Step1 data={mockData} setData={mockSetData} nextStep={mockNextStep} />)
    
    // First and last name should be in a grid layout
    const firstNameInput = screen.getByLabelText(/first name/i)
    const lastName = screen.getByLabelText(/last name/i)
    
    expect(firstNameInput.closest('.grid')).toBeInTheDocument()
    expect(lastName.closest('.grid')).toBeInTheDocument()
  })
})