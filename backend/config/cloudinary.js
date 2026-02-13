const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// Check if Cloudinary credentials are available
const isCloudinaryConfigured = 
  process.env.CLOUDINARY_CLOUD_NAME && 
  process.env.CLOUDINARY_API_KEY && 
  process.env.CLOUDINARY_API_SECRET;

// Configure Cloudinary only if credentials are available
if (isCloudinaryConfigured) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
  });
  console.log('Cloudinary configured successfully');
} else {
  console.log('Cloudinary credentials not found - image upload will be disabled');
}

// Configure Cloudinary storage for multer
const storage = isCloudinaryConfigured ? new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'user-profiles',
    allowed_formats: ['jpg', 'jpeg', 'png'],
    transformation: [
      { width: 500, height: 500, crop: 'fill', gravity: 'face' }
    ]
  }
}) : null;

module.exports = { cloudinary, storage, isCloudinaryConfigured };
