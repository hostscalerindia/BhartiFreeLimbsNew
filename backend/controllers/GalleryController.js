import multer from "multer";
import pool from "../config/db.js";

// Use memory storage to keep file in memory (buffer) for DB insert
const upload = multer({ storage: multer.memoryStorage() });

export const galleryUploadMiddleware = upload.single("image");
export const galleryUploadMultipleMiddleware = upload.array("images", 30);

export const createGalleryItem = async (req, res) => {
  try {
    // Note: galleryUploadMiddleware must run before this handler to populate req.file
    const { title, description } = req.body;

    if (!req.file) {
      return res.status(400).json({ success: false, message: "Image file is required" });
    }

    const imageBuffer = req.file.buffer;
    const imageMime = req.file.mimetype;
    const imageName = req.file.originalname;

    const [result] = await pool.execute(
      `INSERT INTO gallery_items (title, description, image, image_mime, image_name)
       VALUES (?, ?, ?, ?, ?)`,
      [title, description, imageBuffer, imageMime, imageName]
    );

    return res.status(201).json({
      success: true,
      data: { id: result.insertId },
      message: "Gallery item created",
    });
  } catch (error) {
    console.error("Error creating gallery item:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Bulk create gallery items (multiple images in one request)
export const createGalleryItemsBulk = async (req, res) => {
  try {
    // Note: galleryUploadMultipleMiddleware must run before this handler to populate req.files
    // Validation ignored per request; only images are required
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, message: "At least one image is required" });
    }

    // Optional common fields and optional per-file fields
    // titles/descriptions can be arrays from FormData (titles[], descriptions[])
    const { title, description } = req.body; // common (optional)
    let { titles, descriptions } = req.body; // per-file (optional)

    // Normalize titles/descriptions to arrays aligned with files length
    const filesCount = req.files.length;
    if (titles !== undefined) {
      if (!Array.isArray(titles)) titles = [titles];
    } else {
      titles = [];
    }
    if (descriptions !== undefined) {
      if (!Array.isArray(descriptions)) descriptions = [descriptions];
    } else {
      descriptions = [];
    }

    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      const insertSql = `INSERT INTO gallery_items (title, description, image, image_mime, image_name) VALUES (?, ?, ?, ?, ?)`;
      const insertedIds = [];

      for (let i = 0; i < req.files.length; i++) {
        const file = req.files[i];
        const imageBuffer = file.buffer;
        const imageMime = file.mimetype;
        const imageName = file.originalname;

        // Per-file overrides > common > defaults
        const itemTitle = (titles[i] !== undefined && titles[i] !== null && titles[i] !== '')
          ? titles[i]
          : (title || imageName || 'Image');
        const itemDescription = (descriptions[i] !== undefined && descriptions[i] !== null)
          ? descriptions[i]
          : (description || '');

        const [result] = await connection.execute(insertSql, [itemTitle, itemDescription, imageBuffer, imageMime, imageName]);
        insertedIds.push(result.insertId);
      }

      await connection.commit();
      connection.release();

      return res.status(201).json({ success: true, data: { ids: insertedIds }, message: `Uploaded ${insertedIds.length} images` });
    } catch (err) {
      await connection.rollback();
      connection.release();
      throw err;
    }
  } catch (error) {
    console.error("Error creating bulk gallery items:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const listGalleryItems = async (req, res) => {
  try {
    const [rows] = await pool.execute(
      `SELECT id, title, description, image_mime, image_name, created_at, image
       FROM gallery_items
       ORDER BY created_at DESC`
    );
    return res.json({ success: true, data: rows });
  } catch (error) {
    console.error("Error listing gallery items:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const getGalleryImage = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.execute(
      "SELECT image, image_mime FROM gallery_items WHERE id = ?",
      [id]
    );
    if (rows.length === 0 || !rows[0].image) {
      return res.status(404).send("Not found");
    }
    res.setHeader("Content-Type", rows[0].image_mime || "application/octet-stream");
    return res.send(rows[0].image);
  } catch (error) {
    console.error("Error getting gallery image:", error);
    return res.status(500).send("Internal server error");
  }
};

export const deleteGalleryItem = async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await pool.execute(
      "DELETE FROM gallery_items WHERE id = ?",
      [id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: "Not found" });
    }
    return res.json({ success: true, message: "Deleted" });
  } catch (error) {
    console.error("Error deleting gallery item:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const updateGalleryItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description } = req.body;

    // Build dynamic update
    const fields = [];
    const params = [];
    if (title !== undefined) { fields.push("title = ?"); params.push(title); }
    if (description !== undefined) { fields.push("description = ?"); params.push(description); }

    if (req.file) {
      fields.push("image = ?", "image_mime = ?", "image_name = ?");
      params.push(req.file.buffer, req.file.mimetype, req.file.originalname);
    }

    if (fields.length === 0) {
      return res.status(400).json({ success: false, message: "No fields to update" });
    }

    const sql = `UPDATE gallery_items SET ${fields.join(", ")}, updated_at = NOW() WHERE id = ?`;
    params.push(id);
    const [result] = await pool.execute(sql, params);
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: "Not found" });
    }
    return res.json({ success: true, message: "Updated" });
  } catch (error) {
    console.error("Error updating gallery item:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};


