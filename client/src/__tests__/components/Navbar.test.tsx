import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Navbar from '@/components/Navbar'

const mockUser = {
  id: 'user-1',
  username: 'testuser',
  role: 'student' as const,
  firstName: 'Test',
  lastName: 'User',
}

describe('Navbar Component', () => {
  it('renders ezyICT branding', () => {
    render(<Navbar user={mockUser} />)
    
    expect(screen.getByText('ezyICT')).toBeInTheDocument()
    expect(screen.getByText('Smart Learning Made Easy')).toBeInTheDocument()
  })

  it('displays user information', () => {
    render(<Navbar user={mockUser} />)
    
    expect(screen.getByText('testuser')).toBeInTheDocument()
    expect(screen.getByText('student')).toBeInTheDocument()
  })

  it('shows student navigation items', () => {
    render(<Navbar user={mockUser} />)
    
    expect(screen.getByText('Dashboard')).toBeInTheDocument()
    expect(screen.getByText('Video Lessons')).toBeInTheDocument()
    expect(screen.getByText('Assignments')).toBeInTheDocument()
  })

  it('handles logout when onLogout prop is provided', async () => {
    const mockOnLogout = jest.fn()
    const user = userEvent.setup()
    
    render(<Navbar user={mockUser} onLogout={mockOnLogout} />)
    
    // Find and click profile button to open dropdown
    const profileButton = screen.getByRole('button', { name: /testuser/i })
    await user.click(profileButton)
    
    // Click logout button
    const logoutButton = screen.getByText('Logout')
    await user.click(logoutButton)
    
    expect(mockOnLogout).toHaveBeenCalled()
  })

  it('renders without user (guest state)', () => {
    render(<Navbar user={null} />)
    
    // Should still show branding
    expect(screen.getByText('ezyICT')).toBeInTheDocument()
    
    // Should not show user-specific elements
    expect(screen.queryByText('Dashboard')).not.toBeInTheDocument()
  })
})