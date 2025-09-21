# Grip Invest Backend API

A robust and secure REST API for the Grip Invest investment platform, built with Node.js, Express, and MySQL.

## Features

- **Authentication & Authorization** - JWT-based secure authentication system
- **Investment Management** - Complete CRUD operations for investment products and user investments
- **User Management** - User registration, login, and profile management
- **Portfolio Analytics** - Real-time portfolio summary and analytics
- **Transaction Logging** - Comprehensive logging of all API transactions
- **Risk-Based Recommendations** - Personalized investment recommendations based on user risk appetite
- **Database Integration** - MySQL database with connection pooling
- **Error Handling** - Comprehensive error handling and validation
- **Security** - Password hashing, JWT tokens, and input validation
- **Testing** - Unit tests with Jest and Supertest

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js 5.1.0
- **Database**: MySQL 2 (mysql2 driver)
- **Authentication**: JSON Web Tokens (JWT)
- **Password Hashing**: bcrypt
- **Validation**: Custom middleware validation
- **Testing**: Jest + Supertest
- **Development**: Nodemon for hot reloading
- **Environment**: dotenv for configuration

## Project Structure

```
grip_invest_backend/
├── config/
│   └── database.js          # Database configuration and connection
├── middleware/
│   ├── auth.js              # JWT authentication middleware
│   └── validation.js        # Request validation middleware
├── routes/
│   ├── auth.js              # Authentication routes
│   ├── investments.js       # Investment management routes
│   └── products.js          # Investment products routes
├── tests/
│   ├── auth.test.js         # Authentication tests
│   ├── investments.test.js  # Investment tests
│   └── products.test.js     # Products tests
├── index.js                 # Main application entry point
├── package.json             # Dependencies and scripts
└── README.md                # This file
```

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- MySQL (v8.0 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd grip_invest_backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables:**
   Create a `.env` file in the root directory:
   ```env
   # Database Configuration
   DB_HOST=localhost
   DB_USER=your_mysql_username
   DB_PASSWORD=your_mysql_password
   DB_NAME=invest_x
   DB_PORT=3306

   # JWT Configuration
   JWT_SECRET=your_super_secret_jwt_key_here

   # Server Configuration
   PORT=5000
   NODE_ENV=development

   # Frontend URL (for CORS)
   FRONTEND_URL=http://localhost:3000
   ```

4. **Set up the database:**
   Create a MySQL database named `invest_x` and create the following tables:

   ```sql
   -- Users table
   CREATE TABLE users (
     id INT AUTO_INCREMENT PRIMARY KEY,
     first_name VARCHAR(100) NOT NULL,
     last_name VARCHAR(100),
     email VARCHAR(255) UNIQUE NOT NULL,
     password_hash VARCHAR(255) NOT NULL,
     risk_appetite ENUM('low', 'moderate', 'high') DEFAULT 'moderate',
     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
   );

   -- Investment products table
   CREATE TABLE investment_products (
     id INT AUTO_INCREMENT PRIMARY KEY,
     name VARCHAR(255) NOT NULL,
     description TEXT,
     investment_type ENUM('bond', 'fd', 'mf', 'etf', 'other') NOT NULL,
     risk_level ENUM('low', 'moderate', 'high') NOT NULL,
     annual_yield DECIMAL(5,2) NOT NULL,
     tenure_months INT NOT NULL,
     min_investment DECIMAL(15,2) NOT NULL,
     max_investment DECIMAL(15,2),
     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
     updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
   );

   -- Investments table
   CREATE TABLE investments (
     id INT AUTO_INCREMENT PRIMARY KEY,
     user_id INT NOT NULL,
     product_id INT NOT NULL,
     amount DECIMAL(15,2) NOT NULL,
     expected_return DECIMAL(15,2) NOT NULL,
     maturity_date DATE NOT NULL,
     status ENUM('active', 'matured', 'cancelled') DEFAULT 'active',
     invested_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
     FOREIGN KEY (user_id) REFERENCES users(id),
     FOREIGN KEY (product_id) REFERENCES investment_products(id)
   );

   -- Transaction logs table
   CREATE TABLE transaction_logs (
     id INT AUTO_INCREMENT PRIMARY KEY,
     user_id INT,
     email VARCHAR(255),
     endpoint VARCHAR(255) NOT NULL,
     http_method VARCHAR(10) NOT NULL,
     status_code INT NOT NULL,
     error_message TEXT,
     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
     FOREIGN KEY (user_id) REFERENCES users(id)
   );
   ```

5. **Start the development server:**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

The server will start on `http://localhost:5000` (or your configured PORT).

## API Documentation

### Base URL
```
http://localhost:5000
```

### Authentication Endpoints

#### POST `/api/auth/signup`
Register a new user account.

**Request Body:**
```json
{
  "first_name": "John",
  "last_name": "Doe",
  "email": "john.doe@example.com",
  "password": "securePassword123",
  "risk_appetite": "moderate"
}
```

**Response:**
```json
{
  "message": "User created successfully",
  "userId": 1
}
```

#### POST `/api/auth/login`
Authenticate user and get JWT token.

**Request Body:**
```json
{
  "email": "john.doe@example.com",
  "password": "securePassword123"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "first_name": "John",
    "last_name": "Doe",
    "email": "john.doe@example.com",
    "risk_appetite": "moderate"
  }
}
```

#### GET `/api/auth/profile`
Get current user profile (requires authentication).

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response:**
```json
{
  "user": {
    "id": 1,
    "first_name": "John",
    "last_name": "Doe",
    "email": "john.doe@example.com",
    "risk_appetite": "moderate",
    "created_at": "2024-01-01T00:00:00.000Z"
  }
}
```

### Investment Products Endpoints

#### GET `/api/products`
Get all investment products with optional filtering (requires authentication).

**Query Parameters:**
- `risk_level` - Filter by risk level (low, moderate, high)
- `investment_type` - Filter by type (bond, fd, mf, etf)
- `sort_by` - Sort by field (annual_yield, tenure_months, min_investment, created_at)

**Response:**
```json
{
  "products": [
    {
      "id": 1,
      "name": "Government Bond Series A",
      "description": "Safe government-backed investment",
      "investment_type": "bond",
      "risk_level": "low",
      "annual_yield": 7.5,
      "tenure_months": 36,
      "min_investment": 10000,
      "max_investment": 1000000,
      "created_at": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

#### GET `/api/products/:productId`
Get specific investment product details (requires authentication).

#### GET `/api/products/recommendations/for-me`
Get personalized recommendations based on user's risk appetite (requires authentication).

### Investment Management Endpoints

#### POST `/api/investments`
Create a new investment (requires authentication).

**Request Body:**
```json
{
  "product_id": 1,
  "amount": 50000
}
```

#### GET `/api/investments`
Get user's investments with portfolio summary (requires authentication).

**Response:**
```json
{
  "investments": [...],
  "portfolio_summary": {
    "total_invested": 150000,
    "total_expected_return": 165000,
    "total_gain": 15000,
    "active_investments": 3
  }
}
```

#### GET `/api/investments/:investmentId`
Get specific investment details (requires authentication).

#### PATCH `/api/investments/:investmentId/cancel`
Cancel an investment within 24 hours (requires authentication).

### Health Check

#### GET `/health`
Check API and database health status.

**Response:**
```json
{
  "status": "ok",
  "database": "connected",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

#### GET `/`
Get API information and available endpoints.

**Response:**
```json
{
  "message": "Grip Invest Backend API",
  "version": "1.0.0",
  "endpoints": {
    "auth": "/api/auth",
    "products": "/api/products",
    "investments": "/api/investments",
    "health": "/health"
  }
}
```

## Testing

Run the test suite:

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm test -- --coverage
```

## Security Features

- **Password Hashing**: bcrypt with salt rounds
- **JWT Authentication**: Secure token-based authentication
- **Input Validation**: Comprehensive request validation
- **SQL Injection Prevention**: Parameterized queries
- **CORS Configuration**: Configurable cross-origin resource sharing
- **Error Handling**: Secure error responses (no sensitive data exposure)
- **Transaction Logging**: Complete audit trail of all API calls

## Deployment

### Production Environment

1. **Set production environment variables:**
   ```env
   NODE_ENV=production
   DB_HOST=your_production_db_host
   DB_USER=your_production_db_user
   DB_PASSWORD=your_production_db_password
   JWT_SECRET=your_production_jwt_secret
   FRONTEND_URL=https://your-frontend-domain.com
   ```

2. **Start the production server:**
   ```bash
   npm start
   ```

### Docker Deployment

Create a `Dockerfile`:
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 5000
CMD ["npm", "start"]
```

Build and run:
```bash
docker build -t grip-invest-backend .
docker run -p 5000:5000 grip-invest-backend
```

## Database Schema

The application uses the following main tables:

- **users** - User accounts and profiles
- **investment_products** - Available investment products
- **investments** - User investments with status tracking
- **transaction_logs** - Complete API transaction logging

## Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `DB_HOST` | MySQL host | localhost |
| `DB_USER` | MySQL username | - |
| `DB_PASSWORD` | MySQL password | - |
| `DB_NAME` | Database name | invest_x |
| `DB_PORT` | MySQL port | 3306 |
| `JWT_SECRET` | JWT signing secret | - |
| `PORT` | Server port | 5000 |
| `NODE_ENV` | Environment | development |
| `FRONTEND_URL` | Frontend URL for CORS | http://localhost:3000 |

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is private and proprietary.