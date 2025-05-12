const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Define the temporary folder name as a constant
const TEMP_FOLDER_NAME = 'temp_folder';

// Configure multer storage
const upload = (fieldName = 'photos', maxCount = 10) => {
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      // Use the constant temporary folder name for file storage
      const uploadPath = path.join(__dirname, '..', 'uploads', TEMP_FOLDER_NAME);

      // Ensure the temporary folder exists, if not, create it
      fs.mkdirSync(uploadPath, { recursive: true });

      cb(null, uploadPath); // Store the files in the temporary folder
    },
    filename: (req, file, cb) => {
      // Set the file name as 'temp' (or a static name)
    // Get the file extension

      // Use a fixed name 'temp' or you can add a suffix for uniqueness if required
      const fileName = file.originalname

      cb(null, fileName); // Set the file name to 'temp' with its extension
    }
  });

  return multer({ storage }).array(fieldName, maxCount);
};

module.exports = upload;
