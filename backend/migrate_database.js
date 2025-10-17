import mysql from "mysql2/promise";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from root
dotenv.config({ path: path.join(__dirname, "../.env") });

const migrateDatabase = async () => {
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

    // Check if centers table exists
    const [centersTable] = await connection.execute("SHOW TABLES LIKE 'centers'");
    if (centersTable.length === 0) {
      console.log("❌ centers table not found. Please run the main database setup first.");
      return;
    }

    // Add service_type_name column to centers table
    try {
      await connection.execute("ALTER TABLE centers ADD COLUMN service_type_name VARCHAR(255) AFTER service_type_id");
      console.log("✅ Added service_type_name column to centers table");
    } catch (error) {
      if (error.code === 'ER_DUP_FIELDNAME') {
        console.log("⏭️  service_type_name column already exists in centers table");
      } else {
        console.error("❌ Error adding service_type_name column:", error.message);
        return;
      }
    }

    // Remove status column from centers table if it exists
    try {
      await connection.execute("ALTER TABLE centers DROP COLUMN status");
      console.log("✅ Removed status column from centers table");
    } catch (error) {
      if (error.code === 'ER_CANT_DROP_FIELD_OR_KEY') {
        console.log("⏭️  status column doesn't exist in centers table");
      } else {
        console.error("❌ Error removing status column:", error.message);
      }
    }

    // Update existing centers with service_type_name from service_types table
    try {
      await connection.execute(`
        UPDATE centers c 
        LEFT JOIN service_types st ON c.service_type_id = st.id 
        SET c.service_type_name = st.name 
        WHERE c.service_type_name IS NULL AND st.name IS NOT NULL
      `);
      console.log("✅ Updated existing centers with service_type_name");
    } catch (error) {
      console.error("❌ Error updating existing centers:", error.message);
    }

    console.log("\n🎉 Database migration completed successfully!");

  } catch (error) {
    console.error("❌ Database migration failed:", error.message);
    console.error("Please check your database connection and try again");
  } finally {
    if (connection) {
      await connection.end();
      console.log("Database connection closed");
    }
  }
};

migrateDatabase();
