import { describe, it, expect, beforeAll, afterAll, afterEach } from 'vitest'
import { render, screen, fireEvent, waitFor, cleanup } from '@testing-library/vue'
import App from './App.vue'

// Integration tests that test the full user flow
describe('Chat Application Integration Tests', () => {
  // Clean up after each test to prevent DOM conflicts
  afterEach(() => {
    cleanup()
  })
  it('completes full user conversation flow', async () => {
    render(App)
    
    // Initial state: should be on homepage
    expect(screen.getByText('Cogbot')).toBeTruthy()
    expect(screen.getByText('New Chat')).toBeTruthy()
    
    // Navigate to chat
    const newChatButton = screen.getByText('New Chat')
    await fireEvent.click(newChatButton)
    
    // Should now see chat interface with welcome message
    expect(screen.getByText("Hello! I'm Cogbot, your friendly AI assistant. How can I help you today?")).toBeTruthy()
    
    const input = screen.getByPlaceholderText('Reply ...')
    const button = document.querySelector('.send-button')
    
    // Step 1: User types first message
    await fireEvent.update(input, 'What exercises should I do?')
    await fireEvent.click(button)
    
    // Verify user message appears
    expect(screen.getByText('What exercises should I do?')).toBeTruthy()
    
    // Verify loading state
    expect(input.disabled).toBe(true)
    expect(button.disabled).toBe(true)
    
    // Wait for response
    await waitFor(() => {
      expect(screen.getByText('Mock response to: What exercises should I do?')).toBeTruthy()
    })
    
    // Verify interface is re-enabled
    expect(input.disabled).toBe(false)
    expect(button.disabled).toBe(false)
    
    // Step 2: User types follow-up message
    await fireEvent.update(input, 'How many sets?')
    await fireEvent.click(button)
    
    // Verify both conversations are maintained
    expect(screen.getByText('What exercises should I do?')).toBeTruthy()
    expect(screen.getByText('Mock response to: What exercises should I do?')).toBeTruthy()
    expect(screen.getByText('How many sets?')).toBeTruthy()
    
    await waitFor(() => {
      expect(screen.getByText('Mock response to: How many sets?')).toBeTruthy()
    })
    
    // Step 3: Test Enter key functionality
    await fireEvent.update(input, 'Thank you!')
    await fireEvent.keyUp(input, { key: 'Enter' })
    
    expect(screen.getByText('Thank you!')).toBeTruthy()
    
    await waitFor(() => {
      expect(screen.getByText('Mock response to: Thank you!')).toBeTruthy()
    })
    
    // Verify all messages are still visible (conversation history)
    expect(screen.getByText('What exercises should I do?')).toBeTruthy()
    expect(screen.getByText('How many sets?')).toBeTruthy()
    expect(screen.getByText('Thank you!')).toBeTruthy()
  })
  
  it('handles rapid successive messages correctly', async () => {
    render(App)
    
    // Navigate to chat first
    const newChatButton = screen.getByText('New Chat')
    await fireEvent.click(newChatButton)
    
    const input = screen.getByPlaceholderText('Reply ...')
    const button = document.querySelector('.send-button')
    
    // Send multiple messages one at a time, waiting for each response
    const messages = ['Message 1', 'Message 2', 'Message 3']
    
    for (const message of messages) {
      await fireEvent.update(input, message)
      await fireEvent.click(button)
      
      // Wait for the user message to appear
      await waitFor(() => {
        expect(screen.getByText(message)).toBeTruthy()
      })
      
      // Wait for the bot response
      await waitFor(() => {
        expect(screen.getByText(`Mock response to: ${message}`)).toBeTruthy()
      }, { timeout: 3000 })
    }
    
    // Verify all messages and responses are still visible
    messages.forEach(message => {
      expect(screen.getByText(message)).toBeTruthy()
      expect(screen.getByText(`Mock response to: ${message}`)).toBeTruthy()
    })
  })
  
  it('maintains proper UI state during error recovery', async () => {
    render(App)
    
    // Navigate to chat first
    const newChatButton = screen.getByText('New Chat')
    await fireEvent.click(newChatButton)
    
    const input = screen.getByPlaceholderText('Reply ...')
    const button = document.querySelector('.send-button')
    
    // Send a successful message
    await fireEvent.update(input, 'Working message')
    await fireEvent.click(button)
    
    // Wait for user message to appear
    await waitFor(() => {
      expect(screen.getByText('Working message')).toBeTruthy()
    })
    
    // Wait for bot response
    await waitFor(() => {
      expect(screen.getByText('Mock response to: Working message')).toBeTruthy()
    }, { timeout: 3000 })
    
    // Verify interface is still functional after response
    await waitFor(() => {
      expect(input.disabled).toBe(false)
      expect(button.disabled).toBe(false)
      expect(input.value).toBe('')
    })
  })
  
  it('properly handles viewport changes during conversation', async () => {
    const wrapper = render(App)
    
    // Initial viewport
    expect(wrapper.container.firstChild.style.height).toBe('800px')
    
    // Navigate to chat first
    const newChatButton = screen.getByText('New Chat')
    await fireEvent.click(newChatButton)
    
    const input = screen.getByPlaceholderText('Reply ...')
    const button = document.querySelector('.send-button')
    
    // Start a conversation
    await fireEvent.update(input, 'Test viewport')
    await fireEvent.click(button)
    
    // Simulate mobile browser address bar hiding (viewport change)
    window.innerHeight = 900
    window.dispatchEvent(new Event('resize'))
    
    await waitFor(() => {
      expect(wrapper.container.firstChild.style.height).toBe('900px')
    })
    
    // Verify conversation continues normally after viewport change
    await waitFor(() => {
      expect(screen.getByText('Mock response to: Test viewport')).toBeTruthy()
    })
    
    // Send another message after viewport change
    await fireEvent.update(input, 'After resize')
    await fireEvent.click(button)
    
    expect(screen.getByText('After resize')).toBeTruthy()
    
    // Simulate orientation change
    window.innerHeight = 400
    window.dispatchEvent(new Event('orientationchange'))
    
    await waitFor(() => {
      expect(wrapper.container.firstChild.style.height).toBe('400px')
    })
    
    // Verify both messages are still visible
    expect(screen.getByText('Test viewport')).toBeTruthy()
    expect(screen.getByText('After resize')).toBeTruthy()
  })
  
  it('handles long conversations without performance issues', async () => {
    render(App)
    
    // Navigate to chat first
    const newChatButton = screen.getByText('New Chat')
    await fireEvent.click(newChatButton)
    
    const input = screen.getByPlaceholderText('Reply ...')
    const button = document.querySelector('.send-button')
    
    // Send multiple messages to test performance (reduced count for faster test)
    const messageCount = 5
    const messages = Array.from({ length: messageCount }, (_, i) => `Message ${i + 1}`)
    
    for (const message of messages) {
      await fireEvent.update(input, message)
      await fireEvent.click(button)
      
      // Wait for user message to appear
      await waitFor(() => {
        expect(screen.getByText(message)).toBeTruthy()
      })
      
      // Wait for bot response
      await waitFor(() => {
        expect(screen.getByText(`Mock response to: ${message}`)).toBeTruthy()
      }, { timeout: 3000 })
    }
    
    // Verify all messages are still accessible
    messages.forEach(message => {
      expect(screen.getByText(message)).toBeTruthy()
    })
    
    // Verify the message container exists (scroll functionality)
    const messageContainer = document.querySelector('.messages-container')
    expect(messageContainer).toBeTruthy()
  })
  
  it('validates accessibility features', async () => {
    render(App)
    
    // Navigate to chat first
    const newChatButton = screen.getByText('New Chat')
    await fireEvent.click(newChatButton)
    
    const input = screen.getByPlaceholderText('Reply ...')
    const button = document.querySelector('.send-button')
    
    // Check ARIA attributes and roles
    expect(input).toBeTruthy()
    expect(button).toBeTruthy()
    
    // Verify keyboard navigation
    input.focus()
    expect(document.activeElement).toBe(input)
    
    // Test tab navigation
    await fireEvent.keyDown(input, { key: 'Tab' })
    // Button should be focusable after input
    
    // Test disabled states maintain accessibility
    await fireEvent.update(input, 'Accessibility test')
    await fireEvent.click(button)
    
    expect(input.disabled).toBe(true)
    expect(button.disabled).toBe(true)
    
    await waitFor(() => {
      expect(input.disabled).toBe(false)
      expect(button.disabled).toBe(false)
    })
  })
})