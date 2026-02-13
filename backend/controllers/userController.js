const User = require('../models/User');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const path = require('path');
const fs = require('fs');

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

// @desc    Create a new user
// @route   POST /api/users
// @access  Public
const createUser = async (req, res) => {
    try {
        const { firstName, lastName, email, mobile, gender, status, location } = req.body;
        
        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ 
                success: false, 
                message: 'User with this email already exists' 
            });
        }

        // Handle profile image (Cloudinary URL from multer-cloudinary or memory storage)
        let profile = null;
        if (req.file) {
            if (req.file.path) {
                // Cloudinary URL available
                profile = req.file.path;
                console.log('Image uploaded to Cloudinary:', profile);
            } else {
                // Memory storage fallback - create a temporary URL for display
                profile = `data:image/jpeg;base64,${req.file.buffer.toString('base64')}`;
                console.log('Image uploaded to memory storage (temporary display)');
            }
        } else if (req.body && req.body.profile) {
            profile = req.body.profile;
        }

        const user = new User({
            firstName,
            lastName,
            email,
            mobile,
            gender,
            status: status || 'Active',
            profile,
            location
        });

        const savedUser = await user.save();
        res.status(201).json({
            success: true,
            message: 'User created successfully',
            data: savedUser
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Get all users with pagination
// @route   GET /api/users
// @access  Public
const getUsers = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const totalUsers = await User.countDocuments();
        const users = await User.find()
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const totalPages = Math.ceil(totalUsers / limit);

        res.json({
            success: true,
            data: users,
            pagination: {
                currentPage: page,
                totalPages: totalPages,
                totalRecords: totalUsers,
                limit: limit
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Get single user by ID
// @route   GET /api/users/:id
// @access  Public
const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.json({
            success: true,
            data: user
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Public
const updateUser = async (req, res) => {
    try {
        const { firstName, lastName, email, mobile, gender, status, location } = req.body;
        
        // Find user first
        let user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Check if email is being changed and if it already exists
        if (email && email !== user.email) {
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                return res.status(400).json({ 
                    success: false, 
                    message: 'User with this email already exists' 
                });
            }
        }

        // Handle profile image (Cloudinary URL from multer-cloudinary or memory storage)
        let profile = user.profile;
        if (req.file) {
            if (req.file.path) {
                // Cloudinary URL available
                profile = req.file.path;
                console.log('Image uploaded to Cloudinary:', profile);
            } else {
                // Memory storage fallback - create a temporary URL for display
                profile = `data:image/jpeg;base64,${req.file.buffer.toString('base64')}`;
                console.log('Image uploaded to memory storage (temporary display)');
            }
        }

        // Update user
        user = await User.findByIdAndUpdate(
            req.params.id,
            {
                firstName: firstName || user.firstName,
                lastName: lastName || user.lastName,
                email: email || user.email,
                mobile: mobile || user.mobile,
                gender: gender || user.gender,
                status: status || user.status,
                profile: profile,
                location: location || user.location
            },
            { new: true, runValidators: true }
        );

        res.json({
            success: true,
            message: 'User updated successfully',
            data: user
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Public
const deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        await User.findByIdAndDelete(req.params.id);

        res.json({
            success: true,
            message: 'User deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Search users
// @route   GET /api/users/search
// @access  Public
const searchUsers = async (req, res) => {
    try {
        const { keyword } = req.query;
        
        if (!keyword) {
            return res.status(400).json({
                success: false,
                message: 'Search keyword is required'
            });
        }

        const searchRegex = new RegExp(keyword, 'i'); // case-insensitive search
        
        const users = await User.find({
            $or: [
                { firstName: { $regex: searchRegex } },
                { lastName: { $regex: searchRegex } },
                { email: { $regex: searchRegex } },
                { mobile: { $regex: searchRegex } },
                { gender: { $regex: searchRegex } },
                { status: { $regex: '^' + keyword + '$', $options: 'i' } },
                { location: { $regex: searchRegex } }
            ]
        }).sort({ createdAt: -1 });

        res.json({
            success: true,
            data: users,
            count: users.length
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Export users to CSV
// @route   GET /api/users/export
// @access  Public
const exportUsersToCSV = async (req, res) => {
    try {
        const users = await User.find().sort({ createdAt: -1 });
        
        const csvWriter = createCsvWriter({
            path: path.join(__dirname, '..', 'uploads', 'users_export.csv'),
            header: [
                { id: '_id', title: 'ID' },
                { id: 'firstName', title: 'First Name' },
                { id: 'lastName', title: 'Last Name' },
                { id: 'email', title: 'Email' },
                { id: 'mobile', title: 'Mobile' },
                { id: 'gender', title: 'Gender' },
                { id: 'status', title: 'Status' },
                { id: 'location', title: 'Location' },
                { id: 'createdAt', title: 'Created At' }
            ]
        });

        const records = users.map(user => ({
            ...user._doc,
            createdAt: user.createdAt.toISOString()
        }));

        await csvWriter.writeRecords(records);

        res.download(path.join(__dirname, '..', 'uploads', 'users_export.csv'), 'users_export.csv', (err) => {
            if (err) {
                console.error('Error downloading CSV:', err);
            }
            // Optionally delete the file after download
            fs.unlink(path.join(__dirname, '..', 'uploads', 'users_export.csv'), (unlinkErr) => {
                if (unlinkErr) console.error('Error deleting CSV:', unlinkErr);
            });
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    createUser,
    getUsers,
    getUserById,
    updateUser,
    deleteUser,
    searchUsers,
    exportUsersToCSV
};
