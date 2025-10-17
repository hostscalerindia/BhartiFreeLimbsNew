import db from "../config/db.js";

export const deleteServiceType = async (req, res) => {
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

    // Check if services table exists before checking for dependencies
    try {
      const [servicesTable] = await db.execute("SHOW TABLES LIKE 'services'");
      if (servicesTable.length > 0) {
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
      }
    } catch (error) {
      console.log("Services table doesn't exist, skipping dependency check");
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
};

export const bulkDeleteServiceTypes = async (req, res) => {
  try {
    const { ids } = req.body;

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Array of IDs is required"
      });
    }

    // Check if services table exists before checking for dependencies
    try {
      const [servicesTable] = await db.execute("SHOW TABLES LIKE 'services'");
      if (servicesTable.length > 0) {
        // Check if any service types are being used by services
        const [servicesUsingTypes] = await db.execute(
          "SELECT DISTINCT service_type_id FROM services WHERE service_type_id IN (?)",
          [ids]
        );

        if (servicesUsingTypes.length > 0) {
          const usedIds = servicesUsingTypes.map(row => row.service_type_id);
          return res.status(400).json({
            success: false,
            message: `Cannot delete service types with IDs: ${usedIds.join(', ')}. They are being used by existing services.`
          });
        }
      }
    } catch (error) {
      console.log("Services table doesn't exist, skipping dependency check");
    }

    // Delete multiple service types
    const [result] = await db.execute(
      "DELETE FROM service_types WHERE id IN (?)",
      [ids]
    );

    res.json({
      success: true,
      message: `${result.affectedRows} service type(s) deleted successfully`
    });
  } catch (error) {
    console.error("Error bulk deleting service types:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
}; 