import db from "../config/db.js";

export const updateServiceType = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;
    const imageFile = req.file; // Multer adds the file to req.file

    // Validate required fields
    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Name is required field"
      });
    }

    // Check if service type exists
    const [existingRows] = await db.execute(
      "SELECT id FROM service_types WHERE id = ?",
      [id]
    );

    if (existingRows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Service type not found"
      });
    }

    // Check if name already exists for other service types
    const [duplicateRows] = await db.execute(
      "SELECT id FROM service_types WHERE name = ? AND id != ?",
      [name, id]
    );

    if (duplicateRows.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Service type with this name already exists"
      });
    }

    // Update service type with or without image
    if (imageFile) {
      // Update with new image
      await db.execute(
        "UPDATE service_types SET name = ?, description = ?, image = ?, image_mime = ?, image_name = ?, updated_at = NOW() WHERE id = ?",
        [name, description || null, imageFile.buffer, imageFile.mimetype, imageFile.originalname, id]
      );
    } else {
      // Update without changing image
      await db.execute(
        "UPDATE service_types SET name = ?, description = ?, updated_at = NOW() WHERE id = ?",
        [name, description || null, id]
      );
    }

    // Get the updated service type
    const [updatedServiceType] = await db.execute(
      "SELECT * FROM service_types WHERE id = ?",
      [id]
    );

    res.json({
      success: true,
      data: updatedServiceType[0],
      message: "Service type updated successfully"
    });
  } catch (error) {
    console.error("Error updating service type:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
}; 