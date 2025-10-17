import db from "../config/db.js";

const ServiceTypeController = {
  // Get all service types
  getAllServiceTypes: async (req, res) => {
    try {
      const [rows] = await db.execute(
        "SELECT * FROM service_types ORDER BY created_at DESC"
      );
      
      res.json({
        success: true,
        data: rows,
        message: "Service types fetched successfully"
      });
    } catch (error) {
      console.error("Error fetching service types:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
        error: error.message
      });
    }
  },

  // Create new service type
  createServiceType: async (req, res) => {
    try {
      const { name, description } = req.body;

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
        "INSERT INTO service_types (name, description, created_at, updated_at) VALUES (?, ?, NOW(), NOW())",
        [name, description || null]
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
  },

  // Update service type
  updateServiceType: async (req, res) => {
    try {
      const { id } = req.params;
      const { name, description } = req.body;

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

      // Update service type
      await db.execute(
        "UPDATE service_types SET name = ?, description = ?, updated_at = NOW() WHERE id = ?",
        [name, description || null, id]
      );

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
  },

  // Delete service type
  deleteServiceType: async (req, res) => {
    try {
      const { id } = req.params;

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

      // Check if service type is being used by any services
      const [servicesUsingType] = await db.execute(
        "SELECT id FROM services WHERE service_type_id = ? LIMIT 1",
        [id]
      );

      if (servicesUsingType.length > 0) {
        return res.status(400).json({
          success: false,
          message: "Cannot delete service type. It is being used by existing services."
        });
      }

      // Delete service type
      await db.execute(
        "DELETE FROM service_types WHERE id = ?",
        [id]
      );

      res.json({
        success: true,
        message: "Service type deleted successfully"
      });
    } catch (error) {
      console.error("Error deleting service type:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
        error: error.message
      });
    }
  }
};

export default ServiceTypeController; 