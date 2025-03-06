const Router = require('koa-router');
const { signup, login, getPosts, createPost, deletePost } = require('./controllers');
const { authMiddleware } = require('./middleware');

const router = new Router();

router.post('/signup', signup);
router.post('/login', login);
router.get('/posts', authMiddleware, getPosts);
router.post('/posts', authMiddleware, createPost);
router.delete('/posts/:id', authMiddleware, deletePost);

module.exports = router;
