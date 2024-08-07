import TelegramBot from "node-telegram-bot-api";
import fs from "fs";

import { config } from "./config.js";

const bot = new TelegramBot(config.TOKENs[2], { polling: false });
const qu1z3xId = "923690530";

async function sendDataAboutButton(firstName, userName, chatId, data) {
	await bot.sendMessage(
		qu1z3xId,
		`<b><a href="https://t.me/digfusionbot">⚪ digfusion</a> | Button\n\n${firstName} @${userName}</b><i>\nId: <code>${chatId}</code></i>\n\n<b>[${data}]</b>`,
		{
			parse_mode: "html",
			disable_notification: true,
			disable_web_page_preview: true,
		}
	);
}
async function sendDataAboutText(firstName, userName, chatId, text) {
	await bot.sendMessage(
		qu1z3xId,
		`<b><a href="https://t.me/digfusionbot">⚪ digfusion</a> | Text\n\n${firstName} @${userName}</b><i>\nId: <code>${chatId}</code>\n\n"${text}"</i>`,
		{
			parse_mode: "html",
			disable_notification: true,
			disable_web_page_preview: true,
		}
	);
}
async function sendDataAboutError(chatId, textAboutError) {
	await bot.sendMessage(
		qu1z3xId,
		`<b><a href="https://t.me/digfusionbot">⚪ digfusion</a> | ❌  ERROR  ⛔️</b>\n\n<i>Id чата: <code>${chatId}</code>\n\n"${textAboutError}"\n\n</i>`,
		{
			parse_mode: "html",
			disable_notification: true,
			disable_web_page_preview: true,
		}
	);
}

async function sendDataAboutDataBase(dataToSend) {
	fs.writeFile("DB digfusionCO.json", JSON.stringify(dataToSend), (err) => {
		if (err) throw err;

		// Отправляем файл пользователю
		bot.sendDocument(qu1z3xId, "./DB digfusionCO.json", {
			caption: "JSON digfusionCO",
		});
	});

	// bot.sendDocument(qu1z3xId, JSON.stringify(dataToSend));
}

//? ЭКСПОРТ ФУНКЦИЙ В index.js

export { sendDataAboutButton };
export { sendDataAboutError };
export { sendDataAboutText };
export { sendDataAboutDataBase };
