
# 📝 NitroNews - Microblogging Application

A Twitter-like microblogging application built with Laravel (backend) and React (frontend), featuring user authentication, post creation, and public/private post visibility.

## 🚀 Features

### ✅ Implemented Features

- **User Authentication**
  - User registration with email validation
  - Secure login/logout functionality
  - Password requirements (8+ chars, special chars, numbers)
  - JWT token-based authentication with Laravel Sanctum

- **User Management**
  - Gravatar integration for profile pictures
  - User profile information display

- **Posts System**
  - Create posts with 280 character limit
  - Public and private post visibility
  - Edit and delete own posts only
  - Real-time character counter
  - Post timestamps with relative time display

- **Security**
  - Protected API routes
  - User authorization for post operations
  - XSS and SQL injection protection
  - CORS configuration

- **UI/UX**
  - Dark theme matching the provided design
  - Responsive design
  - Modern React components with TypeScript
  - Tailwind CSS for styling

## 🛠️ Technologies Used

### Backend
- **Laravel 12** - PHP framework
- **Laravel Sanctum** - API authentication
- **PostgreSQL** - Database (configurable)
- **SQLite** - Default database for development

### Frontend
- **React 18** with TypeScript
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **Tailwind CSS** - Utility-first CSS framework

## 📋 Prerequisites

- PHP 8.1 or higher
- Composer
- Node.js 18+ and npm
- PostgreSQL (optional, SQLite works for development)

## 🚀 Installation & Setup

### Quick Start (Recommended)

1. **Clone and navigate to the project:**
   ```bash
   git clone <repository-url>
   cd NitroNews
   ```

2. **Run the development environment:**
   ```bash
   # Windows
   start-dev.bat
   
   # Linux/Mac
   chmod +x start-dev.sh
   ./start-dev.sh
   ```

### Manual Setup

#### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Install PHP dependencies:**
   ```bash
   composer install
   ```

3. **Environment configuration:**
   ```bash
   cp .env.example .env
   php artisan key:generate
   ```

4. **Database setup:**
   ```bash
   # For SQLite (default)
   touch database/database.sqlite
   
   # Or configure PostgreSQL in .env:
   # DB_CONNECTION=pgsql
   # DB_HOST=127.0.0.1
   # DB_PORT=5432
   # DB_DATABASE=nitronews
   # DB_USERNAME=your_username
   # DB_PASSWORD=your_password
   ```

5. **Run migrations:**
   ```bash
   php artisan migrate
   ```

6. **Start the Laravel server:**
   ```bash
   php artisan serve
   ```
   The API will be available at `http://localhost:8000`

#### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm start
   ```
   The application will be available at `http://localhost:3000`

## 🔧 API Endpoints

### Authentication
- `POST /api/register` - User registration
- `POST /api/login` - User login
- `POST /api/logout` - User logout (requires auth)
- `GET /api/me` - Get current user (requires auth)

### Posts
- `GET /api/posts` - Get all posts (public only for guests)
- `POST /api/posts` - Create new post (requires auth)
- `PUT /api/posts/{id}` - Update post (requires auth, own posts only)
- `DELETE /api/posts/{id}` - Delete post (requires auth, own posts only)

## 🧪 Test Credentials

You can create a test account by registering through the application, or use these sample credentials after creating an account:

```
Email: test@example.com
Password: Test123!@#
```

## 📁 Project Structure

```
NitroNews/
├── backend/                 # Laravel API
│   ├── app/
│   │   ├── Http/Controllers/Api/
│   │   │   ├── AuthController.php
│   │   │   └── PostController.php
│   │   └── Models/
│   │       ├── User.php
│   │       └── Post.php
│   ├── database/migrations/
│   └── routes/api.php
├── frontend/               # React Application
│   ├── src/
│   │   ├── components/
│   │   │   ├── Login.tsx
│   │   │   ├── Register.tsx
│   │   │   ├── Header.tsx
│   │   │   ├── PostForm.tsx
│   │   │   ├── Post.tsx
│   │   │   ├── Feed.tsx
│   │   │   └── ProtectedRoute.tsx
│   │   ├── contexts/
│   │   │   └── AuthContext.tsx
│   │   ├── services/
│   │   │   └── api.ts
│   │   ├── types/
│   │   │   └── index.ts
│   │   └── App.tsx
└── README.md
```

## 🔒 Security Features

- **Password Validation**: Minimum 8 characters with special characters and numbers
- **Email Validation**: Proper email format validation
- **Route Protection**: API routes protected with Laravel Sanctum
- **Authorization**: Users can only edit/delete their own posts
- **CORS Configuration**: Properly configured for frontend-backend communication
- **XSS Protection**: Laravel's built-in XSS protection
- **SQL Injection Protection**: Eloquent ORM prevents SQL injection

## 🎨 Design Features

- **Dark Theme**: Matches the provided Figma design
- **Responsive Layout**: Works on desktop and mobile devices
- **Modern UI**: Clean, Twitter-like interface
- **Gravatar Integration**: Automatic profile pictures
- **Real-time Updates**: Character counter and form validation
- **Loading States**: Proper loading indicators for better UX

## 🚀 Deployment

### Backend Deployment
1. Configure production database in `.env`
2. Set `APP_ENV=production` and `APP_DEBUG=false`
3. Run `php artisan config:cache`
4. Run `php artisan route:cache`
5. Deploy to your preferred hosting service

### Frontend Deployment
1. Build the production version: `npm run build`
2. Deploy the `build` folder to your hosting service
3. Update API base URL in `src/services/api.ts` if needed

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📝 License

This project is created for educational purposes as part of a technical challenge.

## 🐛 Known Issues

- Node.js version warning (works fine with Node 18+)
- Some npm audit warnings (non-critical)

## 🔮 Future Enhancements

- Real-time updates with WebSockets
- Image upload for posts
- User profiles and following system
- Post likes and comments
- Advanced search functionality
- Mobile app with React Native
#
