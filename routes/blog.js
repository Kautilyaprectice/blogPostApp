const express = require('express');
const router = express.Router();
const blogController = require('../controllers/blog');

router.get('/',blogController.getAllBlogs);
router.post('/',blogController.createBlog);
router.post('/:id/comment',blogController.createBlogComment);
router.delete('/:id/comment/:commentIndex',blogController.deleteComment);

module.exports = router;