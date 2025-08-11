# Zyntiq Backend Server

A complete Node.js/Express backend server for the Zyntiq Learning Platform with integrated Razorpay payment processing.

## 🚀 Features

- **Authentication System**: JWT-based user registration and login
- **Payment Processing**: Complete Razorpay integration with webhooks
- **Database Support**: PostgreSQL and SQLite support
- **Security**: Rate limiting, CORS, input validation, password hashing
- **Logging**: Comprehensive logging with Winston
- **Contact Management**: Contact form handling
- **Production Ready**: Security headers, compression, error handling

## 📋 Prerequisites

- Node.js 18+ 
- npm or yarn
- Razorpay account (for payments)

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Start the server**
   ```bash
   # Development
   npm run dev
   
   # Production
   npm start
   ```

## ⚙️ Configuration

### Environment Variables

Create a `.env` file in the backend directory:

```env
# Server Configuration
NODE_ENV=development
PORT=3001

# Database Configuration
DATABASE_TYPE=sqlite  # or postgresql
DATABASE_URL=your_postgresql_connection_string  # for PostgreSQL

# Razorpay Configuration
RAZORPAY_KEY_ID=rzp_test_your_test_key_id
RAZORPAY_SECRET_KEY=your_test_secret_key
RAZORPAY_WEBHOOK_SECRET=your_webhook_secret

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRES_IN=7d

# Security Configuration
BCRYPT_SALT_ROUNDS=12
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# CORS Configuration
ALLOWED_ORIGINS=http://localhost:3000,https://zyntiq.in
```

## 🗄️ Database Setup

### SQLite (Default for Development)

The server automatically creates a SQLite database in `data/zyntiq.db`.

### PostgreSQL (Production)

1. Install PostgreSQL
2. Create a database
3. Set `DATABASE_TYPE=postgresql` and `DATABASE_URL` in your `.env`
4. The server will automatically create tables

## 🔐 Razorpay Setup

1. **Create Razorpay Account**
   - Go to [Razorpay Dashboard](https://dashboard.razorpay.com)
   - Complete KYC verification

2. **Get API Keys**
   - Go to Settings > API Keys
   - Generate new key pair
   - Copy Key ID and Secret Key to `.env`

3. **Configure Webhooks**
   - Go to Settings > Webhooks
   - Add webhook URL: `https://yourdomain.com/api/payments/webhook`
   - Select events: `payment.captured`, `payment.failed`, `order.paid`
   - Copy webhook secret to `.env`

## 📡 API Endpoints

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile (protected)
- `PUT /api/auth/profile` - Update user profile (protected)
- `PUT /api/auth/change-password` - Change password (protected)

### Payments

- `POST /api/payments/orders` - Create payment order (protected)
- `POST /api/payments/verify` - Verify payment (protected)
- `GET /api/payments/history` - Get payment history (protected)
- `GET /api/payments/:paymentId` - Get payment details (protected)
- `POST /api/payments/webhook` - Razorpay webhook handler

### Contact

- `POST /api/contact/submit` - Submit contact message
- `GET /api/contact/messages` - Get all messages (admin)
- `PUT /api/contact/messages/:id/status` - Update message status (admin)

### Health Check

- `GET /health` - Server health check

## 🔒 Security Features

- **Rate Limiting**: 100 requests per 15 minutes per IP
- **CORS Protection**: Configurable allowed origins
- **Input Validation**: All inputs validated and sanitized
- **Password Hashing**: bcrypt with 12 salt rounds
- **JWT Authentication**: Secure token-based auth
- **Security Headers**: Helmet.js protection
- **SQL Injection Protection**: Parameterized queries
- **XSS Protection**: Input sanitization

## 📊 Logging

Logs are stored in `logs/` directory:
- `combined.log` - All logs
- `error.log` - Error logs only

Log levels: `error`, `warn`, `info`, `debug`

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage
```

## 🚀 Deployment

### Development

```bash
npm run dev
```

### Production

1. **Set environment variables**
   ```bash
   NODE_ENV=production
   DATABASE_TYPE=postgresql
   DATABASE_URL=your_production_db_url
   RAZORPAY_KEY_ID=rzp_live_your_live_key
   RAZORPAY_SECRET_KEY=your_live_secret
   ```

2. **Start server**
   ```bash
   npm start
   ```

### Docker (Optional)

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3001
CMD ["npm", "start"]
```

## 📝 API Examples

### Register User

```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "SecurePass123!"
  }'
```

### Create Payment Order

```bash
curl -X POST http://localhost:3001/api/payments/orders \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "amount": 1000,
    "currency": "INR",
    "notes": {
      "description": "Premium Course"
    }
  }'
```

### Submit Contact Message

```bash
curl -X POST http://localhost:3001/api/contact/submit \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "message": "I have a question about the course."
  }'
```

## 🔧 Troubleshooting

### Common Issues

1. **Database Connection Error**
   - Check database credentials
   - Ensure database is running
   - Verify DATABASE_URL format

2. **Razorpay Integration Issues**
   - Verify API keys are correct
   - Check webhook URL is accessible
   - Ensure webhook secret matches

3. **CORS Errors**
   - Check ALLOWED_ORIGINS configuration
   - Verify frontend URL is included

4. **JWT Token Issues**
   - Ensure JWT_SECRET is set
   - Check token expiration
   - Verify Authorization header format

### Logs

Check logs in `logs/` directory for detailed error information.

## 📞 Support

For issues and questions:
- Check the logs in `logs/` directory
- Review Razorpay documentation
- Contact development team

## 📄 License

MIT License - see LICENSE file for details.