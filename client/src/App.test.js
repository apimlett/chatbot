import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
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
    
    // Mock addEventListener and removeEventListener
    vi.spyOn(window, 'addEventListener')
    vi.spyOn(window, 'removeEventListener')
  })
  
  afterEach(() => {
    vi.restoreAllMocks()
  })
  it('renders the chat interface', () => {
    render(App)
    
    // Check for input field
    expect(screen.getByPlaceholderText('Type a message...')).toBeTruthy()
    
    // Check for send button
    expect(screen.getByRole('button', { name: 'Send' })).toBeTruthy()
  })

  it('sends a message and displays the response', async () => {
    render(App)
    
    const input = screen.getByPlaceholderText('Type a message...')
    const button = screen.getByRole('button', { name: 'Send' })
    
    // Type and send a message
    await fireEvent.update(input, 'Hello, AI!')
    await fireEvent.click(button)
    
    // Check if user message is displayed
    expect(screen.getByText('Hello, AI!')).toBeTruthy()
    
    // Wait for and check the response
    await waitFor(() => {
      expect(screen.getByText('Mock response to: Hello, AI!')).toBeTruthy()
    })
  })

  it('handles empty messages', async () => {
    render(App)
    
    const input = screen.getByPlaceholderText('Type a message...')
    const button = screen.getByRole('button', { name: 'Send' })
    
    // Try to send empty message
    await fireEvent.update(input, '   ')
    await fireEvent.click(button)
    
    // Check that no messages were added
    const messages = document.querySelectorAll('.message')
    expect(messages.length).toBe(0)
  })

  it('handles API errors gracefully', async () => {
    // Mock API error
    server.use(
      http.post('*/api/chat', () => {
        return new HttpResponse(null, { status: 500 })
      })
    )
    
    render(App)
    
    const input = screen.getByPlaceholderText('Type a message...')
    const button = screen.getByRole('button', { name: 'Send' })
    
    // Send a message
    await fireEvent.update(input, 'Test message')
    await fireEvent.click(button)
    
    // Check if error message is displayed
    await waitFor(() => {
      expect(screen.getByText('Sorry, I encountered an error. Please try again.')).toBeTruthy()
    })
  })

  it('disables input while sending message', async () => {
    render(App)
    
    const input = screen.getByPlaceholderText('Type a message...')
    const button = screen.getByRole('button', { name: 'Send' })
    
    // Send a message
    await fireEvent.update(input, 'Test message')
    await fireEvent.click(button)
    
    // Check if input is disabled
    expect(input.disabled).toBe(true)
    expect(button.disabled).toBe(true)
    
    // Wait for response and check if input is enabled again
    await waitFor(() => {
      expect(input.disabled).toBe(false)
      expect(button.disabled).toBe(false)
    })
  })

  it('maintains message history', async () => {
    render(App)
    
    const input = screen.getByPlaceholderText('Type a message...')
    const button = screen.getByRole('button', { name: 'Send' })
    
    // Send first message
    await fireEvent.update(input, 'First message')
    await fireEvent.click(button)
    
    // Wait for response
    await waitFor(() => {
      expect(screen.getByText('Mock response to: First message')).toBeTruthy()
    })
    
    // Send second message
    await fireEvent.update(input, 'Second message')
    await fireEvent.click(button)
    
    // Check if both messages and responses are displayed
    await waitFor(() => {
      expect(screen.getByText('First message')).toBeTruthy()
      expect(screen.getByText('Mock response to: First message')).toBeTruthy()
      expect(screen.getByText('Second message')).toBeTruthy()
      expect(screen.getByText('Mock response to: Second message')).toBeTruthy()
    })
  })

  it('sets up viewport height tracking on mount', () => {
    render(App)
    
    // Check that event listeners were added
    expect(window.addEventListener).toHaveBeenCalledWith('resize', expect.any(Function))
    expect(window.addEventListener).toHaveBeenCalledWith('orientationchange', expect.any(Function))
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

  it('updates viewport height on orientation change', async () => {
    const wrapper = render(App)
    
    // Change window height
    window.innerHeight = 1000
    
    // Trigger orientation change event
    window.dispatchEvent(new Event('orientationchange'))
    
    await waitFor(() => {
      expect(wrapper.container.firstChild.style.height).toBe('1000px')
    })
  })

  it('cleans up event listeners on unmount', () => {
    const wrapper = render(App)
    
    // Unmount component
    wrapper.unmount()
    
    // Check that event listeners were removed
    expect(window.removeEventListener).toHaveBeenCalledWith('resize', expect.any(Function))
    expect(window.removeEventListener).toHaveBeenCalledWith('orientationchange', expect.any(Function))
  })

  it('handles Enter key press to send message', async () => {
    render(App)
    
    const input = screen.getByPlaceholderText('Type a message...')
    
    // Type message and press Enter
    await fireEvent.update(input, 'Hello via Enter')
    await fireEvent.keyUp(input, { key: 'Enter', code: 'Enter' })
    
    // Check if message was sent
    expect(screen.getByText('Hello via Enter')).toBeTruthy()
    
    // Wait for response
    await waitFor(() => {
      expect(screen.getByText('Mock response to: Hello via Enter')).toBeTruthy()
    })
  })

  it('shows loading indicator while processing message', async () => {
    render(App)
    
    const input = screen.getByPlaceholderText('Type a message...')
    const button = screen.getByRole('button', { name: 'Send' })
    
    // Send a message
    await fireEvent.update(input, 'Test loading')
    await fireEvent.click(button)
    
    // Check for loading dots
    const loadingDots = document.querySelectorAll('.animate-bounce')
    expect(loadingDots.length).toBe(3)
  })

  it('scrolls to bottom after sending message', async () => {
    const mockScrollTo = vi.fn()
    Object.defineProperty(Element.prototype, 'scrollTop', {
      set: mockScrollTo,
      configurable: true
    })
    
    render(App)
    
    const input = screen.getByPlaceholderText('Type a message...')
    const button = screen.getByRole('button', { name: 'Send' })
    
    await fireEvent.update(input, 'Test scroll')
    await fireEvent.click(button)
    
    // Wait for scroll to be called
    await waitFor(() => {
      expect(mockScrollTo).toHaveBeenCalled()
    })
  })

  it('displays initial welcome message', () => {
    render(App)
    
    expect(screen.getByText("Hello! I'm Cogfusion.ai. How can I help you today?")).toBeTruthy()
  })

  it('handles network timeout errors', async () => {
    // Mock network timeout
    server.use(
      http.post('*/api/chat', async () => {
        await new Promise(() => {}) // Never resolves
      })
    )
    
    render(App)
    
    const input = screen.getByPlaceholderText('Type a message...')
    const button = screen.getByRole('button', { name: 'Send' })
    
    await fireEvent.update(input, 'Timeout test')
    await fireEvent.click(button)
    
    // Message should be added to history
    expect(screen.getByText('Timeout test')).toBeTruthy()
    
    // Input should be disabled while loading
    expect(input.disabled).toBe(true)
    expect(button.disabled).toBe(true)
  })

  it('handles different HTTP error codes', async () => {
    const errorCodes = [400, 401, 403, 404, 500, 502, 503]
    
    for (const code of errorCodes) {
      server.use(
        http.post('*/api/chat', () => {
          return new HttpResponse(null, { status: code })
        })
      )
      
      render(App)
      
      const input = screen.getByPlaceholderText('Type a message...')
      const button = screen.getByRole('button', { name: 'Send' })
      
      await fireEvent.update(input, `Error ${code} test`)
      await fireEvent.click(button)
      
      await waitFor(() => {
        expect(screen.getByText('Sorry, I encountered an error. Please try again.')).toBeTruthy()
      })
      
      // Clean up for next iteration
      document.body.innerHTML = ''
    }
  })

  it('trims whitespace from messages', async () => {
    render(App)
    
    const input = screen.getByPlaceholderText('Type a message...')
    const button = screen.getByRole('button', { name: 'Send' })
    
    // Send message with leading/trailing spaces
    await fireEvent.update(input, '  Hello World  ')
    await fireEvent.click(button)
    
    // Should display trimmed message
    expect(screen.getByText('Hello World')).toBeTruthy()
  })

  it('generates unique message IDs', async () => {
    const originalDateNow = Date.now
    let counter = 1000
    Date.now = vi.fn(() => counter++)
    
    render(App)
    
    const input = screen.getByPlaceholderText('Type a message...')
    const button = screen.getByRole('button', { name: 'Send' })
    
    // Send first message and wait for it to complete
    await fireEvent.update(input, 'Message 1')
    await fireEvent.click(button)
    
    await waitFor(() => {
      expect(screen.getByText('Mock response to: Message 1')).toBeTruthy()
    })
    
    // Send second message and wait for it to complete
    await fireEvent.update(input, 'Message 2')
    await fireEvent.click(button)
    
    await waitFor(() => {
      expect(screen.getByText('Mock response to: Message 2')).toBeTruthy()
    })
    
    // Both messages should be visible (indicating unique IDs)
    expect(screen.getByText('Message 1')).toBeTruthy()
    expect(screen.getByText('Message 2')).toBeTruthy()
    
    Date.now = originalDateNow
  })
}) 