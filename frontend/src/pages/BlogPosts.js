import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
// const { user, token, logout } = useContext(AuthContext);
import "./BlogPosts.css";

const BlogPosts = () => {
    const { user, token, logout } = useContext(AuthContext);
    const [posts, setPosts] = useState([]);
    const [newPost, setNewPost] = useState({ title: "", content: "" });

    useEffect(() => {
        axios.get("http://localhost:3000/posts", { headers: { Authorization: `Bearer ${token}` } })
            .then(res => setPosts(res.data))
            .catch(err => console.error(err));
    }, [token]);

    const handleCreatePost = async () => {
        try {
            await axios.post("http://localhost:3000/posts", newPost, { headers: { Authorization: `Bearer ${token}` } });
            setNewPost({ title: "", content: "" });
            // Refresh posts after creating a new one
            const res = await axios.get("http://localhost:3000/posts", { headers: { Authorization: `Bearer ${token}` } });
            setPosts(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleDeletePost = async (id) => {
        try {
            await axios.delete(`http://localhost:3000/posts/${id}`, { headers: { Authorization: `Bearer ${token}` } });
            setPosts(posts.filter(post => post.id !== id));
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="blog-container">
            <div className="blog-header">
                <div className="header-content">
                    <h1>Blog Posts</h1>
                    <p className="welcome-text">Welcome, {user?.username || 'User'}!</p>
                </div>
                <button className="logout-button" onClick={logout}>
                    <i className="fas fa-sign-out-alt"></i> Logout
                </button>
            </div>
            
            <div className="main-content">
                <div className="create-post-section">
                    <div className="create-post-form">
                        <h2>Create New Post</h2>
                        <div className="form-group">
                            <label htmlFor="post-title">Title</label>
                            <input 
                                id="post-title"
                                type="text" 
                                className="post-input"
                                placeholder="Enter your post title" 
                                value={newPost.title} 
                                onChange={(e) => setNewPost({ ...newPost, title: e.target.value })} 
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="post-content">Content</label>
                            <textarea 
                                id="post-content"
                                className="post-textarea"
                                placeholder="Write your post content here..." 
                                value={newPost.content} 
                                onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                                rows="6"
                            ></textarea>
                        </div>
                        <button 
                            className="create-button" 
                            onClick={handleCreatePost}
                            disabled={!newPost.title || !newPost.content}
                        >
                            <i className="fas fa-plus-circle"></i> Publish Post
                        </button>
                    </div>
                </div>
                
                <div className="posts-section">
                    <h2>Recent Posts</h2>
                    <div className="posts-list">
                        {posts.map(post => (
                            <div key={post.id} className="post-card">
                                <h3 className="post-title">{post.title}</h3>
                                <p className="post-content">{post.content}</p>
                                <div className="post-footer">
                                    <span className="post-author">By: {post.author}</span>
                                    {post.author === user?.username && (
                                        <button className="delete-button" onClick={() => handleDeletePost(post.id)}>Delete</button>
                                    )}
                                </div>
                            </div>
                        ))}
                        {posts.length === 0 && <p className="no-posts">No posts available. Create your first post!</p>}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BlogPosts;
