import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

const BlogPosts = () => {
    const { token, logout } = useContext(AuthContext);
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
        <div>
            <h2>Blog Posts</h2>
            <button onClick={logout}>Logout</button>
            <div>
                <input type="text" placeholder="Title" value={newPost.title} onChange={(e) => setNewPost({ ...newPost, title: e.target.value })} />
                <textarea placeholder="Content" value={newPost.content} onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}></textarea>
                <button onClick={handleCreatePost}>Create Post</button>
            </div>
            <ul>
                {posts.map(post => (
                    <li key={post.id}>
                        <h3>{post.title}</h3>
                        <p>{post.content}</p>
                        <button onClick={() => handleDeletePost(post.id)}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default BlogPosts;
