const {ConsoleConnector, ConsoleBot} = require('../../lib');

const connector = new ConsoleConnector().listen();
const bot = new ConsoleBot({connector});

bot.use(async (ctx, next) => {
    if (ctx.event.isText()) {
        ctx.session.send(ctx.event.text);
    }
});

/* bot.use(async (ctx, next) => {
    ctx.session.send(`Hello, ${ctx.session.getUsername()}`);
}); */
