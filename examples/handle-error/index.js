const { ConsoleConnector, Bot } = require('../../lib');

const connector = new ConsoleConnector().listen();
const bot = new Bot({ connector });

bot.use(async (ctx) => {
    throw new Error('Awesome error');
});

bot.catch((err) => {
    console.error('ERROR: Opps', err);
});
