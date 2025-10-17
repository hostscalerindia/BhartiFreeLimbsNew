import mysql from "mysql2/promise";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from root
dotenv.config({ path: path.join(__dirname, "../.env") });

const setupDatabase = async () => {
  let connection;
  
  try {
    // Create connection
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'bhartifreelimb'
    });

    console.log("Connected to MySQL Database");

    // Create service_types table
    const createTableSQL = `
      CREATE TABLE IF NOT EXISTS service_types (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL UNIQUE,
        description TEXT,
        status ENUM('active', 'inactive') DEFAULT 'active',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `;

    await connection.execute(createTableSQL);
    console.log("✅ service_types table created successfully");

    // Insert sample data
    const sampleData = [
      ['Healthcare', 'Medical and health-related services', 'active'],
      ['Education', 'Educational and training services', 'active'],
      ['Community Service', 'Community development and welfare services', 'active'],
      ['Environmental', 'Environmental protection and sustainability services', 'active'],
      ['Welfare', 'Social welfare and support services', 'active'],
      ['Emergency Relief', 'Emergency response and disaster relief services', 'active'],
      ['Development', 'Infrastructure and development services', 'active']
    ];

    for (const [name, description, status] of sampleData) {
      try {
        await connection.execute(
          "INSERT INTO service_types (name, description, status) VALUES (?, ?, ?)",
          [name, description, status]
        );
        console.log(`✅ Added: ${name}`);
      } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
          console.log(`⏭️  Skipped (already exists): ${name}`);
        } else {
          console.error(`❌ Error adding ${name}:`, error.message);
        }
      }
    }

    // Check if services table exists and add service_type_id column
    try {
      const [servicesTable] = await connection.execute("SHOW TABLES LIKE 'services'");
      if (servicesTable.length > 0) {
        try {
          await connection.execute("ALTER TABLE services ADD COLUMN service_type_id INT");
          console.log("✅ Added service_type_id column to services table");
        } catch (error) {
          if (error.code === 'ER_DUP_FIELDNAME') {
            console.log("⏭️  service_type_id column already exists in services table");
          } else {
            console.error("❌ Error adding service_type_id column:", error.message);
          }
        }
      } else {
        console.log("ℹ️  services table not found, skipping service_type_id column addition");
      }
    } catch (error) {
      console.error("❌ Error checking services table:", error.message);
    }

    console.log("\n🎉 Database setup completed successfully!");
    console.log("You can now start your backend server with: npm run dev");

  } catch (error) {
    console.error("❌ Database setup failed:", error.message);
    console.error("Please check your database connection and try again");
  } finally {
    if (connection) {
      await connection.end();
      console.log("Database connection closed");
    }
  }
};

// Run the setup
setupDatabase(); 