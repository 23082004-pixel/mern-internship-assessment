const express = require('express');
const router = express.Router();
const fileUpload = require('../middleware/fileUpload');
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
router.post('/', fileUpload, createUser);
router.get('/', getUsers);
router.get('/search', searchUsers);
router.get('/export', exportUsersToCSV);
router.get('/:id', getUserById);
router.put('/:id', fileUpload, updateUser);
router.delete('/:id', deleteUser);

module.exports = router;
