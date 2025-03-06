const jwt = require('jsonwebtoken');
const SECRET_KEY = "your_secret_key"; // ควรใช้ .env ในโปรเจกต์จริง

const authMiddleware = async (ctx, next) => {
    const token = ctx.headers.authorization?.split(" ")[1];
    if (!token) {
        ctx.status = 401;
        ctx.body = { error: "Unauthorized" };
        return;
    }

    try {
        ctx.state.user = jwt.verify(token, SECRET_KEY);
        await next();
    } catch (err) {
        ctx.status = 403;
        ctx.body = { error: "Invalid token" };
    }
};

module.exports = { authMiddleware, SECRET_KEY };
