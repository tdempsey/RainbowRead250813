# Overview

This is a full-stack LGBTQ+ news aggregation platform built with React, Express, and TypeScript. The application aggregates news content from multiple sources including RSS feeds and NewsAPI, providing a centralized hub for LGBTQ+ focused news stories. Users can search, filter, bookmark articles, and browse content by categories. The platform emphasizes community-focused content curation with features for liking articles and newsletter subscriptions.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture

The client-side is built with React 18 and uses a modern component-based architecture:

- **UI Framework**: React with TypeScript, using Vite as the build tool
- **Styling**: Tailwind CSS with shadcn/ui component library for consistent design
- **State Management**: TanStack Query (React Query) for server state management and caching
- **Routing**: Wouter for lightweight client-side routing
- **Design System**: Custom pride-themed color palette with CSS variables for theming

## Backend Architecture

The server follows a RESTful API pattern using Express.js:

- **Framework**: Express.js with TypeScript
- **Architecture Pattern**: Layered architecture with separate routes, services, and storage layers
- **API Design**: RESTful endpoints for articles, bookmarks, categories, and RSS sources
- **Content Aggregation**: Scheduled background services for fetching content from external sources
- **Error Handling**: Centralized error handling middleware with structured error responses

## Data Storage Solutions

The application uses a dual storage approach:

- **Production Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **Development Storage**: In-memory storage implementation for local development
- **Database Schema**: Well-defined schema for articles, RSS sources, bookmarks, and categories
- **Migration System**: Drizzle-kit for database migrations and schema management

## Content Aggregation System

Automated content collection from multiple sources:

- **RSS Parser**: Custom RSS feed parser for consuming various LGBTQ+ news sources
- **NewsAPI Integration**: Integration with NewsAPI for broader news coverage
- **Scheduler Service**: Background job scheduler for regular content updates (RSS every 30 minutes, NewsAPI every 2 hours)
- **Content Categorization**: Automatic categorization and LGBTQ+ relevance detection using keyword matching

## Search and Filtering

Advanced content discovery features:

- **Full-text Search**: Server-side search implementation with query parameter support
- **Category Filtering**: Multi-level filtering by predefined categories (Politics, Culture, Health, Business, Community)
- **Tag-based Filtering**: Support for tag-based content organization
- **Source Filtering**: Ability to filter by specific news sources
- **LGBTQ+ Focus Filter**: Dedicated filtering for LGBTQ+-focused content

## Session Management

Simplified user experience without full authentication:

- **Session-based Bookmarking**: Temporary session IDs for bookmark functionality
- **No User Accounts**: Streamlined experience without registration requirements
- **Client-side Session Generation**: Automatic session creation for feature access

# External Dependencies

## Database Services
- **Neon Database**: PostgreSQL hosting service via `@neondatabase/serverless`
- **Drizzle ORM**: Type-safe database toolkit for PostgreSQL operations

## Content Sources
- **NewsAPI**: External news aggregation service for broader content coverage
- **RSS Feeds**: Various LGBTQ+ news sources and mainstream publications
- **RSS Parser**: `rss-parser` library for feed processing

## UI and Styling
- **shadcn/ui**: Comprehensive React component library built on Radix UI
- **Radix UI**: Low-level accessible UI primitives
- **Tailwind CSS**: Utility-first CSS framework
- **Lucide React**: Icon library for consistent iconography

## Development and Build Tools
- **Vite**: Fast build tool and development server
- **TypeScript**: Type safety across the entire application
- **ESBuild**: Fast JavaScript bundler for production builds
- **Replit Integration**: Development environment integration with error overlay and cartographer

## Additional Services
- **TanStack Query**: Server state management and caching
- **Zod**: Runtime type validation and schema parsing
- **date-fns**: Date manipulation and formatting utilities