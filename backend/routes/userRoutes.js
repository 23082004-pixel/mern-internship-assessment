const express = require('express');
const router = express.Router();
const upload = require('../config/multer');
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
router.post('/', upload.single('profile'), createUser);
router.get('/', getUsers);
router.get('/search', searchUsers);
router.get('/export', exportUsersToCSV);
router.get('/:id', getUserById);
router.put('/:id', upload.single('profile'), updateUser);
router.delete('/:id', deleteUser);

module.exports = router;
