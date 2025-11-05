/**
 * Simple test to verify Jest setup is working
 */

describe('Jest Setup', () => {
  it('should run basic tests', () => {
    expect(1 + 1).toBe(2)
  })

  it('should have access to DOM APIs', () => {
    expect(document).toBeDefined()
    expect(window).toBeDefined()
  })

  it('should have localStorage mock', () => {
    expect(localStorage.getItem).toBeDefined()
    expect(localStorage.setItem).toBeDefined()
  })

  it('should have alert mock', () => {
    expect(window.alert).toBeDefined()
    expect(window.confirm).toBeDefined()
  })
})