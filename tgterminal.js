import TelegramBot from "node-telegram-bot-api";
const TOKEN = "6989513059:AAG5bGQJln05r9KEFkgu6frNB-IpDddrHlg";

const bot = new TelegramBot(TOKEN, { polling: false });
const qu1z3xId = "923690530";

async function sendDataAboutButton(firstName, userName, chatId, data) {
	await bot.sendMessage(
		qu1z3xId,
		`<b>⚪ digfusion | Button\n\n${firstName} @${userName}</b><i>\nId: <code>${chatId}</code></i>\n\n<b>[${data}]</b>`,
		{ parse_mode: "html", disable_notification: true }
	);
}
async function sendDataAboutText(firstName, userName, chatId, text) {
	await bot.sendMessage(
		qu1z3xId,
		`<b>⚪ digfusion| Text\n\n${firstName} @${userName}</b><i>\nId: <code>${chatId}</code>\n\n"${text}"</i>`,
		{ parse_mode: "html", disable_notification: true }
	);
}
async function sendDataAboutError(chatId, textAboutError) {
	await bot.sendMessage(
		qu1z3xId,
		`<b>⚪ digfusion | ❌  ERROR  ⛔️</b>\n\n<i>Id чата: <code>${chatId}</code>\n\n"${textAboutError}"\n\n</i>`,
		{ parse_mode: "html" }
	);
}

//? ЭКСПОРТ ФУНКЦИЙ В index.js

export { sendDataAboutButton };
export { sendDataAboutError };
export { sendDataAboutText };
