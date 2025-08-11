const { Pool } = require('pg');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

class Database {
  constructor() {
    this.connection = null;
    this.type = process.env.DATABASE_TYPE || 'sqlite';
  }

  async connect() {
    try {
      if (this.type === 'postgresql') {
        await this.connectPostgreSQL();
      } else {
        await this.connectSQLite();
      }
      
      console.log(`✅ Connected to ${this.type} database`);
      await this.initializeTables();
    } catch (error) {
      console.error('❌ Database connection failed:', error);
      throw error;
    }
  }

  async connectPostgreSQL() {
    this.connection = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
    });

    // Test the connection
    await this.connection.query('SELECT NOW()');
  }

  async connectSQLite() {
    const dbPath = path.join(__dirname, '../data/zyntiq.db');
    
    return new Promise((resolve, reject) => {
      this.connection = new sqlite3.Database(dbPath, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }

  async initializeTables() {
    if (this.type === 'postgresql') {
      await this.createPostgreSQLTables();
    } else {
      await this.createSQLiteTables();
    }
  }

  async createPostgreSQLTables() {
    const queries = [
      // Users table
      `CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        name VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )`,

      // Orders table
      `CREATE TABLE IF NOT EXISTS orders (
        id SERIAL PRIMARY KEY,
        razorpay_order_id VARCHAR(255) UNIQUE NOT NULL,
        user_id INTEGER REFERENCES users(id),
        amount INTEGER NOT NULL,
        currency VARCHAR(10) DEFAULT 'INR',
        receipt VARCHAR(255),
        status VARCHAR(50) DEFAULT 'created',
        notes JSONB,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )`,

      // Payments table
      `CREATE TABLE IF NOT EXISTS payments (
        id SERIAL PRIMARY KEY,
        razorpay_payment_id VARCHAR(255) UNIQUE NOT NULL,
        order_id INTEGER REFERENCES orders(id),
        user_id INTEGER REFERENCES users(id),
        amount INTEGER NOT NULL,
        currency VARCHAR(10) DEFAULT 'INR',
        status VARCHAR(50) NOT NULL,
        method VARCHAR(50),
        description TEXT,
        email VARCHAR(255),
        contact VARCHAR(20),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )`,

      // Enrollments table
      `CREATE TABLE IF NOT EXISTS enrollments (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        course_name VARCHAR(255) NOT NULL,
        status VARCHAR(50) DEFAULT 'active',
        enrolled_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        completed_at TIMESTAMP,
        progress INTEGER DEFAULT 0
      )`,

      // Contact messages table
      `CREATE TABLE IF NOT EXISTS contact_messages (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        message TEXT NOT NULL,
        status VARCHAR(50) DEFAULT 'unread',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )`
    ];

    for (const query of queries) {
      await this.connection.query(query);
    }
  }

  async createSQLiteTables() {
    const queries = [
      // Users table
      `CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        name TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`,

      // Orders table
      `CREATE TABLE IF NOT EXISTS orders (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        razorpay_order_id TEXT UNIQUE NOT NULL,
        user_id INTEGER,
        amount INTEGER NOT NULL,
        currency TEXT DEFAULT 'INR',
        receipt TEXT,
        status TEXT DEFAULT 'created',
        notes TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id)
      )`,

      // Payments table
      `CREATE TABLE IF NOT EXISTS payments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        razorpay_payment_id TEXT UNIQUE NOT NULL,
        order_id INTEGER,
        user_id INTEGER,
        amount INTEGER NOT NULL,
        currency TEXT DEFAULT 'INR',
        status TEXT NOT NULL,
        method TEXT,
        description TEXT,
        email TEXT,
        contact TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (order_id) REFERENCES orders (id),
        FOREIGN KEY (user_id) REFERENCES users (id)
      )`,

      // Enrollments table
      `CREATE TABLE IF NOT EXISTS enrollments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        course_name TEXT NOT NULL,
        status TEXT DEFAULT 'active',
        enrolled_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        completed_at DATETIME,
        progress INTEGER DEFAULT 0,
        FOREIGN KEY (user_id) REFERENCES users (id)
      )`,

      // Contact messages table
      `CREATE TABLE IF NOT EXISTS contact_messages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        message TEXT NOT NULL,
        status TEXT DEFAULT 'unread',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`
    ];

    for (const query of queries) {
      await this.runQuery(query);
    }
  }

  async query(sql, params = []) {
    if (this.type === 'postgresql') {
      const result = await this.connection.query(sql, params);
      return result.rows;
    } else {
      return this.runQuery(sql, params);
    }
  }

  async runQuery(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.connection.all(sql, params, (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }

  async run(sql, params = []) {
    if (this.type === 'postgresql') {
      const result = await this.connection.query(sql, params);
      return result;
    } else {
      return new Promise((resolve, reject) => {
        this.connection.run(sql, params, function(err) {
          if (err) {
            reject(err);
          } else {
            resolve({ lastID: this.lastID, changes: this.changes });
          }
        });
      });
    }
  }

  async close() {
    if (this.connection) {
      if (this.type === 'postgresql') {
        await this.connection.end();
      } else {
        this.connection.close();
      }
    }
  }
}

module.exports = new Database();