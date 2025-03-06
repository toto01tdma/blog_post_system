import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import './Posts.css';

const Posts = () => {
  const [posts, setPosts] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const { user, token } = useContext(AuthContext);

  useEffect(() => {
    fetchPosts();
  }, [token]);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:3000/posts', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch posts');
      }

      const data = await response.json();
      setPosts(data);
    } catch (err) {
      setError('Error loading posts. Please try again later.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    
    try {
      const response = await fetch('http://localhost:3000/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ title, content })
      });

      if (!response.ok) {
        throw new Error('Failed to create post');
      }

      setTitle('');
      setContent('');
      setSuccessMessage('Post created successfully!');
      fetchPosts();
    } catch (err) {
      setError(err.message || 'Error creating post. Please try again.');
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:3000/posts/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete post');
      }

      setPosts(posts.filter(post => post.id !== id));
      setSuccessMessage('Post deleted successfully!');
    } catch (err) {
      setError(err.message || 'Error deleting post. Please try again.');
    }
  };

  return (
    <div className="posts-container">
      <div className="posts-header">
        <h1>Blog Posts</h1>
        <p className="welcome-message">Welcome, {user?.username || 'User'}!</p>
      </div>

      {error && <div className="error-message">{error}</div>}
      {successMessage && <div className="success-message">{successMessage}</div>}

      <div className="posts-content">
        <div className="create-post-section">
          <h2>Create New Post</h2>
          <form onSubmit={handleSubmit} className="create-post-form">
            <div className="form-group">
              <label htmlFor="title">Title</label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                placeholder="Enter post title"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="content">Content</label>
              <textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
                placeholder="Write your post content here..."
                rows="6"
              />
            </div>
            
            <button type="submit" className="create-post-button">Publish Post</button>
          </form>
        </div>

        <div className="posts-list-section">
          <h2>All Posts</h2>
          
          {loading ? (
            <div className="loading-spinner">Loading posts...</div>
          ) : posts.length === 0 ? (
            <div className="no-posts-message">No posts available. Create your first post!</div>
          ) : (
            <div className="posts-grid">
              {posts.map((post) => (
                <div key={post.id} className="post-card">
                  <div className="post-header">
                    <h3 className="post-title">{post.title}</h3>
                    {post.author === user?.username && (
                      <button
                        className="delete-button"
                        onClick={() => handleDelete(post.id)}
                        aria-label="Delete post"
                      >
                        <i className="fas fa-trash"></i>
                      </button>
                    )}
                  </div>
                  <div className="post-meta">
                    <span className="post-author">By {post.author}</span>
                    <span className="post-date">
                      {new Date(post.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="post-content">{post.content}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Posts;
