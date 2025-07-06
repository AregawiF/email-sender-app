# Email Sender App

A modern email application built with Next.js frontend and Fastify backend, featuring a beautiful Apple Mail-style interface.

## 🚀 Features

### Frontend (Next.js + Material-UI)
- **Apple Mail-style sidebar** with email list
- **Real-time search** with 500ms debounced backend filtering
- **Compose email functionality** with all required fields (To, CC, BCC, Subject, Body)
- **Responsive design** with modern Material-UI components
- **Environment-based configuration** for easy deployment

### Backend (Fastify + SQLite)
- **RESTful API** with proper error handling
- **SQLite database** with Knex.js ORM
- **Search functionality** across all email fields
- **CORS support** for frontend integration
- **Database migrations** and seed data

## 📋 Requirements

- Node.js 16+ 
- Yarn or npm
- Git

## 🛠️ Installation & Setup

### 1. Clone the repository
```bash
git clone https://github.com/AregawiF/email-sender-app.git
cd email-sender-app
```

### 2. Backend Setup
```bash
cd backend
yarn install
yarn migrate
yarn dev
```
The backend will start on `http://localhost:3001`

### 3. Frontend Setup
```bash
cd frontend
yarn install
yarn dev
```
The frontend will start on `http://localhost:3000`

## 🌐 API Endpoints

### Base URL: `http://localhost:3001/api`

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/emails` | Get all emails |
| GET | `/emails/search?q=query` | Search emails |
| GET | `/emails/:id` | Get email by ID |
| POST | `/emails` | Create new email |
| GET | `/ping` | Health check |

### Example API Usage

```bash
# Get all emails
curl http://localhost:3001/api/emails

# Search emails
curl http://localhost:3001/api/emails/search?q=project

# Create new email
curl -X POST http://localhost:3001/api/emails \
  -H "Content-Type: application/json" \
  -d '{
    "to": "recipient@example.com",
    "subject": "Test Email",
    "body": "This is a test email"
  }'
```

## 🗄️ Database Schema

### Emails Table
```sql
CREATE TABLE emails (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  to TEXT,
  cc TEXT,
  bcc TEXT,
  subject STRING,
  body TEXT,
  created_at DATETIME,
  updated_at DATETIME
);
```

## 🔧 Configuration

### Environment Variables

Create `.env.local` in the frontend directory:
```env
NEXT_PUBLIC_BACKEND_URL=http://localhost:3001/api
```

For production, update the URL to your backend server.

## 📁 Project Structure

```
email-sender-app/
├── backend/
│   ├── src/
│   │   ├── db/
│   │   │   └── index.js          # Database operations
│   │   └── routes/
│   │       ├── index.js          # Main routes
│   │       └── emails.js         # Email endpoints
│   ├── migrations/               # Database migrations
│   ├── index.js                  # Fastify server
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── index.js          # Main email interface
│   │   │   ├── _app.js           # App wrapper
│   │   │   └── _document.js      # Document wrapper
│   │   ├── config/
│   │   │   └── index.js          # Configuration
│   │   └── styles/
│   │       └── globals.css       # Global styles
│   └── package.json
└── README.md
```

## 🎨 UI Features

- **Sidebar Layout**: Clean email list with sender, subject, and date
- **Search Bar**: Real-time filtering with debounced backend requests
- **Email Composition**: Full-featured compose dialog with validation
- **Responsive Design**: Works on desktop and mobile devices
- **Loading States**: Proper loading indicators and error handling

## 🚀 Deployment

### Frontend
1. Set environment variable `NEXT_PUBLIC_BACKEND_URL` to your backend URL
2. Deploy to Vercel or Netlify

### Backend 
1. Set up SQLite or switch to PostgreSQL
2. Update database configuration
3. Deploy to your preferred platform
