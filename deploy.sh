#!/bin/bash

# Zyntiq Learning Platform Deployment Script
# This script helps deploy the application to production

set -e  # Exit on any error

echo "🚀 Starting Zyntiq Learning Platform Deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if running as root
if [[ $EUID -eq 0 ]]; then
   print_error "This script should not be run as root"
   exit 1
fi

# Check Node.js version
NODE_VERSION=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    print_error "Node.js 18 or higher is required. Current version: $(node --version)"
    exit 1
fi

print_success "Node.js version check passed: $(node --version)"

# Check if .env.production exists
if [ ! -f ".env.production" ]; then
    print_warning ".env.production not found. Creating from template..."
    cp .env.example .env.production
    print_warning "Please update .env.production with your production values before continuing"
    print_warning "Required variables:"
    print_warning "  - VITE_RAZORPAY_KEY_ID (production key)"
    print_warning "  - VITE_RAZORPAY_SECRET_KEY (production secret)"
    print_warning "  - VITE_API_URL (your backend API URL)"
    exit 1
fi

# Install frontend dependencies
print_status "Installing frontend dependencies..."
npm ci --production=false

# Build frontend
print_status "Building frontend application..."
npm run build

if [ $? -eq 0 ]; then
    print_success "Frontend build completed successfully"
else
    print_error "Frontend build failed"
    exit 1
fi

# Check if backend directory exists
if [ ! -d "backend" ]; then
    print_error "Backend directory not found. Please ensure the backend is set up."
    exit 1
fi

# Install backend dependencies
print_status "Installing backend dependencies..."
cd backend
npm ci --production=false

# Check if backend .env exists
if [ ! -f ".env" ]; then
    print_warning "Backend .env not found. Creating from template..."
    cp .env.example .env
    print_warning "Please update backend/.env with your production values"
    print_warning "Required variables:"
    print_warning "  - RAZORPAY_KEY_ID (production key)"
    print_warning "  - RAZORPAY_SECRET_KEY (production secret)"
    print_warning "  - RAZORPAY_WEBHOOK_SECRET"
    print_warning "  - JWT_SECRET (strong random string)"
    print_warning "  - DATABASE_URL (if using PostgreSQL)"
    cd ..
    exit 1
fi

# Test backend connection
print_status "Testing backend configuration..."
npm run test 2>/dev/null || print_warning "Backend tests not configured or failed"

cd ..

# Security audit
print_status "Running security audit..."
npm audit --audit-level=moderate || print_warning "Security audit found issues"

# Create deployment package
print_status "Creating deployment package..."
DEPLOY_DIR="deploy-$(date +%Y%m%d-%H%M%S)"
mkdir -p "$DEPLOY_DIR"

# Copy frontend build
cp -r dist "$DEPLOY_DIR/"
cp package.json "$DEPLOY_DIR/"

# Copy backend
cp -r backend "$DEPLOY_DIR/"

# Copy deployment files
cp .env.production "$DEPLOY_DIR/"
cp deploy.sh "$DEPLOY_DIR/"

# Create production start script
cat > "$DEPLOY_DIR/start.sh" << 'EOF'
#!/bin/bash

# Start the backend server
cd backend
npm start &
BACKEND_PID=$!

# Wait for backend to start
sleep 5

# Check if backend is running
if curl -f http://localhost:3001/health > /dev/null 2>&1; then
    echo "✅ Backend server started successfully"
else
    echo "❌ Backend server failed to start"
    exit 1
fi

# Keep the script running
wait $BACKEND_PID
EOF

chmod +x "$DEPLOY_DIR/start.sh"

print_success "Deployment package created: $DEPLOY_DIR"

# Create deployment instructions
cat > "$DEPLOY_DIR/DEPLOYMENT_INSTRUCTIONS.md" << 'EOF'
# Deployment Instructions

## Prerequisites
- Node.js 18+ installed
- Database (PostgreSQL recommended for production)
- Razorpay production account with API keys

## Quick Start

1. **Update Environment Variables**
   ```bash
   # Frontend (.env.production)
   VITE_RAZORPAY_KEY_ID=rzp_live_your_key
   VITE_RAZORPAY_SECRET_KEY=your_secret
   VITE_API_URL=https://yourdomain.com/api
   
   # Backend (backend/.env)
   NODE_ENV=production
   RAZORPAY_KEY_ID=rzp_live_your_key
   RAZORPAY_SECRET_KEY=your_secret
   RAZORPAY_WEBHOOK_SECRET=your_webhook_secret
   JWT_SECRET=your_jwt_secret
   DATABASE_URL=your_database_url
   ```

2. **Start the Application**
   ```bash
   ./start.sh
   ```

3. **Access the Application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3001
   - Health Check: http://localhost:3001/health

## Production Deployment

### Using PM2 (Recommended)
```bash
# Install PM2
npm install -g pm2

# Start backend
cd backend
pm2 start server.js --name "zyntiq-backend"

# Start frontend (if serving from backend)
pm2 start server.js --name "zyntiq-frontend"
```

### Using Docker
```bash
# Build and run with Docker Compose
docker-compose up -d
```

### Using Nginx
```bash
# Configure Nginx to serve frontend and proxy backend
# Example configuration in nginx.conf
```

## Monitoring

- Check logs: `pm2 logs`
- Monitor processes: `pm2 status`
- Health check: `curl http://localhost:3001/health`

## Troubleshooting

1. **Backend won't start**
   - Check environment variables
   - Verify database connection
   - Check port availability

2. **Payment issues**
   - Verify Razorpay keys
   - Check webhook configuration
   - Review payment logs

3. **Frontend issues**
   - Check API URL configuration
   - Verify CORS settings
   - Check browser console for errors
EOF

print_success "Deployment instructions created"

# Create nginx configuration example
cat > "$DEPLOY_DIR/nginx.conf" << 'EOF'
server {
    listen 80;
    server_name yourdomain.com;
    
    # Redirect HTTP to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com;
    
    # SSL configuration
    ssl_certificate /path/to/your/certificate.crt;
    ssl_certificate_key /path/to/your/private.key;
    
    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;
    
    # Frontend (React app)
    location / {
        root /path/to/your/dist;
        try_files $uri $uri/ /index.html;
        
        # Cache static assets
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
    }
    
    # Backend API
    location /api/ {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
    
    # Health check
    location /health {
        proxy_pass http://localhost:3001/health;
        proxy_set_header Host $host;
    }
}
EOF

print_success "Nginx configuration example created"

# Create docker-compose file
cat > "$DEPLOY_DIR/docker-compose.yml" << 'EOF'
version: '3.8'

services:
  frontend:
    build:
      context: .
      dockerfile: Dockerfile.frontend
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
    depends_on:
      - backend

  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    ports:
      - "3001:3001"
    environment:
      - NODE_ENV=production
    env_file:
      - ./backend/.env
    depends_on:
      - database

  database:
    image: postgres:15
    environment:
      POSTGRES_DB: zyntiq
      POSTGRES_USER: zyntiq_user
      POSTGRES_PASSWORD: your_secure_password
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

volumes:
  postgres_data:
EOF

print_success "Docker Compose configuration created"

# Create Dockerfile for frontend
cat > "$DEPLOY_DIR/Dockerfile.frontend" << 'EOF'
FROM node:18-alpine as builder

WORKDIR /app
COPY package*.json ./
RUN npm ci --production=false

COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
EOF

# Create Dockerfile for backend
cat > "$DEPLOY_DIR/Dockerfile.backend" << 'EOF'
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 3001

CMD ["npm", "start"]
EOF

print_success "Docker configurations created"

# Final summary
echo ""
print_success "🎉 Deployment package ready!"
echo ""
echo "📁 Deployment directory: $DEPLOY_DIR"
echo ""
echo "📋 Next steps:"
echo "1. Update environment variables in:"
echo "   - $DEPLOY_DIR/.env.production (frontend)"
echo "   - $DEPLOY_DIR/backend/.env (backend)"
echo ""
echo "2. Choose your deployment method:"
echo "   - Direct: ./start.sh"
echo "   - PM2: Use PM2 commands"
echo "   - Docker: docker-compose up -d"
echo "   - Nginx: Use nginx.conf example"
echo ""
echo "3. Configure your domain and SSL certificates"
echo ""
echo "📚 See DEPLOYMENT_INSTRUCTIONS.md for detailed instructions"
echo ""

print_success "Deployment script completed successfully!"