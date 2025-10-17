import pool from "../config/db.js";
import fs from "fs";
import path from "path";

export const addService = async (req, res) => {
  const { title, name, description, location } = req.body;
  const image = req.file ? req.file.filename : null;

  try {
    // ✅ Create table if not exists
    await pool.query(`
      CREATE TABLE IF NOT EXISTS servicetable (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(200),
        name VARCHAR(255),
        description TEXT,
        location VARCHAR(255),
        image VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // ✅ Insert data
    const [result] = await pool.query(
      `INSERT INTO servicetable (title, name, description, location, image) VALUES (?, ?, ?, ?, ?)`,
      [title, name, description, location, image]
    );

    res.json({ success: true, message: "Service added successfully", id: result.insertId });
  } catch (error) {
    console.error("Error adding service:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
