
// server.js
import Koa from 'koa';
import KoaRouter from 'koa-router';
import mount from 'koa-mount';
import serve from 'koa-static';
import { ChatGPTAPI } from 'chatgpt'
import bodyParser from 'koa-bodyparser';
import dotenv from 'dotenv-safe'
dotenv.config()

const app = new Koa();
const router = new KoaRouter();

app.use(bodyParser());

async function send_chat(message) {
  // sessionToken is required; see below for details
  try {
    console.log("process.env.SESSION_TOKEN: ", process.env.SESSION_TOKEN);
    const api = new ChatGPTAPI({
      sessionToken: process.env.SESSION_TOKEN
    })

    // ensure the API is properly authenticated
    await api.ensureAuth()

    // send a message and wait for the response
    const response = await api.sendMessage(
      message
    )

    console.log(response);
    return response;
  } catch (e) {
    console.log(e);
    return "我需要休息一下"
  }
}

async function post_chatgpt(ctx) {
  const body = ctx.request.body;
  console.log("ctx: ", ctx);
  console.log("ctx body: ", ctx.request.body);
  let response = await send_chat(ctx.request.body['msg']);
  ctx.body = { reply: response };
  ctx.status = 200
}

router.get('/hello', async (ctx, next) => {
  ctx.body = "Hello World!";
})
  .post('/api/chatgpt', post_chatgpt);


app.use(router.routes())
  .use(router.allowedMethods());

app.use(mount('/', serve('public/')));

console.log("listen 3000");
app.listen(3000);