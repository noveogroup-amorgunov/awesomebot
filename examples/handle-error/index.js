const {ConsoleConnector, ConsoleBot} = require('../../lib');

const connector = new ConsoleConnector().listen();
const bot = new ConsoleBot({connector});

bot.use(async () => {
    throw new Error('Awesome error');
});

bot.catch((err) => {
    console.error(err);
});
