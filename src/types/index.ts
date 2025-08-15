import React, { ComponentType } from 'react';

// Core user types
export interface User {
  id: string;
  email: string;
  first_name: string;
  middle_name?: string;
  last_name: string;
  phone: string;
}

// Course types
export interface Course {
  id: string;
  title: string;
  description: string;
  price: number;
  duration: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  category: string;
  image: string;
  content?: CourseContent[];
}

export interface CourseContent {
  id: string;
  title: string;
  type: 'video' | 'text' | 'quiz';
  duration?: number;
  content?: string;
  videoUrl?: string;
  questions?: QuizQuestion[];
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
}

// Enrollment types
export interface Enrollment {
  id: string;
  user_id: string;
  course_name: string;
  payment_id: string;
  amount_paid: number;
  enrolled_at: string;
  enrollment_type: string;
  progress: number;
  status: string;
}

export interface Certificate {
  id: string;
  userId: string;
  courseId: string;
  issuedAt: string;
  certificateUrl: string;
}

// Payment types
export interface PaymentResponse {
  success: boolean;
  transactionId?: string;
  error?: string;
  amount?: number;
  currency?: string;
}

export interface PaymentOptions {
  amount: number;
  currency: string;
  description: string;
  customerEmail: string;
  customerName: string;
}

// Training types
export interface TrainingData {
  name: string;
  email: string;
  phone: string;
  course: string;
  amount: number;
}

// Value Certificate types
export interface Topic {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  questions: QuizQuestion[];
}

export interface VideoPlayerState {
  playing: boolean;
  progress: number;
  duration: number;
}

// Admin types
export interface AdminStats {
  totalUsers: number;
  totalEnrollments: number;
  totalRevenue: number;
  activeCourses: number;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  created_at: string;
}

// Component prop types
export interface LazyLoaderProps {
  component: () => Promise<{ default: ComponentType<unknown> }>;
  fallback?: React.ReactNode;
}

export interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  paymentOptions: PaymentOptions;
  onSuccess?: (paymentResponse: PaymentResponse) => void;
  onError?: (error: string) => void;
}

export interface CertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  certificate: Certificate;
  studentName: string;
  courseName: string;
}