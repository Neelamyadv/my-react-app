# 🔐 Admin Panel Security Guide

## 🎯 **Overview**
Your admin panels are now secured with password protection. This guide explains how to manage access and maintain security.

## 🔑 **Default Passwords**

### **📊 Admin Panel (Full Access)**
- **URL**: `/admin`
- **Password**: `admin2024`
- **Access**: Complete administrative control

### **👥 Access Panel (HR Team)**
- **URL**: `/access`
- **Password**: `hr2024`
- **Access**: Grant course and eBook access to users

### **📈 Analytics Dashboard (HR Team)**
- **URL**: `/analytics`
- **Password**: `hr2024`
- **Access**: View daily conversion reports

## 🔧 **How to Change Passwords**

### **Step 1: Edit Configuration File**
Open `src/config/adminPasswords.ts` and update the passwords:

```typescript
export const ADMIN_PASSWORDS = {
  // Full Admin Panel Password (for complete admin access)
  ADMIN_PANEL: 'your_new_admin_password',
  
  // Access Panel Password (for HR team access)
  ACCESS_PANEL: 'your_new_hr_password',
  
  // Analytics Dashboard Password (for HR team analytics)
  ANALYTICS: 'your_new_analytics_password'
} as const;
```

### **Step 2: Password Requirements**
Your passwords should meet these requirements:
- **Minimum 8 characters**
- **Include uppercase letters (A-Z)**
- **Include lowercase letters (a-z)**
- **Include numbers (0-9)**
- **Optional: Include symbols (!@#$%^&*)**

### **Step 3: Recommended Strong Passwords**
```
Admin Panel: AdminSecure2024!
Access Panel: HRTeamAccess2024!
Analytics: AnalyticsView2024!
```

## 🛡️ **Security Features**

### **✅ Password Protection**
- **Session-based access** - Expires when browser closes
- **Failed attempt blocking** - 3 attempts then 5-minute lockout
- **Password visibility toggle** - Show/hide password
- **Secure storage** - Passwords stored in session storage

### **✅ Access Control**
- **Separate passwords** for different access levels
- **No cross-access** - Each panel has its own authentication
- **Automatic logout** - Session expires on browser close
- **Attempt tracking** - Monitors failed login attempts

### **✅ User Experience**
- **Professional interface** - Clean, modern design
- **Clear feedback** - Success/error messages
- **Easy navigation** - Simple login process
- **Mobile friendly** - Works on all devices

## 📋 **Access Levels**

### **🔴 Admin Panel (Full Access)**
- User Management
- Payment Tracking
- Course Access Control
- eBook Access Control
- System Settings
- Analytics Dashboard
- Contact Messages

### **🔵 Access Panel (HR Team)**
- Grant Course Access
- Grant eBook Access
- Premium Pass Access
- User Management
- Email-based Access

### **🟢 Analytics Dashboard (HR Team)**
- Daily Conversion Reports
- Revenue Analytics
- Payment Type Breakdown
- Export Reports
- Date Navigation

## 🚨 **Security Best Practices**

### **🔐 Password Management**
1. **Use strong passwords** - Follow the requirements above
2. **Change regularly** - Update passwords every 3-6 months
3. **Don't share** - Keep passwords confidential
4. **Use different passwords** - Don't reuse across panels
5. **Store securely** - Use password managers

### **👥 Access Management**
1. **Limit access** - Only give access to trusted team members
2. **Monitor usage** - Check who has access regularly
3. **Revoke access** - Remove access when team members leave
4. **Regular audits** - Review access permissions monthly

### **🔒 Production Security**
1. **Environment variables** - Store passwords in `.env` files
2. **HTTPS only** - Use secure connections
3. **Rate limiting** - Implement API rate limiting
4. **Logging** - Monitor access attempts
5. **Backup security** - Secure backup access

## 📱 **How to Use**

### **🔑 Logging In**
1. **Navigate** to the panel URL
2. **Enter** the correct password
3. **Click** "Access Panel"
4. **Start** using the features

### **🚪 Logging Out**
1. **Click** the "Logout" button
2. **Session** expires immediately
3. **Re-authenticate** to access again

### **🔄 Session Management**
- **Automatic expiry** - Sessions end when browser closes
- **Manual logout** - Click logout button anytime
- **No persistent login** - Must re-enter password each session

## 🆘 **Troubleshooting**

### **❌ "Incorrect Password"**
- **Check spelling** - Ensure password is typed correctly
- **Check caps lock** - Verify case sensitivity
- **Try again** - Wait if account is temporarily locked

### **⏰ "Too Many Failed Attempts"**
- **Wait 5 minutes** - Account is temporarily locked
- **Try again** - Attempts reset after lockout period
- **Contact admin** - If you're sure password is correct

### **🔒 "Access Denied"**
- **Check URL** - Ensure you're on the correct panel
- **Verify access** - Confirm you have permission
- **Contact admin** - Request access if needed

## 📞 **Support**

### **🆘 Need Help?**
- **Password reset** - Contact the system administrator
- **Access issues** - Verify your permissions
- **Technical problems** - Check your internet connection
- **Security concerns** - Report immediately

### **📧 Contact Information**
- **Admin**: admin@zyntiq.in
- **Support**: support@zyntiq.in
- **Security**: security@zyntiq.in

---

## 🎯 **Quick Reference**

| Panel | URL | Password | Access Level |
|-------|-----|----------|--------------|
| Admin | `/admin` | `admin2024` | Full Access |
| Access | `/access` | `hr2024` | HR Team |
| Analytics | `/analytics` | `hr2024` | HR Analytics |

**🔐 Your admin panels are now secure and ready for production use!**