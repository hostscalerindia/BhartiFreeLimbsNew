-- Remove location column from gallery_items table
-- This script will permanently remove the location field

USE bhartifreelimb;

-- Check if location column exists before removing
SELECT COLUMN_NAME, DATA_TYPE, IS_NULLABLE 
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_SCHEMA = 'bhartifreelimb' 
AND TABLE_NAME = 'gallery_items' 
AND COLUMN_NAME = 'location';

-- Remove the location column
ALTER TABLE gallery_items DROP COLUMN location;

-- Verify the column has been removed
DESCRIBE gallery_items;

-- Show updated table structure
SELECT COLUMN_NAME, DATA_TYPE, IS_NULLABLE 
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_SCHEMA = 'bhartifreelimb' 
AND TABLE_NAME = 'gallery_items' 
ORDER BY ORDINAL_POSITION;

