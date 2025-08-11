// Content delivery service for course materials
export interface CourseContent {
  id: string;
  courseId: string;
  type: 'video' | 'pdf' | 'quiz' | 'resource';
  title: string;
  description?: string;
  url: string;
  duration?: number; // for videos in seconds
  size?: number; // file size in bytes
  order: number;
  isLocked: boolean;
  prerequisites?: string[];
}

export interface VideoContent extends CourseContent {
  type: 'video';
  thumbnailUrl: string;
  quality: 'HD' | 'FHD' | '4K';
  subtitles?: string[];
  chapters?: VideoChapter[];
}

export interface VideoChapter {
  id: string;
  title: string;
  startTime: number;
  endTime: number;
}

export interface QuizContent extends CourseContent {
  type: 'quiz';
  questions: QuizQuestion[];
  passingScore: number;
  timeLimit?: number; // in minutes
  attempts: number;
}

export interface QuizQuestion {
  id: string;
  question: string;
  type: 'multiple-choice' | 'true-false' | 'fill-blank';
  options?: string[];
  correctAnswer: string | string[];
  explanation?: string;
  points: number;
}

class ContentService {
  private baseUrl: string;
  private apiKey: string;

  constructor() {
    // Configure based on your chosen provider
    this.baseUrl = import.meta.env.VITE_CONTENT_CDN_URL || 'https://your-cdn.com';
    this.apiKey = import.meta.env.VITE_CONTENT_API_KEY || '';
  }

  // Get course content structure
  async getCourseContent(courseId: string): Promise<CourseContent[]> {
    // Return demo content directly to avoid fetch errors with placeholder URL
    return this.getDemoContent(courseId);
  }

  // Get signed URL for secure content access
  async getSecureUrl(contentId: string, userId: string): Promise<string> {
    try {
      const response = await fetch(`${this.baseUrl}/api/content/${contentId}/access`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userId })
      });

      const data = await response.json();
      return data.signedUrl;
    } catch (error) {
      console.error('Error getting secure URL:', error);
      throw error;
    }
  }

  // Track video progress
  async updateVideoProgress(contentId: string, userId: string, progress: number): Promise<void> {
    try {
      await fetch(`${this.baseUrl}/api/progress/video`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          contentId,
          userId,
          progress,
          timestamp: new Date().toISOString()
        })
      });
    } catch (error) {
      console.error('Error updating video progress:', error);
    }
  }

  // Submit quiz answers
  async submitQuiz(quizId: string, userId: string, answers: Record<string, any>): Promise<{
    score: number;
    passed: boolean;
    feedback: string[];
  }> {
    try {
      const response = await fetch(`${this.baseUrl}/api/quiz/${quizId}/submit`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId,
          answers,
          submittedAt: new Date().toISOString()
        })
      });

      return await response.json();
    } catch (error) {
      console.error('Error submitting quiz:', error);
      throw error;
    }
  }

  // Demo content for development
  private getDemoContent(courseId: string): CourseContent[] {
    // ========================================
    // 🎥 VIDEO CONTENT MANAGEMENT
    // ========================================
    // To add your actual video content:
    // 1. Replace the 'url' field with your actual video URLs
    // 2. Update 'duration' with actual video length in seconds
    // 3. Add proper 'thumbnailUrl' for video previews
    // 4. For production, use CDN URLs like:
    //    - AWS CloudFront: https://d1234567890.cloudfront.net/videos/course1/intro.mp4
    //    - Vimeo: https://player.vimeo.com/video/123456789
    //    - YouTube: https://www.youtube.com/embed/VIDEO_ID
    //    - Bunny CDN: https://video-cdn.bunnycdn.com/videos/course1/intro.mp4
    
    const baseContent = [
      {
        id: `${courseId}-intro`,
        courseId,
        type: 'video' as const,
        title: 'Course Introduction',
        description: 'Welcome to the course! Learn what you\'ll achieve.',
        // 🎥 REPLACE THIS URL WITH YOUR ACTUAL VIDEO URL
        url: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
        // Example production URLs:
        // url: 'https://d1234567890.cloudfront.net/courses/web-dev/intro.mp4',
        // url: 'https://player.vimeo.com/video/123456789',
        // url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        duration: 300, // 🎥 UPDATE WITH ACTUAL VIDEO DURATION IN SECONDS
        order: 1,
        isLocked: false,
        // 🎥 REPLACE WITH ACTUAL THUMBNAIL URL
        thumbnailUrl: 'https://via.placeholder.com/640x360/6366f1/ffffff?text=Course+Intro'
        // Example: thumbnailUrl: 'https://d1234567890.cloudfront.net/thumbnails/intro.jpg'
      },
      {
        id: `${courseId}-lesson1`,
        courseId,
        type: 'video' as const,
        title: 'Lesson 1: Fundamentals',
        description: 'Core concepts and foundations',
        // 🎥 REPLACE THIS URL WITH YOUR ACTUAL VIDEO URL
        url: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_2mb.mp4',
        duration: 1200, // 🎥 UPDATE WITH ACTUAL VIDEO DURATION IN SECONDS
        order: 2,
        isLocked: false,
        // 🎥 REPLACE WITH ACTUAL THUMBNAIL URL
        thumbnailUrl: 'https://via.placeholder.com/640x360/8b5cf6/ffffff?text=Lesson+1'
      },

      // ========================================
      // 📝 QUIZ CONTENT MANAGEMENT
      // ========================================
      // To edit quiz content:
      // 1. Modify the 'questions' array below
      // 2. Update 'passingScore' (percentage needed to pass)
      // 3. Set 'timeLimit' in minutes (null for no time limit)
      // 4. Adjust 'attempts' (number of allowed attempts)
      {
        id: `${courseId}-quiz1`,
        courseId,
        type: 'quiz' as const,
        title: 'Quiz: Test Your Knowledge',
        description: 'Check your understanding of the fundamentals',
        url: '',
        order: 3,
        isLocked: false,
        // 📝 EDIT QUIZ QUESTIONS HERE
        questions: [
          {
            id: 'q1',
            question: 'What is the main purpose of this course?', // 📝 EDIT QUESTION TEXT
            type: 'multiple-choice', // 📝 OPTIONS: 'multiple-choice', 'true-false', 'fill-blank'
            options: [ // 📝 EDIT ANSWER OPTIONS (for multiple-choice)
              'To learn basic concepts',
              'To master advanced techniques',
              'To get certified',
              'All of the above'
            ],
            correctAnswer: 'All of the above', // 📝 SET CORRECT ANSWER
            explanation: 'This course covers all aspects from basics to certification.', // 📝 OPTIONAL EXPLANATION
            points: 10 // 📝 POINTS FOR THIS QUESTION
          },
          // 📝 ADD MORE QUESTIONS HERE:
          // {
          //   id: 'q2',
          //   question: 'True or False: HTML stands for HyperText Markup Language?',
          //   type: 'true-false',
          //   correctAnswer: 'True',
          //   explanation: 'HTML indeed stands for HyperText Markup Language.',
          //   points: 5
          // },
          // {
          //   id: 'q3',
          //   question: 'Fill in the blank: CSS stands for Cascading _____ Sheets.',
          //   type: 'fill-blank',
          //   correctAnswer: 'Style',
          //   explanation: 'CSS stands for Cascading Style Sheets.',
          //   points: 5
          // }
        ],
        passingScore: 70, // 📝 PERCENTAGE NEEDED TO PASS (0-100)
        timeLimit: null, // 📝 TIME LIMIT IN MINUTES (null for no limit)
        attempts: 3 // 📝 NUMBER OF ALLOWED ATTEMPTS
      } as QuizContent,

      // ========================================
      // 📄 PDF CONTENT MANAGEMENT
      // ========================================
      // To add your PDF files:
      // 1. Upload PDFs to your CDN/storage service
      // 2. Replace the 'url' field with your actual PDF URLs
      // 3. Update 'size' with actual file size in bytes
      // 4. For production, use CDN URLs like:
      //    - AWS S3: https://your-bucket.s3.amazonaws.com/pdfs/course-materials.pdf
      //    - Google Cloud: https://storage.googleapis.com/your-bucket/pdfs/materials.pdf
      //    - Azure Blob: https://youraccount.blob.core.windows.net/pdfs/materials.pdf
      {
        id: `${courseId}-resources`,
        courseId,
        type: 'pdf' as const,
        title: 'Course Resources & Materials',
        description: 'Downloadable PDFs, cheat sheets, and reference materials',
        // 📄 REPLACE THIS URL WITH YOUR ACTUAL PDF URL
        url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        // Example production URLs:
        // url: 'https://your-bucket.s3.amazonaws.com/courses/web-dev/materials.pdf',
        // url: 'https://storage.googleapis.com/your-bucket/courses/web-dev/cheatsheet.pdf',
        size: 2048000, // 📄 UPDATE WITH ACTUAL FILE SIZE IN BYTES
        order: 4,
        isLocked: false
      }

      // ========================================
      // 🔄 TO ADD MORE CONTENT:
      // ========================================
      // Copy one of the objects above and modify:
      // 1. Change the 'id' to be unique
      // 2. Update 'title' and 'description'
      // 3. Set the correct 'type' (video, pdf, quiz)
      // 4. Update 'url' with your content URL
      // 5. Adjust 'order' for proper sequencing
      // 6. Set 'isLocked' to true if it should be unlocked by prerequisites
      // 7. Add 'prerequisites' array if needed: ['previous-lesson-id']
      
      // Example additional video:
      // {
      //   id: `${courseId}-lesson2`,
      //   courseId,
      //   type: 'video' as const,
      //   title: 'Lesson 2: Advanced Concepts',
      //   description: 'Building on the fundamentals',
      //   url: 'https://your-cdn.com/videos/lesson2.mp4',
      //   duration: 1800,
      //   order: 5,
      //   isLocked: false,
      //   prerequisites: [`${courseId}-lesson1`], // Requires lesson 1 completion
      //   thumbnailUrl: 'https://your-cdn.com/thumbnails/lesson2.jpg'
      // }
    ];

    return baseContent;
  }

  // ========================================
  // 🛠️ CONTENT MANAGEMENT HELPERS
  // ========================================
  
  // Add this method to easily add new content
  addContent(courseId: string, content: Omit<CourseContent, 'id' | 'courseId'>): CourseContent {
    return {
      id: `${courseId}-${Date.now()}`,
      courseId,
      ...content
    };
  }

  // Add this method to validate video URLs
  async validateVideoUrl(url: string): Promise<boolean> {
    try {
      const response = await fetch(url, { method: 'HEAD' });
      return response.ok && response.headers.get('content-type')?.includes('video');
    } catch {
      return false;
    }
  }

  // Add this method to get video metadata
  async getVideoMetadata(url: string): Promise<{ duration: number; size: number } | null> {
    return new Promise((resolve) => {
      const video = document.createElement('video');
      video.onloadedmetadata = () => {
        resolve({
          duration: Math.round(video.duration),
          size: 0 // Size would need to be provided by your CDN/API
        });
      };
      video.onerror = () => resolve(null);
      video.src = url;
    });
  }
}

export const contentService = new ContentService();

// ========================================
// 📋 CONTENT MANAGEMENT CHECKLIST
// ========================================
/*
For each course, you need to:

1. 🎥 VIDEOS:
   - Upload videos to your CDN (AWS CloudFront, Bunny CDN, etc.)
   - Get the direct URLs or embed codes
   - Create thumbnail images (recommended: 640x360 or 1280x720)
   - Note the duration of each video
   - Update the video objects in getDemoContent()

2. 📄 PDFs:
   - Upload PDF files to your storage service
   - Get the direct download URLs
   - Note the file sizes
   - Update the PDF objects in getDemoContent()

3. 📝 QUIZZES:
   - Write your questions and answers
   - Set the passing score percentage
   - Decide on time limits (if any)
   - Set number of allowed attempts
   - Update the quiz objects in getDemoContent()

4. 🔒 CONTENT SECURITY:
   - For production, implement signed URLs for video/PDF access
   - Add user authentication checks
   - Implement content unlocking based on prerequisites
   - Add progress tracking to your database

5. 📊 ANALYTICS:
   - Track video watch time
   - Monitor quiz completion rates
   - Log content access patterns
   - Implement completion certificates

6. 🎨 CUSTOMIZATION:
   - Add course-specific branding
   - Customize player themes
   - Add interactive elements
   - Implement bookmarking/notes
*/