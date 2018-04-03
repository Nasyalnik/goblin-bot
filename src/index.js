const Datastore = require('nedb'),
    db = new Datastore({
        filename: '/tmp/costs',
        autoload: true
    });

const Telegraf = require('telegraf')
const bot = new Telegraf('process.env.BOT_TOKEN')

bot.start((ctx) => ctx.reply('Welcome!'))
bot.command('/new_cost', (ctx) => {
    const cost = {
        message: ctx.message.text
    }
    db.insert(cost, function (err, newDoc) {
        if (err) {
            console.error(err)
        }
    });
})
bot.startPolling()