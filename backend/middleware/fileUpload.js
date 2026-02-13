const express = require('express');
const path = require('path');
const fs = require('fs');

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

// File upload middleware using Express built-in
const fileUpload = (req, res, next) => {
    // Handle both JSON and FormData
    if (req.is('application/json')) {
        // JSON request - no file upload
        return next();
    }
    
    // FormData request - handle file upload
    if (req.is('multipart/form-data')) {
        const busboy = require('busboy');
        const bb = busboy({ headers: req.headers });
        
        let fileData = null;
        let formData = {};
        
        bb.on('file', (name, file, info) => {
            if (name === 'profile') {
                const filename = `profile-${Date.now()}-${info.filename}`;
                const filepath = path.join(uploadsDir, filename);
                
                fileData = {
                    filename: filename,
                    filepath: filepath,
                    mimetype: info.mimeType,
                    size: info.size
                };
                
                file.pipe(fs.createWriteStream(filepath));
            }
        });
        
        bb.on('field', (name, val, info) => {
            formData[name] = val;
        });
        
        bb.on('finish', () => {
            // Attach file info to req
            if (fileData) {
                req.file = {
                    filename: fileData.filename,
                    path: fileData.filepath,
                    mimetype: fileData.mimetype,
                    size: fileData.size
                };
                
                // Add file path to formData
                formData.profile = `/uploads/${fileData.filename}`;
            }
            
            // Attach form data to req.body
            req.body = formData;
            next();
        });
        
        bb.on('error', (err) => {
            console.error('File upload error:', err);
            res.status(400).json({
                success: false,
                message: 'File upload failed: ' + err.message
            });
        });
        
        req.pipe(bb);
    } else {
        next();
    }
};

module.exports = fileUpload;
