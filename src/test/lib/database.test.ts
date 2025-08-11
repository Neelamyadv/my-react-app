import { describe, it, expect, beforeEach, vi } from 'vitest';
import { localDB } from '../../lib/database';
import bcrypt from 'bcryptjs';

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

describe('LocalStorageDatabase', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorageMock.getItem.mockReturnValue('[]');
  });

  describe('signUp', () => {
    it('should create a new user with hashed password', async () => {
      const userData = {
        email: 'test@example.com',
        password: 'TestPass123!',
        first_name: 'Test',
        last_name: 'User',
        phone: '1234567890'
      };

      const result = await localDB.signUp(userData);

      expect(result.error).toBeNull();
      expect(result.user).toBeDefined();
      expect(result.user?.email).toBe('test@example.com');
      expect(result.user?.first_name).toBe('Test');
      expect(result.user?.last_name).toBe('User');
      expect(result.user?.phone).toBe('1234567890');
    });

    it('should reject weak passwords', async () => {
      const userData = {
        email: 'test@example.com',
        password: 'weak',
        first_name: 'Test',
        last_name: 'User',
        phone: '1234567890'
      };

      const result = await localDB.signUp(userData);

      expect(result.error).toContain('Password must be at least 8 characters long');
      expect(result.user).toBeNull();
    });

    it('should reject invalid email formats', async () => {
      const userData = {
        email: 'invalid-email',
        password: 'TestPass123!',
        first_name: 'Test',
        last_name: 'User',
        phone: '1234567890'
      };

      const result = await localDB.signUp(userData);

      expect(result.error).toContain('Please enter a valid email address');
      expect(result.user).toBeNull();
    });

    it('should reject duplicate emails', async () => {
      const userData = {
        email: 'test@example.com',
        password: 'TestPass123!',
        first_name: 'Test',
        last_name: 'User',
        phone: '1234567890'
      };

      // Mock existing user
      localStorageMock.getItem.mockReturnValue(JSON.stringify([{
        id: 'existing-user',
        email: 'test@example.com',
        first_name: 'Existing',
        last_name: 'User',
        phone: '1234567890',
        password: 'hashedpassword',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }]));

      const result = await localDB.signUp(userData);

      expect(result.error).toContain('An account with this email already exists');
      expect(result.user).toBeNull();
    });
  });

  describe('signIn', () => {
    it('should authenticate user with correct credentials', async () => {
      const hashedPassword = await bcrypt.hash('TestPass123!', 12);
      
      localStorageMock.getItem.mockReturnValue(JSON.stringify([{
        id: 'test-user',
        email: 'test@example.com',
        first_name: 'Test',
        last_name: 'User',
        phone: '1234567890',
        password: hashedPassword,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }]));

      const result = await localDB.signIn('test@example.com', 'TestPass123!');

      expect(result.error).toBeNull();
      expect(result.user).toBeDefined();
      expect(result.user?.email).toBe('test@example.com');
    });

    it('should reject incorrect password', async () => {
      const hashedPassword = await bcrypt.hash('TestPass123!', 12);
      
      localStorageMock.getItem.mockReturnValue(JSON.stringify([{
        id: 'test-user',
        email: 'test@example.com',
        first_name: 'Test',
        last_name: 'User',
        phone: '1234567890',
        password: hashedPassword,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }]));

      const result = await localDB.signIn('test@example.com', 'WrongPassword123!');

      expect(result.error).toContain('Invalid email or password');
      expect(result.user).toBeNull();
    });

    it('should reject non-existent user', async () => {
      localStorageMock.getItem.mockReturnValue('[]');

      const result = await localDB.signIn('nonexistent@example.com', 'TestPass123!');

      expect(result.error).toContain('Invalid email or password');
      expect(result.user).toBeNull();
    });
  });

  describe('input sanitization', () => {
    it('should sanitize user inputs', async () => {
      const userData = {
        email: '  test@example.com  ',
        password: 'TestPass123!',
        first_name: '<script>alert("xss")</script>Test',
        last_name: 'User<script>',
        phone: '1234567890'
      };

      const result = await localDB.signUp(userData);

      expect(result.error).toBeNull();
      expect(result.user?.email).toBe('test@example.com');
      expect(result.user?.first_name).toBe('script>alert("xss")script>Test');
      expect(result.user?.last_name).toBe('Userscript>');
    });
  });
});