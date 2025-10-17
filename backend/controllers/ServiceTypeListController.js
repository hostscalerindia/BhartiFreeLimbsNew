import db from "../config/db.js";

export const getAllServiceTypes = async (req, res) => {
  try {
    const [rows] = await db.execute(
      "SELECT * FROM service_types ORDER BY created_at ASC"
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
};

export const getServiceTypeById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const [rows] = await db.execute(
      "SELECT * FROM service_types WHERE id = ?",
      [id]
    );
    
    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Service type not found"
      });
    }
    
    res.json({
      success: true,
      data: rows[0],
      message: "Service type fetched successfully"
    });
  } catch (error) {
    console.error("Error fetching service type:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
}; 