import pool from '../config/db.js';

// Create a new announcement
const createAnnouncement = async (req, res) => {
  try {
    const { title, message, category, priority, start_date, end_date, status } = req.body;
    
    const query = `
      INSERT INTO announcements (title, message, category, priority, start_date, end_date, status, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
    `;
    
    const [result] = await pool.execute(query, [
      title, message, category, priority, start_date, end_date, status
    ]);
    
    res.json({
      success: true,
      message: 'Announcement created successfully',
      data: { id: result.insertId }
    });
  } catch (error) {
    console.error('Error creating announcement:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create announcement'
    });
  }
};

// Get all announcements (with optional active_only filter)
const getAnnouncements = async (req, res) => {
  try {
    const { active_only } = req.query;
    
    let query = 'SELECT * FROM announcements';
    let params = [];
    
    if (active_only === 'true') {
      query += ' WHERE status = "active" AND (start_date IS NULL OR start_date <= NOW()) AND (end_date IS NULL OR end_date >= NOW())';
    }
    
    query += ' ORDER BY created_at DESC';
    
    const [rows] = await pool.execute(query, params);
    
    res.json({
      success: true,
      data: rows
    });
  } catch (error) {
    console.error('Error fetching announcements:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch announcements'
    });
  }
};

// Get announcement by ID
const getAnnouncementById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const [rows] = await pool.execute(
      'SELECT * FROM announcements WHERE id = ?',
      [id]
    );
    
    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Announcement not found'
      });
    }
    
    res.json({
      success: true,
      data: rows[0]
    });
  } catch (error) {
    console.error('Error fetching announcement:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch announcement'
    });
  }
};

// Update announcement
const updateAnnouncement = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, message, category, priority, start_date, end_date, status } = req.body;
    
    const query = `
      UPDATE announcements 
      SET title = ?, message = ?, category = ?, priority = ?, start_date = ?, end_date = ?, status = ?, updated_at = NOW()
      WHERE id = ?
    `;
    
    const [result] = await pool.execute(query, [
      title, message, category, priority, start_date, end_date, status, id
    ]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Announcement not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Announcement updated successfully'
    });
  } catch (error) {
    console.error('Error updating announcement:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update announcement'
    });
  }
};

// Delete announcement
const deleteAnnouncement = async (req, res) => {
  try {
    const { id } = req.params;
    
    const [result] = await pool.execute(
      'DELETE FROM announcements WHERE id = ?',
      [id]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Announcement not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Announcement deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting announcement:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete announcement'
    });
  }
};

export {
  createAnnouncement,
  getAnnouncements,
  getAnnouncementById,
  updateAnnouncement,
  deleteAnnouncement
};
