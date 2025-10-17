import multer from 'multer';
import pool from '../config/db.js';

export const centerUpload = multer({ storage: multer.memoryStorage() });

export const createCenter = async (req, res) => {
  try {
    const { name, description, location, phone_number, service_type_id, service_type_name } = req.body;
    if (!name || !service_type_id) {
      return res.status(400).json({ success: false, message: 'name and service_type_id are required' });
    }
    const image = req.file?.buffer || null;
    const image_mime = req.file?.mimetype || null;
    const image_name = req.file?.originalname || null;
    const [result] = await pool.execute(
      `INSERT INTO centers (name, description, location, phone_number, service_type_id, service_type_name, image, image_mime, image_name)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [name, description || null, location || null, phone_number || null, Number(service_type_id) || null, service_type_name || null, image, image_mime, image_name]
    );
    return res.status(201).json({ success: true, data: { id: result.insertId } });
  } catch (e) {
    console.error('createCenter error', e);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

export const listCenters = async (req, res) => {
  try {
    const { service_type_id } = req.query;
    let sql = `SELECT c.*, COALESCE(c.service_type_name, st.name) as service_type_name FROM centers c LEFT JOIN service_types st ON c.service_type_id = st.id`;
    const params = [];
    if (service_type_id) { sql += ' WHERE c.service_type_id = ?'; params.push(Number(service_type_id)); }
    sql += ' ORDER BY c.created_at DESC';
    const [rows] = await pool.execute(sql, params);
    return res.json({ success: true, data: rows });
  } catch (e) {
    console.error('listCenters error', e);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

export const getCenterImage = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.execute('SELECT image, image_mime FROM centers WHERE id = ?', [id]);
    if (rows.length === 0 || !rows[0].image) return res.status(404).send('Not found');
    res.setHeader('Content-Type', rows[0].image_mime || 'application/octet-stream');
    return res.send(rows[0].image);
  } catch (e) {
    console.error('getCenterImage error', e);
    return res.status(500).send('Internal server error');
  }
};

export const deleteCenter = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if center exists
    const [existingCenter] = await pool.execute('SELECT id FROM centers WHERE id = ?', [id]);
    if (existingCenter.length === 0) {
      return res.status(404).json({ success: false, message: 'Center not found' });
    }
    
    // Delete the center
    const [result] = await pool.execute('DELETE FROM centers WHERE id = ?', [id]);
    
    if (result.affectedRows > 0) {
      return res.json({ success: true, message: 'Center deleted successfully' });
    } else {
      return res.status(500).json({ success: false, message: 'Failed to delete center' });
    }
  } catch (e) {
    console.error('deleteCenter error', e);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};


