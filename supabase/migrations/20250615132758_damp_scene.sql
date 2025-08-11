/*
  # Create users and enrollments tables for upLern platform

  1. New Tables
    - `users`
      - `id` (uuid, primary key)
      - `email` (text, unique)
      - `first_name` (text)
      - `middle_name` (text)
      - `last_name` (text)
      - `phone` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `contact_messages`
      - `id` (uuid, primary key)
      - `name` (text)
      - `email` (text)
      - `phone` (text)
      - `message` (text)
      - `created_at` (timestamp)
    
    - `enrollments`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references users)
      - `course_id` (text)
      - `course_name` (text)
      - `payment_id` (text)
      - `enrollment_type` (text)
      - `amount_paid` (integer)
      - `enrolled_at` (timestamp)
      - `status` (text)
      - `progress` (integer)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
    - Add policies for public contact form
*/

-- Create users table (separate from auth.users for custom fields)
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  first_name text NOT NULL,
  middle_name text DEFAULT '',
  last_name text NOT NULL,
  phone text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create contact_messages table
CREATE TABLE IF NOT EXISTS contact_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  message text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create enrollments table
CREATE TABLE IF NOT EXISTS enrollments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  course_id text NOT NULL,
  course_name text NOT NULL,
  payment_id text NOT NULL,
  enrollment_type text NOT NULL CHECK (enrollment_type IN ('course', 'premium_pass')),
  amount_paid integer NOT NULL DEFAULT 0,
  enrolled_at timestamptz DEFAULT now(),
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed')),
  progress integer NOT NULL DEFAULT 0 CHECK (progress >= 0 AND progress <= 100)
);

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE enrollments ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can read own data"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid()::text = id::text);

CREATE POLICY "Users can update own data"
  ON users
  FOR UPDATE
  TO authenticated
  USING (auth.uid()::text = id::text)
  WITH CHECK (auth.uid()::text = id::text);

-- Contact messages policies (allow public insert)
CREATE POLICY "Anyone can insert contact messages"
  ON contact_messages
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Enrollments policies
CREATE POLICY "Users can read own enrollments"
  ON enrollments
  FOR SELECT
  TO authenticated
  USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can insert own enrollments"
  ON enrollments
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid()::text = user_id::text);

CREATE POLICY "Users can update own enrollments"
  ON enrollments
  FOR UPDATE
  TO authenticated
  USING (auth.uid()::text = user_id::text)
  WITH CHECK (auth.uid()::text = user_id::text);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_enrollments_user_id ON enrollments(user_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_course_id ON enrollments(course_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_type ON enrollments(enrollment_type);

-- Create updated_at trigger for users
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE OR REPLACE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insert demo data
INSERT INTO users (id, email, first_name, middle_name, last_name, phone) VALUES
  ('550e8400-e29b-41d4-a716-446655440001', 'demo@uplern.com', 'Demo', '', 'User', '9876543210'),
  ('550e8400-e29b-41d4-a716-446655440002', 'john@uplern.com', 'John', 'M', 'Doe', '9876543211')
ON CONFLICT (email) DO NOTHING;

-- Insert demo enrollments
INSERT INTO enrollments (user_id, course_id, course_name, payment_id, enrollment_type, amount_paid, enrolled_at, status, progress) VALUES
  ('550e8400-e29b-41d4-a716-446655440001', 'web-development', 'Web Development', 'pay_demo_12345', 'course', 599, '2024-01-15T10:30:00Z', 'active', 75),
  ('550e8400-e29b-41d4-a716-446655440001', 'ui-ux-design', 'UI/UX Design', 'pay_demo_12346', 'course', 599, '2024-01-10T09:15:00Z', 'completed', 100),
  ('550e8400-e29b-41d4-a716-446655440001', 'digital-marketing', 'Digital Marketing', 'pay_demo_12347', 'course', 599, '2024-01-22T14:20:00Z', 'active', 30)
ON CONFLICT DO NOTHING;