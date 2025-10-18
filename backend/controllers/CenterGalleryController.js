import multer from 'multer';
import pool from '../config/db.js';

export const centerGalleryUpload = multer({ storage: multer.memoryStorage() });

// Multiple file upload middleware for bulk center gallery
export const centerGalleryUploadMultiple = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 20 * 1024 * 1024 // 5MB limit per file
  },
  fileFilter: (req, file, cb) => {
    const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    const allowedExtensions = /\.(jpeg|jpg|png|gif|webp)$/i;
    
    const isValidMimeType = allowedMimeTypes.includes(file.mimetype);
    const isValidExtension = allowedExtensions.test(file.originalname);
    
    if (isValidMimeType || isValidExtension) {
      return cb(null, true);
    } else {
      cb(new Error(`Invalid file type. Allowed: ${allowedMimeTypes.join(', ')} or ${allowedExtensions.source}`));
    }
  }
});

export const createCenterGalleryItem = async (req, res) => {
  try {
    const { center_id, center_name } = req.body;
    
    // Validation - center_id is required
    if (!center_id) {
      return res.status(400).json({ success: false, message: 'center_id is required' });
    }
    
    // Check if it's multiple files (bulk upload)
    if (req.files && req.files.length > 0) {
      // Handle multiple files
      const files = req.files;
      const results = [];
      
      // Get center name from database if not provided
      let actualCenterName = center_name;
      if (!actualCenterName) {
        try {
          const [centerRows] = await pool.execute('SELECT name FROM centers WHERE id = ?', [Number(center_id)]);
          if (centerRows.length > 0) {
            actualCenterName = centerRows[0].name;
          }
        } catch (error) {
          console.error('Error fetching center name:', error);
        }
      }
      
      for (const file of files) {
        try {
          // Try to insert with center_name first, fallback to without if column doesn't exist
          try {
            const [result] = await pool.execute(
              `INSERT INTO center_galleries (center_id, center_name, title, description, status, image, image_mime, image_name)
               VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
              [Number(center_id), actualCenterName, file.originalname, '', 'active', file.buffer, file.mimetype, file.originalname]
            );
            results.push({ id: result.insertId, name: file.originalname });
          } catch (insertError) {
            if (insertError.code === 'ER_BAD_FIELD_ERROR') {
              // Fallback: insert without center_name if column doesn't exist
              const [result] = await pool.execute(
                `INSERT INTO center_galleries (center_id, title, description, status, image, image_mime, image_name)
                 VALUES (?, ?, ?, ?, ?, ?, ?)`,
                [Number(center_id), file.originalname, '', 'active', file.buffer, file.mimetype, file.originalname]
              );
              results.push({ id: result.insertId, name: file.originalname });
            } else {
              throw insertError;
            }
          }
        } catch (error) {
          console.error('Error inserting file:', file.originalname, error);
          results.push({ name: file.originalname, error: error.message });
        }
      }

      const successful = results.filter(r => r.id);
      const failed = results.filter(r => r.error);

      return res.status(201).json({
        success: true,
        message: `Successfully uploaded ${successful.length} images${failed.length > 0 ? `, ${failed.length} failed` : ''}`,
        data: {
          successful,
          failed
        }
      });
    }
    
    // Handle single file (existing functionality)
    const { title, description = '', status = 'active' } = req.body;
    const img = req.file?.buffer || null;
    const mime = req.file?.mimetype || null;
    const name = req.file?.originalname || null;
    
    // Validation for single file
    if (!title) {
      return res.status(400).json({ success: false, message: 'title is required' });
    }
    
    // Get center name from database if not provided
    let actualCenterName = center_name;
    if (!actualCenterName) {
      try {
        const [centerRows] = await pool.execute('SELECT name FROM centers WHERE id = ?', [Number(center_id)]);
        if (centerRows.length > 0) {
          actualCenterName = centerRows[0].name;
        }
      } catch (error) {
        console.error('Error fetching center name:', error);
      }
    }
    
    // Try to insert with center_name first, fallback to without if column doesn't exist
    try {
      const [result] = await pool.execute(
        `INSERT INTO center_galleries (center_id, center_name, title, description, status, image, image_mime, image_name)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [Number(center_id), actualCenterName, title, description, status, img, mime, name]
      );
      res.status(201).json({ success: true, data: { id: result.insertId } });
    } catch (insertError) {
      if (insertError.code === 'ER_BAD_FIELD_ERROR') {
        // Fallback: insert without center_name if column doesn't exist
        const [result] = await pool.execute(
          `INSERT INTO center_galleries (center_id, title, description, status, image, image_mime, image_name)
           VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [Number(center_id), title, description, status, img, mime, name]
        );
        res.status(201).json({ success: true, data: { id: result.insertId } });
      } else {
        throw insertError;
      }
    }
  } catch (e) {
    console.error('createCenterGalleryItem error', e);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

export const listCenterGallery = async (req, res) => {
  try {
    const { center_id } = req.query;
    
    // If no center_id provided, return all center galleries
    if (!center_id) {
      try {
        const [rows] = await pool.execute(
          'SELECT id, center_id, center_name, title, description, status, created_at FROM center_galleries ORDER BY created_at DESC'
        );
        res.json({ success: true, data: rows });
        return;
      } catch (selectError) {
        if (selectError.code === 'ER_BAD_FIELD_ERROR') {
          // Fallback: select without center_name if column doesn't exist
          const [rows] = await pool.execute(
            'SELECT id, center_id, title, description, status, created_at FROM center_galleries ORDER BY created_at DESC'
          );
          // Add null center_name to each row for consistency
          const rowsWithCenterName = rows.map(row => ({ ...row, center_name: null }));
          res.json({ success: true, data: rowsWithCenterName });
          return;
        } else {
          throw selectError;
        }
      }
    }
    
    // Try to select with center_name first, fallback to without if column doesn't exist
    try {
      const [rows] = await pool.execute(
        'SELECT id, center_id, center_name, title, description, status, created_at FROM center_galleries WHERE center_id = ? ORDER BY created_at DESC', 
        [Number(center_id)]
      );
      res.json({ success: true, data: rows });
    } catch (selectError) {
      if (selectError.code === 'ER_BAD_FIELD_ERROR') {
        // Fallback: select without center_name if column doesn't exist
        const [rows] = await pool.execute(
          'SELECT id, center_id, title, description, status, created_at FROM center_galleries WHERE center_id = ? ORDER BY created_at DESC', 
          [Number(center_id)]
        );
        // Add null center_name to each row for consistency
        const rowsWithCenterName = rows.map(row => ({ ...row, center_name: null }));
        res.json({ success: true, data: rowsWithCenterName });
      } else {
        throw selectError;
      }
    }
  } catch (e) {
    console.error('listCenterGallery error', e);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

export const getCenterGalleryImage = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.execute('SELECT image, image_mime FROM center_galleries WHERE id = ?', [id]);
    
    if (rows.length === 0 || !rows[0].image) {
      return res.status(404).send('Not found');
    }
    
    res.setHeader('Content-Type', rows[0].image_mime || 'application/octet-stream');
    return res.send(rows[0].image);
  } catch (e) {
    console.error('getCenterGalleryImage error', e);
    res.status(500).send('Internal server error');
  }
};

export const deleteCenterGalleryItem = async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await pool.execute(
      "DELETE FROM center_galleries WHERE id = ?",
      [id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: "Center gallery item not found" });
    }
    return res.json({ success: true, message: "Center gallery item deleted successfully" });
  } catch (error) {
    console.error("Error deleting center gallery item:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};



