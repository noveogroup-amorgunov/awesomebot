process.env.NTBA_FIX_319 = true;
const {TelegramConnector, TelegramBot} = require('../../lib');

const token = '489940580:AAFXNk3HABpA6785n1eC4OVvpsxE5v9ERuQ';
const connector = new TelegramConnector({token}).listen();
const bot = new TelegramBot({connector});

const store = {
    messages: [],
    likes: []
};

function createLikeButtons(buttons) {
    const data = buttons.map((button, i) => ({
        text: `${button.text} ${button.count}`,
        callback_data: i
    }));
    return [data];
}


bot.use(async (ctx, next) => {
    if (ctx.event.isText()) {
        const likeButtons = [
            {text: '👍', count: 0},
            {text: '🤖', count: 0},
            {text: '😍', count: 0}
        ];

        const inline_keyboard = createLikeButtons(likeButtons);
        console.log(inline_keyboard);
        const opts = {parse_mode: 'Markdown', reply_markup: {inline_keyboard}};

        await ctx.session
            .send(`Hello, *${ctx.session.getUsername()}*`, opts)
            .then((message) => {
                store.messages.push({fromTelegram: message, likeButtons});
            });
    } else if (ctx.event.isCallbackQuery()) {
        const query = ctx.event._rawEvent.callback_query;
        const {payload} = ctx.event;
        console.log(`payload: ${payload}`);
        await ctx.session.answerCallbackQuery(query.id, 'Done!');

        const message = store.messages.filter(m => m.fromTelegram.message_id === query.message.message_id)[0];
        if (message && message.likeButtons[payload]) {
            const {likeButtons} = message;
            likeButtons[payload].count += 1;

            await ctx.session.editMessageReplyMarkup({ inline_keyboard: createLikeButtons(likeButtons) }, {
                message_id: query.message.message_id,
                chat_id: query.message.chat.id
            });
        } else {
            await ctx.session.send('Message is not found');
        }
    }
});


/*
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
*/