const Blog = require('../models/blog');

exports.getAllBlogs = async (req, res, next) => {
    try{
        const blog = await Blog.findAll();
        res.json(blog);

    }catch(err){
        res.status(500).json({ error: err.message });
    }
};

exports.createBlog = async (req, res, next) => {
    const { blogTitle, blogAuthor, blogContent } = req.body;
    try{
        const newBlog = await Blog.create({ blogTitle, blogAuthor, blogContent });
        res.status(201).json({ newBlog });
    }catch(err){
        res.status(500).json({ error: err.message });
    }
};

exports.createBlogComment = async (req, res, next) => {
    const { id } = req.params;
    const { comment } = req.body;
    try {

        const blog = await Blog.findByPk(id);

        if (blog) {

            const existingComments = blog.comment || '';

            let newComments;
            if(existingComments){

                newComments = `${existingComments} ; ${comment}`

            }else{

                newComments = comment;
            }

            blog.comment = newComments;
            await blog.save();

            let updatedComments; 
            if(blog.comment){

                updatedComments = blog.comment.split(';');
            }else{

                updatedComments = [];
            }

            res.status(200).json({ message: 'Comment added successfully', comments: updatedComments });
        } else {
            res.status(404).json({ error: 'Blog not found' });
        }
    } catch (err) {
        console.error('Error adding comment:', err);
        res.status(500).json({ error: err.message });
    }
};


exports.deleteComment = async (req, res, next) => {
    const { id, commentIndex } = req.params;
    try {
        const blog = await Blog.findByPk(id);
        if (blog) {
            const comments = blog.comment ? blog.comment.split(';') : [];
            if (comments[commentIndex]) {
                comments.splice(commentIndex, 1);
                blog.comment = comments.join(';');
                await blog.save();
                res.status(200).json({ message: 'Comment deleted successfully', blog });
            } else {
                res.status(404).json({ error: 'Comment not found' });
            }
        } else {
            res.status(404).json({ error: 'Blog not found' });
        }
    } catch (err) {
        console.error('Error deleting comment:', err);
        res.status(500).json({ error: err.message });
    }
};
