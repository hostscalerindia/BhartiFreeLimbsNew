import db from "../config/db.js";
import multer from "multer";

// Configure multer for file uploads
export const serviceTypeUpload = multer({ 
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    // Accept only image files
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

export const createServiceType = async (req, res) => {
  try {
    
    const { name, description } = req.body;
    const imageFile = req.file; // Multer adds the file to req.file

    // Validate required fields
    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Name is required field"
      });
    }

    // Check if service type name already exists
    const [existingRows] = await db.execute(
      "SELECT id FROM service_types WHERE name = ?",
      [name]
    );

    if (existingRows.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Service type with this name already exists"
      });
    }

    // Insert new service type
    const [result] = await db.execute(
      "INSERT INTO service_types (name, description, image, image_mime, image_name, created_at, updated_at) VALUES (?, ?, ?, ?, ?, NOW(), NOW())",
      [
        name, 
        description || null, 
        imageFile ? imageFile.buffer : null,
        imageFile ? imageFile.mimetype : null,
        imageFile ? imageFile.originalname : null
      ]
    );

    // Get the inserted service type
    const [newServiceType] = await db.execute(
      "SELECT * FROM service_types WHERE id = ?",
      [result.insertId]
    );

    res.status(201).json({
      success: true,
      data: newServiceType[0],
      message: "Service type created successfully"
    });
  } catch (error) {
    console.error("Error creating service type:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};

export const getServiceTypeImage = async (req, res) => {
  try {
    const { id } = req.params;
    
    const [rows] = await db.execute(
      "SELECT image, image_mime, image_name FROM service_types WHERE id = ?",
      [id]
    );

    if (rows.length === 0 || !rows[0].image) {
      return res.status(404).json({
        success: false,
        message: "Image not found"
      });
    }

    const { image, image_mime, image_name } = rows[0];
    
    res.set({
      'Content-Type': image_mime,
      'Content-Disposition': `inline; filename="${image_name}"`,
      'Cache-Control': 'public, max-age=31536000'
    });
    
    res.send(image);
  } catch (error) {
    console.error("Error serving service type image:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
}; 