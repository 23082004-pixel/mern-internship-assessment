const { storage, isCloudinaryConfigured } = require('../config/cloudinary');
const multer = require('multer');

// Configure multer storage based on Cloudinary availability
let uploadStorage;
if (isCloudinaryConfigured && storage) {
  uploadStorage = storage; // Use Cloudinary storage
  console.log('Using Cloudinary for image uploads');
} else {
  // Use memory storage as fallback (images won't be saved but won't break the app)
  uploadStorage = multer.memoryStorage();
  console.log('Using memory storage - images will not be saved permanently');
}

// Configure multer
const upload = multer({
  storage: uploadStorage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    // Check file type
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  }
});

// Export middleware for single file upload
module.exports = upload.single('profile');
