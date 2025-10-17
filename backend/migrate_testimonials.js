import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const createTestimonialsTable = async () => {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'bharat_free_limbs'
  });

  try {
    console.log('Creating testimonials table...');
    
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS testimonials (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        profession VARCHAR(255) NOT NULL,
        text TEXT NOT NULL,
        image LONGBLOB,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `;

    await connection.execute(createTableQuery);
    console.log('✅ Testimonials table created successfully!');

    // Insert sample testimonials
    const sampleTestimonials = [
      {
        name: 'Rajesh Kumar',
        profession: 'Farmer',
        text: 'Bharti Free Limbs gave me back my mobility and dignity. The free prosthetic limb service changed my life completely. I can now walk, work, and support my family again. The staff was incredibly caring and professional throughout the entire process.'
      },
      {
        name: 'Priya Sharma',
        profession: 'Teacher',
        text: 'After losing my leg in an accident, I thought my life was over. But Bharti Free Limbs provided me with a high-quality prosthetic limb completely free of cost. Their dedication to helping the needy is truly inspiring. I\'m forever grateful.'
      },
      {
        name: 'Amit Patel',
        profession: 'Shop Owner',
        text: 'The free artificial limb center in our area has been a blessing for many families. The quality of care and the compassion shown by the team is exceptional. They don\'t just provide limbs, they restore hope and independence.'
      }
    ];

    for (const testimonial of sampleTestimonials) {
      const insertQuery = `
        INSERT INTO testimonials (name, profession, text) 
        VALUES (?, ?, ?)
        ON DUPLICATE KEY UPDATE name = name
      `;
      
      await connection.execute(insertQuery, [
        testimonial.name,
        testimonial.profession,
        testimonial.text
      ]);
    }

    console.log('✅ Sample testimonials inserted successfully!');
    console.log('🎉 Testimonials migration completed!');

  } catch (error) {
    console.error('❌ Error during migration:', error);
  } finally {
    await connection.end();
  }
};

createTestimonialsTable();
