import { render } from '@testing-library/vue'
import { describe, it, expect } from 'vitest'
import ChatMessage from '@/components/ChatMessage.vue'

describe('ChatMessage', () => {
  const sentMessage = {
    id: '1',
    text: 'Hello world',
    type: 'sent'
  }

  const receivedMessage = {
    id: '2',
    text: 'Hello there!',
    type: 'received'
  }

  const markdownMessage = {
    id: '3',
    text: '**Bold text** and *italic text* with `code`',
    type: 'received'
  }

  it('renders sent message correctly', () => {
    const { getByText, container } = render(ChatMessage, {
      props: { message: sentMessage }
    })

    expect(getByText('Hello world')).toBeTruthy()
    expect(container.querySelector('.bg-blue-500')).toBeTruthy()
    expect(container.querySelector('.text-white')).toBeTruthy()
  })

  it('renders received message correctly', () => {
    const { getByText, container } = render(ChatMessage, {
      props: { message: receivedMessage }
    })

    expect(getByText('Hello there!')).toBeTruthy()
    expect(container.querySelector('.bg-gray-200')).toBeTruthy()
    expect(container.querySelector('.text-gray-800')).toBeTruthy()
  })

  it('renders markdown in received messages', () => {
    const { container } = render(ChatMessage, {
      props: { message: markdownMessage }
    })

    const html = container.innerHTML
    expect(html).toContain('<strong>Bold text</strong>')
    expect(html).toContain('<em>italic text</em>')
    expect(html).toContain('<code>code</code>')
  })

  it('does not render markdown in sent messages', () => {
    const sentMarkdown = {
      id: '4',
      text: '**This should not be bold**',
      type: 'sent'
    }

    const { getByText, container } = render(ChatMessage, {
      props: { message: sentMarkdown }
    })

    expect(getByText('**This should not be bold**')).toBeTruthy()
    expect(container.innerHTML).not.toContain('<strong>')
  })

  it('sanitizes dangerous HTML', () => {
    const dangerousMessage = {
      id: '5',
      text: '<script>alert("xss")</script>**Safe markdown**',
      type: 'received'
    }

    const { container } = render(ChatMessage, {
      props: { message: dangerousMessage }
    })

    const html = container.innerHTML
    expect(html).not.toContain('<script>')
    expect(html).not.toContain('alert')
    // The markdown should be processed and script tags removed
    expect(html).toContain('Safe markdown')
  })

  it('applies correct CSS classes for message types', () => {
    const { container: sentContainer } = render(ChatMessage, {
      props: { message: sentMessage }
    })

    const { container: receivedContainer } = render(ChatMessage, {
      props: { message: receivedMessage }
    })

    expect(sentContainer.querySelector('.justify-end')).toBeTruthy()
    expect(receivedContainer.querySelector('.justify-start')).toBeTruthy()
  })
})