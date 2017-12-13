const { ConsoleConnector, ConsoleBot } = require('../../lib');

const connector = new ConsoleConnector().listen();
const bot = new ConsoleBot({ connector });

bot.setInitialState({
    todos: [],
});

bot.use('/list', async ({session}) => {
    const {todos} = session.state;
    const msg = todos.length > 0 ? todos.join('\n') : 'No todos!';
    await session.send(msg);
});

bot.use('/clear', async ({session}) => {
    session.resetState();
    await session.send('Successfully clear all todos!');
});

bot.use(/\/add (.+)/, async ({session, event}) => {
    const newTodos = event.params[0];
    session.setState({ todos: [...session.state.todos, newTodos] });
    await session.send(`Todo: ${newTodos} added!`);
});

bot.use(async ({session}) => {
    await session.send('Unknown command. Type /list, /clear or /add {todo}.');
});
