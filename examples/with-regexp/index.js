const {ConsoleConnector, ConsoleBot} = require('../../lib');

const connector = new ConsoleConnector().listen();
const bot = new ConsoleBot({connector});

bot.use(/\/yo (.+)/, async ({session, event}) => {
    await session.send(`hey ${event.params[0]}`);
});
