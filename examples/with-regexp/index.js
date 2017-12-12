const { ConsoleConnector, Bot } = require('../../lib');

const connector = new ConsoleConnector().listen();
const bot = new Bot({ connector });

bot.use(/\/yo (.+)/, async ({session, message}) => {
    await session.send(`hey ${message.params[0]}`);
});
