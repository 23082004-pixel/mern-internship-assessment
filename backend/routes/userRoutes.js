const express = require('express');
const router = express.Router();
const cloudinaryUpload = require('../middleware/cloudinaryUpload');
const {
    createUser,
    getUsers,
    getUserById,
    updateUser,
    deleteUser,
    searchUsers,
    exportUsersToCSV
} = require('../controllers/userController');

// CRUD Routes
router.post('/', cloudinaryUpload, createUser);
router.get('/', getUsers);
router.get('/search', searchUsers);
router.get('/export', exportUsersToCSV);
router.get('/:id', getUserById);
router.put('/:id', cloudinaryUpload, updateUser);
router.delete('/:id', deleteUser);

module.exports = router;
