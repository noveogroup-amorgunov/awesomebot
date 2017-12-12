const { ConsoleConnector, Bot } = require('../../lib');

const connector = new ConsoleConnector().listen();
const bot = new Bot({ connector });


bot.setInitialState({
    todos: [],
});

bot.use(async ({session, message}) => {
    switch (message.getText()) {
        case '/list':
            if (session.state.todos.length > 0) {
                await session.send(session.state.todos.join('\n'));
            } else {
                await session.send('No todos!');
            }
            break;
        case '/clear':
            session.resetState();
            await session.send('Successfully clear all todos!');
            break;
        default:
            const newTodos = message.getText();
            session.setState({ todos: [...session.state.todos, newTodos] });
            await session.send(`Todo: ${newTodos} added!`);
            break;
    }
});
