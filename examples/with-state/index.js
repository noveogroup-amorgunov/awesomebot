const {ConsoleConnector, ConsoleBot} = require('../../lib');

const connector = new ConsoleConnector().listen();
const bot = new ConsoleBot({connector});

const {DEBUG_SESSION_STATE} = process.env;

bot.setInitialState({asking: false, name: null});

if (DEBUG_SESSION_STATE) {
    bot.use(async (ctx, next) => {
        console.log(`State before request: ${JSON.stringify(ctx.session.state)}`);
        await next();
        console.log(`State after request: ${JSON.stringify(ctx.session.state)}`);
    });
}

bot.use(async ({session, event}) => {
    if (session.state.asking) {
        session.setState({name: event.text, asking: false});
        await session.send(`Hey ${session.state.name}!`);
    } else {
        session.resetState();
        session.setState({asking: true});
        await session.send("Hi, what's your nickname?");
    }
});
