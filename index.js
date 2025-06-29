import TelegramBot from "node-telegram-bot-api";
import cron from "node-cron";
import fs from "fs";

import {
	sendDataAboutText,
	sendDataAboutButton,
	sendDataAboutError,
	sendDataAboutDataBase,
} from "./tgterminal.js";

import { config } from "./config.js";

const TOKEN = config.TOKENs[1]; // 1 - оригинал
const bot = new TelegramBot(TOKEN, { polling: true });

const qu1z3xId = "923690530";
const digsupportId = "923690530";

let BotName = "digfusionbot";

let usersData = [];
let systemData = {
	feedbacksAllTime: 0,
	activityAllTime: 0,
};

let services = [
	//? БОТЫ

	{
		name: `Однотипный бот`,
		moreAbout:
			"Сбор информации с пользователей, доступ к базе данных. Выполнение несложных операций.",
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
			"Один ведущий раздел с главным функционалом, базы данных любой информации или рассылка сообщений. Базовоя интеграциия нейросети.",
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
			"Полная площадка, со множеством разделов, главным меню и с возможностью администрирования. Сложное внедрение нейросети.",
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
				firstPrice: 0, // 750
				price: 699, // 670
				priceSentence: "",
			},
			{
				name: "3 мес",
				moreAbout:
					"Три месяца хранения проекта на нашем МОЩНОМ хостинге, с подключением, настройкой, поддержкой и гарантией качества!",
				location: "Москва 🇷🇺",
				lifeTime: "90 дней",
				firstPrice: 0, //
				price: 1990, //
				priceSentence: "",
			},
			{
				name: "6 мес",
				moreAbout:
					"Шесть месяцев хранения проекта на нашем МОЩНОМ хостинге, с подключением, настройкой, поддержкой и гарантией качества!",
				location: "Москва 🇷🇺",
				lifeTime: "180 дней",
				firstPrice: 0, // 4400
				price: 4199, // 3990
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
					"Неделя хранения проекта на нашем МОЩНОМ зарубежном сервере. Нужен для обхода ограничений и интеграции сервисов ChatGPT и тд",
				location: "Нидерланды 🇳🇱",
				lifeTime: "7 дней",
				firstPrice: 0,
				price: 199, // 180 себестоимость
				priceSentence: "",
			},
			{
				name: "1 мес",
				moreAbout:
					"Месяц хранения проекта на нашем МОЩНОМ зарубежном сервере. Нужен для обхода ограничений и интеграции сервисов ChatGPT и тд",
				location: "Нидерланды 🇳🇱",
				lifeTime: "30 дней",
				firstPrice: 0, // 850
				price: 799, // 799 (760 себестоимость)
				priceSentence: "",
			},
			{
				name: "3 мес",
				moreAbout:
					"Три месяца хранения проекта на нашем МОЩНОМ зарубежном сервере. Нужен для обхода ограничений и интеграции сервисов ChatGPT и тд",
				location: "Нидерланды 🇳🇱",
				lifeTime: "90 дней",
				firstPrice: 0, //
				price: 2399, // (2280 себестоимость)
				priceSentence: "",
			},
			{
				name: "6 мес",
				moreAbout:
					"Шесть месяцев хранения проекта на нашем МОЩНОМ зарубежном сервере. Нужен для обхода ограничений и интеграции сервисов ChatGPT и тд",
				location: "Нидерланды 🇳🇱",
				lifeTime: "180 дней",
				firstPrice: 0, // 5200
				price: 4990, // 4990 (4628 себестоимость)
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
					? `<s>${obj.firstPrice}</s> <b><i>${obj.price}₽ (-${Math.floor(
							((obj.firstPrice - obj.price) / obj.firstPrice) * 100
						)}%)</i></b>`
					: `<b><i>${obj.price}₽</i></b>`
			}`;
		}
		if (obj.type == "server") {
			for (let j = 0; j < obj.variations.length; j++) {
				const element = obj.variations[j];

				element.priceSentence = `${
					element.firstPrice
						? `<s>${element.firstPrice}</s> <b><i>${
								element.price
							}₽ (выгода ${Math.round((element.firstPrice - element.price) / 10) * 10}₽)</i></b>`
						: `<b><i>${element.price}₽</i></b>`
				}`;
			}
		}
	}

const ourProjects = [
	{
		name: `НейроМетод для ИВЛИЕВОЙ 🧑‍🔬`,
		botName: "neuro_method_bot",
		moreAboutText: `🔥 ИИ по Методу Ивлиевой — мощный инструмент для участников курса МЕТОД. Запросы клиентов, тренировать терапевтические навыки и готовиться к сессиям с ИИ.`,
		serviceSentence: `${services[2].name} - <a href="https://t.me/${BotName}/?start=catalogOfServices${2}">к услуге</a>\n\n<b>Цена:</b> <b><i>${35000}₽  (договорная)</i></b>`,
	},
	{
		name: `проверч́ик ✒️`,
		botName: "digtionary",
		moreAboutText: `Самый мощный ИИ в мире для проверки грамматики! Присылаете любое сообщение, текст - он их исправит и обьяснит`,
		serviceSentence: `${services[1].name} - <a href="https://t.me/${BotName}/?start=catalogOfServices${2}">к услуге</a>\n\n<b>Цена:</b> ${services[1].priceSentence}`,
	},
	{
		name: `Нейро ✨`,
		botName: "digneurobot",
		moreAboutText: `Бесплатный инструмент работы с ИИ. Позволяет быстро получать текстовые ответы, генерировать изображения и видео, упрощая взаимодействие с новейшими технологиями`,
		serviceSentence: `${services[1].name} - <a href="https://t.me/${BotName}/?start=catalogOfServices${2}">к услуге</a>\n\n<b>Цена:</b> ${services[1].priceSentence}`,
	},
	{
		name: `АТЛАНТ для АПОЛЛО 🤵‍♂️`,
		botName: "atlasum_bot",
		moreAboutText: `🔥 ИИ-тренер АПОЛЛО — блогера полумиллионника по саморазвитию. Анализирует тело, подбирает тренировки и отслеживает прогресс`,
		serviceSentence: `${services[2].name} - <a href="https://t.me/${BotName}/?start=catalogOfServices${2}">к услуге</a>\n\n<b>Цена:</b> ${services[2].priceSentence}`,
	},
	{
		name: `KungFuFighter 🥊`,
		botName: "KungFuFighter_bot",
		moreAboutText: `Узнайте всё о клубе Kung-Fu Fighter за секунды с ИИ! Расписание, цены, тренеры - ВСЕ!`,
		serviceSentence: `${services[2].name} - <a href="https://t.me/${BotName}/?start=catalogOfServices${3}">к услуге</a>\n\n<b>Цена:</b> ${services[2].priceSentence}`,
	},

	{
		name: `Цифровичок 🏫`,
		botName: "digschbot",
		moreAboutText: `Школьный помощник, упрощающий учебный процесс. Альтернатива школьному порталу в Telegram`,
		serviceSentence: `${services[2].name} - <a href="https://t.me/${BotName}/?start=catalogOfServices${3}">к услуге</a>\n\n<b>Цена:</b> ${services[2].priceSentence}`,
	},
	{
		name: `digfusion | услуги ☑️`,
		botName: "digfusionbot",
		moreAboutText: `Да, это наш бот-консультант. Серьёзная работа с данными, автоматизация бизнес-процесса, множество сложных разделов.`,
		serviceSentence: `${services[2].name} - <a href="https://t.me/${BotName}/?start=catalogOfServices${3}">к услуге</a>\n\n<b>Цена:</b> ${services[2].priceSentence}`,
	},
	{
		name: `Алгебравичок 🧮`,
		botName: "digmathbot",
		moreAboutText: `Личный репититор, генерирующий арифметические задачки по вашему уровню знаний. Закрепление материала и поддержания счётных навыков в форме.`,
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
	`<blockquote><b>📂 Громкие кейсы</b>\nС нами работали АПОЛЛО (500к подп), ИВЛИЕВА (400к подп) и др.\n\n<b>🤝 Постоплата</b>\nРасчет после завершения, с предоплатой в 50%\n\n<b>💰 Доступные</b>\nЗдесь без конских ценников, платите за качество</blockquote>\n<b>Ваш проект - наша задача!</b>`,

	"<b>Это digfusion — Telegram-боты под ключ</b>\n\nБыстро, надежно и с умом. Нам доверяют <b>ПОПУЛЯРНЫЕ личности.</b> Мы делаем <b>на резултат</b>\n\n<blockquote><i>😁 У вас уже есть идея - мы ее реализуем!</i></blockquote>",

	`<b><blockquote><i><a href="https://telegra.ph/digfusion--Politika-08-08#%D0%A7%D1%82%D0%BE-%D0%B2%D1%8B-%D0%BC%D0%BE%D0%B6%D0%B5%D1%82%D0%B5-%D0%BE%D0%B6%D0%B8%D0%B4%D0%B0%D1%82%D1%8C-%D0%BE%D1%82-%D0%BD%D0%B0%D1%81">Наши обязательсва</a>\n<a href="https://telegra.ph/digfusion--Politika-08-08#%D0%A7%D1%82%D0%BE-%D0%BC%D1%8B-%D0%BE%D0%B6%D0%B8%D0%B4%D0%B0%D0%B5%D0%BC-%D0%BE%D1%82-%D0%B2%D0%B0%D1%81">Что мы ожидаем от вас</a>\n<a href="https://telegra.ph/digfusion--Politika-08-08#%D0%9F%D1%80%D0%B5%D0%B4%D0%BE%D1%81%D1%82%D0%B0%D0%B2%D0%BB%D0%B5%D0%BD%D0%B8%D0%B5-%D1%83%D1%81%D0%BB%D1%83%D0%B3">Предоставление услуг</a>\n<a href="https://telegra.ph/digfusion--Politika-08-08#%D0%A1%D0%B5%D1%80%D0%B2%D0%B5%D1%80-%D0%BF%D1%80%D0%BE%D0%B5%D0%BA%D1%82%D0%B0">Сервер проекта</a></i></blockquote></b>`,

	// "Около года <b>основатель компании</b> посещал <b>Московскую Школу Программистов (МШП),</b> успешно занимаясь и <b>максимально</b> погружаясь в процесс, демонстрируя <b>потрясающие для одного года обучения</b> результаты в виде <b>дополнительных проектов,</b> которые он создавал из своего <b>огромного желания преуспеть</b> в этой области. Уже сегодня, спустя <b>несколько лет</b> с начала своей <b>карьеры в IT</b> он показывает <b>максимум</b> своих <b>приобретенных знаний</b> в <b><i>разработке</i></b> и <i><b>предоставлении услуг</b></i> по созданию чат-ботов.\n\nНо, изначально <b>выбор отрасли не был очевидным,</b> сначала это была <b>разработка консольных приложений,</b> затем упор на <b>дискретную математику,</b> далее разработка <b>веб-приложений для Windows, gameDev,</b> и только потом, по поручению <b>главнокомандующего информатика школы,</b> он углубился в <b>действительно полезную</b> и <b>сложную отрасль</b> разработки – <b>создание чат-ботов в Telegram. Поручение</b> заключалось в создании <b>школьного помощника,</b> который бы <b>показывал расписание, напоминал о звонках, демонстрировал меню столовой</b> и многое другое! Если вы <b>ознакамливались с нашими проектами,</b> то не сложно догадаться, этот <b>прорывной</b> проект – <b>«Цифровичок»,</b> который действительно пригодился <b>десяткам людей как повседневный помощник!</b>",

	// "\n\n<b>Возникает вопрос,</b> откуда появилось название <b>«digfusion»?</b> При создании <b>«Цифровичка»</b> я выбирал <b>доменное имя,</b> и <b>среди предложенных</b> информатиком были имена, состоящие из <b>двух слов – «digital»</b> и <b>«school». Telegram</b> не пропускал <b>по длине</b> все составленные из этих <b>полных</b> слов имена, поэтому в голову пришли <b>гениальные сокращения,</b> такие как <b>«dig»</b> и <b>«sch»</b>, что дает - <b>digsch</b>. <b>Вторым проектом</b> оказался <b>«Спортивичек»,</b> по просьбе <b>физрука,</b> и поскольку он предназначен для <b>судейства,</b> слово <b>«sch» (school)</b> мы заменили на <b>«judge»</b>. Именно поэтому <b>все последующие помощники</b> начинаются с <b>«dig» (digital),</b> и <b>наша компания</b> тоже взяла себе такую <b>отличительную фирменную приставку!</b>\n\n<b>Идея её основания</b> возникла после того, как, хорошо задумавшись, захотелось <b>монетизировать своё творчество</b> и помогать людям не только <b>из своего окружения,</b> но и <b>по всему интернету.</b>\n\n<b>Вот и вся история! Напоминаем,</b> мы ничего <b>не держим в секрете</b> от своих <b>клиентов! Вся информация</b> и <b>все процессы</b> находятся <b>на поверхности!</b> Если вы <b>нам доверяете</b> и прочитали <b>весь этот текст, спасибо вам огромное! Мы очень ценим вас! ❤️</b>",
];

bot.setMyCommands([
	{
		command: "/restart",
		description: "Главное меню 🔄️",
	},
	{
		command: "/services",
		description: "Каталог с ИИ ✨",
	},
	{
		command: "/consultation",
		description: "Связь 🧑‍💻",
	},
	{
		command: "/profile",
		description: "Профиль ⚙️",
	},
]);

let textToSayHello, match, rndId, clientChatId;

async function firstMeeting(chatId, stageNum = 1) {
	const dataAboutUser = usersData.find((obj) => obj.chatId == chatId);

	dataAboutUser.action = `firstMeeting${stageNum}`;

	try {
		switch (stageNum) {
			case 1:
				await bot.editMessageText(
					`<b>Привет! 👋</b>\n${moreAboutUsText[1]}\n\n<b>Почему нас выбирают? 👇</b>`,
					{
						parse_mode: "html",
						chat_id: chatId,
						message_id: usersData.find((obj) => obj.chatId == chatId).messageId,
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
				await bot.editMessageText(
					`<b>Почему нас выбирают?</b>${moreAboutUsText[0]}\n\n<b>Далее переход в меню 👇</b>`,
					{
						parse_mode: "html",
						chat_id: chatId,
						message_id: usersData.find((obj) => obj.chatId == chatId).messageId,
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

				// dataAboutUser.action = "firstMeeting3";

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
				// dataAboutUser.action = "firstMeeting4";
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
				// await bot.editMessageText(
				// 	`<b><i>Что такое чат-бот❓</i></b>\n\nЭто инструмент, <b>обрабатывающий запросы</b> пользователей в формате <b>диалога в мессенджере,</b> точно так же, как и <b>этот помощник,</b> текст которого <b>вы</b> читаете. 😊\n\n<blockquote>Такой <b>продукт может</b> стать как прекрасным инструментом для <b>автоматизации вашей деятельности,</b> так и <b>обычной рассылкой новостей и акций</b>.</blockquote>\n<b>В пример</b> мы приведем наши <b>успешные работы</b> ⬇️`,
				// 	{
				// 		parse_mode: "html",
				// 		chat_id: chatId,
				// 		message_id: usersData.find((obj) => obj.chatId == chatId).messageId,
				// 		disable_web_page_preview: true,
				// 		reply_markup: {
				// 			inline_keyboard: [
				// 				[
				// 					{
				// 						text: ourProjects[1].name,
				// 						url: `https://t.me/${ourProjects[1].botName}`,
				// 					},
				// 				],
				// 				[
				// 					{
				// 						text: ourProjects[2].name,
				// 						url: `https://t.me/${ourProjects[2].botName}`,
				// 					},
				// 					{
				// 						text: ourProjects[5].name,
				// 						url: `https://t.me/${ourProjects[5].botName}`,
				// 					},
				// 				],
				// 				[
				// 					{
				// 						text: "⬅️Назад",
				// 						callback_data:
				// 							dataAboutUser.action == "firstMeeting1"
				// 								? "firstMeeting1"
				// 								: dataAboutUser.action == "firstMeeting2"
				// 									? "firstMeeting2"
				// 									: "",
				// 					},
				// 				],
				// 			],
				// 		},
				// 	}
				// );
				break;
		}
	} catch (error) {
		console.log(error);
		sendDataAboutError(chatId, dataAboutUser.login, `${String(error)}`);
	}
}

async function menuHome(chatId, navigationListIsActive = false, afterFirstMeeting = false) {
	const dataAboutUser = usersData.find((obj) => obj.chatId == chatId);

	const dateNowHHNN = new Date().getHours() * 100 + new Date().getMinutes();

	if (dateNowHHNN < 1200 && dateNowHHNN >= 600) textToSayHello = "Доброе утро";
	else if (dateNowHHNN < 1700 && dateNowHHNN >= 1200) textToSayHello = "Добрый день";
	else if (dateNowHHNN < 2200 && dateNowHHNN >= 1700) textToSayHello = "Добрый вечер";
	else if (dateNowHHNN >= 2200 || dateNowHHNN < 600) textToSayHello = "Доброй ночи";

	try {
		dataAboutUser.supportiveCount = 1;

		dataAboutUser.currentFeedbackId = null;

		dataAboutUser.action = "menuHome";

		// 1 вариант let navigationListText = `<b>"Каталог с ИИ ✨"</b> - расчет стоимости и выбор продукта, а также удобный выбор услуги под ваши задачи с ИИ.\n\n<b>"Идеи💡"</b> - список идей для вашей деятельности.\n\n<b>"Связь 🧑‍💻"</b> - в живой переписке подскажем и проконсультируем вас по любому вопросу!\n\n<b>"Наши реальные работы 📱"</b> - список и описание всех наших проектов.\n\n<b>"О нас 👥"</b> - вся информация о нашей корпорации и наших преимуществах.\n\n<b>"Отзывы 📧"</b> - возможность оставить отзыв, и список реальных мнений заказчиков.\n\n<b>"Профиль ⚙️"</b> - личные данные, и прочая информация.`;

		// 2 вариант let navigationListText = `<b>"Каталог с ИИ ✨"</b> - расчет стоимости и выбор продукта, а также выбор услуги под ваши задачи с ИИ.\n\n<b>"Связь 🧑‍💻"</b> - в живой переписке подскажем и ответим на любой вопрос!\n\n<b>"Идеи💡"</b> - список идей под каждую из услуг.\n\n<b>"Профиль ⚙️"</b> - личные данные, программа лояльсности и важная информация.`;

		// ${
		// 	navigationListIsActive
		// 		? `<b><a href="https://t.me/${BotName}/?start=hideNavigationListInMenuHome">Навигация по меню ⇩</a></b><blockquote>${navigationListText}<b>\n\n<a href="https://t.me/${BotName}/?start=hideNavigationListInMenuHome">Скрыть навигацию</a></b></blockquote>`
		// 		: `<b><a href="https://t.me/${BotName}/?start=showNavigationListInMenuHome">Навигация по меню ⇨</a></b>`
		// }\n\n

		await bot.editMessageText(
			`${
				afterFirstMeeting
					? `<b>${dataAboutUser.login}, спасибо за регистрацию! 🙏</b>`
					: `<b>${textToSayHello}, ${dataAboutUser.login}!</b>`
			}\n\n<blockquote><b>Наша гордость - <a href="https://digfusion.github.io/digfusion.ru/">digfusion.ru</a></b></blockquote>\n\n<b>Что вас интересует? 🤔</b>`,
			{
				parse_mode: "html",
				chat_id: chatId,
				message_id: usersData.find((obj) => obj.chatId == chatId).messageId,
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
							{
								text: "Отзывы 📧",
								callback_data: "feedbacksList",
							},
							{
								text: "Консультация 🧑‍💻",
								callback_data: "consultation",
							},
						],
						[
							{
								text: "Примеры наших работ 🔥",
								callback_data: "ourProjectsList1",
							},
						],
						[
							{
								text: "Идеи💡",
								callback_data: "ideasForProjects",
							},
							{
								text: "О нас 👥",
								callback_data: "moreAboutUs1",
							},
						],
						[
							{
								text: "Профиль ⚙️",
								callback_data: "profile",
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

async function catalogOfServices(chatId, catalogNum = 0) {
	const dataAboutUser = usersData.find((obj) => obj.chatId == chatId);

	dataAboutUser.action = `catalog${catalogNum}`;
	try {
		let serviceNum =
			dataAboutUser.action === "catalog1"
				? dataAboutUser.selectedService?.bot?.serviceNum
				: dataAboutUser.selectedService?.server?.serviceNum;
		let variationNum = dataAboutUser.selectedService?.server?.variationNum;

		let text = "";
		switch (catalogNum) {
			case 0:
				await bot.editMessageText(
					`<b><i>🛍️ Каталог услуг с ИИ 🛒</i></b>\n\n<blockquote><b><i>💥Удобнейший подбор услуги с ИИ уже здесь!</i></b></blockquote>\n\n<b>Какой тип услуг вам интересен? 🤔</b>`,
					{
						parse_mode: "html",
						chat_id: chatId,
						message_id: usersData.find((obj) => obj.chatId == chatId).messageId,
						disable_web_page_preview: true,
						reply_markup: {
							inline_keyboard: [
								[
									{
										text: `🔥Подбор услуги с ИИ ✨`,
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
				break;
			case 1:
				text = "";
				for (let i = 1; i <= services.length; i++) {
					if (services[i - 1].type == "bot") {
						text += `${
							serviceNum == i
								? `\n\n<b>• ${i}. ${
										services[serviceNum - 1].name
									} •\n</b><blockquote><b>Подробнее:</b> ${services[serviceNum - 1].moreAbout}${
										services[serviceNum - 1].lifeTime
											? `\n\n<b>Действует:</b> ${
													services[serviceNum - 1].lifeTime
												}`
											: ``
									}${
										services[serviceNum - 1].executionDate
											? `\n\n<b>Срок выполнения:</b> ${
													services[serviceNum - 1].executionDate
												} ⌛`
											: ``
									}\n\n<b>Цена:</b> ${services[serviceNum - 1].priceSentence} 💰${
										serviceNum != 4
											? `\n\n<b><a href="https://t.me/${BotName}/?start=ideasForProjects">Идеи для продукта</a></b>`
											: ``
									}</blockquote>`
								: `\n\n<b><a href="https://t.me/${BotName}/?start=catalogOfServices${i}">${i}.</a> </b>${services[i - 1].name}${
										services[i - 1].firstPrice
											? `<i> (-${Math.floor(
													((services[i - 1].firstPrice -
														services[i - 1].price) /
														services[i - 1].firstPrice) *
														100
												)}%)</i>`
											: ``
									}`
						}`;
					}
				}

				await bot.editMessageText(
					`<b><i>🛒 Каталог • Боты 🤖</i></b>${text}\n\n<b><a href="https://telegra.ph/digfusion--Politika-08-08#%D0%A7%D1%82%D0%BE-%D0%B2%D1%8B-%D0%BC%D0%BE%D0%B6%D0%B5%D1%82%D0%B5-%D0%BE%D0%B6%D0%B8%D0%B4%D0%B0%D1%82%D1%8C-%D0%BE%D1%82-%D0%BD%D0%B0%D1%81">Политика компании digfusion</a></b>`,
					{
						parse_mode: "html",
						chat_id: chatId,
						message_id: usersData.find((obj) => obj.chatId == chatId).messageId,
						disable_web_page_preview: true,
						reply_markup: {
							inline_keyboard: [
								[
									{
										text: `⬆️`,
										callback_data: "previousServiceNum",
									},
									{
										text: `№${serviceNum} • ${services[serviceNum - 1].price}₽`,
										callback_data: `warningOrderService`,
									},
									{
										text: `⬇️`,
										callback_data: "nextServiceNum",
									},
								],
								[
									{
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
									} (${services[serviceNum - 1].variations[variationNum - 1].name}) •\n</b><blockquote><b>Подробнее:</b> ${
										element.variations[variationNum - 1].moreAbout
									}\n\n<b>Расположение:</b> ${
										element.variations[variationNum - 1].location
									}\n<b>Действует:</b> ${
										element.variations[variationNum - 1].lifeTime
									} (${services[serviceNum - 1].variations[variationNum - 1].name})\n\n<b>Цена:</b> ${
										element.variations[variationNum - 1].priceSentence
									} 💰</blockquote>`
								: `\n\n<b><a href="https://t.me/${BotName}/?start=catalogOfServices${i}">${i}.</a> </b>${services[i - 1].name}`
						}`;
					}
				}

				await bot.editMessageText(
					`<b><i>🛒 Каталог • Серверы 💾</i></b>${text}\n\n<b><a href="https://telegra.ph/digfusion--Politika-08-08#%D0%A7%D1%82%D0%BE-%D0%B2%D1%8B-%D0%BC%D0%BE%D0%B6%D0%B5%D1%82%D0%B5-%D0%BE%D0%B6%D0%B8%D0%B4%D0%B0%D1%82%D1%8C-%D0%BE%D1%82-%D0%BD%D0%B0%D1%81">Политика компании digfusion</a></b>`,
					{
						parse_mode: "html",
						chat_id: chatId,
						message_id: usersData.find((obj) => obj.chatId == chatId).messageId,
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
												text: services[serviceNum - 1].variations[0].name,
												callback_data: "variationNum1",
											},

									variationNum === 2
										? {
												text: `• ${services[serviceNum - 1].variations[1].name} •`,
												callback_data: "-",
											}
										: {
												text: services[serviceNum - 1].variations[1].name,
												callback_data: "variationNum2",
											},

									variationNum === 3
										? {
												text: `• ${services[serviceNum - 1].variations[2].name} •`,
												callback_data: "-",
											}
										: {
												text: services[serviceNum - 1].variations[2].name,
												callback_data: "variationNum3",
											},

									variationNum === 4
										? {
												text: `• ${services[serviceNum - 1].variations[3].name} •`,
												callback_data: "-",
											}
										: {
												text: services[serviceNum - 1].variations[3].name,
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
											services[serviceNum - 1].variations[variationNum - 1]
												.price
										}₽`,
										callback_data: `warningOrderService`,
									},
									{
										text: `⬇️`,
										callback_data: "nextServiceNum",
									},
								],
								[
									{
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

async function getResponse(chatId, request = null) {
	const dataAboutUser = usersData.find((obj) => obj.chatId == chatId);

	try {
		const url = "https://openrouter.ai/api/v1/chat/completions";
		const headers = {
			Authorization: `Bearer ${config.metaKey}`, // API ключ с сайта
			"Content-Type": "application/json",
		};

		const payload = {
			model: "meta-llama/llama-4-maverick",
			messages: [
				{
					role: "system", // системный промпт
					content: "❗НИЧЕГО КРОМЕ ОТВЕТА JSON РАЗМЕТКОЙ!!!",
				},
				{
					role: "user", // запрос пользователя
					content: `Описание задачи пользователя: "${request}"
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
				},
			],
		};

		const response = await fetch(url, {
			method: "POST",
			headers,
			body: JSON.stringify(payload),
		});

		const data = await response.json();

		return data.choices[0].message.content;
	} catch (error) {
		console.log(error);
		sendDataAboutError(chatId, dataAboutUser.login, `${String(error)}\n\n❗GPT_ERROR`);

		return {
			serviceNum: null,
			explanation: "GPT_ERROR",
		};
	}
}

async function aiSelector(chatId, request = null) {
	const dataAboutUser = usersData.find((obj) => obj.chatId == chatId);

	try {
		dataAboutUser.action = `aiSelector`;

		if (request) dataAboutUser.aiSelectorData.request = request;

		await bot.editMessageText(
			`<b>🛒 Подбор услуги с ИИ ✨</b>\n\n${dataAboutUser.aiSelectorData?.request ? (dataAboutUser.aiSelectorData?.response?.explanation == "GPT_ERROR" ? `<b><i>❌ Приносим извинения, Нейро сейчас в отпуске, но он вернется!</i>\n\n<a href="https://t.me/qu1z3x">👉 ПОМОЖЕМ В ПЕРЕПИСКЕ</a></b>` : `<b>✍️ Ваш запрос:</b>\n<blockquote><i>${dataAboutUser.aiSelectorData.request}</i></blockquote>\n\n<b>✨Ответ от ИИ:</b>\n<blockquote><i>${dataAboutUser.aiSelectorData?.response ? `${dataAboutUser.aiSelectorData?.response?.serviceNum ? `К вашим задачам услуга: <b>"${services[dataAboutUser.aiSelectorData.response.serviceNum - 1].name}"!</b>` : `<b>Не могу определить услугу! 😓</b>`}\n\n${dataAboutUser.aiSelectorData.response.explanation}` : `Анализирую, секунду.. ⌛`}</i></blockquote>\n\n<b>Для редактирования просто нажмите на свой текст, для копирования 👆</b>`) : `<i><b>Это <a href="https://t.me/digneurobot">Нейро-консультант,</a></b> наш искуственный интелект с уклоном на подбор услуг по критериям.</i>\n\n<b>Опишите, какие задачи нужно покрыть? ✍️</b>`}`,
			{
				parse_mode: "html",
				chat_id: chatId,
				message_id: usersData.find((obj) => obj.chatId == chatId).messageId,
				disable_web_page_preview: true,
				reply_markup: {
					inline_keyboard: [
						[
							dataAboutUser.aiSelectorData?.response?.serviceNum
								? {
										text: `Выбрать "${services[dataAboutUser.aiSelectorData.response.serviceNum - 1].name}" ✅`,
										callback_data: `warningOrderService`,
									}
								: dataAboutUser.aiSelectorData?.response?.explanation == "GPT_ERROR"
									? {
											text: "Написать нам (всегда рады) 💭",
											url: "https://t.me/qu1z3x",
										}
									: {
											text: ``,
											callback_data: `-`,
										},
						],
						[
							{
								text: `⬅️Назад`,
								callback_data: `catalog0`,
							},
							dataAboutUser.aiSelectorData?.response?.serviceNum ||
							dataAboutUser.aiSelectorData?.response?.explanation
								? {
										text: `Перезапуск 🔄️`,
										callback_data: `resetAiSelector`,
									}
								: {
										text: ``,
										callback_data: `-`,
									},

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
			bot.sendChatAction(chatId, "typing");

			dataAboutUser.aiSelectorData.response = JSON.parse(
				(await getResponse(chatId, request))
					.replace("```", "")
					.replace("```", "")
					.replace("json", "")
					.replace("JSON", "")
					.replace(/\【.*?】/g, "")
			);

			dataAboutUser.selectedService.bot.serviceNum = dataAboutUser.aiSelectorData?.response
				?.serviceNum
				? dataAboutUser.aiSelectorData.response.serviceNum
				: null;

			dataAboutUser.selectedService.server.variationNum = 1;

			bot.sendChatAction(chatId, "cancel");

			if (dataAboutUser.action == "aiSelector") {
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

	dataAboutUser.action = "ideasForProjects";
	try {
		await bot.editMessageText(
			`<b><i>💭 Идеи для продукта💡</i></b>\n\nМы представили <b><i>небольшой</i> список идей для наших услуг:\n\n1. ${services[0].name}</b> - <a href="https://t.me/${BotName}/?start=catalogOfServices1">к услуге</a><b><blockquote>Примеры реализации:\n• Чек-листы для клиентов\n• Записи на мероприятия\n• Ответы на FAQ</blockquote>\n2. ${services[1].name}</b> - <a href="https://t.me/${BotName}/?start=catalogOfServices2">к услуге</a><b><blockquote>Примеры реализации:\n• Обьявления акций/новостей\n• Помощник ChatGPT\n• Алерты для каналов</blockquote>\n3. ${services[2].name}</b> - <a href="https://t.me/${BotName}/?start=catalogOfServices3">к услуге</a><b><blockquote>Примеры реализации:\n• Виртуальный интернет магазин\n• Онлайн школа/курс\n• Сложное приложение с ИИ</blockquote>\n\nПоявились мысли? - Скорее пишите!! ☺️</b> `,
			{
				parse_mode: "html",
				chat_id: chatId,
				message_id: usersData.find((obj) => obj.chatId == chatId).messageId,
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
							{
								text: "⬅️В меню",
								callback_data: "exit",
							},
							{
								text: "Связь 🧑‍💻",
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
			dataAboutUser.action != "catalog2"
				? dataAboutUser.selectedService.bot.serviceNum
				: dataAboutUser.selectedService.server.serviceNum;
		let variationNum = dataAboutUser.selectedService.server.variationNum;

		const element = services[serviceNum - 1];

		// \n\n<b><a href="https://telegra.ph/digfusion--Politika-08-08#%D0%A7%D1%82%D0%BE-%D0%B2%D1%8B-%D0%BC%D0%BE%D0%B6%D0%B5%D1%82%D0%B5-%D0%BE%D0%B6%D0%B8%D0%B4%D0%B0%D1%82%D1%8C-%D0%BE%D1%82-%D0%BD%D0%B0%D1%81">Политика компании digfusion</a></b>\n<i>Продолжая, вы соглашаетесь со всеми требованиями и положениями digfusion!</i>

		switch (stageNum) {
			case 1:
				await bot.editMessageText(
					`<b>${dataAboutUser.login},</b> вы выбрали ${
						dataAboutUser.action != "catalog2"
							? `<b>услугу №${serviceNum}:\n\n<a href="https://t.me/${BotName}/?start=catalogOfServices${serviceNum}">${serviceNum}. ${
									element.name
								}</a>\n</b><blockquote><b>Подробнее:</b> ${element.moreAbout}\n\n<b>Цена:</b> ${
									element.priceSentence
								} 💰</blockquote>\n\n<b>Напишите нам в личные сообщения после выбора тарифа. Мы ответим! 😊</b>`
							: `<b>тариф сервера:\n\n${serviceNum}. ${
									element.name
								} (на ${element.variations[variationNum - 1].name})\n</b><blockquote><b>Расположение:</b> ${
									element.variations[variationNum - 1].location
								}\n<b>Действует:</b> ${
									element.variations[variationNum - 1].lifeTime
								} (${element.variations[variationNum - 1].name})\n\n<b>Цена:</b> ${
									element.variations[variationNum - 1].priceSentence
								} 💰</blockquote>\n\n<b>Напишите нам в личные сообщения после выбора услуги. Мы ответим! 😊</b>`
					}`,
					{
						parse_mode: "html",
						chat_id: chatId,
						message_id: usersData.find((obj) => obj.chatId == chatId).messageId,
						disable_web_page_preview: true,
						reply_markup: {
							inline_keyboard: [
								[
									{
										text: "⬅️Назад",
										callback_data: dataAboutUser.action,
									},
									{
										text: "Написать ✅",
										callback_data: `consultation`,
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
		}
	} catch (error) {
		console.log(error);
		sendDataAboutError(chatId, dataAboutUser.login, `${String(error)}`);
	}
}

async function consultation(chatId) {
	const dataAboutUser = usersData.find((obj) => obj.chatId == chatId);

	dataAboutUser.action = "consultation";

	try {
		await bot.editMessageText(
			`<b><i>💭 Консультация 🧑‍💻</i>\n\n</b><blockquote><i>📌 Начинаем работу после предоплаты в 50%</i></blockquote>\n\nСобеседник: <b>Давид или Федор</b>\nС <b>10:00</b> по <b>21:00, каждый день</b>`,
			{
				parse_mode: "html",
				chat_id: chatId,
				message_id: usersData.find((obj) => obj.chatId == chatId).messageId,
				disable_web_page_preview: true,
				reply_markup: {
					inline_keyboard: [
						[
							{
								text: `Мы все.. но можете написать) 💭`,
								url: "https://t.me/qu1z3x",
							},
						],
						[
							{
								text: "⬅️В меню",
								callback_data: "exit",
							},
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
		dataAboutUser.action = "ourProjectsList";

		await bot.editMessageText(
			`<b><i>🛠️ Наше портфолио 📱</i></b>\n\nПроект: <b>${
				ourProjects[projectNum - 1].name
			}\n\nПодробнее:</b><blockquote><b>Для чего:</b> ${
				ourProjects[projectNum - 1].moreAboutText
			}\n\n<b>Услуга:</b> ${ourProjects[projectNum - 1].serviceSentence}</blockquote>\n\n${
				ourProjects[projectNum - 1].botName != "-"
					? ourProjects[projectNum - 1].botName == "digfusionbot"
						? `<b>Вы уже в этом боте! 🤗</b>`
						: `<b><a href = "https://t.me/${
								ourProjects[projectNum - 1].botName
							}">👉 К БОТУ</a> • <a href="https://t.me/digfeedbacks">ОТЗЫВЫ</a></b>`
					: `<b>Функционал недоступен 🫤</b>`
			}`,
			{
				parse_mode: "html",
				chat_id: chatId,
				message_id: usersData.find((obj) => obj.chatId == chatId).messageId,
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
								callback_data: `${projectNum == 1 ? "-" : "ourProjectsList1"}`,
							},
						],
						[
							{
								text: `${
									projectNum == 2
										? `• ${ourProjects[projectNum - 1].name} •`
										: `${ourProjects[1].name}`
								}`,
								callback_data: `${projectNum == 2 ? "-" : "ourProjectsList2"}`,
							},
							{
								text: `${
									projectNum == 3
										? `• ${ourProjects[projectNum - 1].name} •`
										: `${ourProjects[2].name}`
								}`,
								callback_data: `${projectNum == 3 ? "-" : "ourProjectsList3"}`,
							},
						],
						[
							{
								text: `${
									projectNum == 4
										? `• ${ourProjects[projectNum - 1].name} •`
										: `${ourProjects[3].name}`
								}`,
								callback_data: `${projectNum == 4 ? "-" : "ourProjectsList4"}`,
							},
						],
						[
							{
								text: `${
									projectNum == 5
										? `• ${ourProjects[projectNum - 1].name} •`
										: `${ourProjects[4].name}`
								}`,
								callback_data: `${projectNum == 5 ? "-" : "ourProjectsList5"}`,
							},
							{
								text: `${
									projectNum == 6
										? `• ${ourProjects[projectNum - 1].name} •`
										: `${ourProjects[5].name}`
								}`,
								callback_data: `${projectNum == 6 ? "-" : "ourProjectsList6"}`,
							},
						],
						[
							{
								text: `${
									projectNum == 7
										? `• ${ourProjects[projectNum - 1].name} •`
										: `${ourProjects[6].name}`
								}`,
								callback_data: `${projectNum == 7 ? "-" : "ourProjectsList7"}`,
							},
						],
						[
							{
								text: `${
									projectNum == 8
										? `• ${ourProjects[projectNum - 1].name} •`
										: `${ourProjects[7].name}`
								}`,
								callback_data: `${projectNum == 8 ? "-" : "ourProjectsList8"}`,
							},
							{
								text: `${
									projectNum == 9
										? `• ${ourProjects[projectNum - 1].name} •`
										: `${ourProjects[8].name}`
								}`,
								callback_data: `${projectNum == 9 ? "-" : "ourProjectsList9"}`,
							},
						],
						[
							{
								text: `⬅️В меню`,
								callback_data: "exit",
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

async function moreAboutUs(chatId, stageNum = 1) {
	const dataAboutUser = usersData.find((obj) => obj.chatId == chatId);

	try {
		dataAboutUser.action = "moreAboutUs";

		// <b>История основания</b> нашей компании <b>необычна</b> и <b>оригинальна,</b> она лежит <b>на поверхности, никаких тайн! 😉</b>\n\n
		await bot.editMessageText(
			`<b><i>👥 О нас • ${
				stageNum == 1
					? `Преимущества 🏆`
					: stageNum == 2
						? "Кто мы 🤔"
						: stageNum == 3
							? "Политика 📖"
							: ``
			}</i></b>\n\n${
				stageNum == 1
					? `<b>Коротко о преимуществах:</b>${
							moreAboutUsText[stageNum - 1]
						}\n\n<b><a href="https://digfusion.github.io/digfusion.ru/">Сайт</a> • <a href="https://t.me/digfusion">Канал</a> • <a href="https://t.me/digfeedbacks">Отзывы</a></b>`
					: stageNum == 2
						? `<b>Чуточку о нас 👇</b>\n${
								moreAboutUsText[stageNum - 1]
							}\n\n<b><a href="https://digfusion.github.io/digfusion.ru/">Сайт</a> • <a href="https://t.me/digfusion">Канал</a> • <a href="https://t.me/digfeedbacks">Отзывы</a></b>`
						: stageNum == 3
							? `Коротко и по делу — <b>чего ждать от нас и от вашей стороны:</b>${
									moreAboutUsText[stageNum - 1]
								}<b><a href ="https://telegra.ph/digfusion--Politika-08-08#%D0%A7%D1%82%D0%BE-%D0%B2%D1%8B-%D0%BC%D0%BE%D0%B6%D0%B5%D1%82%D0%B5-%D0%BE%D0%B6%D0%B8%D0%B4%D0%B0%D1%82%D1%8C-%D0%BE%D1%82-%D0%BD%D0%B0%D1%81">Полный документ digfusion</a></b>`
							: ``
			}`,
			{
				parse_mode: "html",
				chat_id: chatId,
				message_id: usersData.find((obj) => obj.chatId == chatId).messageId,
				disable_web_page_preview: true,
				reply_markup: {
					inline_keyboard: [
						[
							{
								text: `${
									stageNum == 1 ? `• Преимущества 🏆 •` : "Преимущества 🏆"
								}`,
								callback_data: `${stageNum == 1 ? `-` : "moreAboutUs1"}`,
							},
						],
						[
							{
								text: `${stageNum == 2 ? `• Кто мы 🤔 •` : "Кто мы 🤔"}`,
								callback_data: `${stageNum == 2 ? `-` : "moreAboutUs2"}`,
							},
							{
								text: `${stageNum == 3 ? `• Политика 📖 •` : "Политика 📖"}`,
								callback_data: `${stageNum == 3 ? `-` : "moreAboutUs3"}`,
							},
						],
						[
							{
								text: "⬅️В меню",
								callback_data: "exit",
							},
							{
								text: "Написать 💭",
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

function truncateString(text, maxLength) {
	if (text && text.length > maxLength) {
		return text.substring(0, maxLength - 3) + "...";
	}
	return text;
}

function declension(count, one, two, ten) {
	const lastDigit = count % 10;
	const lastTwoDigits = count % 100;

	if (lastTwoDigits >= 11 && lastTwoDigits <= 20) {
		return `${count} ${ten}`;
	}

	if (lastDigit === 1) {
		return `${count} ${one}`;
	}

	if (lastDigit >= 2 && lastDigit <= 4) {
		return `${count} ${two}`;
	}

	return `${count} ${ten}`;
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
					user.feedbacksData.forEach((element) => {
						allFeedbacksData.push(element);
					});
			});

			const dataAboutFeedback = allFeedbacksData.find((obj) => obj.feedbackId == feedbackId);

			await bot.editMessageText(
				`<b><i>📧 Отзыв • <code>${feedbackId}</code> 👤\n\n</i>Содержимое:</b><blockquote><b>${
					dataAboutFeedback.from
				}  •  ${dataAboutFeedback.opinionRating}</b>\n\n<b>${
					dataAboutFeedback.serviceNum
						? `№${dataAboutFeedback.serviceNum} "${
								services[dataAboutFeedback.serviceNum - 1].name
							}" - <a href="https://t.me/${BotName}/?start=catalogOfServices${
								dataAboutFeedback.serviceNum
							}">к услуге</a>`
						: `Услуга неизвестна`
				}</b>\n\n<b>Текст отзыва:</b>\n<i>"${
					dataAboutFeedback.feedbackText
				}</i>"</blockquote>\n<b>${dataAboutFeedback.creationTime}</b> - ${
					dataAboutFeedback.creationDate
				}\n\n<b><i>Отзыв <a href="https://t.me/digfeedbacks">подлинен.</a></i></b>`,
				{
					parse_mode: "html",
					chat_id: chatId,
					message_id: usersData.find((obj) => obj.chatId == chatId).messageId,
					disable_web_page_preview: true,
					reply_markup: {
						inline_keyboard: [
							[
								{
									text: dataAboutFeedback.productLink
										? `👉 СМОТРЕТЬ РЕЗУЛЬТАТ 👈`
										: ``,
									url: dataAboutFeedback.productLink
										? `${dataAboutFeedback.productLink}`
										: "https://t.me/digfusionbot",
								},
							],
							[
								{
									text:
										(chatId == digsupportId || chatId == qu1z3xId) &&
										!dataAboutFeedback.isVerified
											? `Удалить ❌`
											: ``,
									callback_data: `deleteFeedbackWithId${feedbackId}`,
								},
								{
									text:
										chatId == digsupportId || chatId == qu1z3xId
											? !dataAboutFeedback.isVerified
												? `Показать 👁️`
												: ""
											: ``,
									callback_data: `verifiedFeedbackWithId${feedbackId}`,
								},
							],
							[
								{
									text: "⬅️Назад",
									callback_data:
										dataAboutUser.action == "feedbacksList1"
											? "feedbacksList"
											: dataAboutUser.action == "feedbacksList3"
												? "unverifiedFeedbacksAdmin"
												: "feedbacksList",
								},
								{
									text:
										(chatId == digsupportId || chatId == qu1z3xId) &&
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
						dataAboutUser.feedbacksData = dataAboutUser.feedbacksData.filter(
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
							const element = allFeedbacksData[i];

							if (element.isVerified) {
								count++;
								text[countOfLists - 1] += `<b>${count}. ${element.from}  •  ${
									element.opinionRating
								}\n</b>Услуга<b> ${
									element.serviceNum ? `№${element.serviceNum}` : `неизвестна 🤷‍♂️`
								} ${
									element.isVerified ? `` : `</b>- на проверке 🔎<b>`
								}\nТекст:</b><i> "${truncateString(element.feedbackText, 65)}"</i>\n<b><a href="https://t.me/${BotName}/?start=feedbackWithId${element.feedbackId}">Подробнее об отзыве</a></b>\n\n`;

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

					dataAboutUser.action = `feedbacksList1`;

					await bot.editMessageText(
						`<b><i>👥 Отзывы клиентов 📧\n\n${
							countOfLists > 1
								? `${dataAboutUser.supportiveCount} / ${countOfLists} стр • `
								: ``
						}${declension(count, "отзыв", "отзыва", "отзывов")}</i></b>\n\n${
							text[dataAboutUser.supportiveCount - 1]
								? `${text[dataAboutUser.supportiveCount - 1]}<b>Также на <a href="https://digfusion.github.io/digfusion.ru/">digfusion.ru</a> и в <a href="https://t.me/digfeedbacks">отзывы</a></b>`
								: ``
						}`,
						{
							parse_mode: "html",
							chat_id: chatId,
							message_id: usersData.find((obj) => obj.chatId == chatId).messageId,
							disable_web_page_preview: true,
							reply_markup: {
								inline_keyboard: [
									countOfLists > 1
										? [
												{
													text:
														dataAboutUser.supportiveCount > 1
															? "⬅️"
															: "🚫",
													callback_data:
														dataAboutUser.supportiveCount > 1
															? "previousPage"
															: "-",
												},
												{
													text: `${dataAboutUser.supportiveCount} / ${countOfLists} стр`,
													callback_data: "firstPage",
												},
												{
													text:
														dataAboutUser.supportiveCount < countOfLists
															? "➡️"
															: "🚫",
													callback_data:
														dataAboutUser.supportiveCount < countOfLists
															? "nextPage"
															: "-",
												},
											]
										: [],
									[
										{
											text:
												dataAboutUser.feedbacksData?.length > 0
													? `Ваши отзывы (${
															dataAboutUser.feedbacksData.filter(
																(obj) => obj.isCreated
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
					let dataAboutUserFeedbacks = dataAboutUser?.feedbacksData || null;

					count = 0;
					countOfLists = 1;
					text = [""]; // Начальная страница

					if (dataAboutUserFeedbacks) {
						for (let i = 0; i < dataAboutUserFeedbacks.length; i++) {
							if (count % 3 == 0 && count != 0) {
								countOfLists++; // Создаем новую страницу, когда достигаем лимита в 3 отзыва
								text[countOfLists - 1] = "";
							}

							count++;
							text[countOfLists - 1] += `<b>${count}. ${
								dataAboutUserFeedbacks[i].from
							}  •  Услуга ${
								dataAboutUserFeedbacks[i].serviceNum
									? `№${dataAboutUserFeedbacks[i].serviceNum}`
									: `неизвестна 🤷‍♂️`
							}  •  ${dataAboutUserFeedbacks[i].opinionRating}${
								dataAboutUserFeedbacks[i].isVerified ? `` : `🔎`
							}\nТекст: </b><i>"${truncateString(
								dataAboutUserFeedbacks[i].feedbackText,
								65
							)}"</i>\n<b><a href="https://t.me/${BotName}/?start=feedbackWithId${
								dataAboutUserFeedbacks[i].feedbackId
							}">Подробнее об отзыве</a></b>\n\n`;
						}
					}

					dataAboutUser.action = "feedbacksList2";

					await bot.editMessageText(
						`<b><i>👤 Ваши отзывы 📧\n\n${
							countOfLists > 1
								? `${dataAboutUser.supportiveCount} / ${countOfLists} стр • `
								: ``
						}${declension(count, "отзыв", "отзыва", "отзывов")}</i></b>\n\n${
							text[dataAboutUser.supportiveCount - 1]
								? `${text[dataAboutUser.supportiveCount - 1]}${
										dataAboutUser.feedbacksData.find((obj) => !obj.isVerified)
											? `<i>🔎 - находится на проверке</i>`
											: ``
									}`
								: `Пока ни одного отзыва..🤷‍♂️`
						}`,
						{
							parse_mode: "html",
							chat_id: chatId,
							message_id: usersData.find((obj) => obj.chatId == chatId).messageId,
							disable_web_page_preview: true,
							reply_markup: {
								inline_keyboard: [
									countOfLists > 1
										? [
												{
													text:
														dataAboutUser.supportiveCount > 1
															? "⬅️"
															: "🚫",
													callback_data:
														dataAboutUser.supportiveCount > 1
															? "previousPage"
															: "-",
												},
												{
													text: `${dataAboutUser.supportiveCount} стр`,
													callback_data: "firstPage",
												},
												{
													text:
														dataAboutUser.supportiveCount < countOfLists
															? "➡️"
															: "🚫",
													callback_data:
														dataAboutUser.supportiveCount < countOfLists
															? "nextPage"
															: "-",
												},
											]
										: [],
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
							user.feedbacksData.forEach((element) => {
								allFeedbacksData.push(element);
							});
					});

					count = 0;

					if (allFeedbacksData)
						for (let i = 0; i < allFeedbacksData.length; i++) {
							if (!allFeedbacksData[i].isVerified && allFeedbacksData[i].isCreated) {
								count++;
								text += `<b>${count}. ${
									allFeedbacksData[i].from
								}  •  Услуга ${allFeedbacksData[i].serviceNum ? `№${allFeedbacksData[i].serviceNum}` : `неизвестна 🤷‍♂️`}  •  ${
									element.opinionRating
								}${
									allFeedbacksData[i].isVerified ? `` : `🔎`
								}\nТекст: </b><i>"${truncateString(
									allFeedbacksData[i].feedbackText,
									65
								)}"</i>\n<b><a href="https://t.me/${BotName}/?start=feedbackWithId${
									allFeedbacksData[i].feedbackId
								}">Подробнее об отзыве</a></b>\n\n`;
							}
						}

					dataAboutUser.action = "feedbacksList3";

					await bot.editMessageText(
						`<b><i>📧 Отзывы на проверке 🔎</i></b>\n\n<b>${declension(count, "отзыв", "отзыва", "отзывов")}</b>\n\n${text != "" ? `${text}` : `Все отзывы уже проверены! 😉`}`,
						{
							parse_mode: "html",
							chat_id: chatId,
							message_id: usersData.find((obj) => obj.chatId == chatId).messageId,
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

async function writeFeedbacks(chatId, stageNum = 1) {
	const dataAboutUser = usersData.find((obj) => obj.chatId == chatId);

	try {
		let dataAboutFeedback = usersData
			.find(
				(obj) =>
					obj.feedbacksData &&
					obj.feedbacksData.find(
						(element) =>
							dataAboutUser.currentFeedbackId &&
							element.feedbackId == dataAboutUser.currentFeedbackId
					)
			)
			?.feedbacksData.at(-1);

		switch (stageNum) {
			case 1:
				await bot.editMessageText(
					`<b><i>📧 Создание отзыва ✍️</i></b>\n\nНапишите ваше мнение о полученном заказе, нам в личку! 😊\n\n<b>Примечание:</b>\n<i>Пожалуйста, оставьте отзыв с разумным размером, будьте вежливы и излагайте информацию исключительно по теме, которая в дальнейшем поможет сотням клиентов! 🙏</i>\n\n<b><a href="https://t.me/qu1z3x">ПЕРЕЙТИ В ЛИЧКУ / ОСТАВИТЬ ОТЗЫВ</a></b>`,
					{
						parse_mode: "html",
						chat_id: chatId,
						message_id: usersData.find((obj) => obj.chatId == chatId).messageId,
						disable_web_page_preview: true,
						reply_markup: {
							inline_keyboard: [
								[
									{
										text: "⬅️Назад",
										callback_data: "feedbacksList",
									},
									{
										text: dataAboutUser.canWriteFeedbacks ? "Оставить ✍️" : ``,
										url: "https://t.me/qu1z3x",
									},
								],
							],
						},
					}
				);
				break;
			case 2:
				dataAboutUser.action = "writeFeedbacks2";

				if (!dataAboutFeedback) {
					let isUnique = false;
					while (!isUnique) {
						rndId = Math.floor(Math.random() * 9999);
						isUnique = true;

						if (usersData) {
							for (let i = 0; i < usersData.length; i++) {
								if (usersData[i].feedbacksData)
									for (let j = 0; j < usersData[i].feedbacksData.length; j++) {
										if (usersData[i].feedbacksData[j].feedbackId === rndId) {
											isUnique = false;
											break;
										}
									}
								if (!isUnique) break;
							}
						} else break;
					}

					if (dataAboutUser.feedbacksData) {
						dataAboutUser.feedbacksData.push({
							from: dataAboutUser.login,
							userStatus: dataAboutUser.userStatus,
							serviceNum: null,

							opinionRating: "🤩",
							feedbackText: "",
							productLink: "",

							creationTime: `${String(new Date().getHours()).padStart(
								2,
								"0"
							)}:${String(new Date().getMinutes()).padStart(2, "0")}`,
							creationDate: `${new Date().getDate().toString().padStart(2, "0")}.${(
								new Date().getMonth() + 1
							)
								.toString()
								.padStart(2, "0")}.${(new Date().getFullYear() % 100)
								.toString()
								.padStart(2, "0")}`,
							date: new Date(),

							feedbackId: rndId,
							isVerified: false,
							isCreated: true,
						});
					}

					dataAboutUser.currentFeedbackId = rndId;

					writeFeedbacks(chatId, 2);
				}

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
						}</i>"\n\n<b>Оценка:</b> ${
							dataAboutFeedback.opinionRating
								? dataAboutFeedback.opinionRating
								: `Выберите ниже`
						}</blockquote><b>\n\n${
							dataAboutFeedback.opinionRating && dataAboutFeedback.serviceNum
								? dataAboutFeedback.productLink
									? `Вы действительно хотите опубликовать ваш отзыв? 🤔`
									: `По желанию, добавьте ссылку на ваш продукт!\n\nПример:\n<code>https://t.me/бот</code> или <code>@бот</code>`
								: `Оцените полученный продукт и выберите услугу!`
						}</b>`,
						{
							parse_mode: "html",
							chat_id: chatId,
							message_id: usersData.find((obj) => obj.chatId == chatId).messageId,
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
												dataAboutFeedback.opinionRating == "🤬"
													? `•🤬•`
													: `🤬`
											}`,
											callback_data: "setOpinionRating1",
										},
										{
											text: `${
												dataAboutFeedback.opinionRating == "😠"
													? `•😠•`
													: `😠`
											}`,
											callback_data: "setOpinionRating2",
										},
										{
											text: `${
												dataAboutFeedback.opinionRating == "😐"
													? `•😐•`
													: `😐`
											}`,
											callback_data: "setOpinionRating3",
										},
										{
											text: `${
												dataAboutFeedback.opinionRating == "😊"
													? `•😊•`
													: `😊`
											}`,
											callback_data: "setOpinionRating4",
										},
										{
											text: `${
												dataAboutFeedback.opinionRating == "🤩"
													? `•🤩•`
													: `🤩`
											}`,
											callback_data: "setOpinionRating5",
										},
									],

									[
										{
											text: `${
												dataAboutFeedback.serviceNum == 1 ? `• №1 •` : `№1`
											}`,
											callback_data: "setServiceNum1",
										},
										{
											text: `${
												dataAboutFeedback.serviceNum == 2 ? `• №2 •` : `№2`
											}`,
											callback_data: "setServiceNum2",
										},
										{
											text: `${
												dataAboutFeedback.serviceNum == 3 ? `• №3 •` : `№3`
											}`,
											callback_data: "setServiceNum3",
										},
										{
											text: `${
												dataAboutFeedback.serviceNum == 4 ? `• №4 •` : `№4`
											}`,
											callback_data: "setServiceNum4",
										},
										{
											text: `${
												dataAboutFeedback.serviceNum == 5 ? `• №5 •` : `№5`
											}`,
											callback_data: "setServiceNum5",
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
				dataAboutUser.action = "writeFeedbacks3";

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
								message_id: usersData.find((obj) => obj.chatId == chatId).messageId,
								disable_web_page_preview: true,
								reply_markup: {
									inline_keyboard: [
										[
											{
												text: `${
													dataAboutUser.feedbacksData?.length > 0
														? `Ваши отзывы (${
																dataAboutUser.feedbacksData.filter(
																	(obj) => obj.isCreated
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

async function profile(chatId, editLogin = false, afterEdit = false) {
	const dataAboutUser = usersData.find((obj) => obj.chatId == chatId);

	// \n\n<b>Лояльность</b> - <a href="https://t.me/${BotName}/?start=moreAboutUserStatus">подробнее</a>\nСтатус:<b> ${
	// 	dataAboutUser.userStatus
	// }</b>\nРазмер скидки:<b> ${
	// 	dataAboutUser.requestsData
	// 		? `${
	// 				dataAboutUser.requestsData.length >= 3
	// 					? "3%"
	// 					: dataAboutUser.requestsData.length >= 6
	// 						? "6%"
	// 						: dataAboutUser.requestsData.length >= 10
	// 							? "10%"
	// 							: dataAboutUser.requestsData.length < 3
	// 								? "Нет ( 0% )"
	// 								: ""
	// 			}`
	// 		: `Нет ( 0% )`
	// }</b>

	try {
		if (!editLogin) {
			dataAboutUser.action = "profile";

			await bot.editMessageText(
				`<b><i>👤 Профиль • <code>${
					dataAboutUser.chatId
				}</code> ⚙️</i>\n\nДанные:\n</b>Логин: <b>${
					dataAboutUser.login
				}</b> - <a href="https://t.me/${BotName}/?start=editLogin">изменить</a>${
					dataAboutUser.phoneNumber
						? `\nТелефон: <b>+${dataAboutUser.phoneNumber}</b>`
						: ``
				}\n\n<b>Прочее:</b>\nКол-во отзывов: <b>${
					dataAboutUser.feedbacksData
						? dataAboutUser.feedbacksData.filter((obj) => obj.isVerified).length
						: "0"
				}${
					dataAboutUser.feedbacksData?.length > 0
						? ` / ${
								dataAboutUser.feedbacksData.filter((obj) => obj.isCreated).length
							} шт</b> - <a href="https://t.me/${BotName}/?start=myFeedbacks">ваши отзывы</a>`
						: ` шт</b>`
				}\nВы с нами с <b>${
					dataAboutUser.registrationDate
				}</b>\n\n<b><a href="https://telegra.ph/digfusion--Politika-08-08#%D0%A7%D1%82%D0%BE-%D0%B2%D1%8B-%D0%BC%D0%BE%D0%B6%D0%B5%D1%82%D0%B5-%D0%BE%D0%B6%D0%B8%D0%B4%D0%B0%D1%82%D1%8C-%D0%BE%D1%82-%D0%BD%D0%B0%D1%81">Политика компании digfusion</a></b>`,
				{
					parse_mode: "html",
					chat_id: chatId,
					message_id: usersData.find((obj) => obj.chatId == chatId).messageId,
					disable_web_page_preview: true,
					reply_markup: {
						inline_keyboard: [
							[
								{
									text: `${
										chatId == digsupportId || chatId == qu1z3xId
											? `Управление 💠`
											: ""
									}`,
									callback_data: "adminMenu",
								},
							],
							[
								{
									text: "⬅️В меню",
									callback_data: "exit",
								},
								{
									text: "Написать 💭",
									callback_data: "consultation",
								},
							],
						],
					},
				}
			);
		}
		if (editLogin) {
			dataAboutUser.action = "editLogin";

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
					message_id: usersData.find((obj) => obj.chatId == chatId).messageId,
					disable_web_page_preview: true,
					reply_markup: {
						inline_keyboard: [
							[
								{
									text: `${
										dataAboutUser.login != dataAboutUser.telegramFirstName
											? "Сбросить 🔄️"
											: ""
									}`,
									callback_data: "resetLogin",
								},
							],
							[
								{
									text: `⬅️Назад`,
									callback_data: "profile",
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

// async function userStatusInfo(chatId) {
// 	const dataAboutUser = usersData.find((obj) => obj.chatId == chatId);

// 	try {
// 		await bot.editMessageText(
// 			`<b><i>👑 Программа лояльности 📊</i></b>\n\nУ <b>каждого</b> клиента имеется <b>статус,</b> который в зависимости <b>от уровня,</b> предоставляет <b>скидку на заказ</b> при его <b>оформлении! 😍\n\nВот весь список:</b><blockquote><b>"Клиент 🙂"</b> - без скидки (<b>начальный</b>) *\n\n<b>"Постоянный клиент 😎"</b> - 3% (от <b>3 заказов</b>) *\n\n<b>"Особый клиент 🔥"</b> - 6% (от <b>6 заказов</b>) *\n\n<b>"Лучший покупатель 🤴"</b> - 10% (от <b>10 заказов</b>) *\n\n<i>* Считаются только выполненные заказы</i></blockquote>\n\nТекущая роль: <b>${
// 				dataAboutUser.userStatus
// 			}</b>\n\n${
// 				services.find((obj) => obj.firstPrice)
// 					? `<i>Скидка НЕ суммируется с текущей акцией!</i>`
// 					: ``
// 			}`,
// 			{
// 				parse_mode: "html",
// 				chat_id: chatId,
// 				message_id: usersData.find((obj) => obj.chatId == chatId).messageId,
// 				disable_web_page_preview: true,
// 				reply_markup: {
// 					inline_keyboard: [
// 						[
// 							{
// 								text: "⬅️Назад",
// 								callback_data: "profile",
// 							},
// 							{
// 								text: "Каталог 🛒",
// 								callback_data: "catalog0",
// 							},
// 						],
// 					],
// 				},
// 			}
// 		);
// 	} catch (error) {
// 		console.log(error);
// 		sendDataAboutError(chatId, dataAboutUser.login, `${String(error)}`);
// 	}
// }

// async function dialogBuilder(chatId, textNum = 1) {
// 	const dataAboutUser = usersData.find((obj) => obj.chatId == chatId);

// 	const dateNowHHNN = new Date().getHours() * 100 + new Date().getMinutes();
// 	let textToSayHelloForEnd = "";

// 	if (dateNowHHNN < 1200 && dateNowHHNN >= 600) {
// 		textToSayHello = "Доброе утро";
// 		textToSayHelloForEnd = "Доброго утра";
// 	} else if (dateNowHHNN < 1700 && dateNowHHNN >= 1200) {
// 		textToSayHello = "Добрый день";
// 		textToSayHelloForEnd = "Доброго дня";
// 	} else if (dateNowHHNN < 2200 && dateNowHHNN >= 1700) {
// 		textToSayHello = "Добрый вечер";
// 		textToSayHelloForEnd = "Доброго вечера";
// 	} else if (dateNowHHNN >= 2200 || dateNowHHNN < 600) {
// 		textToSayHello = "Доброй ночи";
// 		textToSayHelloForEnd = "Доброй ночи";
// 	}

// 	try {
// 		let dataAboutClient;
// 		if (clientChatId) dataAboutClient = usersData.find((obj) => obj.chatId == clientChatId);

// 		if (textNum == 0) clientChatId = null;

// 		let textsToDialog = [
// 			`${textToSayHello}${
// 				clientChatId ? `, ${dataAboutClient.login}` : ""
// 			}! 👋\n\nМое имя , и я готов помочь вам с любыми вопросами, касающимися нашей деятельности. Я лично отвечаю за выполнение всех проектов и буду работать с вами, чтобы гарантировать успешное завершение вашего будущего проекта! 😊`,
// 			`Подробную информацию о наших преимуществах и о нашей компании вы можете узнать в нашем боте-консультате, в разделе "О нас"! 😉`,
// 			`Услуги подробно и понятно описаны в нашем консультационном боте, в разделе "Каталог услуг". Если у вас остались вопросы, не стесняйтесь их задавать! 😉`,
// 			``,
// 			`пока нет`,
// 			`${
// 				clientChatId ? `${dataAboutClient.login}` : "Уважаемый клиент"
// 			}, благодарим вас за сотрудничество! Мы очень надеемся, что опыт работы с нами вам запомнился, и мы получим содержательный отзыв о предоставленной услуге. 🙏\n\nОтзыв можно оставить в разделе "Отзывы"\n\nНадеемся увидеть вас снова в числе наших клиентов. ${textToSayHelloForEnd}! 😉`,
// 			``,
// 		];

// 		dataAboutUser.action = "dialogBuilder";

// 		await bot.editMessageText(
// 			`<b><i>🗣️ Конструктор диалога ${
// 				clientChatId ? `• <code>${clientChatId}</code>` : ``
// 			}🛠️</i></b>\n\n<b>Скопировать:</b><blockquote><code>${
// 				textsToDialog[textNum - 1]
// 			}</code></blockquote>\n\n${
// 				!dataAboutClient
// 					? `Впишите Id любого клиента ✍️`
// 					: `Текущий клиент: <b><a href="https://t.me/${BotName}/?start=moreAboutUserWithId${dataAboutClient.chatId}">${dataAboutClient.login}</a></b>`
// 			}`,
// 			{
// 				parse_mode: "html",
// 				chat_id: chatId,
// 				message_id: usersData.find((obj) => obj.chatId == chatId).messageId,
// 				disable_web_page_preview: true,
// 				reply_markup: {
// 					inline_keyboard: [
// 						[
// 							{
// 								text: textNum == 1 ? `• Приветсвие 👋 •` : `Приветсвие 👋`,
// 								callback_data: "dialogBuilder1",
// 							},
// 						],
// 						[
// 							{
// 								text: textNum == 2 ? `• Кто мы 🤔 •` : `Кто мы 🤔`,
// 								callback_data: "dialogBuilder2",
// 							},
// 							{
// 								text: textNum == 3 ? `• Услуги 🛒 •` : `Услуги 🛒`,
// 								callback_data: "dialogBuilder3",
// 							},
// 						],
// 						[
// 							{
// 								text:
// 									textNum == 4
// 										? `• Оформление заказа 🛍️ •`
// 										: `Оформление заказа 🛍️`,
// 								callback_data: "dialogBuilder4",
// 							},
// 						],
// 						[
// 							{
// 								text: textNum == 5 ? `• Оплата 💰 •` : `Оплата 💰`,
// 								callback_data: "dialogBuilder5",
// 							},
// 							{
// 								text: textNum == 6 ? `• Отзыв 📧 •` : `Отзыв 📧`,
// 								callback_data: "dialogBuilder6",
// 							},
// 						],
// 						[
// 							{
// 								text: textNum == 7 ? `• Прощание 🫂 •` : `Прощание 🫂`,
// 								callback_data: "dialogBuilder7",
// 							},
// 						],
// 						[
// 							{
// 								text: `${clientChatId ? `К клиенту 👤` : ``}`,
// 								url: `tg://user?id=${clientChatId}`,
// 							},
// 						],
// 						[
// 							{
// 								text: "⬅️В меню",
// 								callback_data: "exit",
// 							},
// 						],
// 					],
// 				},
// 			}
// 		);
// 	} catch (error) {
// 		console.log(error);
// 		sendDataAboutError(chatId, dataAboutUser.login, `${String(error)}`);
// 	}
// }

async function adminMenu(chatId) {
	if (chatId == digsupportId || chatId == qu1z3xId) {
		const dataAboutUser = usersData.find((obj) => obj.chatId == chatId);

		let allFeedbacksData = [];
		usersData.forEach((user) => {
			if (user.feedbacksData)
				user.feedbacksData.forEach((element) => {
					allFeedbacksData.push(element);
				});
		});

		try {
			await bot.editMessageText(
				`<b><i>💠 Управление 💠</i>\n\n</b>Здравствуйте, <b>${dataAboutUser.login}!\n\nЧто вы хотите проверить? 🤔</b>`,
				{
					parse_mode: "html",
					chat_id: chatId,
					message_id: usersData.find((obj) => obj.chatId == chatId).messageId,
					disable_web_page_preview: true,
					reply_markup: {
						inline_keyboard: [
							[
								{
									text: "Реестр пользователей 💾",
									callback_data: "registryDataAdmin",
								},
							],
							[
								{
									text: `Отзывы ${
										allFeedbacksData &&
										allFeedbacksData.filter(
											(obj) => !obj.isVerified && obj.isCreated
										).length > 0
											? `(${
													allFeedbacksData.filter(
														(obj) => !obj.isVerified && obj.isCreated
													).length
												})`
											: ``
									} 📧`,
									callback_data: "unverifiedFeedbacksAdmin",
								},
								{
									text: "Статистика 📊",
									callback_data: "statisticListAdmin",
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
		} catch (error) {
			console.log(error);
			sendDataAboutError(chatId, dataAboutUser.login, `${String(error)}`);
		}
	}
}

async function registryList(chatId, listNum = 1, otherChatId = null) {
	if (chatId == digsupportId || chatId == qu1z3xId) {
		const dataAboutUser = usersData.find((obj) => obj.chatId == chatId);

		let text = "";
		let count = 0;
		let countOfLists = 1;

		try {
			if (otherChatId) {
				const dataAboutClient = usersData.find((obj) => obj.chatId == otherChatId);

				await bot.editMessageText(
					`<b><i>💾 Клиент • <code>${
						dataAboutClient.chatId
					}</code>👤</i>\n\nПодробнее:</b><blockquote><b>Данные:</b>\nЛогин: <b>${
						dataAboutClient.login
					}</b>${
						dataAboutClient.phoneNumber
							? `\nТелефон: <code>+${dataAboutClient.phoneNumber}</code>`
							: ``
					}\nСтатус: <b>${
						dataAboutClient.userStatus
					}</b>\n\n<b>Статистика:</b>\nОтзывов: <b>${
						dataAboutClient.feedbacksData
							? `${
									dataAboutClient.feedbacksData.filter((obj) => obj.isVerified)
										.length
								} / ${
									dataAboutClient.feedbacksData.filter((obj) => obj.isCreated)
										.length
								}`
							: 0
					} шт</b></blockquote><b>${dataAboutClient.registrationDate}</b>`,
					{
						parse_mode: "html",
						chat_id: chatId,
						message_id: usersData.find((obj) => obj.chatId == chatId).messageId,
						disable_web_page_preview: true,
						reply_markup: {
							inline_keyboard: [
								[
									{
										text:
											dataAboutClient.chatId != digsupportId
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
						text = ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""];
						for (let i = 0; i < usersData.length; i++) {
							if (count % 10 == 0 && count != 0) {
								++countOfLists;
							}

							count++;
							text[countOfLists - 1] +=
								`<b>${count}. ${usersData[i].login} • <code>${usersData[i].chatId}</code>\n</b>Статус:<b> ${usersData[i].userStatus}\n<a href="https://t.me/${BotName}/?start=moreAboutUserWithId${usersData[i].chatId}">Подробнее о клиенте</a></b>\n\n`;
						}

						dataAboutUser.action = "registryList1";

						await bot.editMessageText(
							`<b><i>💾 Реестр клиентов 📁\n\n${
								countOfLists > 1
									? `${dataAboutUser.supportiveCount} / ${countOfLists} стр • `
									: ``
							}${declension(count, "клиент", "клиента", "клиентов")}</i></b>\n\n${
								text[dataAboutUser.supportiveCount - 1]
									? `${text[dataAboutUser.supportiveCount - 1]}`
									: `Пока ни одного клиента..🤷‍♂️`
							}`,
							{
								parse_mode: "html",
								chat_id: chatId,
								message_id: usersData.find((obj) => obj.chatId == chatId).messageId,
								disable_web_page_preview: true,
								reply_markup: {
									inline_keyboard: [
										countOfLists > 1
											? [
													{
														text:
															dataAboutUser.supportiveCount > 1
																? "⬅️"
																: "🚫",
														callback_data:
															dataAboutUser.supportiveCount > 1
																? "previousPage"
																: "-",
													},
													{
														text: `${dataAboutUser.supportiveCount} стр`,
														callback_data: "firstPage",
													},
													{
														text:
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
												]
											: [],
										[
											{
												text: "⬅️Назад",
												callback_data: "adminMenu",
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
	if (chatId == digsupportId || chatId == qu1z3xId) {
		const dataAboutUser = usersData.find((obj) => obj.chatId == chatId);
		try {
			systemData.feedbacksAllTime = null;

			for (let i = 0; i < usersData.length; i++) {
				if (usersData[i].feedbacksData)
					systemData.feedbacksAllTime += usersData[i].feedbacksData.length;
			}

			await bot.editMessageText(
				`<b><i>📱 Статистика 📊</i>\n\nЗа все время:\n<blockquote>• ${declension(usersData.length, "клиент", "клиента", "клиентов")}\n• ${declension(systemData.activityAllTime, "действие", "действия", "действий")}\n• ${declension(systemData.feedbacksAllTime, "отзыв", "отзыва", "отзывов")}</blockquote></b>`,
				{
					parse_mode: "html",
					chat_id: chatId,
					message_id: usersData.find((obj) => obj.chatId == chatId).messageId,
					disable_web_page_preview: true,
					reply_markup: {
						inline_keyboard: [
							[
								{
									text: "⬅️Назад",
									callback_data: "adminMenu",
								},
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
		userStatus: "Клиент",
		messageId: null,
		action: null,
		selectedService: {
			bot: {
				serviceNum: 1,
			},
			server: {
				serviceNum: 1,
				variationNum: 1,
			},
		},
		feedbacksData: [],
		aiSelectorData: {
			query: null,
			response: {
				serviceNum: null,
				explanation: null,
			},
		},
		currentFeedbackId: null,
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
					object[key].forEach((item) => applySchema(item, schema[key][0])); // Для массивов объектов
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
		JSON.stringify(
			{
				usersData,
				systemData,
			},
			null,
			2
		)
	);

	console.log("Миграция завершена успешно!");
}

async function StartAll() {
	if (TOKEN == config.TOKENs[1]) BotName = "digfusionbot";
	if (TOKEN == config.TOKENs[0]) BotName = "digtestingbot";

	if (fs.readFileSync("DB.json") != "[]" && fs.readFileSync("DB.json") != "") {
		let dataFromDB = JSON.parse(fs.readFileSync("DB.json"));

		usersData = dataFromDB.usersData || null;
		systemData = dataFromDB.systemData || null;
	}

	// bot.on("contact", (message) => {
	// 	const chatId = message.chat.id;
	// 	const dataAboutUser = usersData.find((obj) => obj.chatId == chatId);

	// 	if (dataAboutUser && dataAboutUser.action == "firstMeeting4") {
	// 		dataAboutUser.phoneNumber = message.contact.phone_number;
	// 		menuHome(chatId);

	// 		try {
	// 			bot.deleteMessage(chatId, dataAboutUser.messageIdOther);
	// 			bot.deleteMessage(chatId, message.message_id);
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
					userStatus: "Клиент",
					messageId: null,
					action: null,

					selectedService: {
						bot: {
							serviceNum: 1,
						},
						server: {
							serviceNum: 1,
							variationNum: 1,
						},
					},

					feedbacksData: [],
					aiSelectorData: {
						query: null,
						response: {
							serviceNum: null,
							explanation: null,
						},
					},

					currentFeedbackId: null,

					messageIdOther: null,
					telegramFirstName: message.from.first_name,
					supportiveCount: 1,
					inBlackList: false,
					registrationDate: `${new Date().getDate().toString().padStart(2, "0")}.${(
						new Date().getMonth() + 1
					)
						.toString()
						.padStart(2, "0")}.${(new Date().getFullYear() % 100)
						.toString()
						.padStart(2, "0")}`,
					date: new Date(),
				});

				dataAboutUser = usersData.find((obj) => obj.chatId == chatId);
			}

			if (dataAboutUser && !dataAboutUser.inBlackList) {
				if (
					message.forward_origin &&
					!dataAboutUser.currentFeedbackId &&
					chatId == qu1z3xId
				) {
					let dataAboutCertainUser = usersData.find(
						(obj) =>
							obj.chatId == message.forward_origin?.id ||
							usersData.find((obj) => obj.chatId == digsupportId)
					);

					if (dataAboutCertainUser) {
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
												usersData[i].feedbacksData[j].feedbackId === rndId
											) {
												isUnique = false;
												break;
											}
										}
									if (!isUnique) break;
								}
							} else break;
						}

						if (dataAboutCertainUser?.feedbacksData) {
							dataAboutCertainUser.feedbacksData.push({
								from:
									message.forward_origin.sender_user?.first_name ||
									message.forward_origin.sender_user_name?.split(" ")[0],
								userStatus: dataAboutCertainUser.userStatus,
								serviceNum: null,

								opinionRating: "🤩",
								feedbackText: text,
								productLink: "",

								creationTime: `${String(new Date().getHours()).padStart(
									2,
									"0"
								)}:${String(new Date().getMinutes()).padStart(2, "0")}`,
								creationDate: `${new Date()
									.getDate()
									.toString()
									.padStart(2, "0")}.${(new Date().getMonth() + 1)
									.toString()
									.padStart(2, "0")}.${(new Date().getFullYear() % 100)
									.toString()
									.padStart(2, "0")}`,
								date: new Date(),

								feedbackId: rndId,
								isVerified: false,
								isCreated: true,
							});
						}

						dataAboutUser.currentFeedbackId = rndId;

						writeFeedbacks(chatId, 2);
					}
				}

				if (dataAboutUser.action == "firstMeeting3" && Array.from(text)[0] != "/") {
					dataAboutUser.login = text;

					firstMeeting(chatId, 4);
				}

				if (dataAboutUser.action == "aiSelector" && Array.from(text)[0] != "/") {
					if (dataAboutUser.aiSelectorData?.response) {
						dataAboutUser.aiSelectorData.response = null;
					}

					aiSelector(chatId, text);
				}

				if (
					text.includes("/start showNavigationListInMenuHome") ||
					text.includes("/start hideNavigationListInMenuHome")
				) {
					match = text.match(/^\/start (.*)NavigationListInMenuHome$/);

					match[1] == "show"
						? menuHome(chatId, true)
						: match[1] == "hide"
							? menuHome(chatId, false)
							: null;
				}

				if (text.includes("/start catalogOfServices")) {
					if (text.includes("RESEND")) {
						try {
							bot.deleteMessage(chatId, dataAboutUser.messageId);
						} catch (error) {}

						await bot.sendMessage(chatId, "ㅤ").then((message) => {
							dataAboutUser.messageId = message.message_id;
						});

						match = text.match(/^\/start catalogOfServices(.*)RESEND$/);
					} else {
						match = text.match(/^\/start catalogOfServices(.*)$/);
					}

					let catalogNum = null;
					switch (parseInt(match[1])) {
						case 1:
						case 2:
						case 3:
							catalogNum = 1;
							dataAboutUser.selectedService.bot.serviceNum = parseInt(match[1]);
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
			}

			if (
				dataAboutUser.action == "writeFeedbacks1" &&
				Array.from(text)[0] != "/" &&
				chatId == digsupportId
			) {
				let isUnique = false;
				while (!isUnique) {
					rndId = Math.floor(Math.random() * 9999);
					isUnique = true;

					if (usersData) {
						for (let i = 0; i < usersData.length; i++) {
							if (usersData[i].feedbacksData)
								for (let j = 0; j < usersData[i].feedbacksData.length; j++) {
									if (usersData[i].feedbacksData[j].feedbackId === rndId) {
										isUnique = false;
										break;
									}
								}
							if (!isUnique) break;
						}
					} else break;
				}

				if (!dataAboutUser.feedbacksData) dataAboutUser.feedbacksData = [];

				if (dataAboutUser.feedbacksData || chatId == digsupportId)
					dataAboutUser.feedbacksData.push({
						from: dataAboutUser.login,
						userStatus: dataAboutUser.userStatus,
						serviceNum: null,

						opinionRating: null,
						feedbackText: text,
						productLink: null,

						creationTime: `${String(new Date().getHours()).padStart(
							2,
							"0"
						)}:${String(new Date().getMinutes()).padStart(2, "0")}`,
						creationDate: `${new Date().getDate().toString().padStart(2, "0")}.${(
							new Date().getMonth() + 1
						)
							.toString()
							.padStart(2, "0")}.${(new Date().getFullYear() % 100)
							.toString()
							.padStart(2, "0")}`,
						date: new Date(),

						feedbackId: rndId,
						isVerified: false,
						isCreated: false,
					});

				dataAboutUser.currentFeedbackId = rndId;

				writeFeedbacks(chatId, 2);
			}

			if (dataAboutUser.action == "writeFeedbacks2") {
				if (text.includes("https://t.me/") && Array.from(text)[0] != "/") {
					usersData
						.find(
							(obj) =>
								obj.feedbacksData &&
								obj.feedbacksData.find(
									(element) =>
										dataAboutUser.currentFeedbackId &&
										element.feedbackId == dataAboutUser.currentFeedbackId
								)
						)
						.feedbacksData.at(-1).productLink = text;

					writeFeedbacks(chatId, 2);
				} else {
					usersData
						.find(
							(obj) =>
								obj.feedbacksData &&
								obj.feedbacksData.find(
									(element) =>
										dataAboutUser.currentFeedbackId &&
										element.feedbackId == dataAboutUser.currentFeedbackId
								)
						)
						.feedbacksData.at(-1).feedbackText = text;

					writeFeedbacks(chatId, 2);
				}
			}

			if (text.includes("/start feedbackWithId")) {
				match = text.match(/^\/start feedbackWithId(.*)$/);

				feedbacksList(chatId, null, parseInt(match[1]));
			}

			if (
				dataAboutUser.action == "editLogin" &&
				text != dataAboutUser.login &&
				Array.from(text)[0] != "/"
			) {
				dataAboutUser.supportiveCount = text;
				profile(chatId, true, true);
			}

			// if (
			// 	dataAboutUser.action == "dialogBuilder" &&
			// 	usersData.find((obj) => obj.chatId == parseInt(text))
			// ) {
			// 	clientChatId = parseInt(text);

			// 	dialogBuilder(chatId, null);
			// }

			if (
				dataAboutUser.action == "registryList" &&
				usersData.find((obj) => obj.chatId == parseInt(text))
			) {
				registryList(chatId, null, parseInt(text));
			}

			if (
				text.includes("/start moreAboutUserWithId") &&
				(chatId == digsupportId || chatId == qu1z3xId)
			) {
				match = text.match(/^\/start moreAboutUserWithId(.*)$/);

				registryList(chatId, null, parseInt(match[1]));
			}

			if (
				text == "/services" ||
				text == "/consultation" ||
				text == "/profile" ||
				text == "/start catalog0" ||
				text == "/start ourProjectsList0"
			) {
				try {
					bot.deleteMessage(chatId, dataAboutUser.messageId);
				} catch (error) {}

				await bot
					.sendMessage(chatId, "ㅤ")
					.then((message) => (dataAboutUser.messageId = message.message_id));

				switch (text) {
					case "/services":
						catalogOfServices(chatId);
						break;
					case "/consultation":
						consultation(chatId);
						break;
					case "/profile":
						profile(chatId);
						break;
					case "/start catalog0":
						catalogOfServices(chatId);
						break;
					case "/start ourProjectsList0":
						ourProjectsList(chatId, 1);
						break;
				}
			}

			//? АЛЕРТЫ

			if (text.includes("/alert") && (chatId == qu1z3xId || chatId == digsupportId)) {
				let alertData = {};
				switch (text) {
					case "/alert1":
						alertData = {
							text: "",
							entities: [],
							photoId: "",
							buttons: [
								[
									{
										text: "",
										callback_data: "-",
									},
								],
							],
						};
						break;
					case "/alert2":
						break;
				}

				if (alertData) {
					for (let i = 0; i < usersData.length; i++) {
						const element = usersData[i];

						try {
							if (element.chatId != qu1z3xId)
								bot.deleteMessage(element.chatId, element.messageId);
						} catch (error) {}

						try {
							if (alertData.photoId) {
								await bot
									.sendPhoto(element.chatId, alertData.photoId, {
										caption: alertData.text || null,
										caption_entities: alertData.entities || null,
										disable_web_page_preview: true,
										reply_markup: {
											inline_keyboard: alertData.buttons
												? alertData.buttons
												: {
														text: "",
														callback_data: "-",
													},
										},
									})
									.then((message) => {
										element.messageIdOther = message.message_id;
									});
							} else {
								await bot
									.sendMessage(element.chatId, alertData.text, {
										disable_web_page_preview: true,
										entities: alertData.entities || null,
										reply_markup: {
											inline_keyboard: alertData.buttons
												? alertData.buttons
												: {
														text: "",
														callback_data: "-",
													},
										},
									})
									.then((message) => {
										element.messageIdOther = message.message_id;
									});
							}
						} catch (error) {
							console.log(error);
							sendDataAboutError(element.chatId, element.login, `${String(error)}`);
							continue;
						}
					}
				}
			}

			switch (text) {
				case "/restart":
				case "/start":
					try {
						bot.deleteMessage(chatId, dataAboutUser.messageId);
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
					profile(chatId, true);
					break;
				// case "/start moreAboutUserStatus":
				// 	userStatusInfo(chatId);
				// 	break;
				case "/start moreAboutUs":
					moreAboutUs(chatId);
					break;
				case "/data":
					if (chatId == digsupportId || chatId == qu1z3xId) {
						const dataToSend = {
							usersData,
							systemData,
						};
						sendDataAboutDataBase(dataToSend);

						console.log("БД обновлена, все ок");
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

			bot.deleteMessage(chatId, message.message_id);

			++systemData.activityAllTime;

			if (chatId != qu1z3xId && chatId != digsupportId) {
				sendDataAboutText(chatId, dataAboutUser.login, text);
			}
		} catch (error) {
			console.log(error);
			sendDataAboutError(chatId, dataAboutUser?.login, `${String(error)}`);
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
				userStatus: "Клиент",
				messageId: query.message.message_id,
				action: null,

				selectedService: {
					bot: {
						serviceNum: 1,
					},
					server: {
						serviceNum: 1,
						variationNum: 1,
					},
				},

				feedbacksData: [],
				aiSelectorData: {
					query: null,
					response: {
						serviceNum: null,
						explanation: null,
					},
				},

				currentFeedbackId: null,

				messageIdOther: null,
				telegramFirstName: query.from.first_name,
				supportiveCount: 1,
				registrationDate: `${new Date().getDate().toString().padStart(2, "0")}.${(
					new Date().getMonth() + 1
				)
					.toString()
					.padStart(2, "0")}.${(new Date().getFullYear() % 100)
					.toString()
					.padStart(2, "0")}`,
				date: new Date(),
				inBlackList: false,
			});

			dataAboutUser = usersData.find((obj) => obj.chatId == chatId);
		}

		if (dataAboutUser) {
			try {
				if (!dataAboutUser.inBlackList) {
					if (query.message.message_id == dataAboutUser.messageIdOther) {
						try {
							bot.deleteMessage(chatId, dataAboutUser.messageIdOther);
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
								dataAboutUser.selectedService.bot.serviceNum = parseInt(match[1]);
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
									bot: {
										serviceNum: serviceNum,
									},
									server: {
										serviceNum: null,
										variationNum: 1,
									},
								};
								break;
							case 2:
								serviceNum = 4;

								dataAboutUser.selectedService = {
									bot: {
										serviceNum: null,
									},
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

					if (data.includes("nextServiceNum") || data.includes("previousServiceNum")) {
						match = data.match(/^(.*)ServiceNum$/);

						const maxServices = dataAboutUser.action === "catalog1" ? 3 : 5;
						const minServices = dataAboutUser.action === "catalog1" ? 1 : 4;

						if (dataAboutUser.supportiveCount == maxServices && match[1] == "next") {
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
									dataAboutUser.action === "catalog1"
										? dataAboutUser.supportiveCount
										: null,
							},
							server: {
								serviceNum:
									dataAboutUser.action === "catalog2"
										? dataAboutUser.supportiveCount
										: null,
								variationNum: 1,
							},
						};

						catalogOfServices(chatId, dataAboutUser.action === "catalog1" ? 1 : 2);
					}

					if (data.includes("variationNum")) {
						match = data.match(/^variationNum(.*)$/);

						dataAboutUser.selectedService.server.variationNum = parseInt(match[1]);

						if (dataAboutUser.action == "catalog2") {
							catalogOfServices(chatId, dataAboutUser.action === "catalog1" ? 1 : 2);
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

						if (chatId == digsupportId || chatId == qu1z3xId) {
							let dataAboutCertainUser =
								usersData.find((obj) =>
									obj.feedbacksData?.some(
										(element) => element.feedbackId == parseInt(match[1])
									)
								) || null;

							if (dataAboutCertainUser) {
								dataAboutCertainUser.feedbacksData.splice(
									dataAboutCertainUser.feedbacksData.indexOf(
										dataAboutCertainUser.feedbacksData.find(
											(obj) => obj.feedbackId == parseInt(match[1])
										),
										1
									)
								);
							}
						}

						feedbacksList(chatId, 1);
					}

					if (data.includes("unverifiedFeedbackWithId")) {
						match = data.match(/^unverifiedFeedbackWithId(.*)$/);

						let allFeedbacksData = [];
						usersData.forEach((user) => {
							if (user.feedbacksData)
								user.feedbacksData.forEach((element) => {
									allFeedbacksData.push(element);
								});
						});

						if (
							(chatId == digsupportId || chatId == qu1z3xId) &&
							allFeedbacksData &&
							allFeedbacksData.find((obj) => obj.feedbackId == parseInt(match[1]))
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
								user.feedbacksData.forEach((element) => {
									allFeedbacksData.push(element);
								});
						});

						if (
							(chatId == digsupportId || chatId == qu1z3xId) &&
							allFeedbacksData &&
							allFeedbacksData.find((obj) => obj.feedbackId == parseInt(match[1]))
						) {
							allFeedbacksData.find(
								(obj) => obj.feedbackId == parseInt(match[1])
							).isVerified = true;
						}
						feedbacksList(chatId, null, parseInt(match[1]));
					} else if (data.includes("digfeedbacksSignAboutFeedbackWithId")) {
						match = data.match(/^digfeedbacksSignAboutFeedbackWithId(.*)$/);

						if (chatId == qu1z3xId) {
							let dataAboutFeedback = usersData
								.find((obj) =>
									obj.feedbacksData?.some(
										(element) => element.feedbackId == match[1]
									)
								)
								?.feedbacksData.find((element) => element.feedbackId == match[1]);

							if (dataAboutFeedback) {
								bot.sendMessage(
									chatId,
									`<b>${dataAboutFeedback.productLink ? `<a href="${dataAboutFeedback.productLink}">Итоговый продукт заказчика</a>\n\n` : ``}Услуга заказчика:</b>\n<blockquote><b>${dataAboutFeedback.serviceNum} ${services[dataAboutFeedback.serviceNum - 1].name}\nЦена:</b> ${services[dataAboutFeedback.serviceNum - 1].priceSentence}</blockquote>\n\n<b><i>digfusion</i>\n<a href="https://t.me/digfusionbot">Услуги</a> • <a href="https://t.me/digfusion">Новости</a> • <a href="https://t.me/qu1z3x">Связь</a></b>`,
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
										(element) =>
											dataAboutUser.currentFeedbackId &&
											element.feedbackId == dataAboutUser.currentFeedbackId
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
										(element) =>
											dataAboutUser.currentFeedbackId &&
											element.feedbackId == dataAboutUser.currentFeedbackId
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

					// if (data.includes("dialogBuilder")) {
					// 	match = data.match(/^dialogBuilder(.*)$/);

					// 	dialogBuilder(chatId, parseInt(match[1]));
					// }

					if (
						data.includes("previousPage") ||
						data.includes("nextPage") ||
						data.includes("firstPage")
					) {
						match = data.match(/^(.*)Page$/);

						if (match[1] == "previous" && dataAboutUser.supportiveCount > 1) {
							--dataAboutUser.supportiveCount;
						} else if (match[1] == "next") {
							++dataAboutUser.supportiveCount;
						} else if (match[1] == "first") {
							dataAboutUser.supportiveCount = 1;
						}

						if (dataAboutUser.action == "feedbacksList1") feedbacksList(chatId, 1);
						else if (dataAboutUser.action == "feedbacksList2") feedbacksList(chatId, 2);
						else if (dataAboutUser.action == "registryList1") registryList(chatId, 1);
					}

					// if (data.includes("buildDialogForUserWithId")) {
					// 	match = data.match(/^buildDialogForUserWithId(.*)$/);

					// 	clientChatId = parseInt(match[1]);

					// 	dialogBuilder(chatId, 1);
					// }

					if (
						data.includes("addToBlackListUserWithId") ||
						data.includes("deleteFromBlackListUserWithId")
					) {
						match = data.match(/^(.*)BlackListUserWithId(.*)$/);

						const dataAboutClient =
							usersData.find((obj) => obj.chatId == parseInt(match[2])) || null;

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
							if (!dataAboutUser.aiSelectorData?.query) {
								bot.answerCallbackQuery(query.id, {
									text: `Чем более содержателен ваш запрос, тем точнее Нейро подберет для вас решение! 🎯`,
									show_alert: true,
								});
							}

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
							bot.answerCallbackQuery(query.id, {
								text: `❕\n${dataAboutUser.login}, мы прекратили деятельность..\n\nВсе это - история digfusion`,
								show_alert: true,
							});
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
							writeFeedbacks(chatId, chatId == qu1z3xId ? 2 : 1);
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
						case "profile":
							profile(chatId);
							break;
						case "resetLogin":
							dataAboutUser.login = dataAboutUser.telegramFirstName;

							bot.answerCallbackQuery(query.id, {
								text: `Ваш логин снова \n«${dataAboutUser.login}» 😉`,
								show_alert: true,
							});

							profile(chatId);
							break;
						case "editLogin":
							dataAboutUser.login = dataAboutUser.supportiveCount;

							bot.answerCallbackQuery(query.id, {
								text: `Ваш логин изменен на\n«${dataAboutUser.supportiveCount}» 😉`,
								show_alert: true,
							});

							profile(chatId);
							break;
						case "":
							break;
						case "adminMenu":
							adminMenu(chatId);
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
						case "/data":
							if (chatId == qu1z3xId || chatId == digsupportId) {
								fs.writeFileSync(
									"DB.json",
									JSON.stringify(
										{ usersData: usersData, systemData: systemData },
										null,
										2
									)
								);
							}
							break;
						case "deleteexcess":
							try {
								bot.deleteMessage(chatId, query.message.message_id);
							} catch (error) {}
							break;
					}
				} else if (dataAboutUser.inBlackList) {
					dataAboutUser.action = "inBlackList";

					bot.editMessageText(
						`<b>Похоже у вас больше нет доступа в общении с нами! ☹️\n\nЧтобы узнать подробнее причину блокировки, обратитесь в поддержку! 🗯️</b>`,
						{
							chat_id: chatId,
							message_id: usersData.find((obj) => obj.chatId == chatId).messageId,
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
											text: "Написать 💭",
											url: "https://t.me/qu1z3x",
										},
									],
								],
							},
						}
					);
				}

				++systemData.activityAllTime;

				if (chatId != qu1z3xId && chatId != digsupportId) {
					sendDataAboutButton(chatId, dataAboutUser.login, data);
				}

				// fs.writeFileSync(
				// 	"DB.json",
				// 	JSON.stringify({ usersData: usersData,
				// systemData: systemData, }, null, 2)
				// );
			} catch (error) {
				console.log(error);
				sendDataAboutError(chatId, dataAboutUser.login, `${String(error)}`);
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
						{
							usersData: usersData,
							systemData: systemData,
						},
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
}

// runMigration("DB.json");
StartAll();
