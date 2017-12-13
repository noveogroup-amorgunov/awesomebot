const {TelegramConnector, TelegramBot} = require('../../lib');

const token = process.env.TOKEN;

const connector = new TelegramConnector({token}).listen();
const bot = new TelegramBot({connector});

bot.use(async (ctx, next) => {
    const text = `Hello, *${ctx.session.getUsername()}*`;
    await ctx.session.send(text, {parse_mode: 'Markdown'})
});
