import TelegramBot from "node-telegram-bot-api";
import fs from "fs";

import { config } from "./config.js";

const bot = new TelegramBot(config.TOKENs[2], { polling: false });
const qu1z3xId = "923690530";

async function sendDataAboutText(chatId, firstName, text) {
	await bot.sendMessage(
		qu1z3xId,
		`<b><a href="https://t.me/digfusionbot">⚪</a> #digfusion | Text\n\n<a href="tg://user?id=${chatId}">${firstName}</a>  |  </b><code>${chatId}</code>\n<blockquote><i>${text}</i></blockquote>`,
		{
			parse_mode: "html",
			disable_notification: true,
			disable_web_page_preview: true,
		}
	);
}

async function sendDataAboutButton(chatId, firstName, data) {
	await bot.sendMessage(
		qu1z3xId,
		`<b><a href="https://t.me/digfusionbot">⚪</a> #digfusion | Button\n\n<a href="tg://user?id=${chatId}">${firstName}</a>  |  </b><code>${chatId}</code>\n<blockquote><b>[${data}]</b></blockquote>`,
		{
			parse_mode: "html",
			disable_notification: true,
			disable_web_page_preview: true,
		}
	);
}

async function sendDataAboutError(chatId, firstName, text) {
	await bot.sendMessage(
		qu1z3xId,
		`<b><a href="https://t.me/digfusionbot">⚪</a> #digfusion | ⛔️ ERROR ⛔️\n\n<a href="tg://user?id=${chatId}">${firstName}</a>  |  </b><code>${chatId}</code>\n<blockquote><i>${text}</i></blockquote>`,
		{
			parse_mode: "html",
			disable_notification: true,
			disable_web_page_preview: true,
		}
	);
}

async function sendDataAboutDataBase(dataToSend) {
	fs.writeFile("DB.json", JSON.stringify(dataToSend), (err) => {
		if (err) throw err;

		// Отправляем файл пользователю
		bot.sendDocument(qu1z3xId, "./DB.json", {
			caption: `<b><a href="https://t.me/digfusionbot">⚪</a> #digfusion | Data</b>`,
			parse_mode: "HTML",
		});
	});
}

//? ЭКСПОРТ ФУНКЦИЙ В index.js

export { sendDataAboutButton };
export { sendDataAboutError };
export { sendDataAboutText };
export { sendDataAboutDataBase };
