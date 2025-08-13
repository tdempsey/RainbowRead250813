# Rainbow Map News 🏳️‍🌈

A comprehensive LGBTQ+ news aggregation platform that brings together stories from multiple sources, providing a centralized hub for community-focused news and updates.

![Rainbow Map News](https://img.shields.io/badge/Status-Live-success)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?logo=react&logoColor=61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-43853D?logo=node.js&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?logo=postgresql&logoColor=white)

## 🌟 Features

### Content Aggregation
- **RSS Feed Integration**: Automated parsing from major LGBTQ+ news sources
- **NewsAPI Integration**: Broader news coverage with LGBTQ+ filtering
- **Smart Categorization**: Automatic content categorization and relevance detection
- **Regular Updates**: RSS feeds refresh every 30 minutes, NewsAPI every 2 hours

### User Experience
- **Responsive Design**: Optimized for both desktop and mobile viewing
- **Pride-Themed UI**: Beautiful design with pride colors and community aesthetics
- **Article Bookmarking**: Session-based bookmarking without registration
- **Full-Text Search**: Advanced search with category and tag filtering
- **Featured Articles**: Hero section highlighting top LGBTQ+-focused content

### Content Management
- **Admin Dashboard**: Comprehensive story management interface
- **Story Ranking**: Priority ranking system for content promotion
- **Hide/Delete Controls**: Moderation tools for content curation
- **RSS Source Management**: Add, edit, and manage news sources
- **Category Management**: Organize content with protected default categories

### Technical Features
- **HTML Entity Decoding**: Proper handling of special characters and quotes
- **Responsive Footer**: Simplified mobile menu, comprehensive desktop links
- **Real-time Updates**: Live content aggregation and display
- **Type Safety**: Full TypeScript implementation across frontend and backend

## 🏗️ Architecture

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and building
- **TanStack Query** for server state management
- **Wouter** for lightweight routing
- **Tailwind CSS** + **shadcn/ui** for styling
- **Lucide React** for icons

### Backend
- **Express.js** with TypeScript
- **RESTful API** design
- **Drizzle ORM** for database operations
- **RSS Parser** for feed processing
- **Automated scheduling** for content updates

### Database
- **PostgreSQL** with Neon Database hosting
- **Drizzle migrations** for schema management
- **Type-safe queries** with Drizzle ORM
- **In-memory fallback** for development

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- PostgreSQL database (or use in-memory storage for development)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd rainbow-map-news
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file with:
   ```env
   # Optional: NewsAPI key for broader coverage
   NEWS_API_KEY=your_newsapi_key_here
   
   # Optional: Database URL (uses in-memory storage if not provided)
   DATABASE_URL=your_postgresql_connection_string
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

   The application will be available at `http://localhost:5000`

## 📖 Usage

### For Readers
- Browse articles by category or search for specific topics
- Bookmark interesting stories for later reading
- Click articles to read full content on original sources
- Discover trending tags and featured LGBTQ+ content

### For Administrators
- Access the admin dashboard at `/admin`
- Manage RSS sources and news categories
- Control article visibility and ranking
- Monitor content aggregation and engagement

## 🔧 Configuration

### Adding RSS Sources
1. Navigate to Admin Dashboard
2. Go to "RSS Sources" tab
3. Add new source with:
   - Name and URL
   - Category classification
   - LGBTQ+ focus designation

### Content Moderation
- Use the "Story Management" section to hide or delete articles
- Adjust story rankings to promote important content
- Monitor trending tags and engagement metrics

## 🏳️‍🌈 Content Sources

### Default RSS Feeds
- **GLAAD Media**: Official LGBTQ+ advocacy content
- **Out Magazine**: Lifestyle and culture coverage
- **Queerty**: News and entertainment
- **The Advocate**: Comprehensive LGBTQ+ journalism
- **LGBTQ Nation**: Community news and updates
- **PinkNews**: International LGBTQ+ coverage

### NewsAPI Integration
- Filters mainstream news for LGBTQ+ relevance
- Provides broader coverage of relevant topics
- Requires API key for activation

## 🛠️ Development

### Project Structure
```
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Route pages
│   │   ├── lib/            # Utilities and helpers
│   │   └── hooks/          # Custom React hooks
├── server/                 # Express backend
│   ├── services/           # Business logic
│   └── routes.ts           # API endpoints
├── shared/                 # Shared types and schemas
└── components.json         # shadcn/ui configuration
```

### Key Commands
- `npm run dev`: Start development server
- `npm run build`: Build for production
- `npm run db:generate`: Generate database migrations
- `npm run db:push`: Push schema changes to database

### Adding New Features
1. Define types in `shared/schema.ts`
2. Update storage interface in `server/storage.ts`
3. Add API routes in `server/routes.ts`
4. Create frontend components and pages
5. Update documentation

## 🌈 Design System

### Colors
The application uses a pride-themed color palette:
- **Pride Pink**: Primary accent color
- **Pride Blue**: Secondary accent
- **Pride Purple**: Tertiary accent
- **Pride Yellow**: Highlight color
- **Pride Green**: Success states
- **Pride Indigo**: Interactive elements

### Responsive Breakpoints
- **Mobile**: < 768px (simplified footer, stacked layout)
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px (full features, multi-column layout)

## 🔒 Privacy & Security

- **No User Registration**: Session-based features for privacy
- **External Links**: All article links open in new tabs
- **Content Moderation**: Admin controls for inappropriate content
- **Data Retention**: Bookmark data tied to browser sessions

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Update tests and documentation
5. Submit a pull request

### Code Style
- TypeScript for all new code
- ESLint and Prettier for formatting
- Tailwind CSS for styling
- Component-based architecture

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **LGBTQ+ News Sources**: For providing valuable community content
- **shadcn/ui**: For the beautiful component library
- **Replit**: For the development platform
- **Community Contributors**: For feedback and support

## 📧 Support

For questions, suggestions, or support:
- Create an issue on GitHub
- Contact the development team
- Join our community discussions

---

*Made with 🏳️‍🌈 pride for the LGBTQ+ community*