import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import express from "express";
import cors from "cors";
import pool from "./config/db.js";
import Routes from "./routes/routes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, ".env") });

const app = express();

// ✅ CORS setup
// const allowedOrigins = [
//   "https://full-stack-home-solar.vercel",
//   "http://localhost:5173",
//   "http://localhost:5174",
//   "http://127.0.0.1:5173",
//   "http://localhost:3000",
//   "http://127.0.0.1:3000",
//   "file://", // Allow file:// protocol for local development
// ];

// app.use(cors({
//   origin: (origin, callback) => {
//     // Allow requests with no origin (like mobile apps or curl requests)
//     if (!origin) return callback(null, true);
    
//     // Check if origin is in allowed list
//     if (allowedOrigins.includes(origin)) {
//       return callback(null, true);
//     }
    
//     // Allow file:// protocol for local development
//     if (origin.startsWith('file://')) {
//       return callback(null, true);
//     }
    
//     // For development, allow all localhost origins
//     if (origin.includes('localhost') || origin.includes('127.0.0.1')) {
//       return callback(null, true);
//     }
    
//     callback(new Error("Not allowed by CORS"));
//   },
//   credentials: true,
//   methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
//   allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
// }));

app.use(cors({
  origin: "*"
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files
app.use('/uploads', express.static('uploads'));

// Function to setup database tables
const setupDatabaseTables = async () => {
  try {
    console.log("Setting up database tables...");
    
    // Create service_types table
    const createServiceTypesTable = `
      CREATE TABLE IF NOT EXISTS service_types (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL UNIQUE,
        description TEXT,
        status ENUM('active', 'inactive') DEFAULT 'active',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `;
    
    await pool.execute(createServiceTypesTable);
    console.log("✅ service_types table ready");

    // Check and add image columns if they don't exist
    try {
      await pool.execute("ALTER TABLE service_types ADD COLUMN image LONGBLOB");
      console.log("✅ Added image column to service_types");
    } catch (error) {
      if (error.code === 'ER_DUP_FIELDNAME') {
        console.log("⏭️  image column already exists in service_types");
      } else {
        console.error("❌ Error adding image column:", error.message);
      }
    }

    try {
      await pool.execute("ALTER TABLE service_types ADD COLUMN image_mime VARCHAR(100)");
      console.log("✅ Added image_mime column to service_types");
    } catch (error) {
      if (error.code === 'ER_DUP_FIELDNAME') {
        console.log("⏭️  image_mime column already exists in service_types");
      } else {
        console.error("❌ Error adding image_mime column:", error.message);
      }
    }

    try {
      await pool.execute("ALTER TABLE service_types ADD COLUMN image_name VARCHAR(255)");
      console.log("✅ Added image_name column to service_types");
    } catch (error) {
      if (error.code === 'ER_DUP_FIELDNAME') {
        console.log("⏭️  image_name column already exists in service_types");
      } else {
        console.error("❌ Error adding image_name column:", error.message);
      }
    }

    // Create services table if it doesn't exist
    const createServicesTable = `
      CREATE TABLE IF NOT EXISTS services (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        location VARCHAR(255),
        service_type_id INT,
        status ENUM('active', 'inactive') DEFAULT 'active',
        image_url VARCHAR(500),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (service_type_id) REFERENCES service_types(id) ON DELETE SET NULL
      )
    `;
    
    await pool.execute(createServicesTable);
    console.log("✅ services table ready");

    // Create centers table if it doesn't exist
    const createCentersTable = `
      CREATE TABLE IF NOT EXISTS centers (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        location VARCHAR(255),
        service_type_id INT,
        status ENUM('active','inactive') DEFAULT 'active',
        image LONGBLOB,
        image_mime VARCHAR(100),
        image_name VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (service_type_id) REFERENCES service_types(id) ON DELETE SET NULL
      )
    `;
    await pool.execute(createCentersTable);
    console.log("✅ centers table ready");

    // Ensure centers.service_type_name column exists for compatibility with controllers
    try {
      await pool.execute("ALTER TABLE centers ADD COLUMN service_type_name VARCHAR(255)");
      console.log("✅ Added service_type_name column to centers");
    } catch (error) {
      if (error.code === 'ER_DUP_FIELDNAME') {
        console.log("⏭️  service_type_name column already exists in centers");
      } else {
        console.error("❌ Error adding service_type_name column:", error.message);
      }
    }

    // Add phone_number column to centers table
    try {
      await pool.execute("ALTER TABLE centers ADD COLUMN phone_number VARCHAR(15)");
      console.log("✅ Added phone_number column to centers");
    } catch (error) {
      if (error.code === 'ER_DUP_FIELDNAME') {
        console.log("⏭️  phone_number column already exists in centers");
      } else {
        console.error("❌ Error adding phone_number column:", error.message);
      }
    }

    // Create center_galleries table if it doesn't exist
    const createCenterGalleriesTable = `
      CREATE TABLE IF NOT EXISTS center_galleries (
        id INT AUTO_INCREMENT PRIMARY KEY,
        center_id INT NOT NULL,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        status ENUM('active','inactive') DEFAULT 'active',
        image LONGBLOB,
        image_mime VARCHAR(100),
        image_name VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (center_id) REFERENCES centers(id) ON DELETE CASCADE
      )
    `;
    await pool.execute(createCenterGalleriesTable);
    console.log("✅ center_galleries table ready");

    // Add center_name column to center_galleries table
    try {
      await pool.execute("ALTER TABLE center_galleries ADD COLUMN center_name VARCHAR(255)");
      console.log("✅ Added center_name column to center_galleries");
    } catch (error) {
      if (error.code === 'ER_DUP_FIELDNAME') {
        console.log("⏭️  center_name column already exists in center_galleries");
      } else {
        console.error("❌ Error adding center_name column to center_galleries:", error.message);
      }
    }

    // Create gallery_items table if it doesn't exist
    const createGalleryItemsTable = `
      CREATE TABLE IF NOT EXISTS gallery_items (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        location VARCHAR(255),
        service_type_id INT,
        service_type_name VARCHAR(255),
        image LONGBLOB,
        image_mime VARCHAR(100),
        image_name VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (service_type_id) REFERENCES service_types(id) ON DELETE SET NULL
      )
    `;

          await pool.execute(createGalleryItemsTable);
      console.log("✅ gallery_items table ready");

      // Add service_type_name column if it doesn't exist
      try {
        await pool.execute("ALTER TABLE gallery_items ADD COLUMN service_type_name VARCHAR(255)");
        console.log("✅ Added service_type_name column to gallery_items");
      } catch (error) {
        if (error.code === 'ER_DUP_FIELDNAME') {
          console.log("⏭️  service_type_name column already exists in gallery_items");
        } else {
          console.error("❌ Error adding service_type_name column:", error.message);
        }
      }

    // Create testimonials table if it doesn't exist
    const createTestimonialsTable = `
      CREATE TABLE IF NOT EXISTS testimonials (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        profession VARCHAR(255) NOT NULL,
        text TEXT NOT NULL,
        image LONGBLOB,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `;
          await pool.execute(createTestimonialsTable);
      console.log("✅ testimonials table ready");
      
      // Create announcements table if it doesn't exist
      const createAnnouncementsTable = `
        CREATE TABLE IF NOT EXISTS announcements (
          id INT AUTO_INCREMENT PRIMARY KEY,
          title VARCHAR(255) NOT NULL,
          content TEXT NOT NULL,
          details TEXT,
          category VARCHAR(100) NOT NULL,
          priority ENUM('high', 'medium', 'low') DEFAULT 'medium',
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        )
      `;
      await pool.execute(createAnnouncementsTable);
      console.log("✅ announcements table ready");

      // Ensure required columns exist on older databases
      try {
        await pool.execute("ALTER TABLE announcements ADD COLUMN content TEXT");
        console.log("✅ Added content column to announcements");
      } catch (error) {
        if (error.code === 'ER_DUP_FIELDNAME') {
          console.log("⏭️  content column already exists in announcements");
        } else {
          console.error("❌ Error adding content column to announcements:", error.message);
        }
      }

      try {
        await pool.execute("ALTER TABLE announcements ADD COLUMN details TEXT");
        console.log("✅ Added details column to announcements");
      } catch (error) {
        if (error.code === 'ER_DUP_FIELDNAME') {
          console.log("⏭️  details column already exists in announcements");
        } else {
          console.error("❌ Error adding details column to announcements:", error.message);
        }
      }

      try {
        await pool.execute("ALTER TABLE announcements ADD COLUMN category VARCHAR(100) NOT NULL DEFAULT 'general'");
        console.log("✅ Added category column to announcements");
      } catch (error) {
        if (error.code === 'ER_DUP_FIELDNAME') {
          console.log("⏭️  category column already exists in announcements");
        } else {
          console.error("❌ Error adding category column to announcements:", error.message);
        }
      }

      try {
        await pool.execute("ALTER TABLE announcements ADD COLUMN priority ENUM('high','medium','low') DEFAULT 'medium'");
        console.log("✅ Added priority column to announcements");
      } catch (error) {
        if (error.code === 'ER_DUP_FIELDNAME') {
          console.log("⏭️  priority column already exists in announcements");
        } else {
          console.error("❌ Error adding priority column to announcements:", error.message);
        }
      }

      // Handle legacy schemas that used a `message` column
      try {
        await pool.execute("ALTER TABLE announcements ADD COLUMN message TEXT");
        console.log("✅ Added message column to announcements");
      } catch (error) {
        if (error.code === 'ER_DUP_FIELDNAME') {
          console.log("⏭️  message column already exists in announcements");
        } else {
          console.error("❌ Error adding message column to announcements:", error.message);
        }
      }

      try {
        await pool.execute("ALTER TABLE announcements MODIFY COLUMN message TEXT NULL");
        console.log("✅ Normalized message column to be NULLABLE");
      } catch (error) {
        console.error("❌ Error normalizing message column:", error.message);
      }

      // Add optional scheduling/status columns used by legacy/new code
      try {
        await pool.execute("ALTER TABLE announcements ADD COLUMN start_date DATE NULL");
        console.log("✅ Added start_date column to announcements");
      } catch (error) {
        if (error.code === 'ER_DUP_FIELDNAME') {
          console.log("⏭️  start_date column already exists in announcements");
        } else {
          console.error("❌ Error adding start_date column to announcements:", error.message);
        }
      }
      try {
        await pool.execute("ALTER TABLE announcements MODIFY COLUMN start_date DATE NULL DEFAULT NULL");
        console.log("✅ Normalized start_date column to NULL DEFAULT NULL");
      } catch (error) {
        console.error("❌ Error normalizing start_date column:", error.message);
      }

      try {
        await pool.execute("ALTER TABLE announcements ADD COLUMN end_date DATE NULL");
        console.log("✅ Added end_date column to announcements");
      } catch (error) {
        if (error.code === 'ER_DUP_FIELDNAME') {
          console.log("⏭️  end_date column already exists in announcements");
        } else {
          console.error("❌ Error adding end_date column to announcements:", error.message);
        }
      }
      try {
        await pool.execute("ALTER TABLE announcements MODIFY COLUMN end_date DATE NULL DEFAULT NULL");
        console.log("✅ Normalized end_date column to NULL DEFAULT NULL");
      } catch (error) {
        console.error("❌ Error normalizing end_date column:", error.message);
      }

      try {
        await pool.execute("ALTER TABLE announcements ADD COLUMN status ENUM('active','inactive') DEFAULT 'active'");
        console.log("✅ Added status column to announcements");
      } catch (error) {
        if (error.code === 'ER_DUP_FIELDNAME') {
          console.log("⏭️  status column already exists in announcements");
        } else {
          console.error("❌ Error adding status column to announcements:", error.message);
        }
      }

      try {
        await pool.execute("ALTER TABLE announcements ADD COLUMN image_path VARCHAR(500) NULL");
        console.log("✅ Added image_path column to announcements");
      } catch (error) {
        if (error.code === 'ER_DUP_FIELDNAME') {
          console.log("⏭️  image_path column already exists in announcements");
        } else {
          console.error("❌ Error adding image_path column to announcements:", error.message);
        }
      }

      // Add image storage columns for binary image data
      try {
        await pool.execute("ALTER TABLE announcements ADD COLUMN image LONGBLOB NULL");
        console.log("✅ Added image column to announcements");
      } catch (error) {
        if (error.code === 'ER_DUP_FIELDNAME') {
          console.log("⏭️  image column already exists in announcements");
        } else {
          console.error("❌ Error adding image column to announcements:", error.message);
        }
      }

      try {
        await pool.execute("ALTER TABLE announcements ADD COLUMN image_mime VARCHAR(100) NULL");
        console.log("✅ Added image_mime column to announcements");
      } catch (error) {
        if (error.code === 'ER_DUP_FIELDNAME') {
          console.log("⏭️  image_mime column already exists in announcements");
        } else {
          console.error("❌ Error adding image_mime column to announcements:", error.message);
        }
      }

      try {
        await pool.execute("ALTER TABLE announcements ADD COLUMN image_name VARCHAR(255) NULL");
        console.log("✅ Added image_name column to announcements");
      } catch (error) {
        if (error.code === 'ER_DUP_FIELDNAME') {
          console.log("⏭️  image_name column already exists in announcements");
        } else {
          console.error("❌ Error adding image_name column to announcements:", error.message);
        }
      }

      // Create team_members table if it doesn't exist
      const createTeamMembersTable = `
        CREATE TABLE IF NOT EXISTS team_members (
          id INT AUTO_INCREMENT PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          designation VARCHAR(255) NOT NULL,
          image LONGBLOB,
          facebook VARCHAR(500),
          twitter VARCHAR(500),
          instagram VARCHAR(500),
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        )
      `;
      await pool.execute(createTeamMembersTable);
      console.log("✅ team_members table ready");

      // Create admin_users table if it doesn't exist
      const createAdminUsersTable = `
        CREATE TABLE IF NOT EXISTS admin_users (
          id INT AUTO_INCREMENT PRIMARY KEY,
          userId VARCHAR(50) NOT NULL UNIQUE,
          email VARCHAR(255) NOT NULL UNIQUE,
          password VARCHAR(255) NOT NULL,
          name VARCHAR(255) NOT NULL,
          role ENUM('admin', 'super_admin') DEFAULT 'admin',
          status ENUM('active', 'inactive') DEFAULT 'active',
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        )
      `;
      
      await pool.execute(createAdminUsersTable);
      console.log("✅ admin_users table ready");

      // Check if admin user exists, if not create default admin
      const [existingAdmin] = await pool.execute("SELECT COUNT(*) as count FROM admin_users WHERE userId = '00000'");
      if (existingAdmin[0].count === 0) {
        try {
          // Hash the default password '00000'
          const bcrypt = await import('bcryptjs');
          const hashedPassword = await bcrypt.default.hash('00000', 10);
          
          await pool.execute(
            "INSERT INTO admin_users (userId, email, password, name, role) VALUES (?, ?, ?, ?, ?)",
            ['00000', '00000', hashedPassword, 'Default Admin', 'super_admin']
          );
          console.log("✅ Default admin user created (userId: 00000, password: 00000)");
        } catch (error) {
          console.error("❌ Error creating default admin user:", error.message);
        }
      } else {
        console.log("⏭️  Default admin user already exists");
      }


    console.log("🎉 Database setup completed successfully!");
    
  } catch (error) {
    console.error("❌ Database setup failed:", error.message);
    console.error("Server will continue but some features may not work");
  }
};

// Test DB connection and setup tables
(async () => {
  try {
    const connection = await pool.getConnection();
    console.log("Connected to MySQL Database");
    connection.release();
    
    // Setup tables after successful connection
    await setupDatabaseTables();
  } catch (error) {
    console.error("MySQL connection error:", error);
    console.error("Server will continue but database features will not work");
  }
})();

app.use("/api", Routes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
