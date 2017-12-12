const { ConsoleConnector, Bot } = require('../../lib');

const connector = new ConsoleConnector().listen();
const bot = new Bot({ connector });

bot.use(async (ctx, next) => {
    ctx.session.send(`> You said: ${ctx.message.getText()}`);
});
