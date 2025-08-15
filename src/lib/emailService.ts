// ========================================
// 📧 EMAIL SERVICE WITH RESEND
// ========================================
// Complete email service for user notifications, payment confirmations, and admin alerts

import { Resend } from 'resend';
import { API_CONFIG } from './apiConfig';
import { logError, logInfo } from './logger';

// Initialize Resend client
const resend = new Resend(API_CONFIG.EMAIL.RESEND_API_KEY);

// Email template interfaces
interface WelcomeEmailData {
  userName: string;
  userEmail: string;
}

interface PaymentConfirmationData {
  userName: string;
  userEmail: string;
  courseName: string;
  amount: number;
  paymentId: string;
  paymentType: string;
}

interface CourseEnrollmentData {
  userName: string;
  userEmail: string;
  courseName: string;
  courseId: string;
}

interface CertificateData {
  userName: string;
  userEmail: string;
  courseName: string;
  certificateUrl: string;
}

interface PasswordResetData {
  userName: string;
  userEmail: string;
  resetUrl: string;
}

interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  message: string;
}

interface AdminNotificationData {
  type: 'new_user' | 'new_payment' | 'new_contact' | 'course_completion';
  data: any;
}

// ========================================
// 🎨 EMAIL TEMPLATES
// ========================================

const createWelcomeEmailTemplate = (data: WelcomeEmailData) => `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to Zyntiq!</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🎓 Welcome to Zyntiq!</h1>
            <p>Your learning journey starts here</p>
        </div>
        <div class="content">
            <h2>Hello ${data.userName}!</h2>
            <p>Welcome to Zyntiq - your gateway to professional development and skill enhancement!</p>
            
            <h3>🚀 What's Next?</h3>
            <ul>
                <li>Explore our course catalog</li>
                <li>Start with a free course</li>
                <li>Join our community</li>
                <li>Track your progress</li>
            </ul>
            
            <a href="https://zyntiq.in/courses" class="button">Explore Courses</a>
            
            <h3>📚 Popular Courses</h3>
            <ul>
                <li>Web Development Fundamentals - ₹599</li>
                <li>Python Programming Mastery - ₹599</li>
                <li>Digital Marketing Strategy - ₹599</li>
                <li>Premium Pass (All Courses) - ₹999</li>
            </ul>
            
            <p>Need help getting started? Reply to this email or contact us at support@zyntiq.in</p>
        </div>
        <div class="footer">
            <p>© 2024 Zyntiq. All rights reserved.</p>
            <p>You received this email because you signed up for Zyntiq.</p>
        </div>
    </div>
</body>
</html>
`;

const createPaymentConfirmationTemplate = (data: PaymentConfirmationData) => `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Payment Confirmation</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .success-box { background: #d1fae5; border: 1px solid #10b981; padding: 20px; border-radius: 5px; margin: 20px 0; }
        .button { display: inline-block; background: #10b981; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>✅ Payment Successful!</h1>
            <p>Your purchase has been confirmed</p>
        </div>
        <div class="content">
            <h2>Hello ${data.userName}!</h2>
            
            <div class="success-box">
                <h3>🎉 Payment Confirmed</h3>
                <p><strong>Course:</strong> ${data.courseName}</p>
                <p><strong>Amount:</strong> ₹${data.amount}</p>
                <p><strong>Payment ID:</strong> ${data.paymentId}</p>
                <p><strong>Type:</strong> ${data.paymentType}</p>
            </div>
            
            <h3>📚 What's Next?</h3>
            <p>You now have full access to your course. Here's what you can do:</p>
            <ul>
                <li>Start learning immediately</li>
                <li>Download course materials</li>
                <li>Track your progress</li>
                <li>Earn your certificate</li>
            </ul>
            
            <a href="https://zyntiq.in/account" class="button">Access Your Course</a>
            
            <h3>💡 Pro Tips</h3>
            <ul>
                <li>Set aside dedicated time for learning</li>
                <li>Complete all assignments for better retention</li>
                <li>Join our community for support</li>
                <li>Don't hesitate to ask questions</li>
            </ul>
            
            <p>Need help? Contact us at support@zyntiq.in</p>
        </div>
        <div class="footer">
            <p>© 2024 Zyntiq. All rights reserved.</p>
            <p>Payment ID: ${data.paymentId}</p>
        </div>
    </div>
</body>
</html>
`;

const createCourseEnrollmentTemplate = (data: CourseEnrollmentData) => `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Course Enrollment Confirmation</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .enrollment-box { background: #dbeafe; border: 1px solid #3b82f6; padding: 20px; border-radius: 5px; margin: 20px 0; }
        .button { display: inline-block; background: #3b82f6; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>📚 You're Enrolled!</h1>
            <p>Welcome to ${data.courseName}</p>
        </div>
        <div class="content">
            <h2>Hello ${data.userName}!</h2>
            
            <div class="enrollment-box">
                <h3>🎓 Enrollment Confirmed</h3>
                <p><strong>Course:</strong> ${data.courseName}</p>
                <p><strong>Course ID:</strong> ${data.courseId}</p>
                <p><strong>Enrollment Date:</strong> ${new Date().toLocaleDateString()}</p>
            </div>
            
            <h3>🚀 Ready to Start Learning?</h3>
            <p>Your course is now available in your account. Here's what you'll find:</p>
            <ul>
                <li>Video lessons and tutorials</li>
                <li>Downloadable course materials</li>
                <li>Interactive quizzes and assignments</li>
                <li>Progress tracking</li>
                <li>Certificate upon completion</li>
            </ul>
            
            <a href="https://zyntiq.in/courses/${data.courseId}" class="button">Start Learning Now</a>
            
            <h3>📋 Course Overview</h3>
            <p>This course will help you master the fundamentals and advanced concepts. Take your time, practice regularly, and don't hesitate to reach out if you need help!</p>
            
            <p>Happy learning! 🎉</p>
        </div>
        <div class="footer">
            <p>© 2024 Zyntiq. All rights reserved.</p>
            <p>Course ID: ${data.courseId}</p>
        </div>
    </div>
</body>
</html>
`;

const createCertificateTemplate = (data: CertificateData) => `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Certificate of Completion</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .certificate-box { background: #fef3c7; border: 2px solid #f59e0b; padding: 30px; border-radius: 10px; margin: 20px 0; text-align: center; }
        .button { display: inline-block; background: #f59e0b; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🏆 Congratulations!</h1>
            <p>You've earned your certificate</p>
        </div>
        <div class="content">
            <h2>Hello ${data.userName}!</h2>
            
            <div class="certificate-box">
                <h3>🎓 Certificate of Completion</h3>
                <p><strong>Course:</strong> ${data.courseName}</p>
                <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
                <p><strong>Status:</strong> ✅ Completed</p>
            </div>
            
            <h3>🎉 You Did It!</h3>
            <p>Congratulations on completing ${data.courseName}! You've demonstrated dedication, persistence, and a commitment to learning.</p>
            
            <a href="${data.certificateUrl}" class="button">Download Certificate</a>
            
            <h3>📈 What's Next?</h3>
            <ul>
                <li>Add this certificate to your resume</li>
                <li>Share your achievement on LinkedIn</li>
                <li>Continue learning with more courses</li>
                <li>Join our alumni community</li>
            </ul>
            
            <p>Keep up the great work! 🚀</p>
        </div>
        <div class="footer">
            <p>© 2024 Zyntiq. All rights reserved.</p>
            <p>Certificate ID: ${Date.now()}</p>
        </div>
    </div>
</body>
</html>
`;

const createPasswordResetTemplate = (data: PasswordResetData) => `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reset Your Password</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .warning-box { background: #fee2e2; border: 1px solid #ef4444; padding: 20px; border-radius: 5px; margin: 20px 0; }
        .button { display: inline-block; background: #ef4444; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🔐 Password Reset</h1>
            <p>Secure your account</p>
        </div>
        <div class="content">
            <h2>Hello ${data.userName}!</h2>
            
            <p>We received a request to reset your password for your Zyntiq account.</p>
            
            <div class="warning-box">
                <h3>⚠️ Security Notice</h3>
                <p>If you didn't request this password reset, please ignore this email. Your password will remain unchanged.</p>
            </div>
            
            <a href="${data.resetUrl}" class="button">Reset Password</a>
            
            <h3>🔒 Security Tips</h3>
            <ul>
                <li>Use a strong, unique password</li>
                <li>Don't share your password with anyone</li>
                <li>Enable two-factor authentication if available</li>
                <li>Log out from shared devices</li>
            </ul>
            
            <p>This link will expire in 24 hours for security reasons.</p>
        </div>
        <div class="footer">
            <p>© 2024 Zyntiq. All rights reserved.</p>
            <p>If you have questions, contact support@zyntiq.in</p>
        </div>
    </div>
</body>
</html>
`;

const createContactFormTemplate = (data: ContactFormData) => `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Thank you for contacting us</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .message-box { background: #f3f4f6; border: 1px solid #d1d5db; padding: 20px; border-radius: 5px; margin: 20px 0; }
        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>📧 Message Received</h1>
            <p>Thank you for contacting Zyntiq</p>
        </div>
        <div class="content">
            <h2>Hello ${data.name}!</h2>
            
            <p>Thank you for reaching out to us. We've received your message and will get back to you as soon as possible.</p>
            
            <div class="message-box">
                <h3>📝 Your Message</h3>
                <p><strong>From:</strong> ${data.name} (${data.email})</p>
                <p><strong>Phone:</strong> ${data.phone}</p>
                <p><strong>Message:</strong></p>
                <p>${data.message}</p>
            </div>
            
            <h3>⏰ Response Time</h3>
            <p>We typically respond within 24 hours during business days. For urgent matters, you can also call us at +91 9401966440.</p>
            
            <h3>📚 While You Wait</h3>
            <ul>
                <li>Explore our course catalog</li>
                <li>Check out our FAQ section</li>
                <li>Read our latest blog posts</li>
                <li>Follow us on social media</li>
            </ul>
            
            <p>Thank you for choosing Zyntiq! 🎓</p>
        </div>
        <div class="footer">
            <p>© 2024 Zyntiq. All rights reserved.</p>
            <p>Contact: support@zyntiq.in | +91 9401966440</p>
        </div>
    </div>
</body>
</html>
`;

// ========================================
// 📧 EMAIL SERVICE FUNCTIONS
// ========================================

export const emailService = {
  // Send welcome email to new users
  async sendWelcomeEmail(data: WelcomeEmailData) {
    try {
      const result = await resend.emails.send({
        from: API_CONFIG.EMAIL.RESEND_FROM_EMAIL,
        to: data.userEmail,
        subject: 'Welcome to Zyntiq! 🎓',
        html: createWelcomeEmailTemplate(data),
      });
      
      logInfo('Welcome email sent', { userEmail: data.userEmail, messageId: result.data?.id });
      return { success: true, messageId: result.data?.id };
    } catch (error) {
      logError('Failed to send welcome email', error);
      return { success: false, error: error.message };
    }
  },

  // Send payment confirmation email
  async sendPaymentConfirmation(data: PaymentConfirmationData) {
    try {
      const result = await resend.emails.send({
        from: API_CONFIG.EMAIL.RESEND_FROM_EMAIL,
        to: data.userEmail,
        subject: `Payment Successful - ${data.courseName} ✅`,
        html: createPaymentConfirmationTemplate(data),
      });
      
      logInfo('Payment confirmation email sent', { userEmail: data.userEmail, paymentId: data.paymentId });
      return { success: true, messageId: result.data?.id };
    } catch (error) {
      logError('Failed to send payment confirmation email', error);
      return { success: false, error: error.message };
    }
  },

  // Send course enrollment email
  async sendCourseEnrollment(data: CourseEnrollmentData) {
    try {
      const result = await resend.emails.send({
        from: API_CONFIG.EMAIL.RESEND_FROM_EMAIL,
        to: data.userEmail,
        subject: `You're Enrolled in ${data.courseName}! 📚`,
        html: createCourseEnrollmentTemplate(data),
      });
      
      logInfo('Course enrollment email sent', { userEmail: data.userEmail, courseId: data.courseId });
      return { success: true, messageId: result.data?.id };
    } catch (error) {
      logError('Failed to send course enrollment email', error);
      return { success: false, error: error.message };
    }
  },

  // Send certificate email
  async sendCertificate(data: CertificateData) {
    try {
      const result = await resend.emails.send({
        from: API_CONFIG.EMAIL.RESEND_FROM_EMAIL,
        to: data.userEmail,
        subject: `Your Certificate is Ready! 🏆`,
        html: createCertificateTemplate(data),
      });
      
      logInfo('Certificate email sent', { userEmail: data.userEmail, courseName: data.courseName });
      return { success: true, messageId: result.data?.id };
    } catch (error) {
      logError('Failed to send certificate email', error);
      return { success: false, error: error.message };
    }
  },

  // Send password reset email
  async sendPasswordReset(data: PasswordResetData) {
    try {
      const result = await resend.emails.send({
        from: API_CONFIG.EMAIL.RESEND_FROM_EMAIL,
        to: data.userEmail,
        subject: 'Reset Your Password - Zyntiq 🔐',
        html: createPasswordResetTemplate(data),
      });
      
      logInfo('Password reset email sent', { userEmail: data.userEmail });
      return { success: true, messageId: result.data?.id };
    } catch (error) {
      logError('Failed to send password reset email', error);
      return { success: false, error: error.message };
    }
  },

  // Send contact form confirmation
  async sendContactFormConfirmation(data: ContactFormData) {
    try {
      const result = await resend.emails.send({
        from: API_CONFIG.EMAIL.RESEND_FROM_EMAIL,
        to: data.email,
        subject: 'Thank you for contacting Zyntiq 📧',
        html: createContactFormTemplate(data),
      });
      
      logInfo('Contact form confirmation sent', { userEmail: data.email });
      return { success: true, messageId: result.data?.id };
    } catch (error) {
      logError('Failed to send contact form confirmation', error);
      return { success: false, error: error.message };
    }
  },

  // Send admin notification
  async sendAdminNotification(data: AdminNotificationData) {
    try {
      const adminEmail = 'admin@zyntiq.in'; // You can change this
      
      let subject = '';
      let html = '';
      
      switch (data.type) {
        case 'new_user':
          subject = 'New User Registration - Zyntiq 👤';
          html = `
            <h2>New User Registration</h2>
            <p><strong>Name:</strong> ${data.data.name}</p>
            <p><strong>Email:</strong> ${data.data.email}</p>
            <p><strong>Date:</strong> ${new Date().toLocaleString()}</p>
          `;
          break;
          
        case 'new_payment':
          subject = 'New Payment Received - Zyntiq 💰';
          html = `
            <h2>New Payment</h2>
            <p><strong>User:</strong> ${data.data.userName}</p>
            <p><strong>Course:</strong> ${data.data.courseName}</p>
            <p><strong>Amount:</strong> ₹${data.data.amount}</p>
            <p><strong>Payment ID:</strong> ${data.data.paymentId}</p>
          `;
          break;
          
        case 'new_contact':
          subject = 'New Contact Form Submission - Zyntiq 📧';
          html = `
            <h2>New Contact Message</h2>
            <p><strong>Name:</strong> ${data.data.name}</p>
            <p><strong>Email:</strong> ${data.data.email}</p>
            <p><strong>Phone:</strong> ${data.data.phone}</p>
            <p><strong>Message:</strong> ${data.data.message}</p>
          `;
          break;
          
        case 'course_completion':
          subject = 'Course Completion - Zyntiq 🎓';
          html = `
            <h2>Course Completed</h2>
            <p><strong>User:</strong> ${data.data.userName}</p>
            <p><strong>Course:</strong> ${data.data.courseName}</p>
            <p><strong>Completion Date:</strong> ${new Date().toLocaleString()}</p>
          `;
          break;
      }
      
      const result = await resend.emails.send({
        from: API_CONFIG.EMAIL.RESEND_FROM_EMAIL,
        to: adminEmail,
        subject,
        html,
      });
      
      logInfo('Admin notification sent', { type: data.type, adminEmail });
      return { success: true, messageId: result.data?.id };
    } catch (error) {
      logError('Failed to send admin notification', error);
      return { success: false, error: error.message };
    }
  },

  // Test email service
  async testEmailService() {
    try {
      const result = await resend.emails.send({
        from: API_CONFIG.EMAIL.RESEND_FROM_EMAIL,
        to: 'test@example.com',
        subject: 'Test Email - Zyntiq Email Service',
        html: '<h1>Test Email</h1><p>This is a test email to verify the email service is working correctly.</p>',
      });
      
      logInfo('Test email sent successfully', { messageId: result.data?.id });
      return { success: true, messageId: result.data?.id };
    } catch (error) {
      logError('Test email failed', error);
      return { success: false, error: error.message };
    }
  },
};

export default emailService;