const express = require('express')
const {searchContent} = require('../controllers/contentController');
const authMiddleware = require('../middleware/authMiddleware')
const router = express.Router()

router.get('/search', authMiddleware, searchContent);

module.exports = router