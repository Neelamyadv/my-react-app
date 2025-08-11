# 🎓 Zyntiq - Online Learning Platform

Welcome to Zyntiq, a modern and beautiful online learning platform built with React, TypeScript, and Tailwind CSS. This README will guide you through all the customizations you can make to personalize your website.

## 📋 Table of Contents

1. [🎨 Design & Styling](#-design--styling)
2. [📝 Content Management](#-content-management)
3. [🎥 Course Content](#-course-content)
4. [💳 Payment Integration](#-payment-integration)
5. [📧 Contact & Social Media](#-contact--social-media)
6. [🔧 Technical Configuration](#-technical-configuration)
7. [📱 Mobile Optimization](#-mobile-optimization)
8. [🚀 Deployment](#-deployment)

---

## 🎨 Design & Styling

### Background Colors & Gradients

**File:** `src/index.css`

#### Main Background Gradient
```css
/* Current: Light purple to white gradient */
background: linear-gradient(135deg, 
  #ffffff 0%,     /* Pure white */
  #f8fafc 15%,    /* Very light gray */
  #e2e8f0 30%,    /* Light gray */
  #ddd6fe 50%,    /* Light purple */
  #c4b5fd 70%,    /* Medium purple */
  #a78bfa 85%,    /* Darker purple */
  #8b5cf6 100%    /* Deep purple */
);
```

**To Change Colors:**
1. Replace the hex color codes with your preferred colors
2. Use tools like [Coolors.co](https://coolors.co) to generate gradients
3. Test different angles (135deg, 90deg, 45deg) for different effects

#### Alternative Gradient Variations
```css
/* Light variation */
.yellow-gradient-light {
  background: linear-gradient(135deg, #ffffff 0%, #f1f5f9 25%, #e2e8f0 50%, #cbd5e1 75%, #94a3b8 100%);
}

/* Medium variation */
.yellow-gradient-medium {
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 25%, #ddd6fe 50%, #c4b5fd 75%, #a78bfa 100%);
}

/* Dark variation */
.yellow-gradient-dark {
  background: linear-gradient(135deg, #ddd6fe 0%, #c4b5fd 25%, #a78bfa 50%, #8b5cf6 75%, #7c3aed 100%);
}
```

### Text Colors

**File:** `src/index.css`

#### Gradient Text (Headings)
```css
.gradient-text {
  @apply bg-gradient-to-r from-purple-600 to-indigo-600 text-transparent bg-clip-text;
}
```

**To Customize:**
- Change `from-purple-600` and `to-indigo-600` to your brand colors
- Example: `from-blue-600 to-green-600` for blue-to-green gradient

#### Button Styles
```css
.gradient-button {
  @apply bg-gradient-to-r from-purple-500 to-indigo-500 text-white;
}

.enroll-button {
  @apply bg-purple-500 hover:bg-purple-600 text-white font-medium py-3 px-6 rounded-full transition-all duration-300 text-center;
}
```

### Logo & Branding

**Files to Update:**
- `public/Frame 3.png` - Main logo
- `src/components/Navbar.tsx` - Logo in navigation
- `src/components/Footer.tsx` - Logo in footer

**To Change Logo:**
1. Replace `public/Frame 3.png` with your logo file
2. Keep the same filename OR update references in:
   - `src/components/Navbar.tsx` (line ~45)
   - `src/components/Footer.tsx` (line ~15)

---

## 📝 Content Management

### Hero Section

**File:** `src/components/HeroSection.tsx`

#### Main Headline
```jsx
<h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 leading-tight text-gray-800">
  Learn from the<br className="hidden sm:block" /> 
  <span className="block sm:inline"> Experts Elevate</span><br className="hidden sm:block" />
  <span className="gradient-text">Your Skills</span>
</h1>
```

#### Description Text
```jsx
<p className="text-gray-700 mb-6 sm:mb-8 max-w-lg mx-auto md:mx-0 text-base sm:text-lg leading-relaxed">
  Unlock your full potential with our comprehensive online courses. 
  Dive into a world of knowledge and transform your career with our 
  expertly-designed learning.
</p>
```

### Course Information

**File:** `src/components/CoursesPage/CourseDetailPage.tsx`

#### Course Data Structure
```javascript
const courseData = {
  'web-development': {
    title: 'Web Development Course',
    description: 'Course description here...',
    image: '/WebD.png',
    lectures: '100+ Lectures',
    price: 599,
    originalPrice: 2450,
    language: 'English',
    enrolled: '1,200+ Enrolled',
    features: [
      'Introduction to Web Development',
      'HTML and CSS Fundamentals',
      // Add more features...
    ]
  }
  // Add more courses...
};
```

**To Add New Courses:**
1. Add course data to the `courseData` object
2. Add course images to the `public/` folder
3. Update course listings in `src/components/CoursesPage/CoursesPage.tsx`

### Pricing

**File:** `src/lib/razorpay.ts`

```javascript
export const PRICING = {
  COURSE: {
    price: 599,           // ← Change individual course price
    originalPrice: 2450,  // ← Change original price for discount calculation
    discount: 75          // ← Discount percentage
  },
  PREMIUM_PASS: {
    price: 999,           // ← Change premium pass price
    originalPrice: 4999,  // ← Change original price
    discount: 80          // ← Discount percentage
  }
} as const;
```

### Testimonials

**File:** `src/components/TestimonialsSection.tsx`

```javascript
const testimonials = [
  {
    quote: "Transformed my web design skills completely",
    text: "The online courses on this platform have been a game changer...",
    name: "James",
    role: "Frontend Developer",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg"
  }
  // Add more testimonials...
];
```

**To Add Testimonials:**
1. Add new objects to the `testimonials` array
2. Use high-quality avatar images (400x400px recommended)
3. Keep quotes concise and impactful

---

## 🎥 Course Content

### Video Content Management

**File:** `src/lib/contentService.ts`

#### Adding Video Content
```javascript
{
  id: `${courseId}-lesson1`,
  courseId,
  type: 'video' as const,
  title: 'Lesson 1: Fundamentals',
  description: 'Core concepts and foundations',
  url: 'https://your-cdn.com/videos/lesson1.mp4', // ← Replace with your video URL
  duration: 1200, // ← Duration in seconds
  order: 2,
  isLocked: false,
  thumbnailUrl: 'https://your-cdn.com/thumbnails/lesson1.jpg' // ← Thumbnail image
}
```

#### Supported Video Platforms
- **AWS CloudFront:** `https://d1234567890.cloudfront.net/videos/course1/intro.mp4`
- **Vimeo:** `https://player.vimeo.com/video/123456789`
- **YouTube:** `https://www.youtube.com/embed/VIDEO_ID`
- **Bunny CDN:** `https://video-cdn.bunnycdn.com/videos/course1/intro.mp4`

### PDF Resources

```javascript
{
  id: `${courseId}-resources`,
  courseId,
  type: 'pdf' as const,
  title: 'Course Resources & Materials',
  description: 'Downloadable PDFs, cheat sheets, and reference materials',
  url: 'https://your-storage.com/pdfs/course-materials.pdf', // ← Replace with your PDF URL
  size: 2048000, // ← File size in bytes
  order: 4,
  isLocked: false
}
```

### Quiz Content

```javascript
{
  id: `${courseId}-quiz1`,
  courseId,
  type: 'quiz' as const,
  title: 'Quiz: Test Your Knowledge',
  description: 'Check your understanding of the fundamentals',
  questions: [
    {
      id: 'q1',
      question: 'What is the main purpose of this course?',
      type: 'multiple-choice',
      options: [
        'To learn basic concepts',
        'To master advanced techniques',
        'To get certified',
        'All of the above'
      ],
      correctAnswer: 'All of the above',
      explanation: 'This course covers all aspects from basics to certification.',
      points: 10
    }
    // Add more questions...
  ],
  passingScore: 70, // ← Percentage needed to pass
  timeLimit: null,  // ← Time limit in minutes (null for no limit)
  attempts: 3       // ← Number of allowed attempts
}
```

---

## 💳 Payment Integration

### Razorpay Configuration

**File:** `src/lib/razorpay.ts`

#### API Keys
```javascript
constructor() {
  // Replace with your actual Razorpay key
  this.keyId = import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_demo_key';
}
```

**Environment Variables (.env file):**
```env
VITE_RAZORPAY_KEY_ID=your_razorpay_key_here
```

#### Payment Options
```javascript
const razorpayOptions = {
  key: this.keyId,
  amount: options.amount,
  currency: options.currency,
  name: options.name,
  description: options.description,
  prefill: options.prefill,
  theme: { color: '#8b5cf6' }, // ← Change brand color
  // Add more Razorpay options...
};
```

### Demo vs Production Mode

**Current:** Demo mode (no real payments)
**To Enable Production:**
1. Get real Razorpay API keys
2. Update `VITE_RAZORPAY_KEY_ID` in environment variables
3. Uncomment production code in `createPayment()` method

---

## 📧 Contact & Social Media

### Contact Information

**File:** `src/components/Footer.tsx`

```jsx
<li className="flex items-center gap-3">
  <Mail className="text-gray-800 flex-shrink-0" size={18} />
  <a href="mailto:info@zyntiq.in" className="text-gray-800 hover:text-purple-800 transition-colors text-sm sm:text-base font-medium">
    info@zyntiq.in  {/* ← Change email */}
  </a>
</li>
<li className="flex items-center gap-3">
  <Phone className="text-gray-800 flex-shrink-0" size={18} />
  <a href="tel:+11234567890" className="text-gray-800 hover:text-purple-800 transition-colors text-sm sm:text-base font-medium">
    +1 (123) 456-7890  {/* ← Change phone */}
  </a>
</li>
```

### Social Media Links

**File:** `src/components/Footer.tsx`

```jsx
<a 
  href="https://www.instagram.com/zyntiq_official?utm_source=qr&igsh=a3d3cGFtb3hudWpi"  {/* ← Change Instagram URL */}
  target="_blank" 
  rel="noopener noreferrer"
  className="w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center hover:bg-white transition-colors enhanced-shadow"
>
  <Instagram size={16} className="text-gray-700" />
</a>
```

### WhatsApp Integration

**File:** `src/components/WhatsAppFloat.tsx`

```javascript
const whatsappNumber = '+916291822142'; // ← Change WhatsApp number
const message = encodeURIComponent('Hi! I\'m interested in learning more about Zyntiq courses. Can you help me?'); // ← Change message
```

---

## 🔧 Technical Configuration

### Database Configuration

**File:** `src/lib/database.ts`

#### Demo User Accounts
```javascript
const demoUsers: (User & { password: string })[] = [
  {
    id: 'demo-user-1',
    email: 'demo@zyntiq.in',     // ← Change demo email
    first_name: 'Demo',
    last_name: 'User',
    phone: '9876543210',
    password: btoa('demo123' + 'zyntiq_salt'), // password: demo123
  }
  // Add more demo users...
];
```

### Google OAuth (Optional)

**File:** `src/lib/googleAuth.ts`

```javascript
private clientId = '752086458650-h6kga1ium8n5l8baaadjkfnmti2tsjb3.apps.googleusercontent.com'; // ← Replace with your Google Client ID
```

**To Enable Google Sign-In:**
1. Create a Google Cloud Project
2. Enable Google Sign-In API
3. Get your Client ID
4. Replace the `clientId` in the code above

### Environment Variables

**Create `.env` file in root directory:**
```env
# Razorpay Configuration
VITE_RAZORPAY_KEY_ID=your_razorpay_key_here

# Google OAuth (Optional)
VITE_GOOGLE_CLIENT_ID=your_google_client_id_here

# Supabase (If using real database)
VITE_SUPABASE_URL=your_supabase_url_here
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

---

## 📱 Mobile Optimization

### Responsive Breakpoints

**File:** `src/index.css`

```css
/* Mobile-first approach */
@media (max-width: 768px) {
  /* Mobile styles */
}

@media (max-width: 600px) {
  /* Small mobile styles */
}

@media (orientation: landscape) and (max-height: 600px) {
  /* Landscape mobile styles */
}
```

### Touch-Friendly Elements

All buttons and interactive elements have minimum 44px touch targets for mobile accessibility.

---

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

### Deployment Options

1. **Netlify** (Recommended)
   - Connect your GitHub repository
   - Auto-deploy on push
   - Custom domain support

2. **Vercel**
   - Similar to Netlify
   - Excellent React support

3. **Traditional Hosting**
   - Upload `dist/` folder contents
   - Configure server for SPA routing

### Environment Variables for Production

Make sure to set these in your hosting platform:
- `VITE_RAZORPAY_KEY_ID`
- `VITE_GOOGLE_CLIENT_ID` (if using Google OAuth)
- `VITE_SUPABASE_URL` (if using Supabase)
- `VITE_SUPABASE_ANON_KEY` (if using Supabase)

---

## 🎯 Quick Customization Checklist

### Essential Changes
- [ ] Replace logo (`public/Frame 3.png`)
- [ ] Update company name throughout the site
- [ ] Change contact information (email, phone, address)
- [ ] Update social media links
- [ ] Modify course content and pricing
- [ ] Add your payment gateway keys
- [ ] Update WhatsApp number

### Content Updates
- [ ] Hero section text and images
- [ ] Course descriptions and features
- [ ] Testimonials and reviews
- [ ] About page content
- [ ] Legal pages (Privacy Policy, Terms of Service)

### Technical Setup
- [ ] Configure payment gateway
- [ ] Set up analytics (Google Analytics, etc.)
- [ ] Configure email service for contact forms
- [ ] Set up domain and hosting
- [ ] Configure SSL certificate

---

## 📞 Support

If you need help with any customizations:

1. **Documentation:** Refer to this README
2. **Code Comments:** Check inline comments in the code
3. **Community:** React and Tailwind CSS communities
4. **Professional Help:** Consider hiring a React developer for complex customizations

---

## 🔄 Regular Maintenance

### Monthly Tasks
- [ ] Update course content
- [ ] Review and respond to contact form submissions
- [ ] Check payment gateway transactions
- [ ] Update testimonials
- [ ] Review website analytics

### Quarterly Tasks
- [ ] Update dependencies (`npm update`)
- [ ] Review and update pricing
- [ ] Add new courses or features
- [ ] Backup website data
- [ ] Performance optimization review

---

**Happy Customizing! 🚀**

Your Zyntiq platform is ready to be personalized. Start with the essential changes and gradually customize other aspects to match your brand and requirements.