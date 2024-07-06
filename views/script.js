document.addEventListener('DOMContentLoaded', function() {
    const blogForm = document.getElementById('blogForm');
    const blogDetails = document.getElementById('blogDetails');

    fetchBlogs();

    blogForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const blogData = {
            blogTitle: document.getElementById('blogTitle').value,
            blogAuthor: document.getElementById('blogAuthor').value,
            blogContent: document.getElementById('blogContent').value
        };

        axios.post('http://localhost:3000/blog', blogData)
            .then(function(res) {
                console.log(res.data);
                fetchBlogs();
                blogForm.reset();
            })
            .catch(function(err) {
                console.error(err);
            });
    });

    function fetchBlogs(){
        axios.get('http://localhost:3000/blog')
            .then((res) => {
                const blogs = res.data;
                blogDetails.innerHTML = '';
                blogs.forEach(blog => {
                    const blogDiv = document.createElement('div');
                    blogDiv.setAttribute('data-blog-id', blog.id);

                    let commentsHTML = '';
                    if (blog.comment) {
                        blog.comment.split(';').forEach((comment, index) => {
                            commentsHTML += `
                                <p>
                                    ${comment}
                                    <button class="deleteCommentButton" data-blog-id="${blog.id}" data-comment-index="${index}">Delete</button>
                                </p>
                            `;
                        });
                    }

                    blogDiv.innerHTML = `
                    <h2>${blog.blogTitle}</h2>
                    <p><strong>Author - </strong>${blog.blogAuthor}</p>
                    <p>${blog.blogContent}</p>
                    <input type="text" class="commentInput" placeholder="Add a comment">
                    <button class="commentButton" data-blog-id="${blog.id}">Submit Comment</button>
                    <div class="comments">
                        ${commentsHTML}
                    </div>
                    <hr>`;

                    blogDetails.appendChild(blogDiv);
                });

                document.querySelectorAll('.commentButton').forEach(button => {
                    button.addEventListener('click', function() {
                        const blogDiv = this.parentElement;
                        const blogId = this.getAttribute('data-blog-id');
                        const commentInput = blogDiv.querySelector('.commentInput');
                        const comment = commentInput.value;

                        axios.post(`http://localhost:3000/blog/${blogId}/comment`, { comment })
                            .then(function(response) {
                                console.log(response.data);
                                const commentsDiv = blogDiv.querySelector('.comments');
                                const newComment = document.createElement('p');
                                newComment.innerHTML = `
                                    ${comment}
                                    <button class="deleteCommentButton" data-blog-id="${blogId}" data-comment-index="${response.data.comments.length - 1}">Delete</button>
                                `;
                                commentsDiv.appendChild(newComment);
                                commentInput.value = '';

                                attachDeleteEvent(newComment.querySelector('.deleteCommentButton'));
                            })
                            .catch(function(error) {
                                console.error(err);
                            });
                    });
                });

                document.querySelectorAll('.deleteCommentButton').forEach(button => {
                    attachDeleteEvent(button);
                });
            })
            .catch((err) => console.error(err));
    }

    function attachDeleteEvent(button) {
        button.addEventListener('click', function() {
            const blogId = this.getAttribute('data-blog-id');
            const commentIndex = this.getAttribute('data-comment-index');

            axios.delete(`http://localhost:3000/blog/${blogId}/comment/${commentIndex}`)
                .then(function(response) {
                    console.log(response.data);
                    fetchBlogs();
                })
                .catch(function(error) {
                    console.error(err);
                });
        });
    }
});
