import { User, ContactMessage, Enrollment, Profile } from './supabase';
import { logError, logInfo } from './logger';

// Browser-compatible password hashing (for demo purposes only)
const hashPassword = async (password: string): Promise<string> => {
  // Use Web Crypto API for browser-compatible hashing
  const encoder = new TextEncoder();
  const data = encoder.encode(password + 'zyntiq_salt_2024');
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
};

const verifyPassword = async (password: string, hashedPassword: string): Promise<boolean> => {
  const newHash = await hashPassword(password);
  return newHash === hashedPassword;
};

// Local storage database implementation
class LocalStorageDatabase {
  private getStorageKey(table: string): string {
    return `zyntiq_${table}`;
  }
  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
  private getTable<T>(tableName: string): T[] {
    try {
      const data = localStorage.getItem(this.getStorageKey(tableName));
      return data ? JSON.parse(data) : [];
    } catch (error) {
      logError(`Error reading table ${tableName}`, error);
      return [];
    }
  }
  private setTable<T>(tableName: string, data: T[]): void {
    try {
      localStorage.setItem(this.getStorageKey(tableName), JSON.stringify(data));
      // Trigger storage event for cross-tab communication
      window.dispatchEvent(new StorageEvent('storage', {
        key: this.getStorageKey(tableName),
        newValue: JSON.stringify(data),
        storageArea: localStorage
      }));
    } catch (error) {
      logError(`Error saving table ${tableName}`, error);
    }
  }
  // Validate password strength
  private validatePasswordStrength(password: string): { isValid: boolean; error?: string } {
    if (password.length < 8) {
      return { isValid: false, error: 'Password must be at least 8 characters long' };
    }
    if (!/(?=.*[a-z])/.test(password)) {
      return { isValid: false, error: 'Password must contain at least one lowercase letter' };
    }
    if (!/(?=.*[A-Z])/.test(password)) {
      return { isValid: false, error: 'Password must contain at least one uppercase letter' };
    }
    if (!/(?=.*\d)/.test(password)) {
      return { isValid: false, error: 'Password must contain at least one number' };
    }
    if (!/(?=.*[@$!%*?&])/.test(password)) {
      return { isValid: false, error: 'Password must contain at least one special character (@$!%*?&)' };
    }
    return { isValid: true };
  }
  // Validate email format
  private validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
  // Sanitize user input
  private sanitizeInput(input: string): string {
    return input.trim().replace(/[<>]/g, '');
  }
  async signUp(userData: {
    email: string;
    password: string;
    first_name: string;
    middle_name?: string;
    last_name: string;
    phone: string;
  }): Promise<{ user: User | null; error: string | null }> {
    try {
      const users = this.getTable<(User & { password: string })>('users');
      // Sanitize inputs
      const sanitizedData = {
        email: this.sanitizeInput(userData.email).toLowerCase(),
        password: userData.password,
        first_name: this.sanitizeInput(userData.first_name),
        middle_name: userData.middle_name ? this.sanitizeInput(userData.middle_name) : '',
        last_name: this.sanitizeInput(userData.last_name),
        phone: this.sanitizeInput(userData.phone)
      };
      // Check if user already exists
      const existingUser = users.find(user => user.email === sanitizedData.email);
      if (existingUser) {
        return { user: null, error: 'An account with this email already exists' };
      }
      // Validate required fields
      if (!sanitizedData.email || !sanitizedData.password || !sanitizedData.first_name || !sanitizedData.last_name || !sanitizedData.phone) {
        return { user: null, error: 'All required fields must be filled' };
      }
      // Validate email format
      if (!this.validateEmail(sanitizedData.email)) {
        return { user: null, error: 'Please enter a valid email address' };
      }
      // Validate password strength
      const passwordValidation = this.validatePasswordStrength(sanitizedData.password);
      if (!passwordValidation.isValid) {
        return { user: null, error: passwordValidation.error! };
      }
      // Hash password
      const hashedPassword = await hashPassword(sanitizedData.password);
      // Create new user
      const newUser: User & { password: string } = {
        id: this.generateId(),
        email: sanitizedData.email,
        password: hashedPassword,
        first_name: sanitizedData.first_name,
        middle_name: sanitizedData.middle_name,
        last_name: sanitizedData.last_name,
        phone: sanitizedData.phone,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      // Save user
      users.push(newUser);
      this.setTable('users', users);
      // Remove password from returned user object
      const { password: _, ...userWithoutPassword } = newUser;
      logInfo('User registered successfully', { email: sanitizedData.email });
      return { user: userWithoutPassword, error: null };
    } catch (error) {
      logError('Error during sign up', error);
      return { user: null, error: 'Failed to create account. Please try again.' };
    }
  }
  async signIn(email: string, password: string): Promise<{ user: User | null; error: string | null }> {
    try {
      const users = this.getTable<(User & { password: string })>('users');
      const sanitizedEmail = this.sanitizeInput(email).toLowerCase();
      // Find user
      const user = users.find(u => u.email === sanitizedEmail);
      if (!user) {
        return { user: null, error: 'Invalid email or password' };
      }
      // Verify password
      const isValidPassword = await verifyPassword(password, user.password);
      if (!isValidPassword) {
        return { user: null, error: 'Invalid email or password' };
      }
      // Remove password from returned user object
      const { password: _, ...userWithoutPassword } = user;
      logInfo('User signed in successfully', { email: sanitizedEmail });
      return { user: userWithoutPassword, error: null };
    } catch (error) {
      logError('Error during sign in', error);
      return { user: null, error: 'Failed to sign in. Please try again.' };
    }
  }
  async getCurrentUser(): Promise<{ user: User | null; error: string | null }> {
    try {
      const currentUserData = localStorage.getItem('zyntiq_current_user');
      if (!currentUserData) {
        return { user: null, error: null };
      }
      const currentUser = JSON.parse(currentUserData);
      const users = this.getTable<User>('users');
      const user = users.find(u => u.id === currentUser.id);
      return { user: user || null, error: null };
    } catch (error) {
      logError('Error getting current user', error);
      return { user: null, error: 'Failed to get current user' };
    }
  }
  async signOut(): Promise<{ error: string | null }> {
    try {
      localStorage.removeItem('zyntiq_current_user');
      return { error: null };
    } catch (error) {
      logError('Error during sign out', error);
      return { error: 'Failed to sign out' };
    }
  }
  async getProfile(userId: string): Promise<{ data: Profile | null; error: string | null }> {
    try {
      const users = this.getTable<User>('users');
      const user = users.find(u => u.id === userId);
      if (!user) {
        return { data: null, error: 'User not found' };
      }
      const profile: Profile = {
        id: user.id,
        first_name: user.first_name,
        middle_name: user.middle_name,
        last_name: user.last_name,
        email: user.email,
        phone: user.phone
      };
      return { data: profile, error: null };
    } catch (error) {
      logError('Get profile error', error);
      return { data: null, error: 'Failed to get profile' };
    }
  }
  async updateProfile(userId: string, profileData: Partial<Profile>): Promise<{ error: string | null }> {
    try {
      const users = this.getTable<User>('users');
      const userIndex = users.findIndex(u => u.id === userId);
      if (userIndex === -1) {
        return { error: 'User not found' };
      }
      // Update user data (only update Profile-compatible fields)
      const { first_name, middle_name, last_name, phone } = profileData;
      users[userIndex] = {
        ...users[userIndex],
        ...(first_name && { first_name }),
        ...(middle_name !== undefined && { middle_name }),
        ...(last_name && { last_name }),
        ...(phone && { phone }),
        updated_at: new Date().toISOString()
      };
      this.setTable('users', users);
      return { error: null };
    } catch (error) {
      logError('Update profile error', error);
      return { error: 'Failed to update profile' };
    }
  }
  async insertContactMessage(messageData: {
    name: string;
    email: string;
    phone: string;
    message: string;
  }): Promise<{ error: string | null }> {
    try {
      const messages = this.getTable<ContactMessage>('contact_messages');
      const newMessage: ContactMessage = {
        id: this.generateId(),
        name: this.sanitizeInput(messageData.name),
        email: this.sanitizeInput(messageData.email).toLowerCase(),
        phone: this.sanitizeInput(messageData.phone),
        message: this.sanitizeInput(messageData.message),
        created_at: new Date().toISOString()
      };
      messages.push(newMessage);
      this.setTable('contact_messages', messages);
      logInfo('Contact message inserted', { email: newMessage.email });
      return { error: null };
    } catch (error) {
      logError('Error inserting contact message', error);
      return { error: 'Failed to send message' };
    }
  }
  async createEnrollment(enrollmentData: {
    user_id: string;
    course_id: string;
    course_name: string;
    payment_id: string;
    enrollment_type: 'course' | 'premium_pass';
    amount_paid: number;
  }): Promise<{ enrollment: Enrollment | null; error: string | null }> {
    try {
      const enrollments = this.getTable<Enrollment>('enrollments');
      // Check if user is already enrolled in this course
      const existingEnrollment = enrollments.find(
        e => e.user_id === enrollmentData.user_id && e.course_id === enrollmentData.course_id
      );
      if (existingEnrollment) {
        return { enrollment: existingEnrollment, error: null };
      }
      const newEnrollment: Enrollment = {
        id: this.generateId(),
        ...enrollmentData,
        enrolled_at: new Date().toISOString(),
        status: 'active',
        progress: 0
      };
      enrollments.push(newEnrollment);
      this.setTable('enrollments', enrollments);
      logInfo('Enrollment created and saved to localStorage', { enrollmentId: newEnrollment.id });
      return { enrollment: newEnrollment, error: null };
    } catch (error) {
      logError('Create enrollment error', error);
      return { enrollment: null, error: 'Failed to create enrollment' };
    }
  }
  async getUserEnrollments(userId: string): Promise<{ enrollments: Enrollment[]; error: string | null }> {
    try {
      const enrollments = this.getTable<Enrollment>('enrollments');
      const userEnrollments = enrollments.filter(e => e.user_id === userId);
      logInfo(`Found ${userEnrollments.length} enrollments for user ${userId}`);
      return { enrollments: userEnrollments, error: null };
    } catch (error) {
      logError('Get user enrollments error', error);
      return { enrollments: [], error: 'Failed to get enrollments' };
    }
  }
  async isUserEnrolledInCourse(userId: string, courseId: string): Promise<{ enrolled: boolean; enrollment?: Enrollment; error: string | null }> {
    try {
      const enrollments = this.getTable<Enrollment>('enrollments');
      const enrollment = enrollments.find(
        e => e.user_id === userId && (e.course_id === courseId || e.enrollment_type === 'premium_pass')
      );
      return { 
        enrolled: !!enrollment, 
        enrollment: enrollment || undefined, 
        error: null 
      };
    } catch (error) {
      logError('Check enrollment error', error);
      return { enrolled: false, error: 'Failed to check enrollment' };
    }
  }
  async updateEnrollmentProgress(enrollmentId: string, progress: number): Promise<{ error: string | null }> {
    try {
      const enrollments = this.getTable<Enrollment>('enrollments');
      const enrollmentIndex = enrollments.findIndex(e => e.id === enrollmentId);
      if (enrollmentIndex === -1) {
        return { error: 'Enrollment not found' };
      }
      enrollments[enrollmentIndex].progress = Math.min(100, Math.max(0, progress));
      if (enrollments[enrollmentIndex].progress === 100) {
        enrollments[enrollmentIndex].status = 'completed';
      }
      this.setTable('enrollments', enrollments);
      return { error: null };
    } catch (error) {
      logError('Update enrollment progress error', error);
      return { error: 'Failed to update progress' };
    }
  }
  async hasPremiumPass(userId: string): Promise<{ hasPremium: boolean; error: string | null }> {
    try {
      const enrollments = this.getTable<Enrollment>('enrollments');
      const premiumEnrollment = enrollments.find(e => 
        e.user_id === userId && 
        e.enrollment_type === 'premium_pass' && 
        e.status === 'active'
      );
      return { hasPremium: !!premiumEnrollment, error: null };
    } catch (error) {
      logError('Check premium pass error', error);
      return { hasPremium: false, error: 'Failed to check premium status' };
    }
  }
}

// Initialize demo data
const initializeDemoData = () => {
  try {
    // Check if demo data already exists
    const existingUsers = localStorage.getItem('zyntiq_users');
    if (existingUsers) {
      return; // Demo data already exists
    }
    // Create demo users
    const demoUsers: (User & { password: string })[] = [
      {
        id: 'demo_user_1',
        email: 'demo@example.com',
        password: '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8', // "password" hashed
        first_name: 'Demo',
        middle_name: '',
        last_name: 'User',
        phone: '+1234567890',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ];
    localStorage.setItem('zyntiq_users', JSON.stringify(demoUsers));
    logInfo('Demo data initialized');
  } catch (error) {
    logError('Error initializing demo data', error);
  }
};

// Initialize demo data on module load
initializeDemoData();

// Export database instance
export const localDB = new LocalStorageDatabase();