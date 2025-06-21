# Changelog

All notable changes to Cogfusion.ai will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Planned Features
- Markdown rendering for bot responses
- Message timestamps
- Enhanced error handling with retry functionality
- Conversation clearing functionality
- Better loading states and animations
- Response streaming for improved UX

## [2.0.0] - 2024-12-21

### Added
- **Pinia State Management**: Centralized reactive state management for better architecture
- **Conversation History**: Bot now remembers previous messages within the same session
- **Session Management**: Foundation for conversation persistence and session tracking
- **Enhanced Chat Store**: Comprehensive store with actions, getters, and state management
- **Conversation Context**: OpenAI API calls now include full conversation history

### Changed
- **Architecture Refactor**: Moved from component-level state to centralized Pinia store
- **API Enhancement**: Backend now processes conversation history for contextual responses
- **Test Infrastructure**: Updated test setup to support Pinia integration
- **Error Handling**: Improved error state management through centralized store

### Technical
- Added Pinia dependency and configuration
- Created comprehensive chat store (`src/stores/chat.js`)
- Refactored App.vue to use Pinia store instead of local state
- Updated backend to handle `conversationHistory` parameter
- Enhanced test setup with Pinia support
- All tests passing (24/24)

## [1.0.0] - 2024-12-21

### Added
- **Complete Rebrand**: Transformed from FitBot/Mandobot to Cogfusion.ai
- **Deployment Optimization**: Configured branch-specific builds and monorepo optimization
- **Build Optimization**: Added intelligent build triggering to prevent unnecessary deployments

### Changed
- **Global Rebranding**: Updated all references to use Cogfusion.ai identity
- **System Message**: Enhanced AI assistant persona for cognitive fusion and problem-solving
- **Package Names**: Updated all package.json files to reflect new branding
- **HTML Titles**: Consistent branding across all client HTML files

### Removed
- **Redundant Files**: Cleaned up generated coverage and dist directories
- **Duplicate Documentation**: Removed redundant client README in favor of centralized docs

### Technical
- Updated system message for enhanced AI assistant capabilities
- Fixed all test references to match new branding
- Configured Vercel for main-branch-only builds
- Added Railway build optimization with `watchPatterns`
- Created build optimization scripts for both platforms
- Comprehensive cleanup of generated files

### Infrastructure
- **Vercel Configuration**: Only builds from main branch, skips builds when only server changes
- **Railway Configuration**: Only builds when server directory changes
- **Monorepo Optimization**: Intelligent build triggering based on changed directories

## [0.1.0] - Initial Release

### Added
- **Vue.js Frontend**: Modern reactive chat interface with Tailwind CSS
- **Express Backend**: Secure API server with OpenAI integration
- **Comprehensive Testing**: 24 test suite with Vitest and Jest
- **Security Features**: Helmet, CORS, rate limiting, and input validation
- **CI/CD Pipeline**: Pre-commit hooks with quality gates
- **Deployment Ready**: Configured for Vercel (client) and Railway (server)

### Features
- Real-time chat interface with OpenAI GPT-3.5-turbo
- Mobile-optimized responsive design
- Loading states and error handling
- Message history display
- Keyboard navigation (Enter to send)
- Viewport height adjustment for mobile browsers

### Quality Assurance
- 85% client test coverage requirement
- 75% server test coverage requirement
- Pre-commit test validation
- Integration test suite
- API endpoint testing
- Security audit integration

### Infrastructure
- Express.js server with security middleware
- Vue.js client with Vite build system
- OpenAI API integration
- Environment-specific configuration
- Rate limiting and input validation
- CORS configuration for cross-origin requests