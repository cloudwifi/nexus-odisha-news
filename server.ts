import express from "express";
import { createServer as createViteServer } from "vite";
import Database from "better-sqlite3";
import path from "path";
import fs from "fs";
import multer from "multer";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = process.env.DATABASE_PATH || "nexus_news.db";
const db = new Database(dbPath);

// Ensure uploads directory exists
const uploadsDir = process.env.UPLOADS_DIR || path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

// Configure multer for file storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// Initialize database
db.exec(`
  CREATE TABLE IF NOT EXISTS news (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    image_url TEXT,
    is_breaking INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS videos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    youtube_url TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS reporters (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    joining_date TEXT NOT NULL,
    validity TEXT NOT NULL,
    area TEXT NOT NULL,
    image_url TEXT
  );

  CREATE TABLE IF NOT EXISTS admin (
    username TEXT PRIMARY KEY,
    password TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS analytics_visits (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS analytics_interactions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    type TEXT NOT NULL,
    target_id TEXT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

// Seed admin if not exists
const adminExists = db.prepare("SELECT * FROM admin WHERE username = ?").get("admin");
if (!adminExists) {
  db.prepare("INSERT INTO admin (username, password) VALUES (?, ?)").run("admin", "nexus123");
}

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.use(express.json());
  app.use("/uploads", express.static(uploadsDir));

  // API Routes
  app.post("/api/upload", (req, res, next) => {
    upload.single("image")(req, res, (err) => {
      if (err) {
        console.error("Multer error:", err);
        return res.status(500).json({ error: err.message });
      }
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }
      const imageUrl = `/uploads/${req.file.filename}`;
      res.json({ imageUrl });
    });
  });

  app.get("/api/news", (req, res) => {
    const news = db.prepare("SELECT * FROM news ORDER BY created_at DESC").all();
    res.json(news);
  });

  app.post("/api/news", (req, res) => {
    const { title, content, image_url, is_breaking } = req.body;
    const result = db.prepare("INSERT INTO news (title, content, image_url, is_breaking) VALUES (?, ?, ?, ?)").run(title, content, image_url, is_breaking ?? 0);
    res.json({ id: result.lastInsertRowid });
  });

  app.put("/api/news/:id", (req, res) => {
    const { title, content, image_url, is_breaking } = req.body;
    db.prepare("UPDATE news SET title = ?, content = ?, image_url = ?, is_breaking = ? WHERE id = ?").run(title, content, image_url, is_breaking ?? 0, req.params.id);
    res.json({ success: true });
  });

  app.delete("/api/news/:id", (req, res) => {
    console.log(`Deleting news with id: ${req.params.id}`);
    const result = db.prepare("DELETE FROM news WHERE id = ?").run(req.params.id);
    console.log(`Deletion result:`, result);
    res.json({ success: true, changes: result.changes });
  });

  app.get("/api/videos", (req, res) => {
    const videos = db.prepare("SELECT * FROM videos ORDER BY created_at DESC").all();
    res.json(videos);
  });

  app.post("/api/videos", (req, res) => {
    const { title, youtube_url } = req.body;
    const result = db.prepare("INSERT INTO videos (title, youtube_url) VALUES (?, ?)").run(title, youtube_url);
    res.json({ id: result.lastInsertRowid });
  });

  app.delete("/api/videos/:id", (req, res) => {
    console.log(`Deleting video with id: ${req.params.id}`);
    const result = db.prepare("DELETE FROM videos WHERE id = ?").run(req.params.id);
    console.log(`Deletion result:`, result);
    res.json({ success: true, changes: result.changes });
  });

  app.get("/api/reporters", (req, res) => {
    const reporters = db.prepare("SELECT * FROM reporters").all();
    res.json(reporters);
  });

  app.get("/api/reporters/:id", (req, res) => {
    const reporter = db.prepare("SELECT * FROM reporters WHERE id = ?").get(req.params.id);
    if (reporter) {
      res.json(reporter);
    } else {
      res.status(404).json({ error: "Reporter not found" });
    }
  });

  app.post("/api/reporters", (req, res) => {
    const { id, name, joining_date, validity, area, image_url } = req.body;
    db.prepare("INSERT INTO reporters (id, name, joining_date, validity, area, image_url) VALUES (?, ?, ?, ?, ?, ?)").run(id, name, joining_date, validity, area, image_url);
    res.json({ success: true });
  });

  app.put("/api/reporters/:id", (req, res) => {
    const { name, joining_date, validity, area, image_url } = req.body;
    db.prepare("UPDATE reporters SET name = ?, joining_date = ?, validity = ?, area = ?, image_url = ? WHERE id = ?").run(name, joining_date, validity, area, image_url, req.params.id);
    res.json({ success: true });
  });

  app.delete("/api/reporters/:id", (req, res) => {
    console.log(`Deleting reporter with id: ${req.params.id}`);
    const result = db.prepare("DELETE FROM reporters WHERE id = ?").run(req.params.id);
    console.log(`Deletion result:`, result);
    res.json({ success: true, changes: result.changes });
  });

  app.post("/api/login", (req, res) => {
    const { username, password } = req.body;
    const admin = db.prepare("SELECT * FROM admin WHERE username = ? AND password = ?").get(username, password);
    if (admin) {
      res.json({ success: true });
    } else {
      res.status(401).json({ error: "Invalid credentials" });
    }
  });

  app.post("/api/change-password", (req, res) => {
    const { username, oldPassword, newPassword } = req.body;
    const admin = db.prepare("SELECT * FROM admin WHERE username = ? AND password = ?").get(username, oldPassword);
    if (admin) {
      db.prepare("UPDATE admin SET password = ? WHERE username = ?").run(newPassword, username);
      res.json({ success: true });
    } else {
      res.status(401).json({ error: "Invalid old password" });
    }
  });

  app.post("/api/analytics/visit", (req, res) => {
    db.prepare("INSERT INTO analytics_visits DEFAULT VALUES").run();
    res.json({ success: true });
  });

  app.post("/api/analytics/interaction", (req, res) => {
    const { type, target_id } = req.body;
    db.prepare("INSERT INTO analytics_interactions (type, target_id) VALUES (?, ?)").run(type, target_id);
    res.json({ success: true });
  });

  app.get("/api/analytics/stats", (req, res) => {
    const totalVisits = db.prepare("SELECT COUNT(*) as count FROM analytics_visits").get() as any;
    const totalInteractions = db.prepare("SELECT COUNT(*) as count FROM analytics_interactions").get() as any;
    
    // Visits by day (last 7 days)
    const visitsByDay = db.prepare(`
      SELECT date(timestamp) as date, COUNT(*) as count 
      FROM analytics_visits 
      WHERE timestamp >= date('now', '-7 days')
      GROUP BY date(timestamp)
      ORDER BY date ASC
    `).all();

    // Top interactions by type
    const interactionsByType = db.prepare(`
      SELECT type, COUNT(*) as count 
      FROM analytics_interactions 
      GROUP BY type
    `).all();

    // Top news views
    const topNews = db.prepare(`
      SELECT n.title, COUNT(i.id) as views
      FROM news n
      JOIN analytics_interactions i ON n.id = i.target_id
      WHERE i.type = 'news_view'
      GROUP BY n.id
      ORDER BY views DESC
      LIMIT 5
    `).all();

    res.json({
      totalVisits: totalVisits.count,
      totalInteractions: totalInteractions.count,
      visitsByDay,
      interactionsByType,
      topNews
    });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  // Global Error Handler
  app.use((err: any, req: any, res: any, next: any) => {
    console.error("Server Error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  });

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
