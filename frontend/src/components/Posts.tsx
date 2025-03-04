import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Post } from '../types';

const API_URL = 'http://localhost:3001';

const Posts: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [newPost, setNewPost] = useState({ title: '', content: '' });
  const [error, setError] = useState<string>('');
  const { user, token } = useAuth();

  const fetchPosts = async () => {
    try {
      const response = await axios.get(`${API_URL}/posts`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPosts(response.data);
    } catch (err) {
      setError('Failed to fetch posts');
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${API_URL}/posts`,
        newPost,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setPosts([...posts, response.data]);
      setNewPost({ title: '', content: '' });
    } catch (err) {
      setError('Failed to create post');
    }
  };

  const handleDelete = async (postId: number) => {
    try {
      await axios.delete(`${API_URL}/posts/${postId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPosts(posts.filter(post => post.id !== postId));
    } catch (err) {
      setError('Failed to delete post');
    }
  };

  return (
    <div className="posts-container">
      <h2>Blog Posts</h2>
      {error && <div className="error">{error}</div>}
      
      <form onSubmit={handleSubmit} className="new-post-form">
        <h3>Create New Post</h3>
        <div className="form-group">
          <label>Title:</label>
          <input
            type="text"
            value={newPost.title}
            onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
            required
          />
        </div>
        <div className="form-group">
          <label>Content:</label>
          <textarea
            value={newPost.content}
            onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
            required
          />
        </div>
        <button type="submit">Create Post</button>
      </form>

      <div className="posts-list">
        {posts.map(post => (
          <div key={post.id} className="post-card">
            <h3>{post.title}</h3>
            <p>{post.content}</p>
            <div className="post-meta">
              <span>By: {post.author}</span>
              <span>Date: {new Date(post.createdAt).toLocaleDateString()}</span>
            </div>
            {user?.username === post.author && (
              <button
                onClick={() => handleDelete(post.id)}
                className="delete-button"
              >
                Delete
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Posts; 