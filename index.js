import TelegramBot from "node-telegram-bot-api";
import cron from "node-cron";
import fs from "fs";

import { sendDataAboutButton } from "./tgterminal.js";
import { sendDataAboutError } from "./tgterminal.js";
import { sendDataAboutText } from "./tgterminal.js";

const TOKENs = [
	"6654105779:AAEnCdIzKS_cgJUg4rMY8yNM3LPP5iZ-d_A",
	"7068045329:AAF0ZeLcIKKEvcubFTb2rWhmFBqrlWId0i8",
];

const TOKEN = TOKENs[1]; // 1 - оригинал
const bot = new TelegramBot(TOKEN, { polling: true });

const qu1z3xId = "923690530";
const jackId = "6815420098";
let BotName = "digfusionbot";

let usersData = [];

bot.setMyCommands([
	{
		command: "/restart",
		description: "Перезапуск 🔄️",
	},
]);

let rndNum, textToSayHello, match, rndId;

async function firstMeeting(chatId, numOfStage = 1) {
	const dataAboutUser = usersData.find((obj) => obj.chatId == chatId);

	try {
		switch (numOfStage) {
			case 1:
				await bot.editMessageText(
					`<b>Вас приветствует</b> компания <b><i>digfusion,</i></b> ваш <B>надежный</B> партнер в области <B>разработки чат-ботов!</B> 👋\n\nМы предоставляем услуги по <b>созданию чат-ботов</b> различных типов и уже <b>более года успешно</b> крутимся в <b>сфере разработки. 🦾</b>\n\nЗа нашими плечами <b>большой</b> опыт реализации <b>крупных</b> проектов, и мы готовы сделать <b>ваш</b> проект <b>таким же!</b> 😎\n\n<b>Нам важно</b> сохранять <b>нашу репутацию,</b> поэтому мы прилагаем <b>максимум усилий</b> для выполнения <b>каждого проекта</b> и действительно <b>вкладываем душу</b> в его реализацию. Даже <B>мелким деталям,</B> таким как <b>толстый шрифт</b> или <b><i>курсивный текст,</i></b> уделяется <B>колоссальное внимание!</B> 🤗\n\n<b>Обращайтесь к нам,</b> и мы поможем вам создать <b><i>эффективного, шустрого</i> и приятного для использования</b> чат-бота для любой вашей <b>деятельности!</b> 😉`,
					{
						parse_mode: "html",
						chat_id: chatId,
						message_id: usersData.find((obj) => obj.chatId == chatId)
							.messageId,
						disable_web_page_preview: true,
						reply_markup: {
							inline_keyboard: [
								[{ text: "Супер! 👍", callback_data: "firstMeeting2" }],
							],
						},
					}
				);
				break;
			case 2:
				await bot.editMessageText(
					`Теперь <b>узнаем</b> друг друга <b>получше!</b> 😊\n\nМы уже рассказали <b>о себе,</b> теперь <b>ваша</b> очередь! 😉 \n\n<b>Как можно к вам обращаться для дальнейшего общения? 🤔</b>`,
					{
						parse_mode: "html",
						chat_id: chatId,
						message_id: usersData.find((obj) => obj.chatId == chatId)
							.messageId,
						disable_web_page_preview: true,
						reply_markup: {
							inline_keyboard: [
								[
									{
										text: `Оставить "${dataAboutUser.telegramFirstName}" ✅`,
										callback_data: "firstMeeting3",
									},
								],
							],
						},
					}
				);
				break;
			case 3:
				break;
			case 4:
				break;
			case 2:
				break;
		}
	} catch (error) {
		console.log(error);
		sendDataAboutError(chatId, `${String(error)}`);
	}
}

async function StartAll() {
	if (TOKEN == TOKENs[1]) {
		BotName = "digsh27_bot";
	} else if (TOKEN == TOKENs[0]) {
		BotName = "digfusionbot";
	}

	bot.on("message", async (message) => {
		const chatId = message.chat.id;
		const text = message.text;

		if (!usersData.find((obj) => obj.chatId === chatId)) {
			usersData.push({
				chatId: chatId,
				login: message.from.first_name,
				telegramFirstName: message.from.first_name,
				messageId: null,
				userAction: null,
			});
		}

		const dataAboutUser = usersData.find((obj) => obj.chatId == chatId);

		if (dataAboutUser) {
			try {
				if (text.includes("")) {
				}
			} catch (error) {
				console.log(error);
				sendDataAboutError(chatId, `${String(error)}`);
			}

			switch (text) {
				case "/start":
				case "/restart":
					await bot
						.sendMessage(chatId, "ㅤ")
						.then(
							(message) => (dataAboutUser.messageId = message.message_id)
						);

					firstMeeting(chatId);
					break;
			}
		}

		bot.deleteMessage(chatId, message.message_id);
	});

	bot.on("callback_query", (query) => {
		const chatId = query.message.chat.id;
		const data = query.data;

		const dataAboutUser = usersData.find((obj) => obj.chatId == chatId);

		if (dataAboutUser) {
			if (data.includes("firstMeeting")) {
				match = data.match(/^firstMeeting(\d+)$/);

				firstMeeting(chatId, parseInt(match[1]));
			}
			switch (data) {
				case "exit":
					menuHome(chatId);
					break;
				case "":
					break;
				case "":
					break;
				case "":
					break;
				case "":
					break;
				case "":
					break;
			}
		}
	});
}

StartAll();
