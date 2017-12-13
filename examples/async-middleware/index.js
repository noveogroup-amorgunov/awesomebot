const {ConsoleConnector, ConsoleBot} = require('../../lib');

const connector = new ConsoleConnector().listen();
const bot = new ConsoleBot({connector});

bot.use(async (ctx, next) => {
    const start = Date.now();
    await next();
    const end = Math.round((Date.now() - start) / 1000);
    console.log(`Request is handled for about ${end}sec`);
});

bot.use(async (ctx) => {
    const timeout = Math.round(Math.random() * 10) * 1000;
    await new Promise(resolve => setTimeout(resolve, timeout));
    ctx.session.send(`timeout ${timeout}`);
});
