import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/vue'
import App from './App.vue'
import { server } from './test/setup'
import { rest } from 'msw'

describe('App.vue', () => {
  it('renders the chat interface', () => {
    render(App)
    
    // Check for input field
    expect(screen.getByPlaceholderText('Type your message...')).toBeTruthy()
    
    // Check for send button
    expect(screen.getByRole('button', { name: 'Send' })).toBeTruthy()
  })

  it('sends a message and displays the response', async () => {
    render(App)
    
    const input = screen.getByPlaceholderText('Type your message...')
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
    
    const input = screen.getByPlaceholderText('Type your message...')
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
      rest.post(`${import.meta.env.VITE_API_URL}/api/chat`, (req, res, ctx) => {
        return res(ctx.status(500))
      })
    )
    
    render(App)
    
    const input = screen.getByPlaceholderText('Type your message...')
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
    
    const input = screen.getByPlaceholderText('Type your message...')
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
    
    const input = screen.getByPlaceholderText('Type your message...')
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
}) 