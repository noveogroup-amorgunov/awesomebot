# awesomebot

Make your awesome bots :robot: in few steps!

- Written with :zap: ES6/ES7 javascript syntax
- Very easy to use
- Use custom session store, platform connector with same interface
- Support telegram

## Installation

You can install awesomebot from npm or yarn

```bash
npm install awesomebot --save
```
or
```bash
yarn add awesomebot
```

## Examples

You can find a lot of examples in the [examples folder](https://github.com/noveogroup-amorgunov/awesomebot/tree/master/examples) :rocket:.

Here is the simple example of usign awesomebot as the **echo-bot**. It always says what you said. There is used async/await function as message's handler.

```js
const {ConsoleConnector, ConsoleBot} = require('awesomebot');

 // Create "console" connector to listen process.stdin
const connector = new ConsoleConnector().listen();
const bot = new ConsoleBot({connector});

// Middleware for handling messages
bot.use(async (ctx, next) => {
    const {text} = ctx.event; // Get user's message
    await ctx.session.send(`> You said: ${text}`); // Send back
    next();
});
```

You can run script and type text to console:

```bash
hello bot
> You said: hello bot
yo
> You said: you
```

Another examples:

- :snowman: [telegram-hello-world](examples/telegram-hello-world) - telegram example bot 
- [echo-bot](examples/echo-bot)
- [async-middleware](examples/async-middleware) - notify the execution time
- [handle-error](examples/handle-error) - custom function for handling errors
- [todos](examples/todos) - todolist
- [with-regexp](examples/with-regexp) - exucate middleware by cetrain regexp/string (like command)
- [with-state](examples/with-state) - operate with session state
- :fire: [giphy-bot](examples/giphy-bot) - find any gif by keywords

## Plans

- Add `MongoSessionStore`
- Add `RedisSessionStore`
- Add `VKConnector`
- Add Documentation
- Add dialog system like microsoft botbuilder