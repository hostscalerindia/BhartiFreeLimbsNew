-- =====================================================
-- Bharat Free Limbs - Complete Database Setup
-- =====================================================

-- Create service_types table
CREATE TABLE IF NOT EXISTS service_types (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL UNIQUE,
  description TEXT,
  image LONGBLOB,
  image_mime VARCHAR(100),
  image_name VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create services table
CREATE TABLE IF NOT EXISTS services (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  location VARCHAR(255),
  service_type_id INT,
  image_url VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (service_type_id) REFERENCES service_types(id) ON DELETE SET NULL
);

-- Create centers table
CREATE TABLE IF NOT EXISTS centers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  location VARCHAR(255),
  service_type_id INT,
  service_type_name VARCHAR(255),
  image LONGBLOB,
  image_mime VARCHAR(100),
  image_name VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (service_type_id) REFERENCES service_types(id) ON DELETE SET NULL
);

-- Create center_galleries table
CREATE TABLE IF NOT EXISTS center_galleries (
  id INT AUTO_INCREMENT PRIMARY KEY,
  center_id INT NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  image LONGBLOB,
  image_mime VARCHAR(100),
  image_name VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (center_id) REFERENCES centers(id) ON DELETE CASCADE
);

-- Create gallery_items table
CREATE TABLE IF NOT EXISTS gallery_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  location VARCHAR(255),
  service_type_id INT,
  image LONGBLOB,
  image_mime VARCHAR(100),
  image_name VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (service_type_id) REFERENCES service_types(id) ON DELETE SET NULL
);

-- Create announcements table
CREATE TABLE IF NOT EXISTS announcements (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  category ENUM('general', 'urgent', 'event', 'maintenance', 'update', 'reminder') DEFAULT 'general',
  priority ENUM('low', 'medium', 'high') DEFAULT 'medium',
  image LONGBLOB,
  image_mime VARCHAR(100),
  image_name VARCHAR(255),
  is_published BOOLEAN DEFAULT true,
  expiry_date DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- =====================================================
-- Database Migration - Add service_type_name column to centers
-- =====================================================

-- Add service_type_name column to centers table if it doesn't exist
ALTER TABLE centers ADD COLUMN IF NOT EXISTS service_type_name VARCHAR(255) AFTER service_type_id;

-- Remove status column from centers table if it exists
ALTER TABLE centers DROP COLUMN IF EXISTS status;

-- Create testimonials table
CREATE TABLE IF NOT EXISTS testimonials (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  profession VARCHAR(255) NOT NULL,
  text TEXT NOT NULL,
  image LONGBLOB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- =====================================================
-- Sample Data Insertion
-- =====================================================

-- Insert new service types for Bharat Free Limbs
INSERT INTO service_types (name, description) VALUES
('FREE PROSTHETIC LIMB CENTER', 'Providing high-quality prosthetic limbs completely free of cost to amputees. Our centers offer professional fitting, rehabilitation support, and follow-up care to restore mobility and dignity to those in need.'),
('HOME LESS SHELTER', 'Safe and secure shelters for homeless individuals and families. We provide temporary accommodation, basic amenities, medical care, and support services to help them transition to stable housing.'),
('ANIMAL RESCUE SHELTER', 'Dedicated facilities for rescuing, rehabilitating, and caring for injured, abandoned, and distressed animals. We provide medical treatment, shelter, and work towards finding them permanent homes.'),
('WATERPONDS WITH HANDPUMPS FOR WILDLIFE', 'Creating and maintaining water sources for wildlife in rural and forest areas. We install handpumps and construct water ponds to ensure animals have access to clean drinking water throughout the year.'),
('DISTRIBUTION OF FREE WHEELCHAIR', 'Providing free wheelchairs to individuals with mobility challenges. Our program includes proper fitting, training on wheelchair use, and ongoing support to improve independence and quality of life.'),
('FREE SLEEPING BAGS', 'Distributing warm and durable sleeping bags to homeless individuals and those in need during cold weather. This initiative helps protect vulnerable people from harsh weather conditions.'),
('SHOES FOR THE HOMELESS', 'Providing new shoes and footwear to homeless individuals and underprivileged people. We ensure they have proper footwear for protection, comfort, and dignity in their daily lives.'),
('FREE FOODSTALL', 'Operating free food stalls and community kitchens to provide nutritious meals to the homeless, underprivileged families, and anyone in need. We serve hot meals daily in various locations.'),
('HELPING SWAMIS', 'Supporting spiritual leaders and swamis who are dedicated to serving society. We provide assistance with their basic needs, medical care, and help them continue their spiritual and charitable work.'),
('FUNDING FOR PLANTING FOR TREES', 'Environmental conservation initiative focused on planting trees and creating green spaces. We fund tree plantation drives, maintain planted areas, and promote environmental awareness in communities.')
ON DUPLICATE KEY UPDATE name = name;

-- Insert sample announcements
INSERT INTO announcements (title, content, category, priority, is_published) VALUES
('Welcome to Bharat Free Limbs', 'We are excited to announce the launch of our new website! Bharat Free Limbs is dedicated to providing prosthetic limbs and support to those in need. Our mission is to help every individual lead a dignified and independent life.', 'general', 'high', true),
('Free Prosthetic Camp - Next Month', 'Join us for our monthly free prosthetic limb camp. We will be providing free assessments, fittings, and follow-up care. Please bring all necessary medical documents. Location and exact dates will be announced soon.', 'event', 'high', true),
('Volunteer Registration Open', 'We are looking for dedicated volunteers to help with our various programs. Whether you have medical experience or just want to help, we have opportunities for everyone. Contact us for more details.', 'general', 'medium', true),
('Donation Drive Success', 'Thank you to everyone who contributed to our recent donation drive! We raised enough funds to provide prosthetic limbs to 25 individuals. Your generosity makes a real difference in people\'s lives.', 'update', 'medium', true),
('Maintenance Notice', 'Our main facility will be closed for maintenance from 15th to 20th of this month. Emergency services will still be available. We apologize for any inconvenience caused.', 'maintenance', 'low', true);

-- =====================================================
-- Database Setup Complete!
-- =====================================================
