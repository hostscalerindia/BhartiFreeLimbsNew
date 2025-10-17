import db from '../config/db.js';

// Create testimonial
const createTestimonial = async (req, res) => {
  try {
    
    const { name, profession, text } = req.body;
    const image = req.file;

    if (!name || !profession || !text) {
      return res.status(400).json({ 
        error: 'Name, profession, and text are required',
        received: { name, profession, text }
      });
    }

    const imageBuffer = image ? image.buffer : null;

    const query = `
      INSERT INTO testimonials (name, profession, text, image) 
      VALUES (?, ?, ?, ?)
    `;


    const [result] = await db.execute(query, [name, profession, text, imageBuffer]);


    res.status(201).json({
      message: 'Testimonial created successfully',
      id: result.insertId
    });
  } catch (error) {
    console.error('createTestimonial error:', error);
    console.error('Error details:', {
      message: error.message,
      code: error.code,
      sqlMessage: error.sqlMessage
    });
    res.status(500).json({ 
      error: 'Failed to create testimonial',
      details: error.message
    });
  }
};

// Get all testimonials
const getAllTestimonials = async (req, res) => {
  try {
    const query = 'SELECT id, name, profession, text, image FROM testimonials ORDER BY created_at DESC';
    const [rows] = await db.execute(query);

    const testimonials = rows.map(row => ({
      id: row.id,
      name: row.name,
      profession: row.profession,
      text: row.text,
      hasImage: !!row.image
    }));

    res.json({ data: testimonials });
  } catch (error) {
    console.error('getAllTestimonials error:', error);
    res.status(500).json({ error: 'Failed to fetch testimonials' });
  }
};

// Get testimonial image
const getTestimonialImage = async (req, res) => {
  try {
    const { id } = req.params;
    
    const query = 'SELECT image FROM testimonials WHERE id = ?';
    const [rows] = await db.execute(query, [id]);

    if (rows.length === 0 || !rows[0].image) {
      return res.status(404).json({ error: 'Image not found' });
    }

    res.set('Content-Type', 'image/jpeg');
    res.send(rows[0].image);
  } catch (error) {
    console.error('getTestimonialImage error:', error);
    res.status(500).json({ error: 'Failed to fetch image' });
  }
};

// Update testimonial
const updateTestimonial = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, profession, text } = req.body;
    const image = req.file;

    if (!name || !profession || !text) {
      return res.status(400).json({ error: 'Name, profession, and text are required' });
    }

    let query, params;

    if (image) {
      query = 'UPDATE testimonials SET name = ?, profession = ?, text = ?, image = ? WHERE id = ?';
      params = [name, profession, text, image.buffer, id];
    } else {
      query = 'UPDATE testimonials SET name = ?, profession = ?, text = ? WHERE id = ?';
      params = [name, profession, text, id];
    }

    const [result] = await db.execute(query, params);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Testimonial not found' });
    }

    res.json({ message: 'Testimonial updated successfully' });
  } catch (error) {
    console.error('updateTestimonial error:', error);
    res.status(500).json({ error: 'Failed to update testimonial' });
  }
};

// Delete testimonial
const deleteTestimonial = async (req, res) => {
  try {
    const { id } = req.params;

    const query = 'DELETE FROM testimonials WHERE id = ?';
    const [result] = await db.execute(query, [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Testimonial not found' });
    }

    res.json({ message: 'Testimonial deleted successfully' });
  } catch (error) {
    console.error('deleteTestimonial error:', error);
    res.status(500).json({ error: 'Failed to delete testimonial' });
  }
};

export {
  createTestimonial,
  getAllTestimonials,
  getTestimonialImage,
  updateTestimonial,
  deleteTestimonial
};
