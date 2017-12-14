const {ConsoleConnector, ConsoleBot, MongoSessionStore} = require('../../lib');

const sessionStore = new MongoSessionStore('mongodb://localhost:27017');
sessionStore.connect();

const connector = new ConsoleConnector().listen();
const bot = new ConsoleBot({connector, sessionStore});

bot.use(async (ctx, next) => {
    ctx.session.setState({ count: (ctx.session.state.count || 0) + 1 });
    console.log(ctx.session.state);
    if (ctx.event.isText()) {
        ctx.session.send(ctx.event.text);
    }
});
