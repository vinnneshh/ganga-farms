import Database from 'better-sqlite3';
import bcrypt from 'bcryptjs';
import path from 'path';

const dbPath = path.resolve(process.cwd(), 'database.sqlite');
const db = new Database(dbPath);

export const initDb = () => {
  // Admin Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS admins (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE,
      password TEXT
    )
  `);

  // Bookings Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS bookings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      bookingId TEXT UNIQUE,
      bookingDate TEXT,
      checkIn TEXT,
      checkOut TEXT,
      customerName TEXT,
      mobileNumber TEXT,
      aadharNumber TEXT,
      address TEXT,
      eventDate TEXT,
      pax INTEGER,
      eventType TEXT,
      rentalAmount REAL,
      amountReceived REAL,
      paymentDate TEXT,
      paymentMethod TEXT,
      upiMethod TEXT,
      otherPaymentSource TEXT,
      balanceAmount REAL,
      securityDeposit REAL DEFAULT 10000,
      totalDue REAL
    )
  `);

  // Create default admin if not exists
  const defaultUser = 'admin';
  const defaultPass = 'ganga@admin';
  
  const row = db.prepare('SELECT * FROM admins WHERE username = ?').get(defaultUser);
  if (!row) {
    const hashedPassword = bcrypt.hashSync(defaultPass, 10);
    db.prepare('INSERT INTO admins (username, password) VALUES (?, ?)').run(defaultUser, hashedPassword);
    console.log('Default admin created: admin / ganga@admin');
  }
};

export default db;
