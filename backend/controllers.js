const jwt = require('jsonwebtoken');
const { users, posts } = require('./data');
const { SECRET_KEY } = require('./middleware');

const signup = async (ctx) => {
    const { username, password } = ctx.request.body;
    if (!username || !password) {
        ctx.status = 400;
        ctx.body = { error: "Username and password required" };
        return;
    }

    users.push({ username, password });
    ctx.body = { message: "User registered successfully" };
};

const login = async (ctx) => {
    const { username, password } = ctx.request.body;
    const user = users.find(u => u.username === username && u.password === password);
    
    if (!user) {
        ctx.status = 401;
        ctx.body = { error: "Invalid credentials" };
        return;
    }

    const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: "1h" });
    ctx.body = { token };
};

const getPosts = async (ctx) => {
    ctx.body = posts;
};

const createPost = async (ctx) => {
    const { title, content } = ctx.request.body;
    if (!title || !content) {
        ctx.status = 400;
        ctx.body = { error: "Title and content required" };
        return;
    }

    const newPost = { id: posts.length + 1, title, content, author: ctx.state.user.username };
    posts.push(newPost);
    ctx.body = { message: "Post created", post: newPost };
};

const deletePost = async (ctx) => {
    const postId = parseInt(ctx.params.id);
    const postIndex = posts.findIndex(p => p.id === postId && p.author === ctx.state.user.username);

    if (postIndex === -1) {
        ctx.status = 403;
        ctx.body = { error: "Post not found or unauthorized" };
        return;
    }

    posts.splice(postIndex, 1);
    ctx.body = { message: "Post deleted" };
};

module.exports = { signup, login, getPosts, createPost, deletePost };
