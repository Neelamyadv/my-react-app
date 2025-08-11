import { User, ContactMessage, Enrollment, Profile } from './supabase';

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
      console.error(`Error reading table ${tableName}:`, error);
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
      console.error(`Error saving table ${tableName}:`, error);
    }
  }

  // Hash password for storage (simple implementation for demo)
  private hashPassword(password: string): string {
    // In production, use proper password hashing like bcrypt
    return btoa(password + 'zyntiq_salt');
  }

  // Verify password
  private verifyPassword(password: string, hashedPassword: string): boolean {
    return this.hashPassword(password) === hashedPassword;
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
      
      // Check if user already exists
      const existingUser = users.find(user => user.email.toLowerCase() === userData.email.toLowerCase());
      if (existingUser) {
        return { user: null, error: 'An account with this email already exists' };
      }

      // Validate required fields
      if (!userData.email || !userData.password || !userData.first_name || !userData.last_name || !userData.phone) {
        return { user: null, error: 'All required fields must be filled' };
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(userData.email)) {
        return { user: null, error: 'Please enter a valid email address' };
      }

      // Validate password strength
      if (userData.password.length < 6) {
        return { user: null, error: 'Password must be at least 6 characters long' };
      }

      // Create new user with hashed password
      const newUser: User & { password: string } = {
        id: this.generateId(),
        email: userData.email.toLowerCase(),
        first_name: userData.first_name,
        middle_name: userData.middle_name || '',
        last_name: userData.last_name,
        phone: userData.phone,
        password: this.hashPassword(userData.password),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      users.push(newUser);
      this.setTable('users', users);

      // Return user without password
      const { password, ...userWithoutPassword } = newUser;
      return { user: userWithoutPassword, error: null };
    } catch (error) {
      console.error('Sign up error:', error);
      return { user: null, error: 'Failed to create account. Please try again.' };
    }
  }

  async signIn(email: string, password: string): Promise<{ user: User | null; error: string | null }> {
    try {
      const users = this.getTable<(User & { password: string })>('users');
      
      // Find user by email (case insensitive)
      const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());

      if (!user) {
        return { user: null, error: 'Invalid email or password' };
      }

      // Handle Google OAuth users
      if (password === 'google-oauth') {
        const { password: _, ...userWithoutPassword } = user;
        
        // Set current user session
        localStorage.setItem('zyntiq_current_user', JSON.stringify({
          id: user.id,
          email: user.email
        }));

        return { user: userWithoutPassword, error: null };
      }

      // Verify password for regular users
      if (!this.verifyPassword(password, user.password)) {
        return { user: null, error: 'Invalid email or password' };
      }

      // Set current user session
      localStorage.setItem('zyntiq_current_user', JSON.stringify({
        id: user.id,
        email: user.email
      }));

      // Return user without password
      const { password: _, ...userWithoutPassword } = user;
      return { user: userWithoutPassword, error: null };
    } catch (error) {
      console.error('Sign in error:', error);
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
      console.error('Get current user error:', error);
      return { user: null, error: 'Failed to get current user' };
    }
  }

  async signOut(): Promise<{ error: string | null }> {
    try {
      localStorage.removeItem('zyntiq_current_user');
      return { error: null };
    } catch (error) {
      console.error('Sign out error:', error);
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
      console.error('Get profile error:', error);
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
      console.error('Update profile error:', error);
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
      console.error('Insert contact message error:', error);
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

      console.log('Enrollment created and saved to localStorage:', newEnrollment);

      return { enrollment: newEnrollment, error: null };
    } catch (error) {
      console.error('Create enrollment error:', error);
      return { enrollment: null, error: 'Failed to create enrollment' };
    }
  }

  async getUserEnrollments(userId: string): Promise<{ enrollments: Enrollment[]; error: string | null }> {
    try {
      const enrollments = this.getTable<Enrollment>('enrollments');
      const userEnrollments = enrollments.filter(e => e.user_id === userId);

      console.log(`Found ${userEnrollments.length} enrollments for user ${userId}:`, userEnrollments);

      return { enrollments: userEnrollments, error: null };
    } catch (error) {
      console.error('Get user enrollments error:', error);
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
      console.error('Check enrollment error:', error);
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
      console.error('Update progress error:', error);
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
      console.error('Check premium status error:', error);
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
        password: btoa('demo123' + 'zyntiq_salt'), // password: demo123
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
        password: btoa('john123' + 'zyntiq_salt'), // password: john123
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

console.log('Using local storage database with demo data');
console.log('Demo accounts:');
console.log('1. Email: demo@zyntiq.in, Password: demo123');
console.log('2. Email: john@zyntiq.in, Password: john123');