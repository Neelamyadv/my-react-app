# 📧 Resend Email Service Setup Guide

## 🎯 **Overview**
This guide will help you set up Resend email service for your Zyntiq website. Resend provides 3,000 free emails per month with excellent deliverability.

## 🚀 **Step 1: Create Resend Account**

### **1.1 Sign Up**
1. Go to [resend.com](https://resend.com)
2. Click "Get Started"
3. Create your account (no credit card required)
4. Verify your email address

### **1.2 Get API Key**
1. After login, go to **API Keys** section
2. Click **"Create API Key"**
3. Give it a name like "Zyntiq Website"
4. Copy the API key (starts with `re_`)

## 🔧 **Step 2: Configure Your Project**

### **2.1 Add API Key to Environment**
Create or update your `.env` file:

```bash
# Email Service (Resend)
VITE_RESEND_API_KEY=re_your_api_key_here
VITE_RESEND_FROM_EMAIL=noreply@zyntiq.in
```

### **2.2 Update API Configuration**
The email service is already configured in `src/lib/apiConfig.ts`:

```typescript
EMAIL: {
  RESEND_API_KEY: import.meta.env.VITE_RESEND_API_KEY || 'YOUR_RESEND_API_KEY',
  RESEND_FROM_EMAIL: import.meta.env.VITE_RESEND_FROM_EMAIL || 'noreply@zyntiq.in',
}
```

## 📧 **Step 3: Domain Verification (Optional but Recommended)**

### **3.1 Add Your Domain**
1. In Resend dashboard, go to **Domains**
2. Click **"Add Domain"**
3. Enter your domain: `zyntiq.in`
4. Follow the DNS setup instructions

### **3.2 DNS Records**
Add these records to your domain's DNS:

```
Type: TXT
Name: @
Value: resend-verification=your_verification_code

Type: CNAME
Name: resend
Value: track.resend.com
```

### **3.3 SPF Record**
Add SPF record to prevent spam:

```
Type: TXT
Name: @
Value: v=spf1 include:spf.resend.com ~all
```

## 🧪 **Step 4: Test Email Service**

### **4.1 Test Function**
Your email service includes a test function:

```typescript
// Test the email service
const testResult = await emailService.testEmailService();
console.log('Test result:', testResult);
```

### **4.2 Manual Test**
You can test by:
1. Submitting the contact form
2. Making a test payment
3. Registering a new user

## 📧 **Email Templates Available**

### **🎉 Welcome Email**
- **Trigger**: New user registration
- **Content**: Welcome message, course catalog, getting started guide

### **💳 Payment Confirmation**
- **Trigger**: Successful payment
- **Content**: Payment details, course access, next steps

### **📚 Course Enrollment**
- **Trigger**: Course enrollment
- **Content**: Course details, access instructions, support info

### **🏆 Certificate Delivery**
- **Trigger**: Course completion
- **Content**: Certificate download link, congratulations

### **🔐 Password Reset**
- **Trigger**: Password reset request
- **Content**: Reset link, security notice

### **📧 Contact Form Confirmation**
- **Trigger**: Contact form submission
- **Content**: Confirmation message, response time

### **👤 Admin Notifications**
- **Trigger**: New user, payment, contact, completion
- **Content**: Admin alerts for business monitoring

## 🔧 **Step 5: Customize Email Templates**

### **5.1 Template Location**
All templates are in `src/lib/emailService.ts`:

```typescript
const createWelcomeEmailTemplate = (data: WelcomeEmailData) => `
  // Your custom HTML template here
`;
```

### **5.2 Customization Options**
- **Colors**: Update gradient colors in CSS
- **Logo**: Add your logo URL
- **Branding**: Update company name and contact info
- **Links**: Update course and website URLs

### **5.3 Example Customization**
```typescript
// Update colors to match your brand
.header { 
  background: linear-gradient(135deg, #your-color-1 0%, #your-color-2 100%); 
}

// Add your logo
<img src="https://zyntiq.in/logo.png" alt="Zyntiq Logo" style="width: 150px;">

// Update contact information
<p>Contact: support@zyntiq.in | +91 9401966440</p>
```

## 📊 **Step 6: Monitor Email Performance**

### **6.1 Resend Dashboard**
- **Analytics**: Track email delivery rates
- **Logs**: View email sending history
- **Bounces**: Monitor failed deliveries
- **Spam Reports**: Track spam complaints

### **6.2 Key Metrics to Watch**
- **Delivery Rate**: Should be >95%
- **Open Rate**: Industry average ~20%
- **Click Rate**: Industry average ~3%
- **Bounce Rate**: Should be <5%

## 🚨 **Step 7: Troubleshooting**

### **7.1 Common Issues**

#### **"Invalid API Key"**
- Check your API key is correct
- Ensure it starts with `re_`
- Verify the key is active in Resend dashboard

#### **"Domain not verified"**
- Complete domain verification process
- Check DNS records are correct
- Wait 24-48 hours for DNS propagation

#### **"Email not sending"**
- Check API key in environment variables
- Verify from email address
- Check Resend dashboard for errors

#### **"Emails going to spam"**
- Complete domain verification
- Add SPF and DKIM records
- Use consistent from address
- Avoid spam trigger words

### **7.2 Debug Mode**
Enable debug logging:

```typescript
// In emailService.ts
console.log('Email service config:', {
  apiKey: API_CONFIG.EMAIL.RESEND_API_KEY,
  fromEmail: API_CONFIG.EMAIL.RESEND_FROM_EMAIL
});
```

## 📈 **Step 8: Scaling Up**

### **8.1 Free Tier Limits**
- **3,000 emails/month** - Perfect for starting
- **No credit card required**
- **Full API access**

### **8.2 When to Upgrade**
- **100+ active users**
- **More than 3,000 emails/month**
- **Need advanced features**

### **8.3 Upgrade Process**
1. Add credit card to Resend account
2. Choose paid plan
3. No code changes needed
4. Same API, higher limits

## 🔒 **Step 9: Security Best Practices**

### **9.1 API Key Security**
- **Never commit API keys** to version control
- **Use environment variables**
- **Rotate keys regularly**
- **Limit key permissions**

### **9.2 Email Security**
- **Verify sender domain**
- **Use consistent from address**
- **Monitor for abuse**
- **Implement rate limiting**

### **9.3 Privacy Compliance**
- **Include unsubscribe links**
- **Respect user preferences**
- **Follow GDPR guidelines**
- **Store consent records**

## 📞 **Step 10: Support Resources**

### **10.1 Resend Support**
- **Documentation**: [resend.com/docs](https://resend.com/docs)
- **API Reference**: [resend.com/docs/api-reference](https://resend.com/docs/api-reference)
- **Community**: [resend.com/community](https://resend.com/community)

### **10.2 Email Best Practices**
- **SendGrid Guide**: [sendgrid.com/email-best-practices](https://sendgrid.com/email-best-practices)
- **Mailchimp Guide**: [mailchimp.com/resources/email-marketing-guide](https://mailchimp.com/resources/email-marketing-guide)

## ✅ **Setup Checklist**

- [ ] Created Resend account
- [ ] Generated API key
- [ ] Added API key to environment variables
- [ ] Tested email service
- [ ] Verified domain (optional)
- [ ] Customized email templates
- [ ] Monitored first emails
- [ ] Set up error handling
- [ ] Documented setup process

## 🎉 **You're Ready!**

Your email service is now configured and ready to send professional emails to your users. The system will automatically send:

- ✅ Welcome emails to new users
- ✅ Payment confirmations
- ✅ Course enrollment notifications
- ✅ Contact form confirmations
- ✅ Admin notifications

**Happy emailing! 📧**