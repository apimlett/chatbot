import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/vue'
import App from './App.vue'
import { server } from './test/setup'
import { http, HttpResponse } from 'msw'

describe('App.vue', () => {
  beforeEach(() => {
    // Mock window.innerHeight for viewport tests
    Object.defineProperty(window, 'innerHeight', {
      writable: true,
      configurable: true,
      value: 800,
    })
  })
  
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('renders the app interface', () => {
    render(App)
    
    // Check for main elements
    expect(screen.getByText('Vue.js + Express Template')).toBeTruthy()
    expect(screen.getByText('A clean starting point for full-stack applications')).toBeTruthy()
    expect(screen.getByText('Welcome to Your New Project')).toBeTruthy()
    expect(screen.getByText('Test API Connection')).toBeTruthy()
  })

  it('tests API connection successfully', async () => {
    render(App)
    
    const button = screen.getByText('Test API Connection')
    await fireEvent.click(button)
    
    // Check for loading state
    expect(screen.getByText('Testing...')).toBeTruthy()
    
    // Wait for API response
    await waitFor(() => {
      expect(screen.getByText('API Response:')).toBeTruthy()
    })
  })

  it('handles API errors gracefully', async () => {
    // Mock API error
    server.use(
      http.get('*/api/health', () => {
        return new HttpResponse(null, { status: 500 })
      })
    )
    
    render(App)
    
    const button = screen.getByText('Test API Connection')
    await fireEvent.click(button)
    
    // Wait for error message
    await waitFor(() => {
      expect(screen.getByText('Error:')).toBeTruthy()
    })
  })

  it('sets up viewport height tracking on mount', () => {
    const addEventListenerSpy = vi.spyOn(window, 'addEventListener')
    render(App)
    
    // Check that event listeners were added
    expect(addEventListenerSpy).toHaveBeenCalledWith('resize', expect.any(Function))
    expect(addEventListenerSpy).toHaveBeenCalledWith('orientationchange', expect.any(Function))
  })

  it('updates viewport height on window resize', async () => {
    const wrapper = render(App)
    
    // Change window height
    window.innerHeight = 600
    
    // Trigger resize event
    window.dispatchEvent(new Event('resize'))
    
    await waitFor(() => {
      expect(wrapper.container.firstChild.style.height).toBe('600px')
    })
  })
})