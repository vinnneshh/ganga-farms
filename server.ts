import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import fs from 'fs';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import db, { initDb } from './db.ts';
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'ganga-farms-secret-key';
const PORT = 3000;

async function startServer() {
  console.log('Starting server...');
  try {
    initDb();
    console.log('Database initialized.');
  } catch (err) {
    console.error('Database initialization failed:', err);
  }

  const app = express();
  app.use(express.json());

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', time: new Date().toISOString() });
  });

  // Auth Middleware
  const authenticateToken = (req: any, res: any, next: any) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.sendStatus(401);

    jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
      if (err) return res.sendStatus(403);
      req.user = user;
      next();
    });
  };

  // API Routes
  app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    try {
      const user: any = db.prepare('SELECT * FROM admins WHERE username = ?').get(username);
      if (!user) return res.status(401).json({ error: 'Invalid credentials' });

      const validPassword = bcrypt.compareSync(password, user.password);
      if (!validPassword) return res.status(401).json({ error: 'Invalid credentials' });

      const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: '24h' });
      res.json({ token });
    } catch (err) {
      res.status(500).json({ error: 'Database error' });
    }
  });

  app.get('/api/bookings', authenticateToken, (req, res) => {
    try {
      const rows = db.prepare('SELECT * FROM bookings ORDER BY id DESC').all();
      res.json(rows);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post('/api/bookings', authenticateToken, (req, res) => {
    const b = req.body;
    const bookingId = b.bookingId || `GF-${Date.now().toString().slice(-6)}`;
    const bookingDate = new Date().toISOString().split('T')[0];
    
    try {
      const sql = `INSERT INTO bookings (
        bookingId, bookingDate, checkIn, checkOut, customerName, mobileNumber, 
        aadharNumber, address, eventDate, pax, eventType, rentalAmount, 
        amountReceived, paymentDate, paymentMethod, upiMethod, otherPaymentSource, balanceAmount, totalDue
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

      const info = db.prepare(sql).run(
        bookingId, bookingDate, b.checkIn, b.checkOut, b.customerName, b.mobileNumber,
        b.aadharNumber, b.address, b.eventDate, b.pax, b.eventType, b.rentalAmount,
        b.amountReceived, b.paymentDate, b.paymentMethod, b.upiMethod, b.otherPaymentSource, b.balanceAmount, b.totalDue
      );

      res.json({ id: info.lastInsertRowid, bookingId });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.put('/api/bookings/:id', authenticateToken, (req, res) => {
    const b = req.body;
    try {
      const sql = `UPDATE bookings SET 
        checkIn = ?, checkOut = ?, customerName = ?, mobileNumber = ?, 
        aadharNumber = ?, address = ?, eventDate = ?, pax = ?, eventType = ?, 
        rentalAmount = ?, amountReceived = ?, paymentDate = ?, paymentMethod = ?, 
        upiMethod = ?, otherPaymentSource = ?, balanceAmount = ?, totalDue = ?
        WHERE id = ?`;

      const info = db.prepare(sql).run(
        b.checkIn, b.checkOut, b.customerName, b.mobileNumber,
        b.aadharNumber, b.address, b.eventDate, b.pax, b.eventType, b.rentalAmount,
        b.amountReceived, b.paymentDate, b.paymentMethod, b.upiMethod, b.otherPaymentSource, b.balanceAmount, b.totalDue,
        req.params.id
      );

      res.json({ updated: info.changes });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.delete('/api/bookings/:id', authenticateToken, (req, res) => {
    try {
      const info = db.prepare('DELETE FROM bookings WHERE id = ?').run(req.params.id);
      res.json({ deleted: info.changes });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Vite middleware for development
  const isProd = process.env.NODE_ENV === 'production';
  const distExists = fs.existsSync(path.join(process.cwd(), 'dist'));

  if (!isProd || !distExists) {
    console.log('Using Vite middleware...');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    console.log('Serving static files from dist...');
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
