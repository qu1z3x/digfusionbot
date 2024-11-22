import TelegramBot from "node-telegram-bot-api";
import cron from "node-cron";
import fs from "fs";

import {
	sendDataAboutText,
	sendDataAboutButton,
	sendDataAboutError,
	sendDataAboutDataBase,
} from "./tgterminal.js";

import { Client } from "@gradio/client";

import { config } from "./config.js";

const TOKEN = config.TOKENs[0]; // 1 - оригинал
const bot = new TelegramBot(TOKEN, { polling: true });

const qu1z3xId = "923690530";
const jackId = "6815420098";

let BotName = "digfusionbot";

let usersData = [];
let systemData = {
	newRequestsToday: 0,
	activityToday: 0,
	newClientsToday: 0,
	newFeedbacksToday: 0,

	requestsAllTime: 0,
	feedbacksAllTime: 0,
	activityAllTime: 0,
};

let services = [
	//? БОТЫ

	{
		name: `Однотипный бот`,
		moreAbout:
			"Сбор информации с пользователей, и доступ к полученной базе данных. Выполнение несложных операций.",
		executionDate: "1 - 5 дней",
		lifeTime: "",
		firstPrice: 8000,
		price: 4990,
		priceSentence: "",
		type: "bot",
	},
	{
		name: `Бот среднего класса`,
		moreAbout:
			"Один ведущий раздел с главным функционалом, базы данных любых массивов информации и возможность рассылки сообщений. Базовоя интеграциия нейросети.",
		executionDate: "3 - 8 дней",
		lifeTime: "",
		firstPrice: 15000,
		price: 9990,
		priceSentence: "",
		type: "bot",
	},
	{
		name: `Сложносоставной бот`,
		moreAbout:
			"Полностью законченая площадка, со множеством разделов, главным меню и с возможностью администрирования. Сложное внедрение нейросети.",
		executionDate: "8 и больше дней",
		lifeTime: "",
		firstPrice: 20000,
		price: 14990,
		priceSentence: "",
		type: "bot",
	},

	//? СЕРВЕРЫ

	// Подходит для тех, кому действительно не хочется заморачиваться с собственным сервером.

	{
		name: `Российский сервер`,
		variations: [
			{
				name: "1 нед",
				moreAbout:
					"Неделя хранения проекта на нашем МОЩНОМ хостинге, с подключением, настройкой, поддержкой и гарантией качества!",
				location: "Москва 🇷🇺",
				lifeTime: "7 дней",
				firstPrice: 0,
				price: 169, // 130 себестоимость
				priceSentence: "",
			},
			{
				name: "1 мес",
				moreAbout:
					"Месяц хранения проекта на нашем МОЩНОМ хостинге, с подключением, настройкой, поддержкой и гарантией качества!",
				location: "Москва 🇷🇺",
				lifeTime: "30 дней",
				firstPrice: 750,
				price: 670,
				priceSentence: "",
			},
			{
				name: "3 мес",
				moreAbout:
					"Три месяца хранения проекта на нашем МОЩНОМ хостинге, с подключением, настройкой, поддержкой и гарантией качества!",
				location: "Москва 🇷🇺",
				lifeTime: "90 дней",
				firstPrice: 2200,
				price: 1990,
				priceSentence: "",
			},
			{
				name: "6 мес",
				moreAbout:
					"Шесть месяцев хранения проекта на нашем МОЩНОМ хостинге, с подключением, настройкой, поддержкой и гарантией качества!",
				location: "Москва 🇷🇺",
				lifeTime: "180 дней",
				firstPrice: 4400,
				price: 3990,
				priceSentence: "",
			},
		],
		type: "server",
	},
	{
		name: `Сервер за рубежом`,
		variations: [
			{
				name: "1 нед",
				moreAbout:
					"Неделя хранения проекта на нашем МОЩНОМ зарубежном сервере. Нужен для обхода ограничений и интеграции сервисов ChatGPT, Google и тд",
				location: "Нидерланды 🇳🇱",
				lifeTime: "7 дней",
				firstPrice: 0,
				price: 199, // 180 себестоимость
				priceSentence: "",
			},
			{
				name: "1 мес",
				moreAbout:
					"Месяц хранения проекта на нашем МОЩНОМ зарубежном сервере. Нужен для обхода ограничений и интеграции сервисов ChatGPT, Google и тд",
				location: "Нидерланды 🇳🇱",
				lifeTime: "30 дней",
				firstPrice: 850,
				price: 799, // 760 себестоимость
				priceSentence: "",
			},
			{
				name: "3 мес",
				moreAbout:
					"Три месяца хранения проекта на нашем МОЩНОМ зарубежном сервере. Нужен для обхода ограничений и интеграции сервисов ChatGPT, Google и тд",
				location: "Нидерланды 🇳🇱",
				lifeTime: "90 дней",
				firstPrice: 2600,
				price: 2449, // 2320 себестоимость
				priceSentence: "",
			},
			{
				name: "6 мес",
				moreAbout:
					"Шесть месяцев хранения проекта на нашем МОЩНОМ зарубежном сервере. Нужен для обхода ограничений и интеграции сервисов ChatGPT, Google и тд",
				location: "Нидерланды 🇳🇱",
				lifeTime: "180 дней",
				firstPrice: 5200,
				price: 4990, // 4628 себестоимость
				priceSentence: "",
			},
		],
		type: "server",
	},
];

if (services)
	//? ФОРМИРОВАНИЕ СТРОЧКИ ПРАЙСА
	for (let i = 0; i < services.length; i++) {
		const obj = services[i];

		if (obj.type == "bot") {
			obj.priceSentence = `${
				obj.firstPrice
					? `<s>${obj.firstPrice}</s> <b><i>${
							obj.price
						}р (-${Math.floor(
							((obj.firstPrice - obj.price) / obj.firstPrice) *
								100
						)}%) 🔥</i></b>`
					: `<b><i>${obj.price}р</i></b>`
			}`;
		}
		if (obj.type == "server") {
			for (let j = 0; j < obj.variations.length; j++) {
				const element = obj.variations[j];

				element.priceSentence = `${
					element.firstPrice
						? `<s>${element.firstPrice}</s> <b><i>${
								element.price
							}р (выгода ${Math.round((element.firstPrice - element.price) / 10) * 10}р) 🔥</i></b>`
						: `<b><i>${element.price}р</i></b>`
				}`;
			}
		}
	}

const ourProjects = [
	{
		name: `digfusion | услуги ☑️`,
		botName: "digfusionbot",
		moreAboutText: `Да, это наш бот-консультант. Серьёзная работа с данными, автоматизация бизнес-процесса, множество сложных разделов. Убедитесь в этом сами, ведь сейчас вы читаете текст этого бота! 😉`,
		serviceSentence: `${services[2].name} - <a href="https://t.me/${BotName}/?start=catalogOfServices${3}">к услуге</a>\n\n<b>Цена:</b> ${services[2].priceSentence}`,
	},
	{
		name: `KungFuFighter 🥊`,
		botName: "KungFuFighter_bot",
		moreAboutText: `Поможет вам быстро узнать все о клубе Kung-Fu Fighter! Хотите расписание тренировок, стоимость занятий или информацию о тренерах? Просто задайте вопрос – нейросеть моментально ответит. Также во всех вопросах вам поможет удобное меню!`,
		serviceSentence: `${services[2].name} - <a href="https://t.me/${BotName}/?start=catalogOfServices${3}">к услуге</a>\n\n<b>Цена:</b> ${services[2].priceSentence}`,
	},
	{
		name: `Алгебравичок 🧮`,
		botName: "digmathbot",
		moreAboutText: `Личный репититор, генерирующий арифметические задачки по вашему уровню знаний. Прекрасно подходит для закрепления материала и поддержания счётных навыков в форме.`,
		serviceSentence: `${services[1].name} - <a href="https://t.me/${BotName}/?start=catalogOfServices${2}">к услуге</a>\n\n<b>Цена:</b> ${services[1].priceSentence}`,
	},
	{
		name: `Цифровичок 🏫`,
		botName: "digschbot",
		moreAboutText: `Цифровой школьный помощник, цель которого — улучшить взаимодействие учеников с учебным процессом. Это альтернатива школьному порталу, лишённая недостатка в полезных функциях, и реализованная в более удобном формате для использования.`,
		serviceSentence: `${services[2].name} - <a href="https://t.me/${BotName}/?start=catalogOfServices${3}">к услуге</a>\n\n<b>Цена:</b> ${services[2].priceSentence}`,
	},
	{
		name: `Нейро-вичок✨`,
		botName: "digneurobot",
		moreAboutText: `Полезный инструмент для работы с новейшими технологиями в сфере искусственного интеллекта. Удобство и простота пользования дает возможность легко и быстро получать текстовые ответы, генерировать изображения и видео.`,
		serviceSentence: `${services[1].name} - <a href="https://t.me/${BotName}/?start=catalogOfServices${2}">к услуге</a>\n\n<b>Цена:</b> ${services[1].priceSentence}`,
	},
	{
		name: `Never Finished 🏅`,
		botName: "neverfinishedbot",
		moreAboutText: `Инструмент для развития самодисциплины! Веди учет своих целей и достижений, сохраняй важные мысли и следи за хорошими привычками. Начни сейчас и стань лучше вместе с Never Finished!`,
		serviceSentence: `${services[1].name} - <a href="https://t.me/${BotName}/?start=catalogOfServices${2}">к услуге</a>\n\n<b>Цена:</b> ${services[1].priceSentence}`,
	},
	{
		name: `Спортивичок 🏀`,
		botName: "digjudgebot",
		moreAboutText: `Идеальный партнер для спортивных состязаний! Он будет отслеживать и записывать счет матча, впоследствии предоставляя подробную информацию о партиях, счете, времени игры и многом другом.`,
		serviceSentence: `${services[1].name} - <a href="https://t.me/${BotName}/?start=catalogOfServices${2}">к услуге</a>\n\n<b>Цена:</b> ${services[1].priceSentence}`,
	},
];

let moreAboutUsText = [
	`<blockquote><b>•  Низкая стоимость услуг</b>\nСтоимость создания достойного чат-бота - не космические цифры, а разумная сумма! 💰<b>\n\n•  Сначала результат, потом оплата</b>\nПолная оплата работы после того, как получите продукт! <i>(Предоплата 20% от суммы)</i> 🤗\n\n<b>•  Реальные отзывы клиентов</b>\nНи один рекламный слоган не может так сказать о компании, как впечатления наших клиентов! <b>Ознакомиться - <a href="https://t.me/digfeedbacks">digfusion | отзывы</a></b> 😉</blockquote>`,

	"За нашими плечами <b>большой</b> опыт реализации <b>крупных</b> проектов, и мы готовы сделать <b>ваш</b> проект <b>таким же!</b> 😎\n\n<b>Обращайтесь к нам,</b> и мы поможем вам создать <b><i>эффективного, шустрого</i> и приятного для использования</b> чат-бота для любой вашей <b>деятельности!</b> 😉",

	`Пожалуйста, не пропускайте список <b>наших положений и требований!</b> Нам важно уведомить вас, о том что <b>вы можете ожидать от нас</b> при использовании <b>услуг digfusion,</b> и что <b>мы ожидаем от вас. 😉\n\nНавигация по документу:<blockquote><i><a href="https://telegra.ph/digfusion--Politika-08-08#%D0%A7%D1%82%D0%BE-%D0%B2%D1%8B-%D0%BC%D0%BE%D0%B6%D0%B5%D1%82%D0%B5-%D0%BE%D0%B6%D0%B8%D0%B4%D0%B0%D1%82%D1%8C-%D0%BE%D1%82-%D0%BD%D0%B0%D1%81">Наши обязательства</a>\n<a href="https://telegra.ph/digfusion--Politika-08-08#%D0%A7%D1%82%D0%BE-%D0%BC%D1%8B-%D0%BE%D0%B6%D0%B8%D0%B4%D0%B0%D0%B5%D0%BC-%D0%BE%D1%82-%D0%B2%D0%B0%D1%81">Что мы ожидаем от вас</a>\n<a href="https://telegra.ph/digfusion--Politika-08-08#%D0%9F%D1%80%D0%B5%D0%B4%D0%BE%D1%81%D1%82%D0%B0%D0%B2%D0%BB%D0%B5%D0%BD%D0%B8%D0%B5-%D1%83%D1%81%D0%BB%D1%83%D0%B3">Предоставление услуг</a>\n<a href="https://telegra.ph/digfusion--Politika-08-08#%D0%A2%D1%80%D0%B5%D0%B1%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D1%8F-%D0%B2-%D0%B4%D0%B8%D0%B0%D0%BB%D0%BE%D0%B3%D0%B5">Требования в диалоге</a>\n<a href="https://telegra.ph/digfusion--Politika-08-08#%D0%A1%D0%B5%D1%80%D0%B2%D0%B5%D1%80-%D0%BF%D1%80%D0%BE%D0%B5%D0%BA%D1%82%D0%B0">Сервер проекта</a></i></blockquote></b>`,

	// "Около года назад <b>основатель компании</b> посещал <b>Московскую Школу Программистов (МШП),</b> успешно занимаясь и <b>максимально</b> погружаясь в процесс, демонстрируя <b>потрясающие для одного года обучения</b> результаты в виде <b>дополнительных проектов,</b> которые он создавал из своего <b>огромного желания преуспеть</b> в этой области. Уже сегодня, спустя <b>несколько лет</b> с начала своей <b>карьеры в IT</b> он показывает <b>максимум</b> своих <b>приобретенных знаний</b> в <b><i>разработке</i></b> и <i><b>предоставлении услуг</b></i> по созданию чат-ботов.\n\nНо, изначально <b>выбор отрасли не был очевидным,</b> сначала это была <b>разработка консольных приложений,</b> затем упор на <b>дискретную математику,</b> далее разработка <b>веб-приложений для Windows, gameDev,</b> и только потом, по поручению <b>главнокомандующего информатика школы,</b> он углубился в <b>действительно полезную</b> и <b>сложную отрасль</b> разработки – <b>создание чат-ботов в Telegram. Поручение</b> заключалось в создании <b>школьного помощника,</b> который бы <b>показывал расписание, напоминал о звонках, демонстрировал меню столовой</b> и многое другое! Если вы <b>ознакамливались с нашими проектами,</b> то не сложно догадаться, этот <b>прорывной</b> проект – <b>«Цифровичок»,</b> который действительно пригодился <b>десяткам людей как повседневный помощник!</b>",

	// "\n\n<b>Возникает вопрос,</b> откуда появилось название <b>«digfusion»?</b> При создании <b>«Цифровичка»</b> я выбирал <b>доменное имя,</b> и <b>среди предложенных</b> информатиком были имена, состоящие из <b>двух слов – «digital»</b> и <b>«school». Telegram</b> не пропускал <b>по длине</b> все составленные из этих <b>полных</b> слов имена, поэтому в голову пришли <b>гениальные сокращения,</b> такие как <b>«dig»</b> и <b>«sch»</b>, что дает - <b>digsch</b>. <b>Вторым проектом</b> оказался <b>«Спортивичек»,</b> по просьбе <b>физрука,</b> и поскольку он предназначен для <b>судейства,</b> слово <b>«sch» (school)</b> мы заменили на <b>«judge»</b>. Именно поэтому <b>все последующие помощники</b> начинаются с <b>«dig» (digital),</b> и <b>наша компания</b> тоже взяла себе такую <b>отличительную фирменную приставку!</b>\n\n<b>Идея её основания</b> возникла после того, как, хорошо задумавшись, захотелось <b>монетизировать своё творчество</b> и помогать людям не только <b>из своего окружения,</b> но и <b>по всему интернету.</b>\n\n<b>Вот и вся история! Напоминаем,</b> мы ничего <b>не держим в секрете</b> от своих <b>клиентов! Вся информация</b> и <b>все процессы</b> находятся <b>на поверхности!</b> Если вы <b>нам доверяете</b> и прочитали <b>весь этот текст, спасибо вам огромное! Мы очень ценим вас! ❤️</b>",
];

bot.setMyCommands([
	{
		command: "/restart",
		description: "Главное меню 🔄️",
	},
	{
		command: "/services",
		description: "Каталог услуг с ИИ ✨",
	},
	{
		command: "/consultation",
		description: "Консультация 🧑‍💻",
	},
	{
		command: "/profile",
		description: "Профиль ⚙️",
	},
]);

let textToSayHello, match, rndId, clientChatId;

async function firstMeeting(chatId, stageNum = 1) {
	const dataAboutUser = usersData.find((obj) => obj.chatId == chatId);

	try {
		switch (stageNum) {
			case 1:
				dataAboutUser.userAction = "firstMeeting1";

				await bot.editMessageText(
					`<b>Вас приветствует</b> компания <b><i>digfusion,</i></b> ваш <b>надежный</b> партнер в области <b>разработки чат-ботов!</b> 👋\n\n${moreAboutUsText[1]}`,
					{
						parse_mode: "html",
						chat_id: chatId,
						message_id: usersData.find(
							(obj) => obj.chatId == chatId
						).messageId,
						disable_web_page_preview: true,
						reply_markup: {
							inline_keyboard: [
								[
									{
										text: "Что такое чат-бот❓",
										callback_data: "firstMeeting5",
									},
								],
								[
									{
										text: "Продолжить➡️",
										callback_data: "firstMeeting2",
									},
								],
							],
						},
					}
				);
				break;
			case 2:
				dataAboutUser.userAction = "firstMeeting2";

				await bot.editMessageText(
					`<b>Ключевые преимущества</b> нашей компании <b>перед другими,</b> с которыми вам <b>гарантированы</b> самые <b>выгодные условия:</b>${moreAboutUsText[0]}`,
					{
						parse_mode: "html",
						chat_id: chatId,
						message_id: usersData.find(
							(obj) => obj.chatId == chatId
						).messageId,
						disable_web_page_preview: true,
						reply_markup: {
							inline_keyboard: [
								// [
								// 	{
								// 		text: "Что такое чат-бот❓",
								// 		callback_data: "firstMeeting5",
								// 	},
								// ],
								[
									{
										text: "⬅️Назад",
										callback_data: "firstMeeting1",
									},
									{
										text: "Далее➡️",
										callback_data: "firstMeeting3",
									},
								],
							],
						},
					}
				);
				break;
			case 3:
				menuHome(chatId, false, true);

				// dataAboutUser.userAction = "firstMeeting3";

				// await bot.editMessageText(
				// 	`<b>Мы</b> уже рассказали <b>о себе,</b> теперь <b>ваша очередь!</b> 😊\n\n<b><a href="https://telegra.ph/digfusion--Politika-08-08">Политика компании digfusion</a></b>\n<i>Продолжая, вы соглашаетесь со всеми требованиями и положениями digfusion!</i>\n\n<b>Пожалуйста,</b> напишите <b>как можно к вам обращаться</b> для <b>дальнейшего общения?</b> 🤔`,
				// 	{
				// 		parse_mode: "html",
				// 		chat_id: chatId,
				// 		message_id: usersData.find(
				// 			(obj) => obj.chatId == chatId
				// 		).messageId,
				// 		disable_web_page_preview: true,
				// 		reply_markup: {
				// 			inline_keyboard: [
				// 				[
				// 					{
				// 						text: `Или оставить ${dataAboutUser.login} ✅`,
				// 						callback_data: "firstMeeting4",
				// 					},
				// 				],
				// 				[
				// 					{
				// 						text: "⬅️Назад",
				// 						callback_data: "firstMeeting2",
				// 					},
				// 				],
				// 			],
				// 		},
				// 	}
				// );
				break;
			case 4:
				// dataAboutUser.userAction = "firstMeeting4";
				// await bot.editMessageText(
				// 	`<b>${dataAboutUser.login},</b> очень прятно! 😁\n\nНа <b>последнем этапе</b> я попрошу <b>вас</b> предоставить <b>номер телефона</b> для <b>подтверждения вашей личности.</b> 😊`,
				// 	{
				// 		parse_mode: "html",
				// 		chat_id: chatId,
				// 		message_id: usersData.find((obj) => obj.chatId == chatId)
				// 			.messageId,
				// 		disable_web_page_preview: true,
				// 		// reply_markup: {
				// 		// 	inline_keyboard: [[{ text: "", callback_data: "-" }]],
				// 		// },
				// 	}
				// );

				// await bot
				// 	.sendMessage(
				// 		chatId,
				// 		`Используйте <b>удобное автозаполнение! ⬇️</b>`,
				// 		{
				// 			parse_mode: "HTML",
				// 			disable_web_page_preview: true,
				// 			reply_markup: {
				// 				keyboard: [
				// 					[
				// 						{
				// 							text: "Автозаполнить номер",
				// 							request_contact: true,
				// 							resize_keyboard: true,
				// 						},
				// 					],
				// 				],
				// 			},
				// 		}
				// 	)
				// 	.then((message) => {
				// 		dataAboutUser.messageIdOther = message.message_id;
				// 	});

				break;
			case 5:
				await bot.editMessageText(
					`<b><i>Что такое чат-бот❓</i></b>\n\nЭто инструмент, <b>обрабатывающий запросы</b> пользователей в формате <b>диалога в мессенджере,</b> точно так же, как и <b>этот помощник,</b> текст которого <b>вы</b> читаете. 😊\n\n<blockquote>Такой <b>продукт может</b> стать как прекрасным инструментом для <b>автоматизации вашей деятельности,</b> так и <b>обычной рассылкой новостей и акций</b>.</blockquote>\n<b>В пример</b> мы приведем наши <b>крупные</b> и <b>успешные работы</b> ⬇️`,
					{
						parse_mode: "html",
						chat_id: chatId,
						message_id: usersData.find(
							(obj) => obj.chatId == chatId
						).messageId,
						disable_web_page_preview: true,
						reply_markup: {
							inline_keyboard: [
								[
									{
										text: ourProjects[3].name,
										url: `https://t.me/${ourProjects[2].botName}`,
									},
								],
								[
									{
										text: ourProjects[1].name,
										url: `https://t.me/${ourProjects[1].botName}`,
									},
									{
										text: ourProjects[4].name,
										url: `https://t.me/${ourProjects[4].botName}`,
									},
								],
								[
									{
										text: "⬅️Назад",
										callback_data:
											dataAboutUser.userAction ==
											"firstMeeting1"
												? "firstMeeting1"
												: dataAboutUser.userAction ==
													  "firstMeeting2"
													? "firstMeeting2"
													: "",
									},
								],
							],
						},
					}
				);
				break;
			case 2:
				break;
		}
	} catch (error) {
		console.log(error);
		sendDataAboutError(chatId, dataAboutUser.login, `${String(error)}`);
	}
}

async function menuHome(
	chatId,
	navigationListIsActive = false,
	beforeFirstMeeting = false
) {
	const dataAboutUser = usersData.find((obj) => obj.chatId == chatId);

	const dateNowHHNN = new Date().getHours() * 100 + new Date().getMinutes();

	if (dateNowHHNN < 1200 && dateNowHHNN >= 600)
		textToSayHello = "Доброе утро";
	else if (dateNowHHNN < 1700 && dateNowHHNN >= 1200)
		textToSayHello = "Добрый день";
	else if (dateNowHHNN < 2200 && dateNowHHNN >= 1700)
		textToSayHello = "Добрый вечер";
	else if (dateNowHHNN >= 2200 || dateNowHHNN < 600)
		textToSayHello = "Доброй ночи";

	try {
		dataAboutUser.supportiveCount = 1;

		dataAboutUser.currentFeedbackId = null;

		dataAboutUser.userAction = "menuHome";

		dataAboutUser.userStatus =
			dataAboutUser.chatId == qu1z3xId
				? "Администратор 👑"
				: dataAboutUser.requestsData?.length < 3 ||
					  !dataAboutUser.requestsData
					? "Клиент 🙂"
					: dataAboutUser.requestsData.length >= 3
						? "Постоянный клиент 😎"
						: dataAboutUser.requestsData.length >= 6
							? "Особый клиент 🤩"
							: dataAboutUser.requestsData.length >= 10
								? "Лучший покупатель 🤴"
								: "";

		// let navigationListText = `<b>"Каталог услуг с ИИ ✨"</b> - расчет стоимости и выбор продукта, а также удобный выбор услуги под ваши задачи с ИИ.\n\n<b>"Идеи💡"</b> - список идей для вашей деятельности.\n\n<b>"Консультация 🧑‍💻"</b> - в живой переписке подскажем и проконсультируем вас по любому вопросу!\n\n<b>"Наши реальные работы 📱"</b> - список и описание всех наших проектов.\n\n<b>"О нас 👥"</b> - вся информация о нашей корпорации и наших преимуществах.\n\n<b>"Отзывы 📧"</b> - возможность оставить отзыв, и список реальных мнений заказчиков.\n\n<b>"Профиль ⚙️"</b> - личные данные, и прочая информация.`;

		let navigationListText = `<b>"Каталог услуг с ИИ ✨"</b> - расчет стоимости и выбор продукта, а также выбор услуги под ваши задачи с ИИ.\n\n<b>"Идеи💡"</b> - список идей под каждую из услуг.\n\n<b>"Консультация 🧑‍💻"</b> - в живой переписке подскажем и ответим на любой вопрос!\n\n<b>"Профиль ⚙️"</b> - личные данные, программа лояльсности и важная информация.`;

		await bot.editMessageText(
			`${
				beforeFirstMeeting
					? `<b>${dataAboutUser.login}, спасибо за регистрацию! 🙏</b>\n\nВас встречает <b>главная страница!</b>\nСтоимость можно расчитать в <b>"Каталоге услуг"!</b>`
					: `<b>${textToSayHello}, ${dataAboutUser.login}! </b>`
			}\n\n${
				navigationListIsActive
					? `<b><a href="https://t.me/${BotName}/?start=hideNavigationListInMenuHome">Навигация по меню ⇩</a></b><blockquote>${navigationListText}<b>\n\n<a href="https://t.me/${BotName}/?start=hideNavigationListInMenuHome">Скрыть навигацию</a></b></blockquote>`
					: `<b><a href="https://t.me/${BotName}/?start=showNavigationListInMenuHome">Навигация по меню ⇨</a></b>`
			}\n\n<b>Что вас интересует? 🤔</b>`,
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
								text: `${
									dataAboutUser.requestsData?.at(-1)?.isActive
										? `❕Ваша заявка ${
												dataAboutUser.requestsData.find(
													(obj) => obj.isActive
												).requestId
											} ⌛`
										: ""
								}`,
								callback_data: "myRequest",
							},
						],
						[
							{
								text: "Каталог услуг с ИИ ✨",
								callback_data: "catalog0",
							},
						],
						[
							{
								text: "Идеи💡",
								callback_data: "ideasForProjects",
							},
							{
								text: "Консультация 🧑‍💻",
								callback_data: "consultation",
							},
						],
						[
							{
								text: "Наши реальные работы 📱",
								callback_data: "ourProjectsList0",
							},
						],
						[
							{ text: "О нас 👥", callback_data: "moreAboutUs1" },
							{
								text: "Отзывы 📧",
								callback_data: "feedbacksList",
							},
						],
						[{ text: "Профиль ⚙️", callback_data: "settings" }],
					],
				},
			}
		);
	} catch (error) {
		console.log(error);
		sendDataAboutError(chatId, dataAboutUser.login, `${String(error)}`);
	}
}

async function catalogOfServices(chatId, catalogNum = 0) {
	const dataAboutUser = usersData.find((obj) => obj.chatId == chatId);

	const dataAboutСertainRequest = dataAboutUser.requestsData
		? dataAboutUser.requestsData.find((obj) => obj.isActive)
		: null;

	dataAboutUser.userAction = `catalog${catalogNum}`;
	try {
		let serviceNum =
			dataAboutUser.userAction === "catalog1"
				? dataAboutUser.selectedService?.bot?.serviceNum
				: dataAboutUser.selectedService?.server?.serviceNum;
		let variationNum = dataAboutUser.selectedService?.server?.variationNum;

		let text = "";
		switch (catalogNum) {
			case 0:
				await bot.editMessageText(
					`<b><i>🛍️ Каталог услуг 🛒</i></b>${
						dataAboutСertainRequest
							? `\n\n<b>У вас</b> уже оставлена <b><a href="https://t.me/${BotName}/?start=myRequest">заявка ${dataAboutСertainRequest.requestId},</a></b> но услуги <b>можно изменить!</b> 😉`
							: ``
					}\n\n<blockquote><b><i>💥Попробуйте удобнейший подбор услуги с ИИ под ваши задачи уже сейчас!</i></b></blockquote>\n\n<b>Какой тип услуг вам интересен? 🤔</b>`,
					{
						parse_mode: "html",
						chat_id: chatId,
						message_id: usersData.find(
							(obj) => obj.chatId == chatId
						).messageId,
						disable_web_page_preview: true,
						reply_markup: {
							inline_keyboard: [
								// [
								// 	{
								// 		text: `${
								// 			dataAboutUser.requestsData?.at(-1)
								// 				?.isActive
								// 				? `❕Ваша заявка ${
								// 						dataAboutUser.requestsData.find(
								// 							(obj) =>
								// 								obj.isActive
								// 						).requestId
								// 					} ⌛`
								// 				: ""
								// 		}`,
								// 		callback_data: "myRequest",
								// 	},
								// ],
								[
									{
										text: `Подбор услуги с ИИ ✨`,
										callback_data: "aiSelector",
									},
								],
								[
									{
										text: "Боты 🤖",
										callback_data: "catalog1",
									},
									{
										text: "Серверы 💾",
										callback_data: "catalog2",
									},
								],
								[{ text: "⬅️В меню", callback_data: "exit" }],
							],
						},
					}
				);
				break;
			case 1:
				text = "";
				for (let i = 1; i <= services.length; i++) {
					if (services[i - 1].type == "bot") {
						text += `${
							serviceNum == i
								? `\n\n<b>• ${i}. ${
										services[serviceNum - 1].name
									} •\n</b><blockquote>${
										dataAboutСertainRequest?.service.bot
											.serviceNum == i
											? `<i>Выбранная услуга</i> - <a href="https://t.me/${BotName}/?start=myRequest">к заявке</a>\n\n`
											: ``
									}<b>Подробнее:</b> ${
										services[serviceNum - 1].moreAbout
									}${
										services[serviceNum - 1].lifeTime
											? `\n\n<b>Действует:</b> ${
													services[serviceNum - 1]
														.lifeTime
												}`
											: ``
									}${
										services[serviceNum - 1].executionDate
											? `\n\n<b>Срок выполнения:</b> ${
													services[serviceNum - 1]
														.executionDate
												} ⌛`
											: ``
									}\n\n<b>Цена:</b> ${
										services[serviceNum - 1].priceSentence
									} 💰${
										serviceNum != 4
											? `\n\n<b><a href="https://t.me/${BotName}/?start=ideasForProjects">Идеи для продукта</a></b>`
											: ``
									}</blockquote>`
								: `\n\n<b><a href="https://t.me/${BotName}/?start=catalogOfServices${i}">${i}.</a> </b>${services[i - 1].name}${
										dataAboutСertainRequest?.service.bot
											.serviceNum == i
											? ` - <b><a href="https://t.me/${BotName}/?start=myRequest">к заявке</a></b>`
											: ``
									}`
						}`;
					}
				}

				await bot.editMessageText(
					`<b><i>🛒 Каталог • Боты 🤖</i></b>\n\nМы предоставляем <b>следующие услуги по ботам:</b>${text}\n\n<b><a href="https://telegra.ph/digfusion--Politika-08-08#%D0%A7%D1%82%D0%BE-%D0%B2%D1%8B-%D0%BC%D0%BE%D0%B6%D0%B5%D1%82%D0%B5-%D0%BE%D0%B6%D0%B8%D0%B4%D0%B0%D1%82%D1%8C-%D0%BE%D1%82-%D0%BD%D0%B0%D1%81">Политика компании digfusion</a></b>`,
					{
						parse_mode: "html",
						chat_id: chatId,
						message_id: usersData.find(
							(obj) => obj.chatId == chatId
						).messageId,
						disable_web_page_preview: true,
						reply_markup: {
							inline_keyboard: [
								[
									{
										text: `⬆️`,
										callback_data: "previousServiceNum",
									},
									{
										text: `№${serviceNum} • ${
											services[serviceNum - 1].price
										}р`,
										callback_data: `${
											dataAboutСertainRequest?.service.bot
												.serviceNum == serviceNum
												? `myRequest`
												: `warningOrderService`
										}`,
									},
									{
										text: `⬇️`,
										callback_data: "nextServiceNum",
									},
								],
								[
									dataAboutСertainRequest?.service.bot
										.serviceNum == serviceNum
										? {
												text: `❕Уже услуга вашей заявки ${dataAboutСertainRequest.requestId} ⌛`,
												callback_data: `myRequest`,
											}
										: {
												text: `Выбрать "${services[serviceNum - 1].name}" ✅`,
												callback_data: `warningOrderService`,
											},
								],
								[
									{
										text: "⬅️Назад",
										callback_data: "catalog0",
									},
									{
										text: "Идеи💡",
										callback_data: "ideasForProjects",
									},
								],
							],
						},
					}
				);
				break;
			case 2:
				text = "";
				for (let i = 1; i <= services.length; i++) {
					if (services[i - 1].type == "server") {
						const element = services[serviceNum - 1];

						text += `${
							serviceNum == i
								? `\n\n<b>• ${i}. ${
										element.name
									} (${services[serviceNum - 1].variations[variationNum - 1].name}) •\n</b><blockquote>${
										dataAboutСertainRequest?.service.server
											.serviceNum == i &&
										dataAboutСertainRequest?.service.server
											.variationNum == variationNum
											? `<i>Выбранный тариф</i> - <a href="https://t.me/${BotName}/?start=myRequest">к заявке</a>\n\n`
											: ``
									}<b>Подробнее:</b> ${
										element.variations[variationNum - 1]
											.moreAbout
									}\n\n<b>Расположение:</b> ${
										element.variations[variationNum - 1]
											.location
									}\n<b>Действует:</b> ${
										element.variations[variationNum - 1]
											.lifeTime
									} (${services[serviceNum - 1].variations[variationNum - 1].name})\n\n<b>Цена:</b> ${
										element.variations[variationNum - 1]
											.priceSentence
									} 💰</blockquote>`
								: `\n\n<b><a href="https://t.me/${BotName}/?start=catalogOfServices${i}">${i}.</a> </b>${services[i - 1].name}${
										dataAboutСertainRequest?.service.server
											.serviceNum == i &&
										dataAboutСertainRequest?.service.server
											.variationNum == variationNum
											? ` - <b><a href="https://t.me/${BotName}/?start=myRequest">к заявке</a></b>`
											: ``
									}`
						}`;
					}
				}
				// ${
				// 	dataAboutСertainRequest?.service.server.serviceNum
				// 		? `\n\n<b>У вас</b> уже выбрана <b>услуга №${dataAboutСertainRequest.service.server.serviceNum},</b> остался только сервер! 😉`
				// 		: ``
				// }

				await bot.editMessageText(
					`<b><i>🛒 Каталог • Серверы 💾</i></b>\n\n<b>По хостингам следующие тарифы:</b>${text}\n\n<b><a href="https://telegra.ph/digfusion--Politika-08-08#%D0%A7%D1%82%D0%BE-%D0%B2%D1%8B-%D0%BC%D0%BE%D0%B6%D0%B5%D1%82%D0%B5-%D0%BE%D0%B6%D0%B8%D0%B4%D0%B0%D1%82%D1%8C-%D0%BE%D1%82-%D0%BD%D0%B0%D1%81">Политика компании digfusion</a></b>`,
					{
						parse_mode: "html",
						chat_id: chatId,
						message_id: usersData.find(
							(obj) => obj.chatId == chatId
						).messageId,
						disable_web_page_preview: true,
						reply_markup: {
							inline_keyboard: [
								[
									variationNum === 1
										? {
												text: `• ${services[serviceNum - 1].variations[0].name} •`,
												callback_data: "-",
											}
										: {
												text: services[serviceNum - 1]
													.variations[0].name,
												callback_data: "variationNum1",
											},

									variationNum === 2
										? {
												text: `• ${services[serviceNum - 1].variations[1].name} •`,
												callback_data: "-",
											}
										: {
												text: services[serviceNum - 1]
													.variations[1].name,
												callback_data: "variationNum2",
											},

									variationNum === 3
										? {
												text: `• ${services[serviceNum - 1].variations[2].name} •`,
												callback_data: "-",
											}
										: {
												text: services[serviceNum - 1]
													.variations[2].name,
												callback_data: "variationNum3",
											},

									variationNum === 4
										? {
												text: `• ${services[serviceNum - 1].variations[3].name} •`,
												callback_data: "-",
											}
										: {
												text: services[serviceNum - 1]
													.variations[3].name,
												callback_data: "variationNum4",
											},
								],
								[
									{
										text: `⬆️`,
										callback_data: "previousServiceNum",
									},
									{
										text: `№${serviceNum} • ${
											services[serviceNum - 1].variations[
												variationNum - 1
											].price
										}р`,
										callback_data: `${
											dataAboutСertainRequest?.service
												.server.serviceNum == serviceNum
												? `myRequest`
												: `warningOrderService`
										}`,
									},
									{
										text: `⬇️`,
										callback_data: "nextServiceNum",
									},
								],
								[
									dataAboutСertainRequest?.service.server
										.serviceNum == serviceNum &&
									dataAboutСertainRequest?.service.server
										.variationNum == variationNum
										? {
												text: `❕Уже тариф вашей заявки ${dataAboutСertainRequest.requestId} ⌛`,
												callback_data: `myRequest`,
											}
										: {
												text: `"${services[serviceNum - 1].name} (на ${services[serviceNum - 1].variations[variationNum - 1].name})" ✅`,
												callback_data: `warningOrderService`,
											},
								],
								[
									{
										text: "⬅️Назад",
										callback_data: "catalog0",
									},
								],
							],
						},
					}
				);
				break;
		}
	} catch (error) {
		console.log(error);
		sendDataAboutError(chatId, dataAboutUser.login, `${String(error)}`);
	}
}

async function moreAboutServer(chatId) {
	const dataAboutUser = usersData.find((obj) => obj.chatId == chatId);

	try {
		await bot.editMessageText(`<b>Почему стоит взять наш сервер</b>`, {
			parse_mode: "html",
			chat_id: chatId,
			message_id: usersData.find((obj) => obj.chatId == chatId).messageId,
			disable_web_page_preview: true,
			reply_markup: {
				inline_keyboard: [
					[
						{
							text: `⬅️Назад`,
							callback_data: dataAboutUser.userAction,
						},
						{
							text: `Консультация 🧑‍💻`,
							callback_data: "consultation",
						},
					],
				],
			},
		});
	} catch (error) {
		console.log(error);
		sendDataAboutError(chatId, dataAboutUser.login, `${String(error)}`);
	}
}

async function getResponse(chatId, request = null) {
	const dataAboutUser = usersData.find((obj) => obj.chatId == chatId);

	try {
		const client = await Client.connect("Qwen/Qwen2-72B-Instruct");
		const result = await client.predict("/model_chat", {
			query: `Описание задачи пользователя: "${request}"
Пожалуйста, проанализируйте описание задачи, предоставленное пользователем, и определите, какая из трёх услуг нашей компании (под номерами 1, 2 или 3) наилучшим образом подойдёт для их потребностей. Верните строго JSON-объект вида:
{ 
    "serviceNum": <номер_услуги_1_2_или_3_или_null>, 
    "explanation": "<краткое_объяснение_причин>" 
}

!!ИНСТРУКЦИЯ:

1. Если описание задачи содержит конкретику и соответствует 1. Однотипный бот (Для простых операций и сбора информации, как \n• Чек-листы для клиентов\n• Регистрации на мероприятия\n• Ответы на FAQ\n• Записи на консультации\n• Сбор отзывов на услуги и т.д.), верните:
{ 
    "serviceNum": 1, 
    "explanation": "Эта услуга подойдёт, так как требуется базовая функция, такая как [объяснение функции]" 
} 

2. Если задача соответствует 2. Бот среднего класса (Для одного ведущего функционала с поддержкой базы данных и возможностью массовых рассылок, \n• Обьявления акций/новостей\n• Помощник ChatGPT\n• Алерты для каналов), верните:
{ 
    "serviceNum": 2, 
    "explanation": "Эта услуга подойдёт, так как требуется дополнительный функционал, такой как [объяснение функции]" 
}

3. Если задача соответствует 3. Сложносоставной бот (Полностью готовая вселенная с множеством разделов и возможностей, \n• Автоматизации бизнес-процессов\n• Виртуальный интернет магазин\n• Онлайн школа/курс\n• Сложное приложение с ИИ и т.д.), верните:
{ 
    "serviceNum": 3, 
    "explanation": "Эта услуга прекрасно подойдёт вам, так как потребуется [объяснение необходимых функций, таких как разделы, процессы и т.д.]" 
}

4. Если описание задачи пользователя не содержит конкретной информации, либо состоит из вопросов или вводных фраз (например, "Привет", "Какой модель нейросети?", "Сделай бота"), верните:
{ 
    "serviceNum": null, 
    "explanation": "Пожалуйста, уточните, какие задачи и функции вы хотите реализовать в боте, чтобы мы могли предложить наиболее подходящую услугу."
}

5. Если описание выглядит двусмысленно, но есть частичная информация о задачах, попробуйте уточнить требования:
{ 
    "serviceNum": null, 
    "explanation": "Мне нужно больше информации о вашей задаче. [Что надо уточнить]"
}`,
			history: [],
			system: "❗НИЧЕГО КРОМЕ ОТВЕТА JSON РАЗМЕТКОЙ!!!",
		});

		return result.data[1][0][1];
	} catch (error) {
		console.log(error);
		sendDataAboutError(
			chatId,
			dataAboutUser.login,
			`${String(error)}\n\n❗GPT_ERROR`
		);
	}
}

async function aiSelector(chatId, request = null) {
	const dataAboutUser = usersData.find((obj) => obj.chatId == chatId);

	try {
		dataAboutUser.userAction = `aiSelector`;

		if (request) dataAboutUser.aiSelectorData.request = request;

		await bot.editMessageText(
			`<b>🛒 Подбор услуги с ИИ ✨</b>\n\n${dataAboutUser.aiSelectorData?.request ? `<b>✍️ Ваш запрос:</b>\n<blockquote><i>${dataAboutUser.aiSelectorData.request}</i></blockquote>\n\n<b>✨Ответ от ИИ:</b>\n<blockquote><i>${dataAboutUser.aiSelectorData?.response ? `${dataAboutUser.aiSelectorData?.response?.serviceNum ? `К вашим задачам услуга: <b>"${services[dataAboutUser.aiSelectorData.response.serviceNum - 1].name}"!</b>` : `<b>Не могу определить услугу! 😓</b>`}\n\n${dataAboutUser.aiSelectorData.response.explanation}` : `Анализирую ответ, думаю над предложением услуги.. (не более 5 сек ⌛)`}</i></blockquote>\n\n<b>Для редактирования просто нажмите на свой текст, для копирования. 👆</b>` : `<i><b>Это Нейросетивичок-консультант,</b> наша генеративная модель с уклоном на подбор услуг по критериям клиента.</i>\n\n<b>Опишите, какие задачи нужно покрыть? ✍️</b>`}`,
			{
				parse_mode: "html",
				chat_id: chatId,
				message_id: usersData.find((obj) => obj.chatId == chatId)
					.messageId,
				disable_web_page_preview: true,
				reply_markup: {
					inline_keyboard: [
						[
							dataAboutUser.aiSelectorData?.response?.serviceNum
								? {
										text: `Выбрать "${services[dataAboutUser.aiSelectorData.response.serviceNum - 1].name}" ✅`,
										callback_data: `warningOrderService`,
									}
								: { text: ``, callback_data: `-` },
						],
						[
							{
								text: `⬅️Назад`,
								callback_data: `catalog0`,
							},
							dataAboutUser.aiSelectorData?.response?.serviceNum
								? {
										text: `Сбросить 🔄️`,
										callback_data: `resetAiSelector`,
									}
								: { text: ``, callback_data: `-` },

							// {
							// 	text: `Диалог 🧠`,
							// 	url: "https://t.me/digneurobot",
							// },
						],
					],
				},
			}
		);

		if (request) {
			dataAboutUser.aiSelectorData.response = JSON.parse(
				await getResponse(chatId, request)
			);

			dataAboutUser.selectedService.bot.serviceNum = dataAboutUser
				.aiSelectorData?.response?.serviceNum
				? dataAboutUser.aiSelectorData.response.serviceNum
				: null;

			dataAboutUser.selectedService.server.variationNum = 1;

			if (dataAboutUser.userAction == "aiSelector") {
				aiSelector(chatId);
			}
		}
	} catch (error) {
		console.log(error);
		sendDataAboutError(chatId, dataAboutUser.login, `${String(error)}`);
	}
}

async function ideasForProjects(chatId) {
	const dataAboutUser = usersData.find((obj) => obj.chatId == chatId);

	dataAboutUser.userAction = "ideasForProjects";
	try {
		await bot.editMessageText(
			`<b><i>💭 Идеи для продукта💡</i></b>\n\nМы представили <b><i>небольшой</i> список идей для наших услуг:\n\n1. ${services[0].name}</b> - <a href="https://t.me/${BotName}/?start=catalogOfServices1">к услуге</a><b><blockquote>Примеры реализации:\n• Чек-листы для клиентов\n• Регистрации на мероприятия\n• Ответы на FAQ\n• Записи на консультации\n• Сбор отзывов на услуги</blockquote>\n2. ${services[1].name}</b> - <a href="https://t.me/${BotName}/?start=catalogOfServices2">к услуге</a><b><blockquote>Примеры реализации:\n• Обьявления акций/новостей\n• Помощник ChatGPT\n• Алерты для каналов</blockquote>\n3. ${services[2].name}</b> - <a href="https://t.me/${BotName}/?start=catalogOfServices3">к услуге</a><b><blockquote>Примеры реализации:\n• Автоматизации бизнес-процессов\n• Виртуальный интернет магазин\n• Онлайн школа/курс\n• Сложное приложение с ИИ</blockquote>\n\nМы очень надеемся, </b>что хотя бы одна из идей <b>привлекла вас</b> к <b>нашим услугам!</b> ☺️`,
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
								text: "Каталог услуг с ИИ ✨",
								callback_data: "catalog0",
							},
						],
						[
							{ text: "⬅️В меню", callback_data: "exit" },
							{
								text: "Консультация 🧑‍💻",
								callback_data: "consultation",
							},
						],
					],
				},
			}
		);
	} catch (error) {
		console.log(error);
		sendDataAboutError(chatId, dataAboutUser.login, `${String(error)}`);
	}
}

async function orderService(chatId, stageNum) {
	const dataAboutUser = usersData.find((obj) => obj.chatId == chatId);

	try {
		let serviceNum =
			dataAboutUser.userAction != "catalog2"
				? dataAboutUser.selectedService.bot.serviceNum
				: dataAboutUser.selectedService.server.serviceNum;
		let variationNum = dataAboutUser.selectedService.server.variationNum;

		const element = services[serviceNum - 1];

		switch (stageNum) {
			case 1:
				await bot.editMessageText(
					`<b>${dataAboutUser.login},</b> вы выбрали ${
						dataAboutUser.userAction != "catalog2"
							? `<b>услугу №${serviceNum}:\n\n${serviceNum}. ${
									element.name
								}\n</b><blockquote><b>Подробнее:</b> ${element.moreAbout}\n\n<b>Цена:</b> ${
									element.priceSentence
								} 💰</blockquote>\n\n<b><a href="https://telegra.ph/digfusion--Politika-08-08#%D0%A7%D1%82%D0%BE-%D0%B2%D1%8B-%D0%BC%D0%BE%D0%B6%D0%B5%D1%82%D0%B5-%D0%BE%D0%B6%D0%B8%D0%B4%D0%B0%D1%82%D1%8C-%D0%BE%D1%82-%D0%BD%D0%B0%D1%81">Политика компании digfusion</a></b>\n<i>Подтверждая, вы соглашаетесь с требованиями и положениями!</i>\n\n<i>📌 Мы начинаем работу над заказом после консультации и предоплаты 20%</i>\n\n${
									dataAboutUser.requestsData?.at(-1)
										?.isActive &&
									dataAboutUser.requestsData.at(-1).service
										.bot.serviceNum
										? `<b>❕Ранее,</b> вы выбирали <b>услугу №${
												dataAboutUser.requestsData.at(
													-1
												).service.bot.serviceNum
											} "${
												services[
													dataAboutUser.requestsData.at(
														-1
													).service.bot.serviceNum - 1
												].name
											}".</b>\n\nХотите ли <b>изменить свой выбор</b> и <b>перезаказать услугу?</b> 🤔`
										: `Cоздать <b>заявку на эту услугу?</b> 🤔`
								}`
							: `<b>тариф сервера:\n\n${serviceNum}. ${
									element.name
								} (на ${element.variations[variationNum - 1].name})\n</b><blockquote><b>Расположение:</b> ${
									element.variations[variationNum - 1]
										.location
								}\n<b>Действует:</b> ${
									element.variations[variationNum - 1]
										.lifeTime
								} (${element.variations[variationNum - 1].name})\n\n<b>Цена:</b> ${
									element.variations[variationNum - 1]
										.priceSentence
								} 💰</blockquote>\n\n<b><a href="https://telegra.ph/digfusion--Politika-08-08#%D0%A7%D1%82%D0%BE-%D0%B2%D1%8B-%D0%BC%D0%BE%D0%B6%D0%B5%D1%82%D0%B5-%D0%BE%D0%B6%D0%B8%D0%B4%D0%B0%D1%82%D1%8C-%D0%BE%D1%82-%D0%BD%D0%B0%D1%81">Политика компании digfusion</a></b>\n<i>Подтверждая, вы соглашаетесь с требованиями и положениями!</i>\n\n<i>📌 Мы начинаем работу над заказом после консультации и предоплаты 20%</i>\n\n${
									dataAboutUser.requestsData?.at(-1)
										?.isActive &&
									dataAboutUser.requestsData.at(-1).service
										.server.serviceNum
										? `<b>❕Ранее,</b> вы выбирали <b>тариф №${
												dataAboutUser.requestsData.at(
													-1
												).service.server.serviceNum
											} "${services[dataAboutUser.requestsData.at(-1).service.server.serviceNum - 1].name} (на ${services[dataAboutUser.requestsData.at(-1).service.server.serviceNum - 1].variations[dataAboutUser.requestsData.at(-1).service.server.variationNum - 1].name})".</b>\n\n<b>Изменить ваш выбор</b> и <b>перезаказать тариф?</b> 🤔`
										: `Cоздать <b>заявку на этот тариф?</b> 🤔`
								}`
					}`,
					{
						parse_mode: "html",
						chat_id: chatId,
						message_id: usersData.find(
							(obj) => obj.chatId == chatId
						).messageId,
						disable_web_page_preview: true,
						reply_markup: {
							inline_keyboard: [
								[
									{
										text: "⬅️Назад",
										callback_data: dataAboutUser.userAction,
									},
									{
										text: "Подтвердить ✅",
										callback_data: `orderService`,
									},
								],
							],
						},
					}
				);

				//? ДО ОБНОВЛЕНИЯ 7.11
				// await bot.editMessageMedia(
				// 	{
				// 		type: "photo",
				// 		media: "attach://media/logoBlank.png",
				// 	},
				// 	{
				// 		chat_id: chatId,
				// 		message_id: usersData.find(
				// 			(obj) => obj.chatId == chatId
				// 		).messageId,
				// 	}
				// );
				break;
			case 2:
				let requestIsEdit = false;
				if (dataAboutUser.requestsData?.at(-1)?.isActive) {
					switch (dataAboutUser.userAction) {
						case "catalog1":
						case "aiSelector":
							dataAboutUser.requestsData.at(
								-1
							).service.bot.serviceNum =
								dataAboutUser.selectedService.bot.serviceNum;
							break;
						case "catalog2":
							dataAboutUser.requestsData.at(
								-1
							).service.server.serviceNum =
								dataAboutUser.selectedService.server.serviceNum;

							dataAboutUser.requestsData.at(
								-1
							).service.server.variationNum =
								dataAboutUser.selectedService.server.variationNum;
							break;
					}

					requestIsEdit = true;
				} else {
					let isUnique = false;
					while (!isUnique) {
						rndId = Math.floor(Math.random() * 9999);
						isUnique = true;

						if (usersData) {
							for (let i = 0; i < usersData.length; i++) {
								if (usersData[i].requestsData)
									for (
										let j = 0;
										j < usersData[i].requestsData.length;
										j++
									) {
										if (
											usersData[i].requestsData[j]
												.requestId === rndId
										) {
											isUnique = false;
											break;
										}
									}
								if (!isUnique) break;
							}
						} else break;
					}

					if (!dataAboutUser.requestsData) {
						dataAboutUser.requestsData = [];
					}

					dataAboutUser.requestsData.push({
						service: dataAboutUser.selectedService,

						creationTime: `${String(new Date().getHours()).padStart(
							2,
							"0"
						)}:${String(new Date().getMinutes()).padStart(2, "0")}`,
						creationDate: `${new Date()
							.getDate()
							.toString()
							.padStart(2, "0")}.${(new Date().getMonth() + 1)
							.toString()
							.padStart(2, "0")}.${(
							new Date().getFullYear() % 100
						)
							.toString()
							.padStart(2, "0")}`,
						date: new Date(),

						requestId: rndId,
						isActive: true,
					});

					requestIsEdit = false;
					++systemData.newRequestsToday;
				}

				await bot.editMessageText(
					`<b>Ваша <a href="https://t.me/${BotName}/?start=myRequest">заявка ${dataAboutUser.requestsData?.at(-1).requestId}</a>${requestIsEdit ? ` изменена и` : ``}</b> находится <b>в обработке! ⌛</b>\n\n<b>Вы</b> можете написать <b>нам напрямую</b> или <b>дождаться</b> нашей <b>связи с вами! 😉</b>`,
					{
						parse_mode: "html",
						chat_id: chatId,
						message_id: usersData.find(
							(obj) => obj.chatId == chatId
						).messageId,
						disable_web_page_preview: true,
						reply_markup: {
							inline_keyboard: [
								[
									{
										text: "Написать напрямую 💭",
										callback_data: "consultation",
									},
								],
								[
									{
										text: "⬅️В меню",
										callback_data: "exit",
									},
									{
										text: "К заявке🪪",
										callback_data: "myRequest",
									},
								],
							],
						},
					}
				);

				//! НАПОМИНАНИЕ АДМИНУ О ЗАЯВКЕ

				await bot
					.sendMessage(
						jackId,
						`<b>Давид, ${requestIsEdit ? `ИЗМЕНЕНА` : `ПОСТУПИЛА`} заявка ${dataAboutUser.requestsData?.at(-1).requestId}❕\n\nОт: <a href="tg://user?id=${dataAboutUser.chatId}">${dataAboutUser.login}</a> • <code>${dataAboutUser.chatId}</code>\n\nОтветить на нее сразу? 🧐</b>`,
						{
							parse_mode: "HTML",
							disable_web_page_preview: true,
							reply_markup: {
								inline_keyboard: [
									[
										{
											text: `К заявке 🪪`,
											callback_data: `requestWithId${rndId}`,
										},
									],
									[
										{
											text: "Клиент 👤",
											url: `tg://user?id=${dataAboutUser.chatId}`,
										},
										{
											text: "Все заявки 🧑‍💻",
											callback_data: `requestsList1`,
										},
									],
									[
										{
											text: "Позже ❌",
											callback_data: "deleteexcess",
										},
									],
								],
							},
						}
					)
					.then((message) => {
						dataAboutUser.messageIdOther = message.message_id;
					});
				break;
		}
	} catch (error) {
		console.log(error);
		sendDataAboutError(chatId, dataAboutUser.login, `${String(error)}`);
	}
}

async function consultation(chatId) {
	const dataAboutUser = usersData.find((obj) => obj.chatId == chatId);

	dataAboutUser.userAction = "consultation";

	try {
		await bot.editMessageText(
			`<b><i>💭 Консультация по услугам 🧑‍💻</i></b>\n\nПеред диалогом, <b>пожалуйста,</b> ознакомьтесь с <b>требованиями в диалоге с нами!\n\n<a href="https://telegra.ph/digfusion--Politika-08-08#%D0%A2%D1%80%D0%B5%D0%B1%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D1%8F-%D0%B2-%D0%B4%D0%B8%D0%B0%D0%BB%D0%BE%D0%B3%D0%B5">Требования digfusion в диалоге</a></b>\n<i>Продолжая, вы соглашаетесь со всеми требованиями и положениями digfusion!</i>\n\nСобеседник: <b>Давид 🧑‍💻</b>\nВремя ответа с <b>10:00</b> по <b>21:00, каждый день</b>${
				dataAboutUser.requestsData?.at(-1)?.isActive
					? `\n\n<b>❕Скопируйте</b> номер <b>вашей заявки:</b> <code>№${
							dataAboutUser.requestsData.find(
								(obj) => obj.isActive
							).requestId
						}</code>`
					: ``
			}`,
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
								text: `Чат с поддержкой 💭`,
								url: "https://t.me/digsupport",
							},
						],
						[
							{ text: "⬅️В меню", callback_data: "exit" },
							{
								text: "Каталог 🛒",
								callback_data: "catalog0",
							},
						],
					],
				},
			}
		);
	} catch (error) {
		console.log(error);
		sendDataAboutError(chatId, dataAboutUser.login, `${String(error)}`);
	}
}

async function ourProjectsList(chatId, projectNum = 1) {
	const dataAboutUser = usersData.find((obj) => obj.chatId == chatId);

	try {
		dataAboutUser.userAction = "ourProjectsList";

		await bot.editMessageText(
			`<b><i>🛠️ Наши работы 📱</i></b>\n\n${
				projectNum == 0
					? `В списке ниже представлены <b>приложения нашей компании</b> и несколько <b>заказов от наших клиентов! 🛍️</b><i>\n\n(Некоторые проекты не размещены, по просьбе заказчиков они остались в их правах)</i>\n\nВыберите любой <b>проект</b> ниже, чтобы просмотреть <b>подробности</b> и <b>опробовать функционал! 😉</b>`
					: `Проект: <b>${
							ourProjects[projectNum - 1].name
						}\n\nПодробнее:</b><blockquote><b>Для чего:</b> ${
							ourProjects[projectNum - 1].moreAboutText
						}\n\n<b>Услуга:</b> ${
							ourProjects[projectNum - 1].serviceSentence
						}</blockquote>\n\n${
							ourProjects[projectNum - 1].botName != "-"
								? ourProjects[projectNum - 1].botName ==
									"digfusionbot"
									? `<b>Вы уже в этом боте! 🤗</b>`
									: `<b><a href = "https://t.me/${
											ourProjects[projectNum - 1].botName
										}">Опробовать функционал</a></b>`
								: `<b>Функционал недоступен 🫤</b>`
						}`
			}`,
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
								text: `${
									projectNum == 1
										? `• ${ourProjects[projectNum - 1].name} •`
										: `${ourProjects[0].name}`
								}`,
								callback_data: `${
									projectNum == 1 ? "-" : "ourProjectsList1"
								}`,
							},
						],
						[
							{
								text: `${
									projectNum == 2
										? `• ${ourProjects[projectNum - 1].name} •`
										: `${ourProjects[1].name}`
								}`,
								callback_data: `${
									projectNum == 2 ? "-" : "ourProjectsList2"
								}`,
							},
							{
								text: `${
									projectNum == 3
										? `• ${ourProjects[projectNum - 1].name} •`
										: `${ourProjects[2].name}`
								}`,
								callback_data: `${
									projectNum == 3 ? "-" : "ourProjectsList3"
								}`,
							},
						],
						[
							{
								text: `${
									projectNum == 4
										? `• ${ourProjects[projectNum - 1].name} •`
										: `${ourProjects[3].name}`
								}`,
								callback_data: `${
									projectNum == 4 ? "-" : "ourProjectsList4"
								}`,
							},
							{
								text: `${
									projectNum == 5
										? `• ${ourProjects[projectNum - 1].name} •`
										: `${ourProjects[4].name}`
								}`,
								callback_data: `${
									projectNum == 5 ? "-" : "ourProjectsList5"
								}`,
							},
						],
						[
							{
								text: `${
									projectNum == 6
										? `• ${ourProjects[projectNum - 1].name} •`
										: `${ourProjects[5].name}`
								}`,
								callback_data: `${
									projectNum == 6 ? "-" : "ourProjectsList6"
								}`,
							},
							{
								text: `${
									projectNum == 7
										? `• ${ourProjects[projectNum - 1].name} •`
										: `${ourProjects[6].name}`
								}`,
								callback_data: `${
									projectNum == 7 ? "-" : "ourProjectsList7"
								}`,
							},
						],
						[
							{
								text: `⬅️В меню`,
								callback_data: "exit",
							},
							// {
							// 	text: `Каталог 🛒`,
							// 	callback_data: "catalog0",
							// },
						],
					],
				},
			}
		);
	} catch (error) {
		console.log(error);
		sendDataAboutError(chatId, dataAboutUser.login, `${String(error)}`);
	}
}

async function moreAboutUs(chatId, stageNum = 1) {
	const dataAboutUser = usersData.find((obj) => obj.chatId == chatId);

	try {
		dataAboutUser.userAction = "moreAboutUs";

		// <b>История основания</b> нашей компании <b>необычна</b> и <b>оригинальна,</b> она лежит <b>на поверхности, никаких тайн! 😉</b>\n\n
		await bot.editMessageText(
			`<b><i>👥 О нас • ${
				stageNum == 1
					? `Преимущества 🏆`
					: stageNum == 2
						? "О компании ℹ️"
						: stageNum == 3
							? "Политика компании 📖"
							: ``
			}</i></b>\n\n${
				stageNum == 1
					? `<b>Ключевые преимущества</b> нашей компании <b>перед другими,</b> с которыми вам <b>гарантированы</b> самые <b>выгодные условия:</b>${
							moreAboutUsText[stageNum - 1]
						}<b>\n<a href="https://t.me/digfusion">Инфо</a> • <a href="https://t.me/digfeedbacks">Отзывы</a> • <a href="https://t.me/digsupport">Поддержка</a></b>`
					: stageNum == 2
						? `Компания <b><i>digfusion</i></b> - <b>начинающий стартап</b> в сфере услуг и ваш <b>надежный</b> партнер в области <b>разработки чат-ботов!</b>\n\n${
								moreAboutUsText[stageNum - 1]
							}\n\nПросмотреть <b>«Почему именно вам стоит иметь чат-бота для своих потребностей»</b> можно в нашем <b>канале <a href="https://t.me/digfusion">digfusion</a>! 🤗\n\n<a href="https://t.me/digfusion">Инфо</a> • <a href="https://t.me/digfeedbacks">Отзывы</a> • <a href="https://t.me/digsupport">Поддержка</a></b>`
						: stageNum == 3
							? `${
									moreAboutUsText[stageNum - 1]
								}<b><a href ="https://telegra.ph/digfusion--Politika-08-08#%D0%A7%D1%82%D0%BE-%D0%B2%D1%8B-%D0%BC%D0%BE%D0%B6%D0%B5%D1%82%D0%B5-%D0%BE%D0%B6%D0%B8%D0%B4%D0%B0%D1%82%D1%8C-%D0%BE%D1%82-%D0%BD%D0%B0%D1%81">Полный документ digfusion</a></b>`
							: ``
			}`,
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
								text: `${
									stageNum == 1
										? `• Преимущества 🏆 •`
										: "Преимущества 🏆"
								}`,
								callback_data: `${
									stageNum == 1 ? `-` : "moreAboutUs1"
								}`,
							},
						],
						[
							{
								text: `${
									stageNum == 2
										? `• О компании ℹ️ •`
										: "О компании ℹ️"
								}`,
								callback_data: `${
									stageNum == 2 ? `-` : "moreAboutUs2"
								}`,
							},
							{
								text: `${
									stageNum == 3
										? `• Политика 📖 •`
										: "Политика 📖"
								}`,
								callback_data: `${
									stageNum == 3 ? `-` : "moreAboutUs3"
								}`,
							},
						],
						[
							{ text: "⬅️В меню", callback_data: "exit" },
							{ text: "Связь 💭", callback_data: "consultation" },
						],
					],
				},
			}
		);
	} catch (error) {
		console.log(error);
		sendDataAboutError(chatId, dataAboutUser.login, `${String(error)}`);
	}
}

function truncateString(text, maxLength) {
	if (text && text.length > maxLength) {
		return text.substring(0, maxLength - 3) + "..";
	}
	return text;
}

async function feedbacksList(chatId, listNum = 1, feedbackId = null) {
	const dataAboutUser = usersData.find((obj) => obj.chatId == chatId);

	let text = "";
	let count = 0;
	let countOfLists = 1;

	dataAboutUser.currentFeedbackId = null;

	try {
		if (feedbackId) {
			let allFeedbacksData = [];
			usersData.forEach((user) => {
				if (user.feedbacksData)
					user.feedbacksData.forEach((feedback) => {
						allFeedbacksData.push(feedback);
					});
			});

			const dataAboutFeedback = allFeedbacksData.find(
				(obj) => obj.feedbackId == feedbackId
			);

			await bot.editMessageText(
				`<b><i>📧 Отзыв • <code>${feedbackId}</code> 👤\n\n</i>Содержимое:</b><blockquote><b>${
					dataAboutFeedback.from
				} • ${dataAboutFeedback.userStatus}\n\n${
					dataAboutFeedback.serviceNum
						? `№${dataAboutFeedback.serviceNum} "${
								services[dataAboutFeedback.serviceNum - 1].name
							}" - <a href="https://t.me/${BotName}/?start=catalogOfServices${
								dataAboutFeedback.serviceNum
							}">к услуге</a>`
						: `Неизвестна услуга`
				}</b>${
					dataAboutFeedback.productLink
						? `\n\n<b>Продукт:</b> <a href="${dataAboutFeedback.productLink}">Просмотр продукта</a>`
						: ``
				}\n\n<b>Текст отзыва:</b>\n<i>"${
					dataAboutFeedback.feedbackText
				}</i>"\n\n<b>Рейтинговая оценка:</b> ${
					dataAboutFeedback.opinionRating
				}</blockquote>\n<b>${dataAboutFeedback.creationTime}</b> - ${
					dataAboutFeedback.creationDate
				}\n\n<b><i>Отзыв защищен, и является подлинным!</i></b>`,
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
									text:
										(chatId == jackId ||
											chatId == qu1z3xId) &&
										!dataAboutFeedback.isVerified
											? `Удалить ❌`
											: ``,
									callback_data: `deleteFeedbackWithId${feedbackId}`,
								},
								{
									text:
										chatId == jackId || chatId == qu1z3xId
											? !dataAboutFeedback.isVerified
												? `Показать ✅`
												: ""
											: ``,
									callback_data: `verifiedFeedbackWithId${feedbackId}`,
								},
							],
							[
								{
									text: "⬅️Назад",
									callback_data:
										dataAboutUser.userAction ==
										"feedbacksList1"
											? "feedbacksList"
											: dataAboutUser.userAction ==
												  "feedbacksList3"
												? "unverifiedFeedbacksAdmin"
												: "feedbacksList",
								},
								{
									text:
										(chatId == jackId ||
											chatId == qu1z3xId) &&
										dataAboutFeedback.isVerified
											? `Скрыть 🤷‍♂️`
											: "",
									callback_data: `unverifiedFeedbackWithId${feedbackId}`,
								},
							],
							[
								{
									text:
										chatId == qu1z3xId
											? `Получить информацию по отзыву ⬇️`
											: "",
									callback_data: `digfeedbacksSignAboutFeedbackWithId${feedbackId}`,
								},
							],
						],
					},
				}
			);
		} else {
			let allFeedbacksData;
			switch (listNum) {
				case 1:
					if (dataAboutUser.feedbacksData?.length > 0) {
						dataAboutUser.feedbacksData =
							dataAboutUser.feedbacksData.filter(
								(obj) => obj.isCreated
							);
					}

					count = 0;
					countOfLists = 1;
					text = [""]; // Начальная страница

					allFeedbacksData = [];
					usersData.forEach((user) => {
						if (user.feedbacksData) {
							allFeedbacksData.push(...user.feedbacksData); // Добавляем отзывы через spread оператор
						}
					});

					if (allFeedbacksData.length > 0) {
						for (let i = allFeedbacksData.length - 1; i >= 0; i--) {
							const feedback = allFeedbacksData[i];

							if (feedback.isVerified) {
								count++;
								text[countOfLists - 1] +=
									`<b>${count}. ${feedback.from} • ${feedback.userStatus}\n</b>Услуга<b> ${
										feedback.serviceNum
											? `№${feedback.serviceNum}`
											: `неизвестна 🤷‍♂️`
									} ${
										feedback.isVerified
											? ``
											: `</b>- на проверке 🔎<b>`
									}\nТекст:</b><i> "${truncateString(feedback.feedbackText, 100)}" - ${
										feedback.opinionRating
									}</i>\n<b><a href="https://t.me/${BotName}/?start=feedbackWithId${feedback.feedbackId}">Подробнее об отзыве</a></b>\n\n`;

								// Если достигнут лимит в 3 отзыва на страницу, создаем новую страницу
								if (count % 3 === 0 && i > 0) {
									countOfLists++;
									text[countOfLists - 1] = "";
								}
							}
						}
					} else {
						text[0] = "Пока ни одного отзыва..🤷‍♂️\n\n";
					}

					dataAboutUser.userAction = `feedbacksList1`;

					await bot.editMessageText(
						`<b><i>👥 Отзывы клиентов 📧\n\n${
							countOfLists > 1
								? `${dataAboutUser.supportiveCount} / ${countOfLists} стр • `
								: ``
						}${count} ${
							(count >= 5 && count <= 20) ||
							(count % 10 >= 5 && count % 10 <= 9) ||
							count % 10 === 0
								? "отзывов"
								: count % 10 === 1
									? "отзыв"
									: count % 10 >= 2 && count % 10 <= 4
										? "отзыва"
										: ``
						}</i></b>\n\n${
							text[dataAboutUser.supportiveCount - 1]
								? `${text[dataAboutUser.supportiveCount - 1]}<b>Также размещены в <a href="https://t.me/digfeedbacks">digfusion | отзывы</a></b>`
								: ``
						}`,
						{
							parse_mode: "html",
							chat_id: chatId,
							message_id: usersData.find(
								(obj) => obj.chatId == chatId
							).messageId,
							disable_web_page_preview: true,
							reply_markup: {
								inline_keyboard: [
									[
										{
											text:
												countOfLists > 1
													? dataAboutUser.supportiveCount >
														1
														? "⬅️"
														: "🚫"
													: "",
											callback_data:
												dataAboutUser.supportiveCount >
												1
													? "previousPage"
													: "-",
										},
										{
											text:
												countOfLists > 1
													? `${dataAboutUser.supportiveCount} стр`
													: "",
											callback_data: "firstPage",
										},
										{
											text:
												countOfLists > 1 &&
												dataAboutUser.supportiveCount <
													countOfLists
													? "➡️"
													: "🚫",
											callback_data:
												dataAboutUser.supportiveCount <
												countOfLists
													? "nextPage"
													: "-",
										},
									],
									[
										{
											text:
												dataAboutUser.feedbacksData
													?.length > 0
													? `Ваши отзывы (${
															dataAboutUser.feedbacksData.filter(
																(obj) =>
																	obj.isCreated
															).length
														}) 📧`
													: ``,
											callback_data: "myFeedbacks",
										},
									],
									[
										{
											text: "⬅️В меню",
											callback_data: "exit",
										},
										{
											text: "Создать ➕",
											callback_data: "writeFeedbacks",
										},
									],
								],
							},
						}
					);
					break;
				case 2:
					let dataAboutUserFeedbacks =
						dataAboutUser?.feedbacksData || null;

					count = 0;
					countOfLists = 1;
					text = [""]; // Начальная страница

					if (dataAboutUserFeedbacks) {
						for (
							let i = 0;
							i < dataAboutUserFeedbacks.length;
							i++
						) {
							if (count % 3 == 0 && count != 0) {
								countOfLists++; // Создаем новую страницу, когда достигаем лимита в 3 отзыва
								text[countOfLists - 1] = "";
							}

							count++;
							text[countOfLists - 1] += `<b>${count}. ${
								dataAboutUserFeedbacks[i].from
							} • Услуга ${
								dataAboutUserFeedbacks[i].serviceNum
									? `№${dataAboutUserFeedbacks[i].serviceNum}`
									: `неизвестна 🤷‍♂️`
							} ${
								dataAboutUserFeedbacks[i].isVerified ? `` : `🔎`
							}\nТекст: </b><i>"${truncateString(
								dataAboutUserFeedbacks[i].feedbackText,
								100
							)}" - ${dataAboutUserFeedbacks[i].opinionRating}</i>\n<b><a href="https://t.me/${BotName}/?start=feedbackWithId${
								dataAboutUserFeedbacks[i].feedbackId
							}">Подробнее об отзыве</a></b>\n\n`;
						}
					}

					dataAboutUser.userAction = "feedbacksList2";

					await bot.editMessageText(
						`<b><i>👤 Ваши отзывы 📧\n\n${
							countOfLists > 1
								? `${dataAboutUser.supportiveCount} / ${countOfLists} стр • `
								: ``
						}${count} ${
							(count >= 5 && count <= 20) ||
							(count % 10 >= 5 && count % 10 <= 9) ||
							count % 10 == 0
								? "отзывов"
								: `${
										count % 10 == 1
											? "отзыв"
											: `${
													count % 10 >= 2 &&
													count % 10 <= 4
														? "отзыва"
														: ``
												}`
									}`
						}</i></b>\n\n${
							text[dataAboutUser.supportiveCount - 1]
								? `${text[dataAboutUser.supportiveCount - 1]}${
										dataAboutUser.feedbacksData.find(
											(obj) => !obj.isVerified
										)
											? `<i>🔎 - находится на проверке</i>`
											: ``
									}`
								: `Пока ни одного отзыва..🤷‍♂️`
						}`,
						{
							parse_mode: "html",
							chat_id: chatId,
							message_id: usersData.find(
								(obj) => obj.chatId == chatId
							).messageId,
							disable_web_page_preview: true,
							reply_markup: {
								inline_keyboard: [
									[
										{
											text:
												countOfLists > 1
													? dataAboutUser.supportiveCount >
														1
														? "⬅️"
														: "🚫"
													: "",
											callback_data:
												dataAboutUser.supportiveCount >
												1
													? "previousPage"
													: "-",
										},
										{
											text:
												countOfLists > 1
													? `${dataAboutUser.supportiveCount} стр`
													: "",
											callback_data: "firstPage",
										},
										{
											text:
												countOfLists > 1 &&
												text[
													dataAboutUser
														.supportiveCount
												]
													? "➡️"
													: "🚫",
											callback_data: text[
												dataAboutUser.supportiveCount
											]
												? "nextPage"
												: "-",
										},
									],
									[
										{
											text: "⬅️Назад",
											callback_data: `feedbacksList`,
										},
										{
											text: "Еще ✍️",
											callback_data: "writeFeedbacks",
										},
									],
								],
							},
						}
					);
					break;
				case 3:
					allFeedbacksData = [];
					usersData.forEach((user) => {
						if (user.feedbacksData)
							user.feedbacksData.forEach((feedback) => {
								allFeedbacksData.push(feedback);
							});
					});

					count = 0;

					if (allFeedbacksData)
						for (let i = 0; i < allFeedbacksData.length; i++) {
							if (
								!allFeedbacksData[i].isVerified &&
								allFeedbacksData[i].isCreated
							) {
								count++;
								text += `<b>${count}. ${
									allFeedbacksData[i].from
								} • Услуга ${allFeedbacksData[i].serviceNum ? `№${allFeedbacksData[i].serviceNum}` : `неизвестна 🤷‍♂️`} ${
									allFeedbacksData[i].isVerified ? `` : `🔎`
								}\nТекст: </b><i>"${truncateString(
									allFeedbacksData[i].feedbackText,
									100
								)}" - ${
									allFeedbacksData[i].opinionRating
								}</i>\n<b><a href="https://t.me/${BotName}/?start=feedbackWithId${
									allFeedbacksData[i].feedbackId
								}">Подробнее об отзыве</a></b>\n\n`;
							}
						}

					dataAboutUser.userAction = "feedbacksList3";

					await bot.editMessageText(
						`<b><i>📧 Отзывы на проверке 🔎</i></b>\n\n<b>${count} ${
							(count >= 5 && count <= 20) ||
							(count % 10 >= 5 && count % 10 <= 9) ||
							count % 10 == 0
								? "отзывов"
								: `${
										count % 10 == 1
											? "отзыв"
											: `${
													count % 10 >= 2 &&
													count % 10 <= 4
														? "отзыва"
														: ``
												}`
									}`
						}</b>\n\n${
							text != ""
								? `${text}`
								: `Все отзывы уже проверены! 😉`
						}`,
						{
							parse_mode: "html",
							chat_id: chatId,
							message_id: usersData.find(
								(obj) => obj.chatId == chatId
							).messageId,
							disable_web_page_preview: true,
							reply_markup: {
								inline_keyboard: [
									[
										{
											text: "⬅️В меню",
											callback_data: "adminMenu",
										},
										{
											text: "В список📧",
											callback_data: "feedbacksList",
										},
									],
								],
							},
						}
					);
					break;
			}
		}
	} catch (error) {
		console.log(error);
		sendDataAboutError(chatId, dataAboutUser.login, `${String(error)}`);
	}
}

async function writeFeedbacks(chatId, stageNum) {
	const dataAboutUser = usersData.find((obj) => obj.chatId == chatId);

	try {
		let dataAboutFeedback = usersData
			.find(
				(obj) =>
					obj.feedbacksData &&
					obj.feedbacksData.find(
						(feedback) =>
							dataAboutUser.currentFeedbackId &&
							feedback.feedbackId ==
								dataAboutUser.currentFeedbackId
					)
			)
			?.feedbacksData.at(-1);

		switch (stageNum) {
			case 1:
				if (!dataAboutUser.requestsData?.at(-1)?.isActive) {
					dataAboutUser.userAction = "writeFeedbacks1";
				}

				await bot.editMessageText(
					`<b><i>📧 Создание отзыва ✍️</i></b>\n\n${
						dataAboutUser.requestsData?.length > 0
							? dataAboutUser.requestsData?.at(-1)?.isActive
								? `<b>${
										dataAboutUser.login
									},</b> отзывы оставляются <b>после получения</b> заказа❕\n\n<b><a href="https://t.me/${BotName}/?start=myRequest">Ваша заявка ${
										dataAboutUser.requestsData.at(-1)
											.requestId
									}</a></b>`
								: `Напишите ваше мнение о полученном заказе, нам в личку! 😊\n\n<b>Примечание:</b>\n<i>Пожалуйста, оставьте отзыв с разумным размером, будьте вежливы и излагайте информацию исключительно по теме, которая в дальнейшем поможет сотням клиентов! 🙏</i>\n\n<b><a href="https://t.me/digsupport">ПЕРЕЙТИ В ЛИЧКУ / ОСТАВИТЬ ОТЗЫВ</a></b>`
							: `<b>${dataAboutUser.login},</b> отзывы оставляются <b>после получения</b> заказа❕\n\n<b><a href="https://t.me/${BotName}/?start=catalogOfServices1">Выбрать услугу</a></b>`
					}`,
					{
						parse_mode: "html",
						chat_id: chatId,
						message_id: usersData.find(
							(obj) => obj.chatId == chatId
						).messageId,
						disable_web_page_preview: true,
						reply_markup: {
							inline_keyboard: [
								[
									{
										text: "⬅️Назад",
										callback_data: "feedbacksList",
									},
									{
										text: dataAboutUser.canWriteFeedbacks
											? "Оставить ✍️"
											: ``,
										url: "https://t.me/digsupport",
									},
								],
							],
						},
					}
				);
				break;
			case 2:
				dataAboutUser.userAction = "writeFeedbacks2";

				if (dataAboutFeedback) {
					await bot.editMessageText(
						`<b><i>📧 Создание отзыва ✍️\n\nВаш отзыв:</i></b><blockquote><b>${
							dataAboutFeedback.from
						} • Услуга ${
							dataAboutFeedback.serviceNum
								? `№${dataAboutFeedback.serviceNum}`
								: "неизвестна❕"
						}\n\nПродукт:</b> ${
							dataAboutFeedback.productLink
								? `<a href="${dataAboutFeedback.productLink}">к боту</a>`
								: `Отправьте ссылку`
						}\n\n<b>Отзыв:</b>\n<i>"${
							dataAboutFeedback.feedbackText
						}</i>"\n\n<b>Рейтинговая оценка:</b> ${
							dataAboutFeedback.opinionRating
								? dataAboutFeedback.opinionRating
								: `Выберите ниже`
						}</blockquote><b>\n\n${
							dataAboutFeedback.opinionRating &&
							dataAboutFeedback.serviceNum
								? dataAboutFeedback.productLink
									? `Вы действительно хотите опубликовать ваш отзыв? 🤔`
									: `По желанию, добавьте ссылку на ваш продукт!\n\nПример:\n<code>https://t.me/бот</code> или <code>@бот</code>`
								: `Оцените полученный продукт и выберите услугу!`
						}</b>`,
						{
							parse_mode: "html",
							chat_id: chatId,
							message_id: usersData.find(
								(obj) => obj.chatId == chatId
							).messageId,
							disable_web_page_preview: true,
							reply_markup: {
								inline_keyboard: [
									[
										{
											text: `🛒 ${
												dataAboutFeedback.serviceNum ||
												dataAboutFeedback.opinionRating
													? `Выбрана услуга ${dataAboutFeedback.serviceNum ? `№${dataAboutFeedback.serviceNum}` : "..."} и оценка "${dataAboutFeedback.opinionRating ? dataAboutFeedback.opinionRating : "..."}"`
													: "Выберите услугу и оценку ⬇️"
											}`,
											callback_data: "-",
										},
									],
									[
										{
											text: `${
												dataAboutFeedback.opinionRating ==
												"🤬"
													? `•🤬•`
													: `🤬`
											}`,
											callback_data: "setOpinionRating1",
										},
										{
											text: `${
												dataAboutFeedback.opinionRating ==
												"😠"
													? `•😠•`
													: `😠`
											}`,
											callback_data: "setOpinionRating2",
										},
										{
											text: `${
												dataAboutFeedback.opinionRating ==
												"😐"
													? `•😐•`
													: `😐`
											}`,
											callback_data: "setOpinionRating3",
										},
										{
											text: `${
												dataAboutFeedback.opinionRating ==
												"😊"
													? `•😊•`
													: `😊`
											}`,
											callback_data: "setOpinionRating4",
										},
										{
											text: `${
												dataAboutFeedback.opinionRating ==
												"🤩"
													? `•🤩•`
													: `🤩`
											}`,
											callback_data: "setOpinionRating5",
										},
									],

									[
										{
											text: `${
												dataAboutFeedback.serviceNum ==
												1
													? `• №1 •`
													: `№1`
											}`,
											callback_data: "setServiceNum1",
										},
										{
											text: `${
												dataAboutFeedback.serviceNum ==
												2
													? `• №2 •`
													: `№2`
											}`,
											callback_data: "setServiceNum2",
										},
										{
											text: `${
												dataAboutFeedback.serviceNum ==
												3
													? `• №3 •`
													: `№3`
											}`,
											callback_data: "setServiceNum3",
										},
										{
											text: `${
												dataAboutFeedback.serviceNum ==
												4
													? `• №4 •`
													: `№4`
											}`,
											callback_data: "setServiceNum4",
										},
									],
									[
										{
											text: "⬅️Отменить",
											callback_data: "feedbacksList",
										},
										{
											text: `${
												dataAboutFeedback.opinionRating &&
												dataAboutFeedback.serviceNum
													? "Опубликовать ✅"
													: ``
											}`,
											callback_data: `sendMyFeedback`,
										},
									],
								],
							},
						}
					);
				}
				break;
			case 3:
				dataAboutUser.userAction = "writeFeedbacks3";

				if (dataAboutFeedback) {
					dataAboutFeedback.isCreated = true;

					if (chatId == qu1z3xId) {
						dataAboutFeedback.isVerified = true;

						feedbacksList(chatId);
					} else {
						await bot.editMessageText(
							`<b>Спасибо</b> за ваш <b>фидбек, ${dataAboutUser.login}! 😊</b>\n\n<b>Мы очень ценим ваше мнение! ❤️</b>\n\nОтзыв отправлен <b>на проверку!</b> 😉`,
							{
								parse_mode: "html",
								chat_id: chatId,
								message_id: usersData.find(
									(obj) => obj.chatId == chatId
								).messageId,
								disable_web_page_preview: true,
								reply_markup: {
									inline_keyboard: [
										[
											{
												text: `${
													dataAboutUser.feedbacksData
														?.length > 0
														? `Ваши отзывы (${
																dataAboutUser.feedbacksData.filter(
																	(obj) =>
																		obj.isCreated
																).length
															}) 📧`
														: ``
												}`,
												callback_data: "myFeedbacks",
											},
										],
										[
											{
												text: "⬅️Назад",
												callback_data: "feedbacksList",
											},
											{
												text: "Еще ✍️",
												callback_data: "writeFeedbacks",
											},
										],
									],
								},
							}
						);
					}
					dataAboutUser.currentFeedbackId = null;
				}

				break;
		}
	} catch (error) {
		console.log(error);
		sendDataAboutError(chatId, dataAboutUser.login, `${String(error)}`);
	}
}

async function settings(chatId, editLogin = false, afterEdit = false) {
	const dataAboutUser = usersData.find((obj) => obj.chatId == chatId);

	try {
		if (!editLogin) {
			dataAboutUser.userAction = "settings";

			await bot.editMessageText(
				`<b><i>👤 Профиль • <code>${
					dataAboutUser.chatId
				}</code> ⚙️</i>\n\nДанные:\n</b>Логин: <b>${
					dataAboutUser.login
				}</b> - <a href="https://t.me/${BotName}/?start=editLogin">изменить</a>${
					dataAboutUser.phoneNumber
						? `\nТелефон: <b>+${dataAboutUser.phoneNumber}</b>`
						: ``
				}\n\n<b>Лояльность</b> - <a href="https://t.me/${BotName}/?start=moreAboutUserStatus">подробнее</a>\nСтатус:<b> ${
					dataAboutUser.userStatus
				}</b>\nРазмер скидки:<b> ${
					dataAboutUser.requestsData
						? `${
								dataAboutUser.requestsData.length >= 3
									? "3%"
									: dataAboutUser.requestsData.length >= 6
										? "6%"
										: dataAboutUser.requestsData.length >=
											  10
											? "10%"
											: dataAboutUser.requestsData
														.length < 3
												? "Нет ( 0% )"
												: ""
							}`
						: `Нет ( 0% )`
				}</b>\n\n<b>Статистика:</b>\nВсего заказов: <b>${
					dataAboutUser.requestsData
						? dataAboutUser.requestsData.length
						: "0"
				} шт</b>${
					!dataAboutUser.requestsData
						? ` - <a href="https://t.me/${BotName}/?start=catalogOfServices1">к услугам</a>`
						: ``
				}\nКол-во отзывов: <b>${
					dataAboutUser.feedbacksData
						? dataAboutUser.feedbacksData.filter(
								(obj) => obj.isVerified
							).length
						: "0"
				}${
					dataAboutUser.feedbacksData?.length > 0
						? ` / ${
								dataAboutUser.feedbacksData.filter(
									(obj) => obj.isCreated
								).length
							} шт</b> - <a href="https://t.me/${BotName}/?start=myFeedbacks">ваши отзывы</a>`
						: ` шт</b>`
				}\n\n<b>Прочее:</b>\nВы с нами с <b>${
					dataAboutUser.registrationDate
				}</b>\n\n<b><a href="https://telegra.ph/digfusion--Politika-08-08#%D0%A7%D1%82%D0%BE-%D0%B2%D1%8B-%D0%BC%D0%BE%D0%B6%D0%B5%D1%82%D0%B5-%D0%BE%D0%B6%D0%B8%D0%B4%D0%B0%D1%82%D1%8C-%D0%BE%D1%82-%D0%BD%D0%B0%D1%81">Политика компании digfusion</a></b>`,
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
									text: `${
										dataAboutUser.requestsData?.at(-1)
											?.isActive
											? `❕Ваша заявка ${
													dataAboutUser.requestsData.find(
														(obj) => obj.isActive
													).requestId
												} ⌛`
											: ""
									}`,
									callback_data: "myRequest",
								},
							],
							[
								{ text: "⬅️В меню", callback_data: "exit" },
								{
									text: "Связь 💭",
									callback_data: "consultation",
								},
							],
							[
								{
									text: `${
										chatId == jackId || chatId == qu1z3xId
											? `Управление 💠`
											: ""
									}`,
									callback_data: "adminMenu",
								},
							],
						],
					},
				}
			);
		}
		if (editLogin) {
			dataAboutUser.userAction = "editLogin";

			await bot.editMessageText(
				`<i><b>🛠️ Изменение логина ⚙️\n\n</b>Логин используется для идентификации пользователя! 🔒</i><b>\n\n${
					afterEdit
						? `Изменённый: <code>${dataAboutUser.supportiveCount}</code>`
						: `Текущий: <code>${dataAboutUser.login}</code>`
				}${
					afterEdit
						? "\n\nПрименить изменения для логина? 🤔"
						: "\n\nНапишите, как можно к вам обращаться ✍️"
				}</b>`,
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
									text: `${
										dataAboutUser.login !=
										dataAboutUser.telegramFirstName
											? "Сбросить 🔄️"
											: ""
									}`,
									callback_data: "resetLogin",
								},
							],
							[
								{
									text: `⬅️Назад`,
									callback_data: "settings",
								},
								{
									text: `${afterEdit ? "Принять✅" : ""}`,
									callback_data: "editLogin",
								},
							],
						],
					},
				}
			);
		}
	} catch (error) {
		console.log(error);
		sendDataAboutError(chatId, dataAboutUser.login, `${String(error)}`);
	}
}

async function userStatusInfo(chatId) {
	const dataAboutUser = usersData.find((obj) => obj.chatId == chatId);

	try {
		await bot.editMessageText(
			`<b><i>👑 Программа лояльности 📊</i></b>\n\nУ <b>каждого</b> клиента имеется <b>статус,</b> который в зависимости <b>от уровня,</b> предоставляет <b>скидку на заказ</b> при его <b>оформлении! 😍\n\nВот весь список:</b><blockquote><b>"Клиент 🙂"</b> - без скидки (<b>начальный</b>) *\n\n<b>"Постоянный клиент 😎"</b> - 3% (от <b>3 заказов</b>) *\n\n<b>"Особый клиент 🤩"</b> - 6% (от <b>6 заказов</b>) *\n\n<b>"Лучший покупатель 🤴"</b> - 10% (от <b>10 заказов</b>) *\n\n<i>* Считаются только выполненные заказы</i></blockquote>\n\nТекущая роль: <b>${
				dataAboutUser.userStatus
			}</b>\nКол-во заказов: ${
				dataAboutUser.requestsData
					? `<b>${dataAboutUser.requestsData.length} шт</b>`
					: `<b>0 шт</b> - <a href="https://t.me/${BotName}/?start=catalogOfServices1">к услугам</a>`
			}\n\n${
				services.find((obj) => obj.firstPrice)
					? `<i>Скидки суммируются с текущими скидками на услуги!</i>`
					: ``
			}`,
			{
				parse_mode: "html",
				chat_id: chatId,
				message_id: usersData.find((obj) => obj.chatId == chatId)
					.messageId,
				disable_web_page_preview: true,
				reply_markup: {
					inline_keyboard: [
						[
							{ text: "⬅️Назад", callback_data: "settings" },
							{
								text: "Каталог 🛒",
								callback_data: "catalog0",
							},
						],
					],
				},
			}
		);
	} catch (error) {
		console.log(error);
		sendDataAboutError(chatId, dataAboutUser.login, `${String(error)}`);
	}
}

async function dialogBuilder(chatId, textNum = 1) {
	const dataAboutUser = usersData.find((obj) => obj.chatId == chatId);

	const dateNowHHNN = new Date().getHours() * 100 + new Date().getMinutes();
	let textToSayHelloForEnd = "";

	if (dateNowHHNN < 1200 && dateNowHHNN >= 600) {
		textToSayHello = "Доброе утро";
		textToSayHelloForEnd = "Доброго утра";
	} else if (dateNowHHNN < 1700 && dateNowHHNN >= 1200) {
		textToSayHello = "Добрый день";
		textToSayHelloForEnd = "Доброго дня";
	} else if (dateNowHHNN < 2200 && dateNowHHNN >= 1700) {
		textToSayHello = "Добрый вечер";
		textToSayHelloForEnd = "Доброго вечера";
	} else if (dateNowHHNN >= 2200 || dateNowHHNN < 600) {
		textToSayHello = "Доброй ночи";
		textToSayHelloForEnd = "Доброй ночи";
	}

	try {
		let dataAboutClient;
		if (clientChatId)
			dataAboutClient = usersData.find(
				(obj) => obj.chatId == clientChatId
			);

		let dataAboutСertainRequest;
		if (dataAboutClient && dataAboutClient.requestsData)
			dataAboutСertainRequest = dataAboutClient.requestsData.at(-1);

		if (textNum == 0) clientChatId = null;

		let textsToDialog = [
			`${textToSayHello}${
				clientChatId ? `, ${dataAboutClient.login}` : ""
			}! 👋\n\nМое имя Давид, и я готов помочь вам с любыми вопросами, касающимися нашей деятельности. Я лично отвечаю за выполнение всех проектов и буду работать с вами, чтобы гарантировать успешное завершение вашего будущего проекта! 😊`,
			`Подробную информацию о наших преимуществах и о нашей компании вы можете узнать в нашем боте-консультате, в разделе "О нас"! 😉`,
			`Услуги подробно и понятно описаны в нашем консультационном боте, в разделе "Каталог услуг". Если у вас остались вопросы, не стесняйтесь их задавать! 😉`,
			`Для оформления нам потребуется, чтобы вы точно определились с услугой и создали на неё заявку в разделе "Каталог услуг", после чего написали нам, указав номер созданной заявки. 😉\n\nЕсли ваша заявка уже создана, номер можно заметить на странице главного меню.`,
			`пока нет`,
			`${
				clientChatId ? `${dataAboutClient.login}` : "Уважаемый клиент"
			}, благодарим вас за сотрудничество! Мы очень надеемся, что опыт работы с нами вам запомнился, и мы получим содержательный отзыв о предоставленной услуге. 🙏\n\nОтзыв можно оставить в разделе "Отзывы"\n\nНадеемся увидеть вас снова в числе наших клиентов. ${textToSayHelloForEnd}! 😉`,
			``,
		];

		dataAboutUser.userAction = "dialogBuilder";

		await bot.editMessageText(
			`<b><i>🗣️ Конструктор диалога ${
				dataAboutСertainRequest ? `• <code>${clientChatId}</code>` : ``
			}🛠️</i></b>\n\n<b>Скопировать:</b><blockquote><code>${
				textsToDialog[textNum - 1]
			}</code></blockquote>\n\n${
				!dataAboutClient
					? `Впишите Id любого клиента ✍️`
					: `Текущий клиент: <b><a href="https://t.me/${BotName}/?start=moreAboutUserWithId${dataAboutClient.chatId}">${dataAboutClient.login}</a></b>`
			}`,
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
								text:
									textNum == 1
										? `• Приветсвие 👋 •`
										: `Приветсвие 👋`,
								callback_data: "dialogBuilder1",
							},
						],
						[
							{
								text:
									textNum == 2 ? `• О нас ℹ️ •` : `О нас ℹ️`,
								callback_data: "dialogBuilder2",
							},
							{
								text:
									textNum == 3
										? `• Услуги 🛒 •`
										: `Услуги 🛒`,
								callback_data: "dialogBuilder3",
							},
						],
						[
							{
								text:
									textNum == 4
										? `• Оформление заказа 🛍️ •`
										: `Оформление заказа 🛍️`,
								callback_data: "dialogBuilder4",
							},
						],
						[
							{
								text:
									textNum == 5
										? `• Оплата 💰 •`
										: `Оплата 💰`,
								callback_data: "dialogBuilder5",
							},
							{
								text:
									textNum == 6 ? `• Отзыв 📧 •` : `Отзыв 📧`,
								callback_data: "dialogBuilder6",
							},
						],
						[
							{
								text:
									textNum == 7
										? `• Прощание 🫂 •`
										: `Прощание 🫂`,
								callback_data: "dialogBuilder7",
							},
						],
						[
							{
								text: `${
									dataAboutСertainRequest
										? `К клиенту 👤`
										: ``
								}`,
								url: `tg://user?id=${clientChatId}`,
							},
							{
								text: `${
									dataAboutСertainRequest?.requestsData
										? `К заявке 🧑‍💻`
										: ``
								}`,
								callback_data: `${
									dataAboutСertainRequest?.requestsData
										? `requestWithId${
												dataAboutСertainRequest.requestsData.at(
													-1
												).requestId
											}`
										: `-`
								}`,
							},
						],
						[
							{ text: "⬅️В меню", callback_data: "exit" },
							{
								text: `${
									dataAboutСertainRequest
										? `К текстам 📖`
										: ``
								}`,
								callback_data: `dialogBuilder0`,
							},
						],
					],
				},
			}
		);
	} catch (error) {
		console.log(error);
		sendDataAboutError(chatId, dataAboutUser.login, `${String(error)}`);
	}
}

async function adminMenu(chatId) {
	if (chatId == jackId || chatId == qu1z3xId) {
		const dataAboutUser = usersData.find((obj) => obj.chatId == chatId);

		let allRequestsData = [];
		usersData.forEach((user) => {
			if (user.requestsData)
				user.requestsData.forEach((request) => {
					allRequestsData.push(request);
				});
		});

		let allFeedbacksData = [];
		usersData.forEach((user) => {
			if (user.feedbacksData)
				user.feedbacksData.forEach((feedback) => {
					allFeedbacksData.push(feedback);
				});
		});

		try {
			await bot.editMessageText(
				`<b><i>💠 Управление 💠</i>\n\n</b>Здравствуйте, <b>${dataAboutUser.login}!\n\nЧто вы хотите изменить? 🤔</b>`,
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
									text: `${
										allRequestsData &&
										allRequestsData.filter(
											(obj) => obj.isActive
										).length != 0
											? `❕Заявки (${
													allRequestsData.filter(
														(obj) => obj.isActive
													).length
												})`
											: "Заявки"
									} 🧑‍💻`,
									callback_data: "requestsDataAdmin",
								},
							],
							[
								{
									text: "Реестр 💾",
									callback_data: "registryDataAdmin",
								},

								{
									text: "Статистика 📊",
									callback_data: "statisticListAdmin",
								},
							],

							[
								{
									text: `Отзывы ${
										allFeedbacksData &&
										allFeedbacksData.filter(
											(obj) =>
												!obj.isVerified && obj.isCreated
										).length > 0
											? `(${
													allFeedbacksData.filter(
														(obj) =>
															!obj.isVerified &&
															obj.isCreated
													).length
												})`
											: ``
									} 📧`,
									callback_data: "unverifiedFeedbacksAdmin",
								},
							],
							[{ text: "⬅️В меню", callback_data: "exit" }],
						],
					},
				}
			);
		} catch (error) {
			console.log(error);
			sendDataAboutError(chatId, dataAboutUser.login, `${String(error)}`);
		}
	}
}

async function requestsList(
	chatId,
	listNum = 1,
	requestId = null,
	userIdForRequest = false
) {
	const dataAboutUser = usersData.find((obj) => obj.chatId == chatId);

	try {
		if (userIdForRequest) {
			let dataAboutСertainRequest = dataAboutUser.requestsData?.at(-1);

			let botService = dataAboutСertainRequest.service.bot || {
				serviceNum: null,
			};
			let serverService = dataAboutСertainRequest.service.server || {
				serviceNum: null,
				variationNum: null,
			};

			// let totalPrice;
			// \n\n<b>ИТОГО:</b> <s>${element.firstPrice}</s> <b><i>${
			// 	totalPriceSentence
			// }р (выгода ${Math.round((element.firstPrice - element.price) / 10) * 10}р) 🔥</i></b>

			await bot.editMessageText(
				`<b><i>🧑‍💻 Ваша заявка • <code>${
					dataAboutСertainRequest.requestId
				}</code> 🪪</i>\n\nУслуга для бота:</b>\n<blockquote>${
					botService.serviceNum
						? `<b>${botService.serviceNum}. ${
								services[botService.serviceNum - 1].name
							}</b> - <a href="https://t.me/${BotName}/?start=catalogOfServices${
								botService.serviceNum
							}">подробнее</a>\n\n<b>Цена:</b> ${
								services[botService.serviceNum - 1]
									.priceSentence
							} 💰\n\n<b><a href="https://t.me/${BotName}/?start=catalogOfServices1">Изменить услугу</a></b>`
						: `<b>Не выбрана</b> - <a href="https://t.me/${BotName}/?start=catalogOfServices1">выбрать</a>`
				}</blockquote>\n\n<b>Тариф для сервера:</b>\n<blockquote>${
					serverService?.serviceNum != null &&
					serverService?.variationNum != null &&
					services[serverService.serviceNum - 1].variations
						? `<b>${serverService.serviceNum}. ${
								services[serverService.serviceNum - 1].name
							} (на ${services[serverService.serviceNum - 1].variations[serverService.variationNum - 1].name})</b> - <a href="https://t.me/${BotName}/?start=catalogOfServices${
								serverService.serviceNum
							}">подробнее</a>\n\n<b>Цена:</b> ${
								services[serverService.serviceNum - 1]
									.variations[serverService.variationNum - 1]
									.priceSentence
							} 💰\n\n<b><a href="https://t.me/${BotName}/?start=catalogOfServices4">Изменить услугу</a></b>`
						: `<b>Не выбран</b> - <a href="https://t.me/${BotName}/?start=catalogOfServices4">выбрать</a>`
				}</blockquote>\nСтатус: <b>${
					dataAboutСertainRequest.isActive
						? "Обрабатывается.. ⌛"
						: "Обработана! ✅"
				}</b>\n\n<b>${dataAboutСertainRequest.creationTime}</b> - ${
					dataAboutСertainRequest.creationDate
				}`,

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
									text: "Написать нам напрямую 💭",
									callback_data: `consultation`,
								},
							],
							[
								dataAboutСertainRequest.isActive
									? {
											text: `Сменить 🔃`,
											callback_data: `catalog0`,
										}
									: {
											text: `Отзыв ✍️`,
											callback_data: "writeFeedbacks",
										},
								dataAboutСertainRequest.isActive
									? {
											text: `Удалить ❌`,
											callback_data: `deleteRequestQuestionWithId${dataAboutСertainRequest.requestId}`,
										}
									: {
											text: `Каталог 🛒`,
											callback_data: `catalogOfServices`,
										},
							],
							[
								{
									text: "⬅️В меню",
									callback_data: "exit",
								},
							],
						],
					},
				}
			);
		} else if (chatId == jackId || chatId == qu1z3xId) {
			if (!requestId) {
				let count = 0;
				let countOfLists = 1;
				let listText = ["", "", "", "", "", "", "", "", "", ""];

				let allRequestsData = [];
				usersData.forEach((user) => {
					if (user.requestsData)
						user.requestsData.forEach((request) => {
							allRequestsData.push(request);
						});
				});

				switch (listNum) {
					case 1:
						dataAboutUser.userAction = "requestsList1";

						if (allRequestsData)
							for (let i = 0; i < allRequestsData.length; i++) {
								if (allRequestsData[i].isActive) {
									let dataAboutUserСertainRequest =
										usersData.find(
											(obj) =>
												obj.requestsData &&
												obj.requestsData.find(
													(request) =>
														request.requestId ==
														allRequestsData[i]
															.requestId
												)
										);

									if (count % 10 == 0 && count != 0) {
										++countOfLists;
									}
									count++;
									listText[countOfLists - 1] +=
										`<b>[${count}] <a href="tg://user?id=${
											dataAboutUserСertainRequest.chatId
										}">${
											dataAboutUserСertainRequest.login
										}</a> • <code>${
											dataAboutUserСertainRequest.chatId
										}</code> ⌛\n${allRequestsData[i].creationTime}</b> - ${
											allRequestsData[i].creationDate
										}<b>\n<a href = "https://t.me/${BotName}/?start=requestWithId${
											allRequestsData[i].requestId
										}">Подробнее о заявке</a></b>\n\n`;
								}
							}
						break;
					case 2:
						dataAboutUser.userAction = "requestsList2";

						if (allRequestsData)
							for (let i = 0; i < allRequestsData.length; i++) {
								let dataAboutUserСertainRequest =
									usersData.find(
										(user) =>
											user.requestsData &&
											user.requestsData.find(
												(request) =>
													request.requestId ==
													allRequestsData[i].requestId
											)
									);

								if (count % 10 == 0 && count != 0) {
									++countOfLists;
								}
								count++;
								listText[countOfLists - 1] +=
									`<b>[${count}] <a href="tg://user?id=${
										dataAboutUserСertainRequest.chatId
									}">${dataAboutUserСertainRequest.login}</a> • <code>${
										dataAboutUserСertainRequest.chatId
									}</code> ${
										allRequestsData[i].isActive
											? "⌛"
											: "✅"
									}\n${allRequestsData[i].creationTime}</b> - ${
										allRequestsData[i].creationDate
									}\n<b><a href = "https://t.me/${BotName}/?start=requestWithId${
										allRequestsData[i].requestId
									}">Подробнее о заявке</a></b>\n\n`;
							}
						break;
				}

				await bot.editMessageText(
					`<b><i>🧑‍💻 Список заявок • ${
						listNum == 1
							? "Новые❕"
							: listNum == 2
								? "За все время 📚"
								: ""
					}\n\n${
						countOfLists > 1
							? `${dataAboutUser.supportiveCount} / ${countOfLists} стр • `
							: ``
					}${count} ${
						(count >= 5 && count <= 20) ||
						(count % 10 >= 5 && count % 10 <= 9) ||
						count % 10 == 0
							? "заявок"
							: `${
									count % 10 == 1
										? "заявка"
										: `${
												count % 10 >= 2 &&
												count % 10 <= 4
													? "заявки"
													: ``
											}`
								}`
					}</i></b>\n\n${
						listText[dataAboutUser.supportiveCount - 1]
							? `${
									listText[dataAboutUser.supportiveCount - 1]
								}Впишите Id любой заявки ✍️`
							: "Не вижу <b>ни одной</b> заявки.. 🤷‍♂️"
					}`,
					{
						parse_mode: "html",
						chat_id: chatId,
						message_id: usersData.find(
							(obj) => obj.chatId == chatId
						).messageId,
						disable_web_page_preview: true,
						reply_markup: {
							inline_keyboard: [
								[
									{
										text:
											countOfLists > 1
												? dataAboutUser.supportiveCount >
													1
													? "⬅️"
													: "🚫"
												: "",
										callback_data:
											dataAboutUser.supportiveCount > 1
												? "previousPage"
												: "-",
									},
									{
										text:
											countOfLists > 1
												? `${dataAboutUser.supportiveCount} стр`
												: "",
										callback_data: "firstPage",
									},
									{
										text:
											countOfLists > 1
												? listText[
														dataAboutUser
															.supportiveCount
													]
													? "➡️"
													: "🚫"
												: "",
										callback_data: listText[
											dataAboutUser.supportiveCount
										]
											? "nextPage"
											: "-",
									},
								],
								[
									{
										text: `${listNum == 1 ? "•" : ""} Новые ${
											allRequestsData &&
											allRequestsData.filter(
												(obj) => obj.isActive
											)
												? `(${
														allRequestsData.filter(
															(obj) =>
																obj.isActive
														).length
													} шт) `
												: ""
										}❕${listNum == 1 ? "•" : ""}`,
										callback_data: "requestsList1",
									},
								],
								[
									{
										text: "⬅️Назад",
										callback_data: "adminMenu",
									},
									{
										text: `${listNum == 2 ? "• Все 📚 •" : "Все 📚"}`,
										callback_data: "requestsList2",
									},
								],
							],
						},
					}
				);
			} else if (requestId) {
				let dataAboutUserСertainRequest;
				if (
					usersData.find(
						(obj) =>
							obj.requestsData &&
							obj.requestsData.find(
								(request) => request.requestId == requestId
							)
					)
				) {
					dataAboutUserСertainRequest = usersData.find(
						(obj) =>
							obj.requestsData &&
							obj.requestsData.find(
								(request) => request.requestId == requestId
							)
					);
				}

				if (
					dataAboutUserСertainRequest.requestsData &&
					dataAboutUserСertainRequest.requestsData.find(
						(obj) => obj.requestId == requestId
					)
				) {
					const dataAboutСertainRequest =
						dataAboutUserСertainRequest.requestsData.find(
							(obj) => obj.requestId == requestId
						);

					let botService = dataAboutСertainRequest.service.bot;
					let serverService = dataAboutСertainRequest.service.server;

					await bot.editMessageText(
						`<b><i>🧑‍💻 Заявка • <code>${requestId}</code> 🪪</i></b>${
							botService.serviceNum
								? `\n\n<b>Услуга для бота:</b>\n<blockquote><b>${botService.serviceNum}. ${
										services[botService.serviceNum - 1].name
									}</b>\n\n<b>Цена:</b> ${
										services[botService.serviceNum - 1]
											.priceSentence
									} 💰</blockquote>`
								: ``
						}${
							serverService.serviceNum
								? `\n\n<b>Тариф для сервера:</b>\n<blockquote><b>${serverService.serviceNum}. ${
										services[serverService.serviceNum - 1]
											.name
									} (на ${services[serverService.serviceNum - 1].variations[serverService.variationNum - 1].name})</b>\n\n<b>Цена:</b> ${
										services[serverService.serviceNum - 1]
											.variations[
											serverService.variationNum - 1
										].priceSentence
									} 💰</blockquote>`
								: ``
						}\n<b>${
							dataAboutСertainRequest.creationTime
						}</b> - ${dataAboutСertainRequest.creationDate} ${
							dataAboutСertainRequest.isActive ? "🕗" : `✅`
						}`,
						{
							parse_mode: "html",
							chat_id: chatId,
							message_id: usersData.find(
								(obj) => obj.chatId == chatId
							).messageId,
							disable_web_page_preview: true,
							reply_markup: {
								inline_keyboard: [
									[
										{
											text: "🛠️",
											callback_data: `buildDialogForUserWithId${dataAboutUserСertainRequest.chatId}`,
										},
										{
											text: "👤",
											url: `tg://user?id=${dataAboutUserСertainRequest.chatId}`,
										},
										{
											text: `${
												dataAboutСertainRequest.isActive
													? "✅"
													: "⌛"
											}`,
											callback_data: `toggleToActiveRequestWithId${dataAboutСertainRequest.requestId}`,
										},
									],
									[
										{
											text: "⬅️Назад",
											callback_data:
												dataAboutUser.userAction ==
													"requestsList1" ||
												dataAboutUser.userAction ==
													"requestsList2"
													? "requestsList1"
													: "exit",
										},
										{
											text: dataAboutСertainRequest.isActive
												? "Удалить❌"
												: "",
											callback_data: `deleteRequest100%WithId${dataAboutСertainRequest.requestId}`,
										},
									],
								],
							},
						}
					);
				}
			}
		}
	} catch (error) {
		console.log(error);
		sendDataAboutError(chatId, dataAboutUser.login, `${String(error)}`);
	}
}

async function registryList(chatId, listNum = 1, otherChatId = null) {
	if (chatId == jackId || chatId == qu1z3xId) {
		const dataAboutUser = usersData.find((obj) => obj.chatId == chatId);

		let text = "";
		let count = 0;
		let countOfLists = 1;

		try {
			if (otherChatId) {
				const dataAboutClient = usersData.find(
					(obj) => obj.chatId == otherChatId
				);

				await bot.editMessageText(
					`<b><i>💾 Клиент • <code>${
						dataAboutClient.chatId
					}</code>👤</i>\n\nПодробнее:</b><blockquote><b>Данные</b>\nЛогин: <b>${
						dataAboutClient.login
					}</b>${
						dataAboutClient.phoneNumber
							? `\nТелефон: <code>+${dataAboutClient.phoneNumber}</code>`
							: ``
					}\nСтатус: <b>${
						dataAboutClient.userStatus
					}</b>\n\n<b>Статистика:</b>\nЗаявок: <b>${
						dataAboutClient.requestsData
							? dataAboutClient.requestsData.length
							: 0
					} шт</b>\nОтзывов: <b>${
						dataAboutClient.feedbacksData
							? `${
									dataAboutClient.feedbacksData.filter(
										(obj) => obj.isVerified
									).length
								} / ${
									dataAboutClient.feedbacksData.filter(
										(obj) => obj.isCreated
									).length
								}`
							: 0
					} шт</b></blockquote><b>${dataAboutClient.registrationDate}</b>`,
					{
						parse_mode: "html",
						chat_id: chatId,
						message_id: usersData.find(
							(obj) => obj.chatId == chatId
						).messageId,
						disable_web_page_preview: true,
						reply_markup: {
							inline_keyboard: [
								[
									{
										text:
											dataAboutClient.chatId != jackId
												? `${
														dataAboutClient.inBlackList
															? `Разблокировать ✅`
															: `Заблокировать ❌`
													}`
												: ``,
										callback_data: `${
											dataAboutClient.inBlackList
												? `deleteFromBlackListUserWithId${dataAboutClient.chatId}`
												: `addToBlackListUserWithId${dataAboutClient.chatId}`
										}`,
									},
								],
								[
									{
										text: "⬅️Назад",
										callback_data: `registryList1`,
									},
									{
										text: "Клиент 👤",
										url: `tg://user?id=${dataAboutClient.chatId}`,
									},
								],
							],
						},
					}
				);
			} else {
				switch (listNum) {
					case 1:
						count = 0;
						countOfLists = 1;
						text = [
							"",
							"",
							"",
							"",
							"",
							"",
							"",
							"",
							"",
							"",
							"",
							"",
							"",
							"",
							"",
							"",
						];
						for (let i = 0; i < usersData.length; i++) {
							if (count % 10 == 0 && count != 0) {
								++countOfLists;
							}

							count++;
							text[countOfLists - 1] +=
								`<b>${count}. ${usersData[i].login} • <code>${usersData[i].chatId}</code>\n</b>Статус:<b> ${usersData[i].userStatus}\n<a href="https://t.me/${BotName}/?start=moreAboutUserWithId${usersData[i].chatId}">Подробнее о клиенте</a></b>\n\n`;
						}

						dataAboutUser.userAction = "registryList1";

						await bot.editMessageText(
							`<b><i>💾 Реестр клиентов 📁\n\n${
								countOfLists > 1
									? `${dataAboutUser.supportiveCount} / ${countOfLists} стр • `
									: ``
							}${count} ${
								(count >= 5 && count <= 20) ||
								(count % 10 >= 5 && count % 10 <= 9) ||
								count % 10 == 0
									? "клиентов"
									: `${
											count % 10 == 1
												? "клиент"
												: `${
														count % 10 >= 2 &&
														count % 10 <= 4
															? "клиента"
															: ``
													}`
										}`
							}</i></b>\n\n${
								text[dataAboutUser.supportiveCount - 1]
									? `${
											text[
												dataAboutUser.supportiveCount -
													1
											]
										}Впишите Id любого клиента ✍️`
									: `Пока ни одного клиента..🤷‍♂️`
							}`,
							{
								parse_mode: "html",
								chat_id: chatId,
								message_id: usersData.find(
									(obj) => obj.chatId == chatId
								).messageId,
								disable_web_page_preview: true,
								reply_markup: {
									inline_keyboard: [
										[
											{
												text:
													countOfLists > 1
														? dataAboutUser.supportiveCount >
															1
															? "⬅️"
															: "🚫"
														: "",
												callback_data:
													dataAboutUser.supportiveCount >
													1
														? "previousPage"
														: "-",
											},
											{
												text:
													countOfLists > 1
														? `${dataAboutUser.supportiveCount} стр`
														: "",
												callback_data: "firstPage",
											},
											{
												text:
													countOfLists > 1
														? text[
																dataAboutUser
																	.supportiveCount
															]
															? "➡️"
															: "🚫"
														: "",
												callback_data: text[
													dataAboutUser
														.supportiveCount
												]
													? "nextPage"
													: "-",
											},
										],
										[
											{
												text: "⬅️Назад",
												callback_data: "adminMenu",
											},
											{
												text: "БД 🗄️",
												url: "https://console.firebase.google.com/u/0/project/digfusionco/database/digfusionco-default-rtdb/data",
											},
										],
									],
								},
							}
						);
						break;
					case 2:
						break;
				}
			}
		} catch (error) {
			console.log(error);
			sendDataAboutError(chatId, dataAboutUser.login, `${String(error)}`);
		}
	}
}

async function statisticList(chatId) {
	if (chatId == jackId || chatId == qu1z3xId) {
		const dataAboutUser = usersData.find((obj) => obj.chatId == chatId);
		try {
			systemData.requestsAllTime = null;
			systemData.feedbacksAllTime = null;

			for (let i = 0; i < usersData.length; i++) {
				if (usersData[i].requestsData)
					systemData.requestsAllTime +=
						usersData[i].requestsData.length;
				if (usersData[i].feedbacksData)
					systemData.feedbacksAllTime +=
						usersData[i].feedbacksData.length;
			}

			await bot.editMessageText(
				`<b><i>📱 Статистика 📊</i>\n\nЗа сегодня:</b>\n<b>• ${
					systemData.newClientsToday
				}</b> ${
					(systemData.newClientsToday >= 5 &&
						systemData.newClientsToday <= 20) ||
					(systemData.newClientsToday % 10 >= 5 &&
						systemData.newClientsToday % 10 <= 9) ||
					systemData.newClientsToday % 10 == 0
						? "новых клиентов"
						: `${
								systemData.newClientsToday % 10 == 1
									? "новый клиент"
									: `${
											systemData.newClientsToday % 10 >=
												2 &&
											systemData.newClientsToday % 10 <= 4
												? "новых клиента"
												: ``
										}`
							}`
				}\n<b>• ${systemData.activityToday}</b> ${
					(systemData.activityToday >= 5 &&
						systemData.activityToday <= 20) ||
					(systemData.activityToday % 10 >= 5 &&
						systemData.activityToday % 10 <= 9) ||
					systemData.activityToday % 10 == 0
						? "действий"
						: `${
								systemData.activityToday % 10 == 1
									? "действие"
									: `${
											systemData.activityToday % 10 >=
												2 &&
											systemData.activityToday % 10 <= 4
												? "действия"
												: ``
										}`
							}`
				}\n<b>• ${systemData.newRequestsToday}</b> ${
					(systemData.newRequestsToday >= 5 &&
						systemData.newRequestsToday <= 20) ||
					(systemData.newRequestsToday % 10 >= 5 &&
						systemData.newRequestsToday % 10 <= 9) ||
					systemData.newRequestsToday % 10 == 0
						? "заявок"
						: `${
								systemData.newRequestsToday % 10 == 1
									? "заявка"
									: `${
											systemData.newRequestsToday % 10 >=
												2 &&
											systemData.newRequestsToday % 10 <=
												4
												? "заявки"
												: ``
										}`
							}`
				}\n<b>• ${systemData.newFeedbacksToday}</b> ${
					(systemData.newFeedbacksToday >= 5 &&
						systemData.newFeedbacksToday <= 20) ||
					(systemData.newFeedbacksToday % 10 >= 5 &&
						systemData.newFeedbacksToday % 10 <= 9) ||
					systemData.newFeedbacksToday % 10 == 0
						? "отзывов"
						: `${
								systemData.newFeedbacksToday % 10 == 1
									? "отзыв"
									: `${
											systemData.newFeedbacksToday % 10 >=
												2 &&
											systemData.newFeedbacksToday % 10 <=
												4
												? "отзыва"
												: ``
										}`
							}`
				}\n\n<b>За все время:</b>\n<b>• ${usersData.length}</b> ${
					(systemData.activityAllTime >= 5 &&
						systemData.activityAllTime <= 20) ||
					(systemData.activityAllTime % 10 >= 5 &&
						systemData.activityAllTime % 10 <= 9) ||
					systemData.activityAllTime % 10 == 0
						? "клиентов"
						: `${
								systemData.activityAllTime % 10 == 1
									? "клиент"
									: `${
											systemData.activityAllTime % 10 >=
												2 &&
											systemData.activityAllTime % 10 <= 4
												? "клиента"
												: ``
										}`
							}`
				}\n<b>• ${systemData.activityAllTime}</b> ${
					(systemData.activityAllTime >= 5 &&
						systemData.activityAllTime <= 20) ||
					(systemData.activityAllTime % 10 >= 5 &&
						systemData.activityAllTime % 10 <= 9) ||
					systemData.activityAllTime % 10 == 0
						? "действий"
						: `${
								systemData.activityAllTime % 10 == 1
									? "действие"
									: `${
											systemData.activityAllTime % 10 >=
												2 &&
											systemData.activityAllTime % 10 <= 4
												? "действия"
												: ``
										}`
							}`
				}\n<b>• ${systemData.requestsAllTime}</b> ${
					(systemData.requestsAllTime >= 5 &&
						systemData.requestsAllTime <= 20) ||
					(systemData.requestsAllTime % 10 >= 5 &&
						systemData.requestsAllTime % 10 <= 9) ||
					systemData.requestsAllTime % 10 == 0
						? "заявок"
						: `${
								systemData.requestsAllTime % 10 == 1
									? "заявка"
									: `${
											systemData.requestsAllTime % 10 >=
												2 &&
											systemData.requestsAllTime % 10 <= 4
												? "заявки"
												: ``
										}`
							}`
				}\n<b>• ${systemData.feedbacksAllTime}</b> ${
					(systemData.feedbacksAllTime >= 5 &&
						systemData.feedbacksAllTime <= 20) ||
					(systemData.feedbacksAllTime % 10 >= 5 &&
						systemData.feedbacksAllTime % 10 <= 9) ||
					systemData.feedbacksAllTime % 10 == 0
						? "отзывов"
						: `${
								systemData.feedbacksAllTime % 10 == 1
									? "отзыв"
									: `${
											systemData.feedbacksAllTime % 10 >=
												2 &&
											systemData.feedbacksAllTime % 10 <=
												4
												? "отзыва"
												: ``
										}`
							}`
				}`,
				{
					parse_mode: "html",
					chat_id: chatId,
					message_id: usersData.find((obj) => obj.chatId == chatId)
						.messageId,
					disable_web_page_preview: true,
					reply_markup: {
						inline_keyboard: [
							[
								{ text: "⬅️Назад", callback_data: "adminMenu" },
								{
									text: "Обновить🔄️",
									callback_data: "statisticListAdmin",
								},
							],
						],
					},
				}
			);
		} catch (error) {
			console.log(error);
			sendDataAboutError(chatId, dataAboutUser.login, `${String(error)}`);
		}
	}
}

// Функция для миграции данных пользователей с обновлением недостающих полей
function runMigration(filePath) {
	// Шаблон данных пользователя
	const userSchema = {
		chatId: null,
		login: "",
		phoneNumber: null,
		userStatus: "Клиент 🙂",
		messageId: null,
		userAction: null,
		selectedService: {
			bot: { serviceNum: 1 },
			server: { serviceNum: 1, variationNum: 1 },
		},
		requestsData: [],
		feedbacksData: [],
		aiSelectorData: {
			query: null,
			response: { serviceNum: null, explanation: null },
		},
		currentFeedbackId: null,
		currentRequestId: null,
		messageIdOther: null,
		telegramFirstName: "",
		supportiveCount: 1,
		registrationDate: "",
		inBlackList: false,
		date: new Date(),
	};

	// Рекурсивная функция для проверки и добавления недостающих полей из схемы
	function applySchema(object, schema) {
		for (let key in schema) {
			if (!(key in object)) {
				object[key] = schema[key]; // Добавляем недостающее поле
			} else if (
				typeof schema[key] === "object" &&
				schema[key] !== null &&
				!Array.isArray(schema[key])
			) {
				if (
					typeof object[key] === "object" &&
					object[key] !== null &&
					!Array.isArray(object[key])
				) {
					applySchema(object[key], schema[key]); // Рекурсивно для вложенных объектов
				} else {
					// Если в базе данных значение не объект, но по схеме должно быть объектом
					object[key] = schema[key];
				}
			} else if (
				Array.isArray(schema[key]) &&
				schema[key].length > 0 &&
				typeof schema[key][0] === "object"
			) {
				if (Array.isArray(object[key])) {
					object[key].forEach((item) =>
						applySchema(item, schema[key][0])
					); // Для массивов объектов
				} else {
					// Если в базе данных значение не массив, но по схеме должно быть массивом
					object[key] = schema[key];
				}
			}
		}
	}

	// Чтение, миграция и сохранение обновленных данных
	const usersData = JSON.parse(fs.readFileSync(filePath)).usersData || null;
	const systemData = JSON.parse(fs.readFileSync(filePath)).systemData || null;

	usersData.forEach((user) => applySchema(user, userSchema));

	fs.writeFileSync(
		filePath,
		JSON.stringify({ usersData, systemData }, null, 2)
	);

	console.log("Миграция завершена успешно!");
}

async function StartAll() {
	if (TOKEN == config.TOKENs[1]) BotName = "digfusionbot";
	if (TOKEN == config.TOKENs[0]) BotName = "digtestingbot";

	if (
		fs.readFileSync("DB.json") != "[]" &&
		fs.readFileSync("DB.json") != ""
	) {
		let dataFromDB = JSON.parse(fs.readFileSync("DB.json"));

		usersData = dataFromDB.usersData || null;
		systemData = dataFromDB.systemData || null;
	}

	// bot.on("contact", (message) => {
	// 	const chatId = message.chat.id;
	// 	const dataAboutUser = usersData.find((obj) => obj.chatId == chatId);

	// 	if (dataAboutUser && dataAboutUser.userAction == "firstMeeting4") {
	// 		dataAboutUser.phoneNumber = message.contact.phone_number;
	// 		menuHome(chatId);

	// 		try {
	// 			await bot.deleteMessage(chatId, dataAboutUser.messageIdOther);
	// 			await bot.deleteMessage(chatId, message.message_id);
	// 		} catch (error) {}
	// 	}
	// });

	bot.on("photo", (message) => {
		const chatId = message.chat.id;
		const fileId = message.photo[message.photo.length - 1].file_id; // file_id самой большой версии фото

		console.log(message + "\n\n" + fileId);
	});

	bot.on("text", async (message) => {
		const chatId = message.chat.id;
		let text = message.text;

		// console.log(message);

		let dataAboutUser = usersData?.find((obj) => obj.chatId == chatId);

		try {
			if (!dataAboutUser) {
				usersData.push({
					chatId: chatId,
					login: message.from.first_name,
					phoneNumber: null,
					userStatus: "Клиент 🙂",
					messageId: null,
					userAction: null,

					selectedService: {
						bot: { serviceNum: 1 },
						server: { serviceNum: 1, variationNum: 1 },
					},

					requestsData: [],
					feedbacksData: [],
					aiSelectorData: {
						query: null,
						response: { serviceNum: null, explanation: null },
					},

					currentFeedbackId: null,
					currentRequestId: null,

					messageIdOther: null,
					telegramFirstName: message.from.first_name,
					supportiveCount: 1,
					inBlackList: false,
					registrationDate: `${new Date()
						.getDate()
						.toString()
						.padStart(2, "0")}.${(new Date().getMonth() + 1)
						.toString()
						.padStart(2, "0")}.${(new Date().getFullYear() % 100)
						.toString()
						.padStart(2, "0")}`,
					date: new Date(),
				});

				++systemData.newClientsToday;
				dataAboutUser = usersData.find((obj) => obj.chatId == chatId);
			}

			if (dataAboutUser && !dataAboutUser.inBlackList) {
				if (
					message.forward_origin &&
					!dataAboutUser.currentFeedbackId &&
					chatId == qu1z3xId
				) {
					let dataAboutСertainUser = usersData.find(
						(obj) => obj.chatId == message.forward_origin?.id
					);

					if (!dataAboutСertainUser) {
						dataAboutСertainUser = usersData.find(
							(obj) => obj.chatId == jackId
						);
					}

					if (dataAboutСertainUser) {
						let isUnique = false;
						while (!isUnique) {
							rndId = Math.floor(Math.random() * 9999);
							isUnique = true;

							if (usersData) {
								for (let i = 0; i < usersData.length; i++) {
									if (usersData[i].feedbacksData)
										for (
											let j = 0;
											j <
											usersData[i].feedbacksData.length;
											j++
										) {
											if (
												usersData[i].feedbacksData[j]
													.feedbackId === rndId
											) {
												isUnique = false;
												break;
											}
										}
									if (!isUnique) break;
								}
							} else break;
						}

						if (dataAboutСertainUser?.feedbacksData) {
							dataAboutСertainUser.feedbacksData.push({
								from:
									message.forward_origin.sender_user
										?.first_name ||
									message.forward_origin.sender_user_name?.split(
										" "
									)[0],
								userStatus: dataAboutСertainUser.userStatus,
								serviceNum: null,

								opinionRating: "🤩",
								feedbackText: text,
								productLink: "",

								creationTime: `${String(
									new Date().getHours()
								).padStart(
									2,
									"0"
								)}:${String(new Date().getMinutes()).padStart(2, "0")}`,
								creationDate: `${new Date()
									.getDate()
									.toString()
									.padStart(2, "0")}.${(
									new Date().getMonth() + 1
								)
									.toString()
									.padStart(2, "0")}.${(
									new Date().getFullYear() % 100
								)
									.toString()
									.padStart(2, "0")}`,
								date: new Date(),

								feedbackId: rndId,
								isVerified: false,
								isCreated: true,
							});
						}

						++systemData.newFeedbacksToday;

						dataAboutUser.currentFeedbackId = rndId;

						writeFeedbacks(chatId, 2);
					}
				}

				if (
					dataAboutUser.userAction == "firstMeeting3" &&
					Array.from(text)[0] != "/"
				) {
					dataAboutUser.login = text;

					firstMeeting(chatId, 4);
				}

				if (
					dataAboutUser.userAction == "aiSelector" &&
					Array.from(text)[0] != "/"
				) {
					if (dataAboutUser.aiSelectorData?.response) {
						dataAboutUser.aiSelectorData.response = null;
					}

					aiSelector(chatId, text);
				}

				if (
					text.includes("/start showNavigationListInMenuHome") ||
					text.includes("/start hideNavigationListInMenuHome")
				) {
					match = text.match(
						/^\/start (.*)NavigationListInMenuHome$/
					);

					match[1] == "show"
						? menuHome(chatId, true)
						: match[1] == "hide"
							? menuHome(chatId, false)
							: null;
				}

				if (text.includes("/start catalogOfServices")) {
					match = text.match(/^\/start catalogOfServices(.*)$/);

					let catalogNum = null;
					switch (parseInt(match[1])) {
						case 1:
						case 2:
						case 3:
							catalogNum = 1;
							dataAboutUser.selectedService.bot.serviceNum =
								parseInt(match[1]);
							break;
						case 4:
						case 5:
							catalogNum = 2;
							dataAboutUser.selectedService.server = {
								serviceNum: parseInt(match[1]),
								variationNum: 1,
							};
							break;
					}

					dataAboutUser.supportiveCount = parseInt(match[1]);

					catalogOfServices(chatId, catalogNum);
				}

				if (
					dataAboutUser.userAction == "writeFeedbacks1" &&
					Array.from(text)[0] != "/" &&
					chatId == jackId
				) {
					let isUnique = false;
					while (!isUnique) {
						rndId = Math.floor(Math.random() * 9999);
						isUnique = true;

						if (usersData) {
							for (let i = 0; i < usersData.length; i++) {
								if (usersData[i].feedbacksData)
									for (
										let j = 0;
										j < usersData[i].feedbacksData.length;
										j++
									) {
										if (
											usersData[i].feedbacksData[j]
												.feedbackId === rndId
										) {
											isUnique = false;
											break;
										}
									}
								if (!isUnique) break;
							}
						} else break;
					}

					if (!dataAboutUser.feedbacksData)
						dataAboutUser.feedbacksData = [];

					if (
						(dataAboutUser.feedbacksData &&
							dataAboutUser.requestsData) ||
						chatId == jackId
					)
						dataAboutUser.feedbacksData.push({
							from: dataAboutUser.login,
							userStatus: dataAboutUser.userStatus,
							serviceNum: null,

							opinionRating: null,
							feedbackText: text,
							productLink: null,

							creationTime: `${String(
								new Date().getHours()
							).padStart(
								2,
								"0"
							)}:${String(new Date().getMinutes()).padStart(2, "0")}`,
							creationDate: `${new Date()
								.getDate()
								.toString()
								.padStart(2, "0")}.${(new Date().getMonth() + 1)
								.toString()
								.padStart(2, "0")}.${(
								new Date().getFullYear() % 100
							)
								.toString()
								.padStart(2, "0")}`,
							date: new Date(),

							feedbackId: rndId,
							isVerified: false,
							isCreated: false,
						});

					++systemData.newFeedbacksToday;

					dataAboutUser.currentFeedbackId = rndId;

					writeFeedbacks(chatId, 2);
				}

				if (
					dataAboutUser.userAction == "writeFeedbacks2" &&
					(text.includes("https://t.me/") ||
						Array.from(text)[0] == "@") &&
					Array.from(text)[0] != "/"
				) {
					if (Array.from(text)[0] == "@") {
						text = `https://t.me/${text}`;
					}

					usersData
						.find(
							(obj) =>
								obj.feedbacksData &&
								obj.feedbacksData.find(
									(feedback) =>
										dataAboutUser.currentFeedbackId &&
										feedback.feedbackId ==
											dataAboutUser.currentFeedbackId
								)
						)
						.feedbacksData.at(-1).productLink = text;

					writeFeedbacks(chatId, 2);
				}

				if (text.includes("/start feedbackWithId")) {
					match = text.match(/^\/start feedbackWithId(.*)$/);

					feedbacksList(chatId, null, parseInt(match[1]));
				}

				if (
					dataAboutUser.userAction == "editLogin" &&
					text != dataAboutUser.login &&
					Array.from(text)[0] != "/"
				) {
					dataAboutUser.supportiveCount = text;
					settings(chatId, true, true);
				}

				if (
					dataAboutUser.userAction == "dialogBuilder" &&
					usersData.find((obj) => obj.chatId == parseInt(text))
				) {
					clientChatId = parseInt(text);

					dialogBuilder(chatId, null);
				}

				if (
					(dataAboutUser.userAction == "requestsList1" ||
						dataAboutUser.userAction == "requestsList2") &&
					dataAboutUser.requestsData?.find(
						(obj) => obj.requestId == parseInt(text)
					)
				) {
					requestsList(chatId, null, parseInt(text));
				}

				if (text.includes("/start requestWithId")) {
					match = text.match(/^\/start requestWithId(.*)$/);

					requestsList(chatId, null, parseInt(match[1]));
				}

				if (
					dataAboutUser.userAction == "registryList" &&
					usersData.find((obj) => obj.chatId == parseInt(text))
				) {
					registryList(chatId, null, parseInt(text));
				}

				if (
					text.includes("/start moreAboutUserWithId") &&
					(chatId == jackId || chatId == qu1z3xId)
				) {
					match = text.match(/^\/start moreAboutUserWithId(.*)$/);

					registryList(chatId, null, parseInt(match[1]));
				}

				if (
					text == "/services" ||
					text == "/consultation" ||
					text == "/profile" ||
					text == "/start catalog0"
				) {
					try {
						await bot.deleteMessage(
							chatId,
							dataAboutUser.messageId
						);
					} catch (error) {}

					await bot
						.sendMessage(chatId, "ㅤ")
						.then(
							(message) =>
								(dataAboutUser.messageId = message.message_id)
						);

					switch (text) {
						case "/services":
							catalogOfServices(chatId);
							break;
						case "/consultation":
							consultation(chatId);
							break;
						case "/profile":
							settings(chatId);
							break;
						case "/start catalog0":
							catalogOfServices(chatId);
							break;
					}
				}

				//? АЛЕРТЫ

				if (
					text.includes("/alert") &&
					(chatId == qu1z3xId || chatId == jackId)
				) {
					let alertData = {};
					switch (text) {
						case "/alert1":
							alertData = {
								text:
									"Искусственный интеллект сильно повышает оптимизацию бизнес-процессов. \n" +
									"\n" +
									"Мы не отстаем, и рады представить вам - персонализированный подбор услуг, с использованием самой передовой генеративной модели на рынке! 🚀\n" +
									"\n" +
									"Готовы вывести ваше дело на новый уровень? Теперь это в разы удобнее! 😉",
								entities: [
									{ offset: 0, length: 70, type: "bold" },
									{ offset: 0, length: 70, type: "italic" },
									{ offset: 109, length: 35, type: "bold" },
									{ offset: 163, length: 35, type: "bold" },
									{ offset: 199, length: 12, type: "bold" },
									{ offset: 213, length: 72, type: "bold" },
								],
								photoId:
									"AgACAgIAAxkBAAIKamc16LDdpGNxbYD0PPnz7NyNDJdFAAJH4zEbdOSxSd4ircRnHqW9AQADAgADeQADNgQ",
								buttons: [
									[
										{
											text: "Каталог услуг с ИИ ✨",
											callback_data: "catalog0",
										},
									],
								],
							};
							break;
						case "/alert2":
							break;
					}
					if (alertData)
						for (let i = 0; i < usersData.length; i++) {
							const element = usersData[i];

							try {
								if (element.chatId != qu1z3xId)
									await bot.deleteMessage(
										element.chatId,
										element.messageId
									);
							} catch (error) {}

							try {
								if (alertData.photoId) {
									await bot
										.sendPhoto(
											element.chatId,
											alertData.photoId,
											{
												caption: alertData.text || null,
												caption_entities:
													alertData.entities || null,
												disable_web_page_preview: true,
												reply_markup: {
													inline_keyboard:
														alertData.buttons
															? alertData.buttons
															: {
																	text: "",
																	callback_data:
																		"-",
																},
												},
											}
										)
										.then((message) => {
											element.messageIdOther =
												message.message_id;
										});
								} else {
									await bot
										.sendMessage(
											element.chatId,
											alertData.text,
											{
												disable_web_page_preview: true,
												entities:
													alertData.entities || null,
												reply_markup: {
													inline_keyboard:
														alertData.buttons
															? alertData.buttons
															: {
																	text: "",
																	callback_data:
																		"-",
																},
												},
											}
										)
										.then((message) => {
											element.messageIdOther =
												message.message_id;
										});
								}
							} catch (error) {
								console.log(error);
								sendDataAboutError(
									element.chatId,
									element.login,
									`${String(error)}`
								);
								continue;
							}
						}
				}

				switch (text) {
					case "/restart":
					case "/start":
						try {
							await bot.deleteMessage(
								chatId,
								dataAboutUser.messageId
							);
						} catch (error) {}

						await bot.sendMessage(chatId, "ㅤ").then((message) => {
							dataAboutUser.messageId = message.message_id;
						});

						if (text == "/restart") {
							menuHome(chatId);
						} else {
							firstMeeting(chatId, 1);
						}
						break;
					case "/start ideasForProjects":
						ideasForProjects(chatId);
						break;
					case "/start myFeedbacks":
						feedbacksList(chatId, 2);
						break;
					case "/start editLogin":
						settings(chatId, true);
						break;
					case "/start moreAboutUserStatus":
						userStatusInfo(chatId);
						break;
					case "/start moreAboutUs":
						moreAboutUs(chatId);
						break;
					case "/start myRequest":
						requestsList(chatId, null, null, true);
						break;
					case "/start myRequestsHistory":
						requestsList(chatId, 4);
						break;
					case "/data":
						if (chatId == jackId || chatId == qu1z3xId) {
							const dataToSend = {
								usersData,
								systemData,
							};
							sendDataAboutDataBase(dataToSend);
						}
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
					case "":
						break;
				}
			}

			await bot.deleteMessage(chatId, message.message_id);

			++systemData.activityToday;
			++systemData.activityAllTime;

			if (chatId != qu1z3xId && chatId != jackId) {
				sendDataAboutText(chatId, dataAboutUser.login, text);
			}
		} catch (error) {
			console.log(error);
			sendDataAboutError(
				chatId,
				dataAboutUser?.login,
				`${String(error)}`
			);
		}
	});

	bot.on("callback_query", async (query) => {
		const chatId = query.message.chat.id;
		const data = query.data;

		let dataAboutUser = usersData?.find((obj) => obj.chatId == chatId);

		if (!dataAboutUser) {
			usersData.push({
				chatId: chatId,
				login: query.from.first_name,
				phoneNumber: null,
				userStatus: "Клиент 🙂",
				messageId: query.message.message_id,
				userAction: null,

				selectedService: {
					bot: { serviceNum: 1 },
					server: { serviceNum: 1, variationNum: 1 },
				},

				requestsData: [],
				feedbacksData: [],
				aiSelectorData: {
					query: null,
					response: { serviceNum: null, explanation: null },
				},

				currentFeedbackId: null,
				currentRequestId: null,

				messageIdOther: null,
				telegramFirstName: query.from.first_name,
				supportiveCount: 1,
				registrationDate: `${new Date()
					.getDate()
					.toString()
					.padStart(2, "0")}.${(new Date().getMonth() + 1)
					.toString()
					.padStart(2, "0")}.${(new Date().getFullYear() % 100)
					.toString()
					.padStart(2, "0")}`,
				date: new Date(),
				inBlackList: false,
			});

			++systemData.newClientsToday;
			dataAboutUser = usersData.find((obj) => obj.chatId == chatId);
		}

		if (dataAboutUser) {
			try {
				if (!dataAboutUser.inBlackList) {
					if (
						query.message.message_id == dataAboutUser.messageIdOther
					) {
						try {
							await bot.deleteMessage(
								chatId,
								dataAboutUser.messageIdOther
							);
						} catch (error) {}

						dataAboutUser.messageIdOther = null;

						await bot.sendMessage(chatId, "ㅤ").then((message) => {
							dataAboutUser.messageId = message.message_id;
						});
					} else dataAboutUser.messageId = query.message.message_id;

					if (data.includes("firstMeeting")) {
						match = data.match(/^firstMeeting(.*)$/);

						firstMeeting(chatId, parseInt(match[1]));
					}

					if (data.includes("catalogOfServices")) {
						match = data.match(/^catalogOfServices(.*)$/);

						let catalogNum = null;
						switch (parseInt(match[1])) {
							case 1:
							case 2:
							case 3:
								catalogNum = 1;
								dataAboutUser.selectedService.bot.serviceNum =
									parseInt(match[1]);
								break;
							case 4:
							case 5:
								catalogNum = 2;
								dataAboutUser.selectedService.server = {
									serviceNum: parseInt(match[1]),
									variationNum: 1,
								};
								break;
						}

						dataAboutUser.supportiveCount = parseInt(match[1]);

						catalogOfServices(chatId, catalogNum);
					} else if (data.includes("catalog")) {
						match = data.match(/^catalog(.*)$/);

						let serviceNum = null;
						switch (parseInt(match[1])) {
							case 1:
								serviceNum = 1;

								dataAboutUser.selectedService = {
									bot: { serviceNum: serviceNum },
									server: {
										serviceNum: null,
										variationNum: 1,
									},
								};
								break;
							case 2:
								serviceNum = 4;

								dataAboutUser.selectedService = {
									bot: { serviceNum: null },
									server: {
										serviceNum: serviceNum,
										variationNum: 1,
									},
								};
								break;
						}

						dataAboutUser.supportiveCount = serviceNum;

						catalogOfServices(chatId, parseInt(match[1]));
					}

					if (
						data.includes("nextServiceNum") ||
						data.includes("previousServiceNum")
					) {
						match = data.match(/^(.*)ServiceNum$/);

						const maxServices =
							dataAboutUser.userAction === "catalog1" ? 3 : 5;
						const minServices =
							dataAboutUser.userAction === "catalog1" ? 1 : 4;

						if (
							dataAboutUser.supportiveCount == maxServices &&
							match[1] == "next"
						) {
							dataAboutUser.supportiveCount = minServices;
						} else if (
							dataAboutUser.supportiveCount == minServices &&
							match[1] == "previous"
						) {
							dataAboutUser.supportiveCount = maxServices;
						} else {
							match[1] == "next"
								? dataAboutUser.supportiveCount++
								: match[1] == "previous"
									? dataAboutUser.supportiveCount--
									: "";
						}

						dataAboutUser.selectedService = {
							bot: {
								serviceNum:
									dataAboutUser.userAction === "catalog1"
										? dataAboutUser.supportiveCount
										: null,
							},
							server: {
								serviceNum:
									dataAboutUser.userAction === "catalog2"
										? dataAboutUser.supportiveCount
										: null,
								variationNum: 1,
							},
						};

						catalogOfServices(
							chatId,
							dataAboutUser.userAction === "catalog1" ? 1 : 2
						);
					}

					if (data.includes("variationNum")) {
						match = data.match(/^variationNum(.*)$/);

						dataAboutUser.selectedService.server.variationNum =
							parseInt(match[1]);

						if (dataAboutUser.userAction == "catalog2") {
							catalogOfServices(
								chatId,
								dataAboutUser.userAction === "catalog1" ? 1 : 2
							);
						}
					}

					if (data.includes("ourProjectsList")) {
						match = data.match(/^ourProjectsList(.*)$/);

						ourProjectsList(chatId, parseInt(match[1]));
					}

					if (data.includes("moreAboutUs")) {
						match = data.match(/^moreAboutUs(.*)$/);

						moreAboutUs(chatId, parseInt(match[1]));
					}

					if (data.includes("deleteFeedbackWithId")) {
						match = data.match(/^deleteFeedbackWithId(.*)$/);

						let allFeedbacksData = [];
						usersData.forEach((user) => {
							if (user.feedbacksData)
								user.feedbacksData.forEach((feedback) => {
									allFeedbacksData.push(feedback);
								});
						});

						if (
							(chatId == jackId || chatId == qu1z3xId) &&
							allFeedbacksData &&
							allFeedbacksData.find(
								(obj) => obj.feedbackId == parseInt(match[1])
							)
						) {
							allFeedbacksData.splice(
								allFeedbacksData.indexOf(
									allFeedbacksData.find(
										(obj) =>
											obj.feedbackId ===
											parseInt(match[1])
									),
									1
								)
							);
						}

						feedbacksList(chatId, 1);
					}

					if (data.includes("unverifiedFeedbackWithId")) {
						match = data.match(/^unverifiedFeedbackWithId(.*)$/);

						let allFeedbacksData = [];
						usersData.forEach((user) => {
							if (user.feedbacksData)
								user.feedbacksData.forEach((feedback) => {
									allFeedbacksData.push(feedback);
								});
						});

						if (
							(chatId == jackId || chatId == qu1z3xId) &&
							allFeedbacksData &&
							allFeedbacksData.find(
								(obj) => obj.feedbackId == parseInt(match[1])
							)
						) {
							allFeedbacksData.find(
								(obj) => obj.feedbackId == parseInt(match[1])
							).isVerified = false;
						}

						feedbacksList(chatId, null, parseInt(match[1]));
					} else if (data.includes("verifiedFeedbackWithId")) {
						match = data.match(/^verifiedFeedbackWithId(.*)$/);

						let allFeedbacksData = [];
						usersData.forEach((user) => {
							if (user.feedbacksData)
								user.feedbacksData.forEach((feedback) => {
									allFeedbacksData.push(feedback);
								});
						});

						if (
							(chatId == jackId || chatId == qu1z3xId) &&
							allFeedbacksData &&
							allFeedbacksData.find(
								(obj) => obj.feedbackId == parseInt(match[1])
							)
						) {
							allFeedbacksData.find(
								(obj) => obj.feedbackId == parseInt(match[1])
							).isVerified = true;
						}
						feedbacksList(chatId, null, parseInt(match[1]));
					} else if (
						data.includes("digfeedbacksSignAboutFeedbackWithId")
					) {
						match = data.match(
							/^digfeedbacksSignAboutFeedbackWithId(.*)$/
						);

						if (chatId == qu1z3xId) {
							let dataAboutFeedback = usersData
								.find((obj) =>
									obj.feedbacksData?.some(
										(feedback) =>
											feedback.feedbackId == match[1]
									)
								)
								?.feedbacksData.find(
									(feedback) =>
										feedback.feedbackId == match[1]
								);

							if (dataAboutFeedback) {
								bot.sendMessage(
									chatId,
									`<b>${dataAboutFeedback.productLink ? `<a href="${dataAboutFeedback.productLink}">Итоговый продукт заказчика</a>\n\n` : ``}Услуга заказчика:</b>\n<blockquote><b>${dataAboutFeedback.serviceNum} ${services[dataAboutFeedback.serviceNum - 1].name}\nЦена:</b> ${services[dataAboutFeedback.serviceNum - 1].priceSentence}</blockquote>\n\n<b><i>digfusion</i>\n<a href="https://t.me/digfusionbot">Услуги</a> • <a href="https://t.me/digfusion">Инфо</a> • <a href="https://t.me/digsupport">Поддержка</a></b>`,
									{
										parse_mode: "HTML",
										disable_web_page_preview: true,
										disable_notification: true,
										reply_markup: {
											inline_keyboard: [
												[
													{
														text: "Удалить ❌",
														callback_data: `deleteexcess`,
													},
												],
											],
										},
									}
								);
							}
						}
					} else if (data.includes("setServiceNum")) {
						match = data.match(/^setServiceNum(.*)$/);

						usersData
							.find(
								(obj) =>
									obj.feedbacksData &&
									obj.feedbacksData.find(
										(feedback) =>
											dataAboutUser.currentFeedbackId &&
											feedback.feedbackId ==
												dataAboutUser.currentFeedbackId
									)
							)
							.feedbacksData.at(-1).serviceNum = match[1];

						writeFeedbacks(chatId, 2);
					} else if (data.includes("setOpinionRating")) {
						match = data.match(/^setOpinionRating(.*)$/);

						usersData
							.find(
								(obj) =>
									obj.feedbacksData &&
									obj.feedbacksData.find(
										(feedback) =>
											dataAboutUser.currentFeedbackId &&
											feedback.feedbackId ==
												dataAboutUser.currentFeedbackId
									)
							)
							.feedbacksData.at(-1).opinionRating =
							match[1] == 1
								? "🤬"
								: match[1] == 2
									? "😠"
									: match[1] == 3
										? "😐"
										: match[1] == 4
											? "😊"
											: match[1] == 5
												? "🤩"
												: null;

						writeFeedbacks(chatId, 2);
					}

					if (data.includes("dialogBuilder")) {
						match = data.match(/^dialogBuilder(.*)$/);

						dialogBuilder(chatId, parseInt(match[1]));
					}

					if (data.includes("requestsList")) {
						match = data.match(/^requestsList(.*)$/);

						dataAboutUser.supportiveCount = 1;

						requestsList(chatId, parseInt(match[1]));
					}

					if (
						data.includes("previousPage") ||
						data.includes("nextPage") ||
						data.includes("firstPage")
					) {
						match = data.match(/^(.*)Page$/);

						if (
							match[1] == "previous" &&
							dataAboutUser.supportiveCount > 1
						) {
							--dataAboutUser.supportiveCount;
						} else if (match[1] == "next") {
							++dataAboutUser.supportiveCount;
						} else if (match[1] == "first") {
							dataAboutUser.supportiveCount = 1;
						}

						if (dataAboutUser.userAction == "feedbacksList1")
							feedbacksList(chatId, 1);
						else if (dataAboutUser.userAction == "feedbacksList2")
							feedbacksList(chatId, 2);
						else if (dataAboutUser.userAction == "requestsList1")
							requestsList(chatId, 1);
						else if (dataAboutUser.userAction == "requestsList2")
							requestsList(chatId, 2);
						else if (dataAboutUser.userAction == "registryList1")
							registryList(chatId, 1);
					}

					if (data.includes("requestWithId")) {
						match = data.match(/^requestWithId(.*)$/);

						dataAboutUser.supportiveCount = 1;

						requestsList(chatId, null, parseInt(match[1]));
					}

					if (data.includes("deleteRequest")) {
						match = data.match(/^deleteRequest(.*)WithId(.*)$/);

						let dataAboutСertainRequest;
						if (dataAboutUser.requestsData)
							dataAboutСertainRequest =
								dataAboutUser.requestsData.at(-1);

						if (match[1] == "Question")
							bot.editMessageText(
								`❕<b>${
									dataAboutUser.login
								}, ваша <a href="https://t.me/${BotName}/?start=myRequest">заявка ${
									dataAboutСertainRequest.requestId
								}</a> еще находится в обработке! ⌛</b>\n\nВы <b>действительно</b> хотите <b><i>безвозвратно</i> удалить вашу заявку?</b> 🤔`,
								{
									parse_mode: "html",
									chat_id: chatId,
									message_id: usersData.find(
										(obj) => obj.chatId == chatId
									).messageId,
									disable_web_page_preview: true,
									reply_markup: {
										inline_keyboard: [
											[
												{
													text: "⬅️Назад",
													callback_data: `myRequest`,
												},
												{
													text: "Да, удалить❌",
													callback_data: `deleteRequest100%WithId${parseInt(
														match[2]
													)}`,
												},
											],
										],
									},
								}
							);
						else if (match[1] == "100%") {
							let dataAboutUserСertainRequest;
							if (
								usersData.find(
									(obj) =>
										obj.requestsData &&
										obj.requestsData.find(
											(request) =>
												request.requestId ==
												parseInt(match[2])
										)
								)
							) {
								dataAboutUserСertainRequest = usersData.find(
									(obj) =>
										obj.requestsData &&
										obj.requestsData.find(
											(request) =>
												request.requestId ==
												parseInt(match[2])
										)
								);

								dataAboutUserСertainRequest.requestsData.splice(
									dataAboutUserСertainRequest.requestsData.indexOf(
										dataAboutUserСertainRequest.requestsData.find(
											(obj) =>
												obj.requestId ==
												parseInt(match[2])
										),
										1
									)
								);

								menuHome(chatId);
							}
						}
					}

					if (data.includes("buildDialogForUserWithId")) {
						match = data.match(/^buildDialogForUserWithId(.*)$/);

						clientChatId = parseInt(match[1]);

						dialogBuilder(chatId, 1);
					}

					if (data.includes("toggleToActiveRequestWithId")) {
						if (chatId == jackId || chatId == qu1z3xId) {
							match = data.match(
								/^toggleToActiveRequestWithId(.*)$/
							);

							const dataAboutUserСertainRequest = usersData.find(
								(obj) =>
									obj.requestsData &&
									obj.requestsData.find(
										(request) =>
											request.requestId ==
											parseInt(match[1])
									)
							);
							let dataAboutСertainRequest = null;
							if (dataAboutUserСertainRequest.requestsData)
								dataAboutСertainRequest =
									dataAboutUserСertainRequest.requestsData.find(
										(obj) =>
											obj.requestId == parseInt(match[1])
									);

							dataAboutСertainRequest.isActive =
								!dataAboutСertainRequest.isActive;

							dataAboutUser.selectedService = null;

							if (!dataAboutСertainRequest.isActive) {
								bot.sendMessage(
									dataAboutUserСertainRequest.chatId,
									`<b>${dataAboutUserСertainRequest.login}, <a href="https://t.me/${BotName}/?start=myRequest">заявка ${dataAboutСertainRequest.requestId}</a> успешно обработана! ✅</b>\n\n<i>Пожалуйста, оставьте содержательный отзыв о полученой работе 🙏</i> \n\n<b>Спасибо вам за сотрудничество! ❤️</b>`,
									{
										parse_mode: "HTML",
										disable_web_page_preview: true,
										reply_markup: {
											inline_keyboard: [
												[
													{
														text: "Оставить отзыв ✍️",
														callback_data:
															"writeFeedbacks",
													},
												],
											],
										},
									}
								).then((message) => {
									dataAboutUserСertainRequest.messageIdOther =
										message.message_id;
								});
							} else {
								try {
									await bot.deleteMessage(
										dataAboutUserСertainRequest.chatId,
										dataAboutUserСertainRequest.messageIdOther
									);
								} catch (error) {}
							}

							requestsList(chatId, null, parseInt(match[1]));
						}
					}

					if (
						data.includes("addToBlackListUserWithId") ||
						data.includes("deleteFromBlackListUserWithId")
					) {
						match = data.match(/^(.*)BlackListUserWithId(.*)$/);

						const dataAboutClient =
							usersData.find(
								(obj) => obj.chatId == parseInt(match[2])
							) || null;

						if (match[1] == "addTo") {
							dataAboutClient.inBlackList = true;
						} else if (match[1] == "deleteFrom") {
							dataAboutClient.inBlackList = false;
						}

						registryList(chatId, null, parseInt(match[2]));
					}

					switch (data) {
						case "exit":
							menuHome(chatId);
							break;
						case "aiSelector":
							bot.answerCallbackQuery(query.id, {
								text: `Чем более содержателен ваш запрос, тем точнее Нейросетивичок подберет для вас решение! 🎯`,
								show_alert: true,
							});

							aiSelector(chatId);
							break;
						case "resetAiSelector":
							dataAboutUser.aiSelectorData = {
								query: null,
								response: {
									serviceNum: null,
									explanation: null,
								},
							};
							aiSelector(chatId);
							break;

						case "moreAboutServer":
							moreAboutServer(chatId);
							break;
						case "warningOrderService":
							orderService(chatId, 1);
							break;
						case "orderService":
							orderService(chatId, 2);
							break;
						case "ideasForProjects":
							ideasForProjects(chatId);
							break;
						case "consultation":
							consultation(chatId);
							break;
						case "moreAboutUs":
							moreAboutUs(chatId);
							break;
						case "feedbacksList":
							dataAboutUser.supportiveCount = 1;
							feedbacksList(chatId);
							break;
						case "writeFeedbacks":
							writeFeedbacks(chatId, 1);
							break;
						case "sendMyFeedback":
							writeFeedbacks(chatId, 3);
							break;
						case "myFeedbacks":
							dataAboutUser.supportiveCount = 1;
							feedbacksList(chatId, 2);
							break;
						case "unverifiedFeedbacksAdmin":
							feedbacksList(chatId, 3);
							break;
						case "":
							break;
						case "":
							break;
						case "":
							break;
						case "myRequest":
							requestsList(chatId, null, null, true);
							break;
						case "settings":
							settings(chatId);
							break;
						case "resetLogin":
							dataAboutUser.login =
								dataAboutUser.telegramFirstName;

							bot.answerCallbackQuery(query.id, {
								text: `Ваш логин снова \n«${dataAboutUser.login}» 😉`,
								show_alert: true,
							});

							settings(chatId);
							break;
						case "editLogin":
							dataAboutUser.login = dataAboutUser.supportiveCount;

							bot.answerCallbackQuery(query.id, {
								text: `Ваш логин изменен на\n«${dataAboutUser.supportiveCount}» 😉`,
								show_alert: true,
							});

							settings(chatId);
							break;
						case "":
							break;
						case "adminMenu":
							adminMenu(chatId);
							break;
						case "requestsDataAdmin":
							dataAboutUser.supportiveCount = 1;
							requestsList(chatId, 1);
							break;
						case "registryList1":
							registryList(chatId);
							break;
						case "registryDataAdmin":
							dataAboutUser.supportiveCount = 1;
							registryList(chatId);
							break;
						case "statisticListAdmin":
							statisticList(chatId);
							break;
						case "":
							break;
						case "":
							break;
						case "":
							break;
						case "deleteexcess":
							try {
								await bot.deleteMessage(
									chatId,
									query.message.message_id
								);
							} catch (error) {}
							break;
					}
				} else if (dataAboutUser.inBlackList) {
					dataAboutUser.userAction = "inBlackList";

					bot.editMessageText(
						`<b>Похоже у вас больше нет доступа в общении с нами! ☹️\n\nЧтобы узнать подробнее причину блокировки, обратитесь в поддержку! 🗯️</b>`,
						{
							chat_id: chatId,
							message_id: usersData.find(
								(obj) => obj.chatId == chatId
							).messageId,
							parse_mode: "html",
							disable_web_page_preview: true,
							reply_markup: {
								inline_keyboard: [
									[
										{
											text: "Обновить 🔄️",
											callback_data: "exit",
										},
										{
											text: "Связь ✍️",
											url: "https://t.me/digsupport",
										},
									],
								],
							},
						}
					);
				}

				++systemData.activityToday;
				++systemData.activityAllTime;

				if (chatId != qu1z3xId && chatId != jackId) {
					sendDataAboutButton(chatId, dataAboutUser.login, data);
				}

				// fs.writeFileSync(
				// 	"DB.json",
				// 	JSON.stringify({ usersData, systemData }, null, 2)
				// );
			} catch (error) {
				console.log(error);
				sendDataAboutError(
					chatId,
					dataAboutUser.login,
					`${String(error)}`
				);
			}
		}
	});

	cron.schedule(`0 */1 * * *`, function () {
		// Запись данных в базу данных
		try {
			if (TOKEN == config.TOKENs[1]) {
				fs.writeFileSync(
					"DB.json",
					JSON.stringify(
						{ usersData: usersData, systemData: systemData },
						null,
						2
					)
				);

				if (new Date().getHours() % 12 == 0)
					sendDataAboutDataBase({
						usersData: usersData,
						systemData: systemData,
					});
			}
		} catch (error) {}
	});

	cron.schedule(`1 0 * * *`, function () {
		systemData.activityToday = 0;
		systemData.newClientsToday = 0;
		systemData.newRequestsToday = 0;
		systemData.newFeedbacksToday = 0;
	});
}

// runMigration("DB.json");
StartAll();
