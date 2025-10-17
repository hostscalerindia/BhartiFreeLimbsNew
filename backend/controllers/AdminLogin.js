import pool from "../config/db.js";
import bcrypt from "bcryptjs";

export const AdminLogin = async (req, res) => {
  const { userId, password } = req.body;

  if (!userId || !password) {
    return res.status(400).json({ success: false, message: "UserId and Password required" });
  }

  try {
    const [rows] = await pool.query("SELECT * FROM admin_users WHERE userId = ?", [userId]);

    if (rows.length === 0) {
      return res.status(401).json({ success: false, message: "Invalid UserId" });
    }

    const admin = rows[0];

    // ✅ Compare hashed password
    const isMatch = await bcrypt.compare(password, admin.password);

    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Invalid Password" });
    }

    return res.json({ success: true, message: "Login successful" });

  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
