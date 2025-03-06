import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import './Posts.css'; // Add this import for the CSS

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

export default Posts;
