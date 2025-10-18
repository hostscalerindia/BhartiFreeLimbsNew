import db from '../config/db.js';
import multer from 'multer';

// Configure multer for memory storage (binary)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 20 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    // More lenient file filter - check MIME type OR extension
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
}).single('image');

// Create announcement
const createAnnouncement = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      console.error('Upload error:', err);
      return res.status(400).json({ error: err.message });
    }

    try {
      const { title, content, details, category, priority, message } = req.body;

      // Accept either `content` (current) or `message` (legacy) from clients
      const normalizedContent = content ?? message;

      if (!title || !normalizedContent || !category) {
        return res.status(400).json({ 
          error: 'Title, content, and category are required',
          received: { title, content, category }
        });
      }

      // Handle image file (binary storage)
      let imageData = null;
      let imageMime = null;
      let imageName = null;
      
      if (req.file) {
        imageData = req.file.buffer;
        imageMime = req.file.mimetype;
        imageName = req.file.originalname;
      }

      const query = `
        INSERT INTO announcements (title, content, details, category, priority, message, image, image_mime, image_name) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;
      
      const [result] = await db.execute(query, [title, normalizedContent, details, category, priority, message ?? null, imageData, imageMime, imageName]);
      
      res.status(201).json({
        message: 'Announcement created successfully',
        id: result.insertId,
        hasImage: !!req.file,
        imageName: imageName
      });
    } catch (error) {
      console.error('createAnnouncement error:', error);
      console.error('Error details:', {
        message: error.message,
        code: error.code,
        sqlMessage: error.sqlMessage
      });
      res.status(500).json({ 
        error: 'Failed to create announcement',
        details: error.message
      });
    }
  });
};

// Get all announcements
// const getAllAnnouncements = async (req, res) => {
//   try {
//     const query = `
//       SELECT id, title, content, details, category, priority, created_at, updated_at, 
//              image_path, image, image_mime, image_name
//       FROM announcements 
//       ORDER BY created_at DESC
//     `;
    
//     const [rows] = await db.execute(query);
    
//     // Process each announcement to add image information
//     const processedAnnouncements = rows.map(announcement => {
//       const hasImage = !!(announcement.image || announcement.image_path);
//       const imageType = announcement.image ? 'binary' : announcement.image_path ? 'path' : null;
      
//       return {
//         ...announcement,
//         hasImage,
//         imageType,
//         // Remove binary data from response to reduce payload size
//         image: undefined,
//         image_mime: announcement.image_mime,
//         image_name: announcement.image_name
//       };
//     });
    
//     res.json({
//       success: true,
//       data: processedAnnouncements
//     });
//   } catch (error) {
//     console.error('getAllAnnouncements error:', error);
//     res.status(500).json({ 
//       error: 'Failed to fetch announcements',
//       details: error.message
//     });
//   }
// };

const getAllAnnouncements = async (req, res) => {
  try {
    const query = `
      SELECT id, title, content, details, category, priority, created_at, updated_at, 
             image_path, image, image_mime, image_name
      FROM announcements 
      ORDER BY created_at DESC
    `;
    
    const [rows] = await db.execute(query);
    
    // Process each announcement to convert image to Base64
    const processedAnnouncements = rows.map(announcement => {
      const hasImage = !!(announcement.image || announcement.image_path);
      const imageType = announcement.image ? 'binary' : announcement.image_path ? 'path' : null;
      
      // Convert the binary image data to a Base64 string
      const image_base64 = announcement.image 
        ? Buffer.from(announcement.image).toString('base64') 
        : null;

      return {
        // Spread the original announcement data, but without the raw image buffer
        id: announcement.id,
        title: announcement.title,
        content: announcement.content,
        details: announcement.details,
        category: announcement.category,
        priority: announcement.priority,
        created_at: announcement.created_at,
        updated_at: announcement.updated_at,
        image_path: announcement.image_path,
        image_mime: announcement.image_mime,
        image_name: announcement.image_name,

        // Add the new Base64 image string
        image_base64: image_base64,
        
        // Keep these for client-side logic
        hasImage,
        imageType,
      };
    });
    
    res.json({
      success: true,
      data: processedAnnouncements
    });
  } catch (error) {
    console.error('getAllAnnouncements error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch announcements',
      details: error.message
    });
  }
};


// Get announcement by ID
const getAnnouncementById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const query = `
      SELECT id, title, content, details, category, priority, created_at, updated_at, 
             image_path, image, image_mime, image_name
      FROM announcements 
      WHERE id = ?
    `;
    
    const [rows] = await db.execute(query, [id]);
    
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Announcement not found' });
    }
    
    const announcement = rows[0];
    const hasImage = !!(announcement.image || announcement.image_path);
    const imageType = announcement.image ? 'binary' : announcement.image_path ? 'path' : null;
    
    const processedAnnouncement = {
      ...announcement,
      hasImage,
      imageType,
      // Remove binary data from response to reduce payload size
      image: undefined,
      image_mime: announcement.image_mime,
      image_name: announcement.image_name
    };
    
    res.json({
      success: true,
      data: processedAnnouncement
    });
  } catch (error) {
    console.error('getAnnouncementById error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch announcement',
      details: error.message
    });
  }
};

// Update announcement
const updateAnnouncement = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, details, category, priority } = req.body;
    
    if (!title || !content || !category) {
      return res.status(400).json({ 
        error: 'Title, content, and category are required'
      });
    }

    const query = `
      UPDATE announcements 
      SET title = ?, content = ?, details = ?, category = ?, priority = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `;
    
    const [result] = await db.execute(query, [title, content, details, category, priority, id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Announcement not found' });
    }
    
    res.json({
      message: 'Announcement updated successfully'
    });
  } catch (error) {
    console.error('updateAnnouncement error:', error);
    res.status(500).json({ 
      error: 'Failed to update announcement',
      details: error.message
    });
  }
};

// Delete announcement
const deleteAnnouncement = async (req, res) => {
  try {
    const { id } = req.params;
    
    const query = `DELETE FROM announcements WHERE id = ?`;
    const [result] = await db.execute(query, [id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Announcement not found' });
    }
    
    res.json({
      message: 'Announcement deleted successfully'
    });
  } catch (error) {
    console.error('deleteAnnouncement error:', error);
    res.status(500).json({ 
      error: 'Failed to delete announcement',
      details: error.message
    });
  }
};

// Get announcement image by ID
const getAnnouncementImage = async (req, res) => {
  try {
    const { id } = req.params;
    
    const query = `
      SELECT image, image_mime, image_name 
      FROM announcements 
      WHERE id = ? AND image IS NOT NULL
    `;
    
    const [rows] = await db.execute(query, [id]);
    
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Image not found' });
    }
    
    const announcement = rows[0];
    
    // Set appropriate headers for image display
    res.set({
      'Content-Type': announcement.image_mime || 'image/jpeg',
      'Content-Disposition': `inline; filename="${announcement.image_name || 'announcement.jpg'}"`,
      'Cache-Control': 'public, max-age=31536000' // Cache for 1 year
    });
    
    // Send the binary image data
    res.send(announcement.image);
  } catch (error) {
    console.error('getAnnouncementImage error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch announcement image',
      details: error.message
    });
  }
};

export {
  createAnnouncement,
  getAllAnnouncements,
  getAnnouncementById,
  updateAnnouncement,
  deleteAnnouncement,
  getAnnouncementImage
};
