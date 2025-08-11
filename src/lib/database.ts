import { User, ContactMessage, Enrollment, Profile } from './supabase';
import { logError, logInfo, logDebug } from './logger';

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
      const { password, ...userWithoutPassword } = newUser;
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
      const { id } = JSON.parse(currentUserData);
      const users = this.getTable<User>('users');
      const user = users.find(u => u.id === id);
      return { user: user || null, error: null };
    } catch (error) {
      logError('Get current user error', error);
      return { user: null, error: 'Failed to get current user' };
    }
  }
  async signOut(): Promise<{ error: string | null }> {
    try {
      localStorage.removeItem('zyntiq_current_user');
      return { error: null };
    } catch (error) {
      logError('Sign out error', error);
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
      // Update user data
      users[userIndex] = {
        ...users[userIndex],
        ...profileData,
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
        ...messageData,
        created_at: new Date().toISOString()
      };
      messages.push(newMessage);
      this.setTable('contact_messages', messages);
      return { error: null };
    } catch (error) {
      logError('Insert contact message error', error);
      return { error: 'Failed to send message. Please try again.' };
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
      logDebug(`Found ${userEnrollments.length} enrollments for user ${userId}`);
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
      logError('Update progress error', error);
      return { error: 'Failed to update progress' };
    }
  }
  async hasPremiumPass(userId: string): Promise<{ hasPremium: boolean; error: string | null }> {
    try {
      const enrollments = this.getTable<Enrollment>('enrollments');
      const premiumEnrollment = enrollments.find(
        e => e.user_id === userId && e.enrollment_type === 'premium_pass'
      );
      return { hasPremium: !!premiumEnrollment, error: null };
    } catch (error) {
      logError('Check premium status error', error);
      return { hasPremium: false, error: 'Failed to check premium status' };
    }
  }
}
// Export the local database implementation
export const localDB = new LocalStorageDatabase();
// Initialize demo data for localStorage
const initializeDemoData = () => {
  const users = JSON.parse(localStorage.getItem('zyntiq_users') || '[]');
  const demoUserExists = users.find((user: User) => user.email === 'demo@zyntiq.in');
  if (!demoUserExists) {
    const demoUsers: (User & { password: string })[] = [
      {
        id: 'demo-user-1',
        email: 'demo@zyntiq.in',
        first_name: 'Demo',
        middle_name: '',
        last_name: 'User',
        phone: '9876543210',
        password: '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/HS.iK8e', // password: Demo123!
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: 'demo-user-2',
        email: 'john@zyntiq.in',
        first_name: 'John',
        middle_name: 'M',
        last_name: 'Doe',
        phone: '9876543211',
        password: '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/HS.iK8e', // password: Demo123!
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ];
    users.push(...demoUsers);
    localStorage.setItem('zyntiq_users', JSON.stringify(users));
    // Create demo enrollments for demo user
    const demoEnrollments: Enrollment[] = [
      {
        id: 'enrollment-1',
        user_id: 'demo-user-1',
        course_id: 'web-development',
        course_name: 'Web Development',
        payment_id: 'pay_demo_12345',
        enrollment_type: 'course',
        amount_paid: 599,
        enrolled_at: '2024-01-15T10:30:00Z',
        status: 'active',
        progress: 75
      },
      {
        id: 'enrollment-2',
        user_id: 'demo-user-1',
        course_id: 'ui-ux-design',
        course_name: 'UI/UX Design',
        payment_id: 'pay_demo_12346',
        enrollment_type: 'course',
        amount_paid: 599,
        enrolled_at: '2024-01-10T09:15:00Z',
        status: 'completed',
        progress: 100
      },
      {
        id: 'enrollment-3',
        user_id: 'demo-user-1',
        course_id: 'digital-marketing',
        course_name: 'Digital Marketing',
        payment_id: 'pay_demo_12347',
        enrollment_type: 'course',
        amount_paid: 599,
        enrolled_at: '2024-01-22T14:20:00Z',
        status: 'active',
        progress: 30
      }
    ];
    localStorage.setItem('zyntiq_enrollments', JSON.stringify(demoEnrollments));
  }
};
// Initialize demo data
initializeDemoData();
logInfo('Using local storage database with demo data');
logInfo('Demo accounts available');
