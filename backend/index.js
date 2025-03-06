const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const router = require('./routes');
const cors = require('@koa/cors');
const app = new Koa();

app.use(cors({
    origin: 'http://localhost:3001', // ให้ Frontend ที่พอร์ต 3001 เข้าถึงได้
  }));

  
app.use(bodyParser());
app.use(router.routes()).use(router.allowedMethods());

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
