const Koa = require('koa');
const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const cors = require('koa-cors');

const app = new Koa();
const router = new Router();

// In-memory storage
const users = [];
const posts = [];

// JWT secret key
const JWT_SECRET = 'your-secret-key';

// Middleware
app.use(bodyParser());
app.use(cors());

// Authentication middleware
const auth = async (ctx, next) => {
  try {
    const token = ctx.header.authorization?.split(' ')[1];
    if (!token) {
      ctx.status = 401;
      ctx.body = { error: 'No token provided' };
      return;
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    ctx.state.user = decoded;
    await next();
  } catch (err) {
    ctx.status = 401;
    ctx.body = { error: 'Invalid token' };
  }
};

// Routes
router.post('/signup', async (ctx) => {
  const { username, password } = ctx.request.body;

  // Validate input
  if (!username || !password) {
    ctx.status = 400;
    ctx.body = { error: 'Username and password are required' };
    return;
  }

  // Check if user already exists
  if (users.find(u => u.username === username)) {
    ctx.status = 400;
    ctx.body = { error: 'Username already exists' };
    return;
  }

  // Hash password and save user
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = {
    id: users.length + 1,
    username,
    password: hashedPassword
  };
  users.push(user);

  ctx.status = 201;
  ctx.body = { message: 'User created successfully' };
});

router.post('/login', async (ctx) => {
  const { username, password } = ctx.request.body;

  // Find user
  const user = users.find(u => u.username === username);
  if (!user) {
    ctx.status = 401;
    ctx.body = { error: 'Invalid credentials' };
    return;
  }

  // Verify password
  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) {
    ctx.status = 401;
    ctx.body = { error: 'Invalid credentials' };
    return;
  }

  // Generate JWT token
  const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, {
    expiresIn: '24h'
  });

  ctx.body = { token };
});

router.get('/posts', auth, async (ctx) => {
  ctx.body = posts;
});

router.post('/posts', auth, async (ctx) => {
  const { title, content } = ctx.request.body;
  const author = ctx.state.user.username;

  // Validate input
  if (!title || !content) {
    ctx.status = 400;
    ctx.body = { error: 'Title and content are required' };
    return;
  }

  const post = {
    id: posts.length + 1,
    title,
    content,
    author,
    createdAt: new Date()
  };
  posts.push(post);

  ctx.status = 201;
  ctx.body = post;
});

router.delete('/posts/:id', auth, async (ctx) => {
  const postId = parseInt(ctx.params.id);
  const postIndex = posts.findIndex(p => p.id === postId);

  if (postIndex === -1) {
    ctx.status = 404;
    ctx.body = { error: 'Post not found' };
    return;
  }

  // Check if user is the author
  if (posts[postIndex].author !== ctx.state.user.username) {
    ctx.status = 403;
    ctx.body = { error: 'Not authorized to delete this post' };
    return;
  }

  posts.splice(postIndex, 1);
  ctx.status = 200;
  ctx.body = { message: 'Post deleted successfully' };
});

// Use router middleware
app.use(router.routes());
app.use(router.allowedMethods());

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 