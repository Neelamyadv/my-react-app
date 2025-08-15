# 🚀 **ZYNTIQ API SETUP GUIDE**

## 📋 **Overview**

This guide will help you set up all the necessary API keys and configurations to make your Zyntiq platform production-ready. Currently, your project uses placeholder APIs that simulate real functionality. When you're ready to go live, simply replace the placeholder values with real API keys.

---

## 🎯 **Current Status: API Placeholders Ready**

✅ **Frontend Application**: Complete and functional  
✅ **API Placeholders**: All configured with mock data  
✅ **Environment Variables**: Template ready  
✅ **Service Layer**: Mock implementations in place  
❌ **Backend Server**: Not yet implemented  
❌ **Real API Keys**: Not yet configured  

---

## 🔧 **Step-by-Step Setup Process**

### **Phase 1: Environment Setup (5 minutes)**

1. **Copy Environment Template**
   ```bash
   cp .env.example .env.local
   ```

2. **Edit Environment File**
   ```bash
   nano .env.local
   # or use your preferred editor
   ```

3. **Fill in Your API Keys** (see sections below)

### **Phase 2: API Key Configuration**

#### **🔐 1. Payment Gateway (Razorpay)**

**Required for**: Course payments, Premium Pass purchases

1. **Sign up at**: https://razorpay.com
2. **Get API Keys**:
   - Go to Settings → API Keys
   - Copy your Key ID and Key Secret
3. **Update Environment**:
   ```env
   VITE_RAZORPAY_KEY_ID=rzp_test_YOUR_ACTUAL_KEY_ID
   VITE_RAZORPAY_KEY_SECRET=YOUR_ACTUAL_SECRET
   ```

#### **🗄️ 2. Database (Supabase)**

**Required for**: User data, courses, enrollments, payments

1. **Sign up at**: https://supabase.com
2. **Create Project**:
   - Create new project
   - Copy Project URL and API Keys
3. **Update Environment**:
   ```env
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-actual-anon-key
   VITE_SUPABASE_SERVICE_ROLE_KEY=your-actual-service-role-key
   ```

#### **📧 3. Email Service (SendGrid)**

**Required for**: Welcome emails, password reset, notifications

1. **Sign up at**: https://sendgrid.com
2. **Get API Key**:
   - Go to Settings → API Keys
   - Create new API Key
3. **Update Environment**:
   ```env
   VITE_SENDGRID_API_KEY=YOUR_ACTUAL_SENDGRID_KEY
   VITE_SENDGRID_FROM_EMAIL=noreply@zyntiq.in
   ```

#### **📱 4. SMS Service (MSG91 - India)**

**Required for**: OTP verification, notifications

1. **Sign up at**: https://msg91.com
2. **Get API Key and Template ID**
3. **Update Environment**:
   ```env
   VITE_MSG91_API_KEY=YOUR_ACTUAL_MSG91_KEY
   VITE_MSG91_TEMPLATE_ID=YOUR_TEMPLATE_ID
   VITE_MSG91_SENDER_ID=ZYNTIQ
   ```

#### **🔐 5. Google OAuth**

**Required for**: Social login

1. **Go to**: https://console.cloud.google.com
2. **Create OAuth 2.0 Credentials**:
   - Create new project
   - Enable Google+ API
   - Create OAuth 2.0 credentials
3. **Update Environment**:
   ```env
   VITE_GOOGLE_CLIENT_ID=YOUR_ACTUAL_CLIENT_ID
   VITE_GOOGLE_CLIENT_SECRET=YOUR_ACTUAL_CLIENT_SECRET
   ```

#### **📊 6. Analytics (Google Analytics)**

**Required for**: User tracking, conversion analytics

1. **Go to**: https://analytics.google.com
2. **Create Property**:
   - Create new property for your website
   - Get Measurement ID
3. **Update Environment**:
   ```env
   VITE_GA_MEASUREMENT_ID=G-YOUR_ACTUAL_GA_ID
   ```

#### **☁️ 7. Cloud Storage (AWS S3)**

**Required for**: Course videos, images, documents

1. **Sign up at**: https://aws.amazon.com
2. **Create S3 Bucket**:
   - Create new bucket
   - Get Access Key and Secret
3. **Update Environment**:
   ```env
   VITE_AWS_ACCESS_KEY_ID=YOUR_ACTUAL_ACCESS_KEY
   VITE_AWS_SECRET_ACCESS_KEY=YOUR_ACTUAL_SECRET_KEY
   VITE_AWS_S3_BUCKET=your-actual-bucket-name
   ```

---

## 🔄 **Switching from Mock to Real APIs**

### **Current State: Mock APIs**
Your project currently uses mock implementations that simulate real API responses. This allows you to:
- Test the frontend functionality
- Develop without backend dependencies
- Demo the application

### **When Backend is Ready: Real APIs**

1. **Update API Service Layer**
   ```typescript
   // In src/lib/apiService.ts
   // Replace mock implementations with real API calls
   
   // BEFORE (Mock):
   return new Promise((resolve) => {
     setTimeout(() => {
       resolve({ success: true, user: mockUser });
     }, 1000);
   });
   
   // AFTER (Real):
   return this.client.post(API_ENDPOINTS.AUTH.LOGIN, credentials);
   ```

2. **Enable Real API Calls**
   ```typescript
   // Uncomment the real API calls and comment out mock implementations
   // return this.client.post(API_ENDPOINTS.AUTH.SIGNUP, userData);
   ```

---

## 🚀 **Going Live Checklist**

### **✅ Pre-Launch Checklist**

- [ ] All API keys configured in `.env.local`
- [ ] Backend server deployed and running
- [ ] Database schema created and populated
- [ ] Payment gateway configured and tested
- [ ] Email service configured and tested
- [ ] SSL certificate installed
- [ ] Domain configured
- [ ] Analytics tracking enabled
- [ ] Error monitoring set up
- [ ] Backup system configured

### **✅ Launch Day Checklist**

- [ ] Switch from test to production API keys
- [ ] Update environment variables for production
- [ ] Deploy frontend to production server
- [ ] Test all payment flows
- [ ] Test user registration and login
- [ ] Test course enrollment
- [ ] Test email notifications
- [ ] Monitor error logs
- [ ] Verify analytics tracking

### **✅ Post-Launch Checklist**

- [ ] Monitor user registrations
- [ ] Track payment conversions
- [ ] Monitor system performance
- [ ] Check error rates
- [ ] Review analytics data
- [ ] Gather user feedback
- [ ] Plan feature updates

---

## 🔧 **Configuration Files**

### **1. API Configuration** (`src/lib/apiConfig.ts`)
Contains all API keys and configuration placeholders.

### **2. API Service Layer** (`src/lib/apiService.ts`)
Handles all API calls with mock implementations ready to be replaced.

### **3. Environment Variables** (`.env.local`)
Contains all your actual API keys and configuration.

---

## 📞 **Support & Troubleshooting**

### **Common Issues**

1. **API Keys Not Working**
   - Verify keys are correctly copied
   - Check for extra spaces or characters
   - Ensure keys are from the correct environment (test/production)

2. **Payment Gateway Issues**
   - Verify Razorpay account is activated
   - Check webhook configuration
   - Ensure correct currency settings

3. **Email Not Sending**
   - Verify SendGrid API key
   - Check sender email verification
   - Review email templates

4. **Database Connection Issues**
   - Verify Supabase credentials
   - Check database schema
   - Ensure proper permissions

### **Getting Help**

- **Documentation**: Check individual service documentation
- **Support**: Contact service providers directly
- **Community**: Join relevant developer communities

---

## 💰 **Cost Estimation**

### **Monthly Costs (Approximate)**

| Service | Cost (USD) | Purpose |
|---------|------------|---------|
| **Razorpay** | $0 + 2% transaction fee | Payment processing |
| **Supabase** | $25/month | Database & hosting |
| **SendGrid** | $15/month | Email service |
| **AWS S3** | $5-20/month | File storage |
| **Google Analytics** | Free | Analytics |
| **Domain & SSL** | $10/month | Website hosting |
| **Total** | **$55-85/month** | **Complete setup** |

### **One-Time Costs**

| Item | Cost (USD) | Description |
|------|------------|-------------|
| **Backend Development** | $8,000-15,000 | Custom backend server |
| **UI/UX Design** | Already done | Your current design |
| **Testing & QA** | $2,000-5,000 | Quality assurance |
| **Total** | **$10,000-20,000** | **Complete development** |

---

## 🎯 **Next Steps**

1. **Immediate**: Set up environment variables with your API keys
2. **Short-term**: Develop backend server (6-8 weeks)
3. **Medium-term**: Replace mock APIs with real implementations
4. **Long-term**: Deploy to production and launch

---

## 📚 **Additional Resources**

- **Razorpay Documentation**: https://razorpay.com/docs/
- **Supabase Documentation**: https://supabase.com/docs
- **SendGrid Documentation**: https://sendgrid.com/docs/
- **AWS S3 Documentation**: https://docs.aws.amazon.com/s3/
- **Google Analytics**: https://analytics.google.com/analytics/

---

**🎉 Your Zyntiq platform is ready to go live once you complete this setup!**