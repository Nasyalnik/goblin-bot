const TelegramBot = require('node-telegram-bot-api');

const Datastore = require('nedb'),
    db = new Datastore({
        filename: '/tmp/costs',
        autoload: true
    });

const token = '479710272:AAFvk7y9A6vLANbAd0sPevwd3cKlznS5gIg';
const bot = new TelegramBot(token, {
    polling: true
});

bot.onText(/\/plancost (.+) (\d+)\s*(.*)/, (msg, match) => {
    const chatId = msg.chat.id;
    const plannedExpense = {
        type: 'PLANNED_EXPENSE',
        name: match[1],
        value: match[2],
        month: match[3]
    };
    db.insert(plannedExpense, function (err, newDoc) {
        if (err) {
            console.error(err);
        }
    });
    bot.sendMessage(chatId, JSON.stringify(plannedExpense));
});

bot.onText(/\/addcost (.+) (\d+)\s*(.*)/, (msg, match) => {
    const chatId = msg.chat.id;
    const expense = {
        type: 'EXPENSE',
        name: match[1],
        value: match[2],
        month: new Date()
    };
    db.insert(expense, function (err, newDoc) {
        if (err) {
            console.error(err);
        }
    });
    bot.sendMessage(chatId, JSON.stringify(expense));
});

bot.on('message', (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, 'Received your message');
});