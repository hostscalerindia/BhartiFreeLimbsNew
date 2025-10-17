-- Create service_types table
CREATE TABLE IF NOT EXISTS service_types (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

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

-- Add service_type_id column to existing services table if it doesn't exist
-- This will allow services to reference service types
ALTER TABLE services ADD COLUMN IF NOT EXISTS service_type_id INT;
ALTER TABLE services ADD CONSTRAINT fk_service_type FOREIGN KEY (service_type_id) REFERENCES service_types(id) ON DELETE SET NULL; 