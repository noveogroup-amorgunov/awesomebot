const { ConsoleConnector, ConsoleBot } = require('../../lib');
const giphyService = require('./giphyService');

const connector = new ConsoleConnector().listen();
const bot = new ConsoleBot({ connector });

bot.use(/\/gif (.+)/, async (ctx, next) => {
    const keywords = ctx.event.params[0];
    const gifUrl = await giphyService.getGifUrlByKeywords(keywords);

    ctx.session.send(`Goto ${gifUrl} to see ${keywords}`);
});

bot.use(async (ctx, next) => {
    ctx.session.send('Unknown command, try type /gif {any-words}, like /gif funny cat');
    next();
});
