import Database from 'better-sqlite3';
import path from 'path';

const dbPath = path.resolve(process.cwd(), 'database.sqlite');
const db = new Database(dbPath);

export const initDb = () => {
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
};

export default db;
