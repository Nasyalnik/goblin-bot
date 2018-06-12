const TelegramBot = require('node-telegram-bot-api');

const Statuses = {
    DEFAULT: 'DEFAULT',
    WAITING_PLANNED_EXPENSE: 'WAITING_PLANNED_EXPENSE',
    WAITING_EXPENSE: 'WAITING_EXPENSE'
};

const currentState = {
    status: Statuses.DEFAULT
};

const Datastore = require('nedb'),
    db = new Datastore({
        filename: '/tmp/costs',
        autoload: true
    });

const token = '479710272:AAFvk7y9A6vLANbAd0sPevwd3cKlznS5gIg';
const bot = new TelegramBot(token, {
    polling: true
});

bot.onText(/\/plancost/, (msg, match) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, 'Введите запланированные расходы');
    currentState.status = Statuses.WAITING_PLANNED_EXPENSE;
});
bot.onText(/(.+) (\d+)\s*(.*)/, (msg, match) => {
    const chatId = msg.chat.id;
    if (currentState.status == Statuses.WAITING_PLANNED_EXPENSE) {
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
        currentState.status = 'DEFAULT';
    }
});

bot.onText(/\/addcost/, (msg, match) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, 'Введите текущие расходы');
    currentState.status = Statuses.WAITING_EXPENSE;
});

bot.onText(/(.+) (\d+)/, (msg, match) => {
    const chatId = msg.chat.id;
    if (currentState.status == Statuses.WAITING_EXPENSE) {
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
        currentState.status = 'DEFAULT';
    }

});