import TelegramBot from "node-telegram-bot-api";
import cron from "node-cron";
import fs from "fs";

import {
	sendDataAboutText,
	sendDataAboutButton,
	sendDataAboutError,
	sendDataAboutDataBase,
} from "./tgterminal.js";

import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, get } from "firebase/database";

import { config } from "./config.js";

const TOKEN = config.TOKENs[0]; // 1 - оригинал
const bot = new TelegramBot(TOKEN, { polling: true });

// Initialize Firebase
const app = initializeApp(config.firebaseConfig);

// Получение ссылки на базу данных Firebase Realtime Database
const db = getDatabase(app);
const dataRef = ref(db);

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

	alertsData: [],
};

let moreAboutUsText = [
	"<blockquote><b>•  Низкая стоимость услуг</b>\nСтоимость создания достойного чат-бота - не космические цифры, а разумная сумма! 💰<b>\n\n•  Сначала результат, потом оплата</b>\nПолная оплата работы после того, как получите продукт! 🤗 <i>(Предоплата 50% от суммы)</i>\n\n<b>•  Постоянная поддержка и правки</b>\nМы доводим каждый проект до конца, учитывая мнения и пожелания клиента. 😉\n\n<b>•  Открытость</b>\nМы никогда ничего не скрываем и не будем скрывать от своих клиентов! 🙈</blockquote> ",

	"За нашими плечами <b>большой</b> опыт реализации <b>крупных</b> проектов, и мы готовы сделать <b>ваш</b> проект <b>таким же!</b> 😎\n\n<b>Обращайтесь к нам,</b> и мы поможем вам создать <b><i>эффективного, шустрого</i> и приятного для использования</b> чат-бота для любой вашей <b>деятельности!</b> 😉",

	`Пожалуйста, не пропускайте список <b>наших положений и требований!</b> Нам важно уведомить вас, о том что <b>вы можете ожидать от нас</b> при использовании <b>услуг digfusion,</b> и что <b>мы ожидаем от вас. 😉\n\nНавигация по документу:<blockquote><i><a href="https://telegra.ph/digfusion--Politika-08-08#%D0%A7%D1%82%D0%BE-%D0%B2%D1%8B-%D0%BC%D0%BE%D0%B6%D0%B5%D1%82%D0%B5-%D0%BE%D0%B6%D0%B8%D0%B4%D0%B0%D1%82%D1%8C-%D0%BE%D1%82-%D0%BD%D0%B0%D1%81">Что вы можете ожидать от нас</a>\n<a href="https://telegra.ph/digfusion--Politika-08-08#%D0%A7%D1%82%D0%BE-%D0%BC%D1%8B-%D0%BE%D0%B6%D0%B8%D0%B4%D0%B0%D0%B5%D0%BC-%D0%BE%D1%82-%D0%B2%D0%B0%D1%81">Что мы ожидаем от вас</a>\n<a href="https://telegra.ph/digfusion--Politika-08-08#%D0%9F%D1%80%D0%B5%D0%B4%D0%BE%D1%81%D1%82%D0%B0%D0%B2%D0%BB%D0%B5%D0%BD%D0%B8%D0%B5-%D1%83%D1%81%D0%BB%D1%83%D0%B3">Предоставление услуг</a>\n<a href="https://telegra.ph/digfusion--Politika-08-08#%D0%A2%D1%80%D0%B5%D0%B1%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D1%8F-%D0%B2-%D0%B4%D0%B8%D0%B0%D0%BB%D0%BE%D0%B3%D0%B5">Требования в диалоге</a></i></blockquote></b>`,

	// "Около года назад <b>основатель компании</b> посещал <b>Московскую Школу Программистов (МШП),</b> успешно занимаясь и <b>максимально</b> погружаясь в процесс, демонстрируя <b>потрясающие для одного года обучения</b> результаты в виде <b>дополнительных проектов,</b> которые он создавал из своего <b>огромного желания преуспеть</b> в этой области. Уже сегодня, спустя <b>несколько лет</b> с начала своей <b>карьеры в IT</b> он показывает <b>максимум</b> своих <b>приобретенных знаний</b> в <b><i>разработке</i></b> и <i><b>предоставлении услуг</b></i> по созданию чат-ботов.\n\nНо, изначально <b>выбор отрасли не был очевидным,</b> сначала это была <b>разработка консольных приложений,</b> затем упор на <b>дискретную математику,</b> далее разработка <b>веб-приложений для Windows, gameDev,</b> и только потом, по поручению <b>главнокомандующего информатика школы,</b> он углубился в <b>действительно полезную</b> и <b>сложную отрасль</b> разработки – <b>создание чат-ботов в Telegram. Поручение</b> заключалось в создании <b>школьного помощника,</b> который бы <b>показывал расписание, напоминал о звонках, демонстрировал меню столовой</b> и многое другое! Если вы <b>ознакамливались с нашими проектами,</b> то не сложно догадаться, этот <b>прорывной</b> проект – <b>«Цифровичок»,</b> который действительно пригодился <b>десяткам людей как повседневный помощник!</b>",

	// "\n\n<b>Возникает вопрос,</b> откуда появилось название <b>«digfusion»?</b> При создании <b>«Цифровичка»</b> я выбирал <b>доменное имя,</b> и <b>среди предложенных</b> информатиком были имена, состоящие из <b>двух слов – «digital»</b> и <b>«school». Telegram</b> не пропускал <b>по длине</b> все составленные из этих <b>полных</b> слов имена, поэтому в голову пришли <b>гениальные сокращения,</b> такие как <b>«dig»</b> и <b>«sch»</b>, что дает - <b>digsch</b>. <b>Вторым проектом</b> оказался <b>«Спортивичек»,</b> по просьбе <b>физрука,</b> и поскольку он предназначен для <b>судейства,</b> слово <b>«sch» (school)</b> мы заменили на <b>«judge»</b>. Именно поэтому <b>все последующие помощники</b> начинаются с <b>«dig» (digital),</b> и <b>наша компания</b> тоже взяла себе такую <b>отличительную фирменную приставку!</b>\n\n<b>Идея её основания</b> возникла после того, как, хорошо задумавшись, захотелось <b>монетизировать своё творчество</b> и помогать людям не только <b>из своего окружения,</b> но и <b>по всему интернету.</b>\n\n<b>Вот и вся история! Напоминаем,</b> мы ничего <b>не держим в секрете</b> от своих <b>клиентов! Вся информация</b> и <b>все процессы</b> находятся <b>на поверхности!</b> Если вы <b>нам доверяете</b> и прочитали <b>весь этот текст, спасибо вам огромное! Мы очень ценим вас! ❤️</b>",
];

let catalogOfServicesText = [
	{
		serviceName: `Однотипный бот`,
		moreAbout:
			"Сбор информации с пользователей, и доступ к полученной базе данных. Выполнение несложных операций.",
		executionDate: "1 - 5 дней",
		lifeTime: "",
		firstPrice: 0,
		price: 990,
		priceSentence: "",
	},
	{
		serviceName: `Бот среднего класса`,
		moreAbout:
			"Один ведущий раздел с главным функционалом, базы данных любых массивов информации и возможность рассылки сообщений.",

		executionDate: "3 - 8 дней",
		lifeTime: "",
		firstPrice: 2990,
		price: 1990,
		priceSentence: "",
	},
	{
		serviceName: `Сложносоставной бот`,
		moreAbout:
			"Полностью законченая площадка, со множеством разделов, главным меню, множеством выполняемых задач, и с возможностью администрирования.",
		executionDate: "8 и больше дней",
		lifeTime: "",
		firstPrice: 7990,
		price: 4990,
		priceSentence: "",
	},
	{
		serviceName: `Неделя на сервере`,
		moreAbout:
			"Неделя хранения вашего проекта на нашем хостинге. Подходит для тех, кому действительно не хочется заморачиваться с собственным сервером.",
		executionDate: "",
		lifeTime: "7 дней",
		firstPrice: 0,
		price: 150,
		priceSentence: "",
	},
];

if (catalogOfServicesText)
	for (let i = 0; i < catalogOfServicesText.length; i++) {
		catalogOfServicesText[i].priceSentence = `${
			catalogOfServicesText[i].firstPrice
				? `<s>${catalogOfServicesText[i].firstPrice}</s> <b><i>от ${
						catalogOfServicesText[i].price
					}р (-${Math.floor(
						((catalogOfServicesText[i].firstPrice -
							catalogOfServicesText[i].price) /
							catalogOfServicesText[i].firstPrice) *
							100
					)}%) 🔥</i></b>`
				: `<b><i>от ${catalogOfServicesText[i].price}р</i></b>`
		}`;
	}

bot.setMyCommands([
	{
		command: "/restart",
		description: "Перезапуск 🔄️",
	},
	{
		command: "/catalog",
		description: "Каталог услуг 🛒",
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

let rndNum, textToSayHello, match, rndId, clientChatId;

async function firstMeeting(chatId, numOfStage = 1) {
	const dataAboutUser = usersData.find((obj) => obj.chatId == chatId);

	try {
		switch (numOfStage) {
			case 1:
				dataAboutUser.userAction = "firstMeeting1";

				await bot.editMessageText(
					`<b>Вас приветствует</b> компания <b><i>digfusion,</i></b> ваш <b>надежный</b> партнер в области <b>разработки чат-ботов!</b> 👋\n\n${moreAboutUsText[1]}`,
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
										text: "Что такое чат-бот❓",
										callback_data: "firstMeeting5",
									},
								],
								[{ text: "Далее➡️", callback_data: "firstMeeting2" }],
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
						message_id: usersData.find((obj) => obj.chatId == chatId)
							.messageId,
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
									{ text: "⬅️Назад", callback_data: "firstMeeting1" },
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
				dataAboutUser.userAction = "firstMeeting3";

				await bot.editMessageText(
					`<b>Мы</b> уже рассказали <b>о себе,</b> теперь <b>ваша очередь!</b> 😊\n\n<b><a href="https://telegra.ph/digfusion--Politika-08-08">Политика компании digfusion</a></b>\n<i>Продолжая, вы соглашаетесь со всеми требованиями и положениями digfusion!</i>\n\n<b>Пожалуйста,</b> напишите <b>как можно к вам обращаться</b> для <b>дальнейшего общения?</b> 🤔`,
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
										text: `Или оставить ${dataAboutUser.login} ✅`,
										callback_data: "firstMeeting4",
									},
								],
								[{ text: "⬅️Назад", callback_data: "firstMeeting2" }],
							],
						},
					}
				);
				break;
			case 4:
				menuHome(chatId, false, true);

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
					`<b><i>Что же такое чат-бот❓</i></b>\n\nЭто инструмент, <b>обрабатывающий</b> различные <b>запросы</b> пользователей <b>в формате диалога в мессенджере,</b> точно так же, как и <b>этот помощник,</b> текст которого <b>вы</b> сейчас читаете. 😊\n\n<blockquote>Такой <b>проект может</b> стать как прекрасным инструментом для <b>монетизации вашей деятельности,</b> так и <b>обычным опросником</b> для получения различных <b>данных</b> от групп людей.</blockquote>\n\nВ <b>пример</b> мы приведем наши <b>крупные</b> и <b>успешные работы.</b> ⬇️`,
					{
						parse_mode: "html",
						chat_id: chatId,
						message_id: usersData.find((obj) => obj.chatId == chatId)
							.messageId,
						disable_web_page_preview: true,
						reply_markup: {
							inline_keyboard: [
								[
									// {
									// 	text: "Цифровичок 🤖",
									// 	url: "https://t.me/digschbot",
									// },
									{
										text: "Алгебравичок 🧮",
										url: "https://t.me/digmathbot",
									},
								],
								[
									{
										text: "Спортивичок 🏀",
										url: "https://t.me/digjudgebot",
									},
									{
										text: "Never Finished 🏅",
										url: "https://t.me/neverfinishedbot",
									},
								],
								[
									{
										text: "⬅️Назад",
										callback_data:
											dataAboutUser.userAction == "firstMeeting1"
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

	if (dateNowHHNN < 1200 && dateNowHHNN >= 600) textToSayHello = "Доброе утро";
	else if (dateNowHHNN < 1700 && dateNowHHNN >= 1200)
		textToSayHello = "Добрый день";
	else if (dateNowHHNN < 2200 && dateNowHHNN >= 1700)
		textToSayHello = "Добрый вечер";
	else if (dateNowHHNN >= 2200 || dateNowHHNN < 600)
		textToSayHello = "Доброй ночи";

	try {
		beforeFirstMeeting =
			dataAboutUser.userAction == "firstMeeting3" ? true : false;

		dataAboutUser.registrationIsOver = true;
		dataAboutUser.supportiveCount = 1;

		dataAboutUser.userAction = "menuHome";

		dataAboutUser.userStatus =
			dataAboutUser.chatId == jackId
				? "Администратор 👑"
				: (dataAboutUser.requestsData &&
							dataAboutUser.requestsData.length < 3) ||
					  !dataAboutUser.requestsData
					? "Клиент 🙂"
					: dataAboutUser.requestsData.length >= 3
						? "Постоянный клиент 😎"
						: dataAboutUser.requestsData.length >= 6
							? "Особый клиент 🤩"
							: dataAboutUser.requestsData.length >= 10
								? "Лучший покупатель 🤴"
								: "";

		let navigationListText = `<b>"Каталог услуг 🛒"</b> - расчет стоимости и выбор типа продукта.\n\n<b>"Идеи 💡"</b> - список идей для вашей деятельности.\n\n<b>"Консультация 🧑‍💻"</b> - в живой переписке подскажем и проконсультируем вас по любому вопросу!\n\n<b>"Наши работы 📱"</b> - список и описание всех наших проектов.\n\n<b>"О нас 👥"</b> - вся информация о нашей корпорации и наших преимуществах.\n\n<b>"Отзывы 📧"</b> - возможность оставить отзыв, и список реальных мнений заказчиков.\n\n<b>"Профиль ⚙️"</b> - личные данные, и прочая информация.`;

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
				message_id: usersData.find((obj) => obj.chatId == chatId).messageId,
				disable_web_page_preview: true,
				reply_markup: {
					inline_keyboard: [
						[
							{
								text: `${
									dataAboutUser.requestsData &&
									dataAboutUser.requestsData.find(
										(obj) => obj.isActive
									)
										? `❗Ваша заявка №${
												dataAboutUser.requestsData.find(
													(obj) => obj.isActive
												).requestId
											} 🕑`
										: ""
								}`,
								callback_data: "myRequest",
							},
						],
						[
							{
								text: "Каталог услуг 🛒",
								callback_data: "catalogOfServices",
							},
						],
						[
							{ text: "Идеи 💡", callback_data: "ideasForProjects" },
							{ text: "Консультация 🧑‍💻", callback_data: "consultation" },
						],
						[
							{
								text: "Наши работы 📱",
								callback_data: "ourProjectsList0",
							},
						],
						[
							{ text: "О нас 👥", callback_data: "moreAboutUs1" },
							{ text: "Отзывы 📧", callback_data: "feedbacksList" },
						],

						[{ text: "Профиль ⚙️", callback_data: "settings" }],
						[
							{
								text: `${
									chatId == jackId || chatId == qu1z3xId
										? "Конструктор 🛠️"
										: ""
								}`,
								callback_data: "dialogBuilder1",
							},
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
	} catch (error) {
		console.log(error);
		sendDataAboutError(chatId, dataAboutUser.login, `${String(error)}`);
	}
}

async function catalogOfServices(chatId, serviceNum = 1) {
	const dataAboutUser = usersData.find((obj) => obj.chatId == chatId);

	const dataAboutСertainRequest = dataAboutUser.requestsData
		? dataAboutUser.requestsData.find((obj) => obj.isActive)
		: null;

	try {
		let text = "";
		for (let i = 1; i <= catalogOfServicesText.length; i++) {
			text += `${
				serviceNum == i
					? `\n\n<b>• ${i}. ${
							catalogOfServicesText[serviceNum - 1].serviceName
						} •\n</b><blockquote>${
							dataAboutСertainRequest &&
							dataAboutСertainRequest.serviceNum == i
								? `<i>Выбранная вами услуга</i> - <a href="https://t.me/${BotName}/?start=myRequest">к заявке</a>\n\n`
								: ``
						}<b>Подробнее:</b> ${
							catalogOfServicesText[serviceNum - 1].moreAbout
						}${
							catalogOfServicesText[serviceNum - 1].lifeTime
								? `\n\n<b>Действует:</b> ${
										catalogOfServicesText[serviceNum - 1].lifeTime
									}`
								: ``
						}${
							catalogOfServicesText[serviceNum - 1].executionDate
								? `\n\n<b>Срок выполнения:</b> ${
										catalogOfServicesText[serviceNum - 1]
											.executionDate
									} ⌛`
								: ``
						}\n\n<b>Цена:</b> ${
							catalogOfServicesText[serviceNum - 1].priceSentence
						} 💰${
							serviceNum != 4
								? `\n\n<b><a href="https://t.me/${BotName}/?start=ideasForProjects">Идеи для проекта</a></b>`
								: ``
						}</blockquote>`
					: `\n\n<b>${i}. </b>${catalogOfServicesText[i - 1].serviceName}${
							dataAboutСertainRequest &&
							dataAboutСertainRequest.serviceNum == i
								? ` - <b><a href="https://t.me/${BotName}/?start=myRequest">к заявке</a></b>`
								: ``
						}`
			}`;
		}

		await bot.editMessageText(
			`<b><i>🛍️ Каталог услуг 🛒</i></b>\n\n<b>На данный момент</b> мы предоставляем <b>данные услуги:</b>${text}${
				dataAboutСertainRequest
					? `\n\n<b>У вас</b> уже выбрана <b>услуга №${dataAboutСertainRequest.serviceNum},</b> но выбор <b>можно изменить!</b> 😉`
					: ``
			}\n\n<b><a href="https://telegra.ph/digfusion--Politika-08-08#%D0%A7%D1%82%D0%BE-%D0%B2%D1%8B-%D0%BC%D0%BE%D0%B6%D0%B5%D1%82%D0%B5-%D0%BE%D0%B6%D0%B8%D0%B4%D0%B0%D1%82%D1%8C-%D0%BE%D1%82-%D0%BD%D0%B0%D1%81">Политика компании digfusion</a></b>`,
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
								text: `№${serviceNum} • ${
									catalogOfServicesText[serviceNum - 1].price
								}р`,
								callback_data: `${
									dataAboutСertainRequest &&
									dataAboutСertainRequest.serviceNum == serviceNum
										? `myRequest`
										: `warningСonsultationOnService${serviceNum}`
								}`,
							},
							{
								text: `⬇️`,
								callback_data: "nextServiceNum",
							},
						],
						[
							{
								text: `${
									dataAboutСertainRequest &&
									dataAboutСertainRequest.serviceNum == serviceNum
										? `${
												dataAboutСertainRequest
													? `❗Ваша заявка №${dataAboutСertainRequest.requestId} 🕑`
													: ""
											}`
										: `Создать заявку на №${serviceNum}💭`
								}`,
								callback_data: `${
									dataAboutСertainRequest &&
									dataAboutСertainRequest.serviceNum == serviceNum
										? `myRequest`
										: `warningСonsultationOnService${serviceNum}`
								}`,
							},
						],
						[
							{ text: "⬅️В меню", callback_data: "exit" },
							{
								text: "Идеи 💡",
								callback_data: "ideasForProjects",
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

async function ideasForProjects(chatId) {
	const dataAboutUser = usersData.find((obj) => obj.chatId == chatId);

	dataAboutUser.userAction = "ideasForProjects";
	try {
		await bot.editMessageText(
			`<b><i>💭 Идеи для проектов 💡</i></b>\n\nМы представили <b><i>небольшой</i> список идей для наших услуг:\n\n1. ${catalogOfServicesText[0].serviceName}</b> - <a href="https://t.me/${BotName}/?start=catalogOfServices1">к услуге</a><b><blockquote>Примеры реализации:\n• Опрос пользователей\n• Проведение тестирования\n• Регистрации на мероприятия\n• Ответы на часто-задаваемы вопросы\n• Сбор отзывов клиентов\n• Заявки на консультацию</blockquote>\n2. ${catalogOfServicesText[1].serviceName}</b> - <a href="https://t.me/${BotName}/?start=catalogOfServices2">к услуге</a><b><blockquote>Примеры реализации:\n• Регистрации с напоминаниями\n• Объявления о событиях\n• Рассылки для компаний\n• Сбор любой инфоромации</blockquote>\n3. ${catalogOfServicesText[2].serviceName}</b> - <a href="https://t.me/${BotName}/?start=catalogOfServices3">к услуге</a><b><blockquote>Примеры реализации:\n• Автоматизации бизнес-процессов\n• Просмотр услуг компании\n• Мини интернет магазин\n• Мини онлайн школа\n• Учебные задания</blockquote>\n\nМы очень надеемся, </b>что хотя бы одна из идей <b>привлекла вас</b> к <b>нашим услугам!</b> ☺️`,
			{
				parse_mode: "html",
				chat_id: chatId,
				message_id: usersData.find((obj) => obj.chatId == chatId).messageId,
				disable_web_page_preview: true,
				reply_markup: {
					inline_keyboard: [
						[
							{
								text: "Каталог услуг 🛒",
								callback_data: "catalogOfServices",
							},
						],
						[
							{ text: "⬅️В меню", callback_data: "exit" },
							{ text: "Обсудить 💭", callback_data: "consultation" },
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

async function consultationOnService(chatId, stageNum, serviceNum) {
	const dataAboutUser = usersData.find((obj) => obj.chatId == chatId);

	try {
		switch (stageNum) {
			case 1:
				await bot.editMessageText(
					`<b>${
						dataAboutUser.login
					},</b> вы выбрали <b>услугу №${serviceNum}:\n\n${serviceNum}. ${
						catalogOfServicesText[serviceNum - 1].serviceName
					}\n</b><blockquote><b>Подробнее:</b> ${
						catalogOfServicesText[serviceNum - 1].moreAbout
					}${
						catalogOfServicesText[serviceNum - 1].lifeTime
							? `\n\n<b>Действует:</b> ${
									catalogOfServicesText[serviceNum - 1].lifeTime
								}`
							: ``
					}${
						catalogOfServicesText[serviceNum - 1].executionDate
							? `\n\n<b>Срок выполнения:</b> ${
									catalogOfServicesText[serviceNum - 1].executionDate
								} ⌛`
							: ``
					}\n\n<b>Цена:</b> ${
						catalogOfServicesText[serviceNum - 1].priceSentence
					} 💰</blockquote>\n\n${
						dataAboutUser.requestsData &&
						dataAboutUser.requestsData.find((obj) => obj.isActive)
							? `<b>❗Ранее,</b> вы выбирали <b>услугу №${
									dataAboutUser.requestsData.find(
										(obj) => obj.isActive
									).serviceNum
								} "${
									catalogOfServicesText[
										dataAboutUser.requestsData.find(
											(obj) => obj.isActive
										).serviceNum - 1
									].serviceName
								}".</b>\n\n<b><a href="https://telegra.ph/digfusion--Politika-08-08#%D0%A7%D1%82%D0%BE-%D0%B2%D1%8B-%D0%BC%D0%BE%D0%B6%D0%B5%D1%82%D0%B5-%D0%BE%D0%B6%D0%B8%D0%B4%D0%B0%D1%82%D1%8C-%D0%BE%D1%82-%D0%BD%D0%B0%D1%81">Политика компании digfusion</a></b>\n<i>Нажимая «Получить!», вы соглашаетесь со всеми требованиями и положениями digfusion!</i>\n\nХотите ли <b>изменить свой выбор</b> и <b>получить консультацию</b> по новой услуге? 🤔`
							: `<b><a href="https://telegra.ph/digfusion--Politika-08-08#%D0%A7%D1%82%D0%BE-%D0%B2%D1%8B-%D0%BC%D0%BE%D0%B6%D0%B5%D1%82%D0%B5-%D0%BE%D0%B6%D0%B8%D0%B4%D0%B0%D1%82%D1%8C-%D0%BE%D1%82-%D0%BD%D0%B0%D1%81">Политика компании digfusion</a></b>\n<i>Нажимая «Получить!», вы соглашаетесь со всеми требованиями и положениями digfusion!</i>\n\nВы <b>действительно</b> хотите получить <b>консультацию по этой услуге?</b> 🤔`
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
										text: "⬅️Назад",
										callback_data: "catalogOfServices",
									},
									{
										text: "Получить! ✅",
										callback_data: `consultationOnService${serviceNum}`,
									},
								],
							],
						},
					}
				);
				break;
			case 2:
				if (
					dataAboutUser.requestsData &&
					dataAboutUser.requestsData.find((obj) => obj.isActive)
				)
					dataAboutUser.requestsData.at(-1).isActive = false;

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
										usersData[i].requestsData[j].requestId === rndId
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
					serviceNum: dataAboutUser.selectedService,

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

					requestId: rndId,
					isActive: true,
				});

				await bot.editMessageText(
					`<b>Ваша <a href="https://t.me/${BotName}/?start=myRequest">заявка №${rndId}</a></b> находится <b>в обработке! 🕑</b>\n\n<b>Вы</b> можете написать <b>нам напрямую</b> или <b>дождаться</b> нашей <b>связи с вами! 😉</b>`,
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
										text: "Написать напрямую 💭",
										callback_data: "consultation",
									},
								],
								[
									{ text: "⬅️В меню", callback_data: "exit" },
									{
										text: "К заявке🪪",
										callback_data: "myRequest",
									},
								],
							],
						},
					}
				);
				++systemData.newRequestsToday;

				//! НАПОМИНАНИЕ АДМИНУ О ЗАЯВКЕ

				await bot
					.sendMessage(
						jackId,
						`<b>Давид, поступила</b> заявка на <b>услугу №${dataAboutUser.selectedService}❗\n\nОт: <a href="tg://user?id=${dataAboutUser.chatId}">${dataAboutUser.login}</a> • <code>${dataAboutUser.chatId}</code>\n\nОтветить на нее сразу? 🧐</b>`,
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
				dataAboutUser.requestsData &&
				dataAboutUser.requestsData.find((obj) => obj.isActive)
					? `\n\n<b>❕Скопируйте</b> номер <b>вашей заявки:</b> <code>№${
							dataAboutUser.requestsData.find((obj) => obj.isActive)
								.requestId
						}</code>`
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
								text: `Чат с поддержкой 💭`,
								url: "https://t.me/digfusionsupport",
							},
						],
						[
							{ text: "⬅️В меню", callback_data: "exit" },
							{ text: "Каталог 🛒", callback_data: "catalogOfServices" },
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

	let ourProjectsInfo = [
		// {
		// 	nameLink: `Цифровичок 🤖`,
		// 	botName: "digschbot",
		// 	moreAboutText: `Цифровой школьный помощник, цель которого — улучшить взаимодействие учеников с учебным процессом. Это альтернатива школьному порталу, лишённая недостатка в полезных функциях, и реализованная в более удобном формате для использования.`,
		// 	serviceName: `${catalogOfServicesText[2].serviceName} - <a href="https://t.me/${BotName}/?start=catalogOfServices3">к услуге</a>\n\n<b>Цена:</b> ${catalogOfServicesText[2].priceSentence}`,
		// },
		{
			nameLink: `digfusion | услуги ☑️`,
			botName: "digfusionbot",
			moreAboutText: `Да, это наш бот-консультант. Серьёзная работа с данными, автоматизация бизнес-процесса, множество сложных разделов. Убедитесь в этом сами, ведь сейчас вы читаете текст этого бота! 😉`,
			serviceName: `${catalogOfServicesText[2].serviceName} - <a href="https://t.me/${BotName}/?start=catalogOfServices2">к услуге</a>\n\n<b>Цена:</b> ${catalogOfServicesText[2].priceSentence}`,
		},
		{
			nameLink: `Алгебравичок 🧮`,
			botName: "digmathbot",
			moreAboutText: `Личный репититор, генерирующий арифметические задачки по вашему уровню знаний. Прекрасно подходит для закрепления материала и поддержания счётных навыков в форме.`,
			serviceName: `${catalogOfServicesText[2].serviceName} - <a href="https://t.me/${BotName}/?start=catalogOfServices3">к услуге</a>\n\n<b>Цена:</b> ${catalogOfServicesText[2].priceSentence}`,
		},
		{
			nameLink: `Спортивичок 🏀`,
			botName: "digjudgebot",
			moreAboutText: `Идеальный партнер для спортивных состязаний! Он будет отслеживать и записывать счет матча, впоследствии предоставляя подробную информацию о партиях, счете, времени игры и многом другом.`,
			serviceName: `${catalogOfServicesText[1].serviceName} - <a href="https://t.me/${BotName}/?start=catalogOfServices2">к услуге</a>\n\n<b>Цена:</b> ${catalogOfServicesText[1].priceSentence}`,
		},
		{
			nameLink: `Never Finished 🏅`,
			botName: "neverfinishedbot",
			moreAboutText: `Инструмент для развития самодисциплины! Веди учет своих целей и достижений, сохраняй важные мысли и следи за хорошими привычками. Начни сейчас и стань лучше вместе с Never Finished!`,
			serviceName: `${catalogOfServicesText[1].serviceName} - <a href="https://t.me/${BotName}/?start=catalogOfServices2">к услуге</a>\n\n<b>Цена:</b> ${catalogOfServicesText[1].priceSentence}`,
		},
		{
			nameLink: `Опросничок❓`,
			botName: "digformsbot",
			moreAboutText: `Клиент для проведения опросов среди пользователей по различным тематикам. Активен только в период проведения опросов.`,
			serviceName: `${catalogOfServicesText[0].serviceName} - <a href="https://t.me/${BotName}/?start=catalogOfServices1">к услуге</a>\n\n<b>Цена:</b> ${catalogOfServicesText[0].priceSentence}`,
		},
		// {
		// 	nameLink: `Тестировичок ⚙️`,
		// 	botName: "-",
		// 	moreAboutText: `Тестовый бот для тестирования обновлений — незаменимый помощник любого проекта. Не несет за собой смысла без разрешения на его использование. Ссылку на него, к сожалению, размещать неконфиденциально!`,
		// 	serviceName: `Различные\n\n<b>Цена:</b> Нет`,
		// },
		// {
		// 	nameLink: `Отладовичок 📊`,
		// 	botName: "digconsolebot",
		// 	moreAboutText: `Отладочный бот для получения терминальных данных по всем созданным проектам, об ошибках в работе и действиях пользователей. Не несет за собой смысла без разрешения на его использование.`,
		// 	serviceName: `${catalogOfServicesText[0].serviceName} - <a href="https://t.me/${BotName}/?start=catalogOfServices1">к услуге</a>\n\n<b>Цена:</b> ${catalogOfServicesText[0].priceSentence}`,
		// },
	];

	try {
		dataAboutUser.userAction = "ourProjectsList";

		await bot.editMessageText(
			`<b><i>🛠️ Наши работы 📱</i></b>\n\n${
				projectNum == 0
					? `В списке ниже представлены <b>приложения нашей компании</b> и несколько <b>заказов от наших клиентов! 🛍️</b><i>\n\n(Некоторые проекты не размещены, по просьбе заказчиков они остались в их правах)</i>\n\nВыберите любой <b>проект</b> ниже, чтобы просмотреть <b>подробности</b> и <b>опробовать функционал! 😉</b>`
					: `Проект: <b>${
							ourProjectsInfo[projectNum - 1].nameLink
						}\n\nПодробнее:</b><blockquote><b>Для чего:</b> ${
							ourProjectsInfo[projectNum - 1].moreAboutText
						}\n\n<b>Услуга:</b> ${
							ourProjectsInfo[projectNum - 1].serviceName
						}</blockquote>\n\n${
							ourProjectsInfo[projectNum - 1].botName != "-"
								? ourProjectsInfo[projectNum - 1].botName ==
									"digfusionbot"
									? `<b>Вы уже в этом боте! 🤗</b>`
									: `<b><a href = "https://t.me/${
											ourProjectsInfo[projectNum - 1].botName
										}">Опробывать функционал</a></b>`
								: `<b>Функционал недоступен 🫤</b>`
						}`
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
										? "• digfusion | услуги ☑️ •"
										: "digfusion | услуги ☑️"
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
										? "• Алгебравичок 🧮 •"
										: "Алгебравичок 🧮"
								}`,
								callback_data: `${
									projectNum == 2 ? "-" : "ourProjectsList2"
								}`,
							},
							{
								text: `${
									projectNum == 3
										? "• Спортивичок 🏀 •"
										: "Спортивичок 🏀"
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
										? "• Never Finished 🏅 •"
										: "Never Finished 🏅 "
								}`,
								callback_data: `${
									projectNum == 4 ? "-" : "ourProjectsList4"
								}`,
							},
							{
								text: `${
									projectNum == 5
										? "• Опросничок ❓ •"
										: "Опросничок ❓"
								}`,
								callback_data: `${
									projectNum == 5 ? "-" : "ourProjectsList5"
								}`,
							},
						],
						// [
						// 	{
						// 		text: `${
						// 			projectNum == 6
						// 				? "• Тестировичок ⚙️ •"
						// 				: "Тестировичок ⚙️"
						// 		}`,
						// 		callback_data: `${
						// 			projectNum == 6 ? "-" : "ourProjectsList6"
						// 		}`,
						// 	},
						// 	{
						// 		text: `${
						// 			projectNum == 7
						// 				? "• Отладовичок 📊 •"
						// 				: "Отладовичок 📊"
						// 		}`,
						// 		callback_data: `${
						// 			projectNum == 7 ? "-" : "ourProjectsList7"
						// 		}`,
						// 	},
						// ],
						[
							{
								text: `⬅️В меню`,
								callback_data: "exit",
							},
							{
								text: `Отзывы 📧`,
								callback_data: "feedbacksList",
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

async function moreAboutUs(chatId, numOfStage = 1) {
	const dataAboutUser = usersData.find((obj) => obj.chatId == chatId);

	try {
		dataAboutUser.userAction = "moreAboutUs";

		// <b>История основания</b> нашей компании <b>необычна</b> и <b>оригинальна,</b> она лежит <b>на поверхности, никаких тайн! 😉</b>\n\n
		await bot.editMessageText(
			`<b><i>👥 О нас • ${
				numOfStage == 1
					? `Преимущества 🏆`
					: numOfStage == 2
						? "О компании ℹ️"
						: numOfStage == 3
							? "Политика компании 📖"
							: ``
			}</i></b>\n\n${
				numOfStage == 1
					? `<b>Ключевые преимущества</b> нашей компании <b>перед другими,</b> с которыми вам <b>гарантированы</b> самые <b>выгодные условия:</b>${
							moreAboutUsText[numOfStage - 1]
						}<b>\n<a href="https://t.me/digfusion">digfusion | инфо</a> • <a href="https://t.me/digfusionsupport">digfusion | поддержка</a></b>`
					: numOfStage == 2
						? `Компания <b><i>digfusion</i></b> - <b>начинающий стартап</b> в сфере услуг и ваш <b>надежный</b> партнер в области <b>разработки чат-ботов!</b> 😉\n\n${
								moreAboutUsText[numOfStage - 1]
							}\n\nПросмотреть <b>«Почему именно вам стоит иметь чат-бота для своих потребностей»</b> можно в нашем <b>Telegram канале! 🤗\n\n<a href="https://t.me/digfusion">digfusion | инфо</a> • <a href="https://t.me/digfusionsupport">digfusion | поддержка</a></b>`
						: numOfStage == 3
							? `${
									moreAboutUsText[numOfStage - 1]
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
									numOfStage == 1
										? `• Преимущества 🏆 •`
										: "Преимущества 🏆"
								}`,
								callback_data: `${
									numOfStage == 1 ? `-` : "moreAboutUs1"
								}`,
							},
						],
						[
							{
								text: `${
									numOfStage == 2
										? `• О компании ℹ️ •`
										: "О компании ℹ️"
								}`,
								callback_data: `${
									numOfStage == 2 ? `-` : "moreAboutUs2"
								}`,
							},
							{
								text: `${
									numOfStage == 3 ? `• Политика 📖 •` : "Политика 📖"
								}`,
								callback_data: `${
									numOfStage == 3 ? `-` : "moreAboutUs3"
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
				} • ${
					usersData.find(
						(user) =>
							user.feedbacksData &&
							user.feedbacksData.find(
								(feedback) => feedback.feedbackId == feedbackId
							)
					).userStatus
				}\n\n№${dataAboutFeedback.serviceNum} "${
					catalogOfServicesText[dataAboutFeedback.serviceNum - 1]
						.serviceName
				}" - <a href="https://t.me/${BotName}/?start=catalogOfServices${
					dataAboutFeedback.serviceNum
				}">к услуге</a></b>${
					dataAboutFeedback.productLink
						? `\n\n<b>Продукт:</b> <a href="${dataAboutFeedback.productLink}">Просмотр продукта</a>`
						: ``
				}\n\n<b>Текст отзыва:</b>\n<i>"${
					dataAboutFeedback.feedbackText
				}</i>"\n\n<b>Рейтинговая оценка:</b> ${
					dataAboutFeedback.opinionRating
				}</blockquote>\n<b>${dataAboutFeedback.creationTime}</b> - ${
					dataAboutFeedback.creationDate
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
										(chatId == jackId || chatId == qu1z3xId) &&
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
										dataAboutUser.userAction == "feedbacksList1"
											? "feedbacksList"
											: dataAboutUser.userAction == "feedbacksList3"
												? "unverifiedFeedbacksAdmin"
												: "feedbacksList",
								},
								{
									text:
										(chatId == jackId || chatId == qu1z3xId) &&
										dataAboutFeedback.isVerified
											? `Скрыть 🤷‍♂️`
											: "",
									callback_data: `unverifiedFeedbackWithId${feedbackId}`,
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
					if (
						dataAboutUser.feedbacksData &&
						dataAboutUser.feedbacksData.length > 0
					) {
						dataAboutUser.feedbacksData =
							dataAboutUser.feedbacksData.filter((obj) => obj.isCreated);
					}

					count = 0;
					countOfLists = 1;
					text = ["", "", "", "", "", "", "", "", "", ""];

					allFeedbacksData = [];
					usersData.forEach((user) => {
						if (user.feedbacksData)
							user.feedbacksData.forEach((feedback) => {
								allFeedbacksData.push(feedback);
							});
					});

					if (allFeedbacksData)
						for (let i = allFeedbacksData.length - 1; i >= 0; i--) {
							const dataAboutUserСertainFeedback = usersData.find(
								(user) =>
									user.feedbacksData &&
									user.feedbacksData.find(
										(feedback) =>
											feedback.feedbackId ==
											allFeedbacksData[i].feedbackId
									)
							);

							if (count % 3 == 0 && count != 0) {
								++countOfLists;
							}

							if (allFeedbacksData[i].isVerified) {
								count++;
								text[countOfLists - 1] += `<b>${count}. ${
									allFeedbacksData[i].from
								} • ${
									dataAboutUserСertainFeedback.userStatus
								}\n</b>Услуга<b> №${allFeedbacksData[i].serviceNum} ${
									allFeedbacksData[i].isVerified
										? ``
										: `</b>- на проверке 🔎<b>`
								}\nТекст:</b><i> "${truncateString(
									allFeedbacksData[i].feedbackText,
									100
								)}" - ${
									allFeedbacksData[i].opinionRating
								}</i>\n<b><a href="https://t.me/${BotName}/?start=feedbackWithId${
									allFeedbacksData[i].feedbackId
								}">Подробнее об отзыве</a></b>\n\n`;
							}
						}

					dataAboutUser.userAction = "feedbacksList1";

					await bot.editMessageText(
						`<b><i>👥 Отзывы клиентов 📧\n\n${
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
													count % 10 >= 2 && count % 10 <= 4
														? "отзыва"
														: ``
												}`
									}`
						}</i></b>\n\n${
							text[dataAboutUser.supportiveCount - 1]
								? `${
										text[dataAboutUser.supportiveCount - 1]
									}<b><i>Все отзывы соответствуют требованиям.</i></b>`
								: `Пока ни одного отзыва..🤷‍♂️`
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
												countOfLists > 1
													? dataAboutUser.supportiveCount > 1
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
													? text[dataAboutUser.supportiveCount]
														? "➡️"
														: "🚫"
													: "",
											callback_data: text[
												dataAboutUser.supportiveCount
											]
												? "nextPage"
												: "-",
										},
									],
									[
										{
											text: `${
												dataAboutUser.feedbacksData
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
										{ text: "⬅️В меню", callback_data: "exit" },
										{
											text: "Оставить ✍️",
											callback_data: "writeFeedbacks",
										},
									],
								],
							},
						}
					);
					break;
				case 2:
					let dataAboutUserFeedbacks = null;
					if (dataAboutUser.feedbacksData)
						dataAboutUserFeedbacks = dataAboutUser.feedbacksData || null;

					count = 0;
					countOfLists = 1;
					text = ["", "", "", "", "", "", "", "", "", "", "", "", "", ""];

					if (dataAboutUserFeedbacks)
						for (let i = 0; i < dataAboutUserFeedbacks.length; i++) {
							if (count % 3 == 0 && count != 0) {
								++countOfLists;
							}

							count++;
							text[countOfLists - 1] += `<b>${count}. ${
								dataAboutUserFeedbacks[i].from
							} • Услуга №${dataAboutUserFeedbacks[i].serviceNum} ${
								dataAboutUserFeedbacks[i].isVerified ? `` : `🔎`
							}\nТекст: </b><i>"${truncateString(
								dataAboutUserFeedbacks[i].feedbackText,
								100
							)}" - ${
								dataAboutUserFeedbacks[i].opinionRating
							}</i>\n<b><a href="https://t.me/${BotName}/?start=feedbackWithId${
								dataAboutUserFeedbacks[i].feedbackId
							}">Подробнее об отзыве</a></b>\n\n`;
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
													count % 10 >= 2 && count % 10 <= 4
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
							message_id: usersData.find((obj) => obj.chatId == chatId)
								.messageId,
							disable_web_page_preview: true,
							reply_markup: {
								inline_keyboard: [
									[
										{
											text:
												countOfLists > 1
													? dataAboutUser.supportiveCount > 1
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
													? text[dataAboutUser.supportiveCount]
														? "➡️"
														: "🚫"
													: "",
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
								} • Услуга №${allFeedbacksData[i].serviceNum} ${
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
													count % 10 >= 2 && count % 10 <= 4
														? "отзыва"
														: ``
												}`
									}`
						}</b>\n\n${
							text != "" ? `${text}` : `Все отзывы уже проверены! 😉`
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
										{ text: "⬅️В меню", callback_data: "adminMenu" },
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

	let dataAboutFeedback = null;
	if (dataAboutUser.feedbacksData)
		dataAboutFeedback = dataAboutUser.feedbacksData.find(
			(obj) => obj.feedbackId == dataAboutUser.currentFeedbackId
		);

	try {
		switch (stageNum) {
			case 1:
				if (dataAboutUser.canWriteFeedbacks) {
					dataAboutUser.userAction = "writeFeedbacks1";
				}

				await bot.editMessageText(
					`<b><i>📧 Создание отзыва ✍️</i></b>\n\n${
						dataAboutUser.requestsData
							? !dataAboutUser.canWriteFeedbacks &&
								dataAboutUser.requestsData.find((obj) => obj.isActive)
								? `<b>${
										dataAboutUser.login
									},</b> отзывы оставляются <b>после получения</b> заказа❗\n\n<b><a href="https://t.me/${BotName}/?start=myRequest">Ваша заявка №${
										dataAboutUser.requestsData.at(-1).requestId
									}</a></b>`
								: dataAboutUser.canWriteFeedbacks
									? `Напишите ваше мнение о полученном заказе, на <b>услугу №${
											dataAboutUser.requestsData.at(-1).serviceNum
										} "${
											catalogOfServicesText[
												dataAboutUser.requestsData.at(-1)
													.serviceNum - 1
											].serviceName
										}"! 😊\n\nПримечание:</b>\n<i>Пожалуйста, оставьте отзыв с разумным размером, будьте вежливы и излагайте информацию исключительно по теме, которая в дальнейшем поможет сотням клиентов! 🙏</i>`
									: ``
							: !dataAboutUser.requestsData
								? `<b>${dataAboutUser.login},</b> отзывы оставляются <b>после получения</b> заказа❗\n\n<b><a href="https://t.me/${BotName}/?start=catalogOfServices1">Выбрать услугу</a></b>`
								: `--`
					}`,
					{
						parse_mode: "html",
						chat_id: chatId,
						message_id: usersData.find((obj) => obj.chatId == chatId)
							.messageId,
						disable_web_page_preview: true,
						reply_markup: {
							inline_keyboard: [
								[{ text: "⬅️Назад", callback_data: "feedbacksList" }],
							],
						},
					}
				);
				break;
			case 2:
				dataAboutUser.userAction = "writeFeedbacks2";

				await bot.editMessageText(
					`<b><i>📧 Создание отзыва ✍️\n\nВаш отзыв:</i></b><blockquote><b>${
						dataAboutUser.login
					} • Услуга №${
						dataAboutUser.requestsData
							? dataAboutUser.requestsData.at(-1).serviceNum
							: 0
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
						dataAboutFeedback.opinionRating
							? dataAboutFeedback.productLink
								? `Вы действительно хотите опубликовать ваш отзыв? 🤔`
								: `По желанию, добавьте ссылку на ваш продукт!\n\nПример:\n<code>https://t.me/никнейм_бота</code>`
							: `Оцените полученный продукт шкалой ниже!`
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
											dataAboutFeedback.opinionRating
												? "Опубликовать отзыв ✅"
												: ``
										}`,
										callback_data: `sendMyFeedback`,
									},
								],

								[
									{ text: "⬅️Назад", callback_data: "feedbacksList" },
									{
										text: `Удалить❌`,
										callback_data: `feedbacksList`,
									},
								],
							],
						},
					}
				);
				break;
			case 3:
				dataAboutUser.userAction = "writeFeedbacks3";

				await bot.editMessageText(
					`<b>Спасибо</b> за ваш <b>фидбек, ${dataAboutUser.login}! 😊</b>\n\n<b>Мы очень ценим ваше мнение! ❤️</b>\n\nОтзыв отправлен <b>на проверку!</b> 😉`,
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
											dataAboutUser.feedbacksData
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
									{ text: "⬅️Назад", callback_data: "feedbacksList" },
									{ text: "Еще ✍️", callback_data: "writeFeedbacks" },
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
										: dataAboutUser.requestsData.length >= 10
											? "10%"
											: dataAboutUser.requestsData.length < 3
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
						? dataAboutUser.feedbacksData.filter((obj) => obj.isVerified)
								.length
						: "0"
				}${
					dataAboutUser.feedbacksData
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
										dataAboutUser.requestsData &&
										dataAboutUser.requestsData.at(-1).isActive
											? `❗Ваша заявка №${
													dataAboutUser.requestsData.at(-1)
														.requestId
												} 🕑`
											: dataAboutUser.requestsData &&
												  !dataAboutUser.requestsData.at(-1)
														.isActive
												? `Последняя заявка №${
														dataAboutUser.requestsData.at(-1)
															.requestId
													} 🔎`
												: ""
									}`,
									callback_data: "myRequest",
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
											? "Сбросить❌"
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
				catalogOfServicesText.find((obj) => obj.firstPrice)
					? `<i>Скидки суммируются с текущими скидками на услуги!</i>`
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
							{ text: "⬅️Назад", callback_data: "settings" },
							{ text: "Каталог 🛒", callback_data: "catalogOfServices" },
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

	if (dateNowHHNN < 1200 && dateNowHHNN >= 600) textToSayHello = "Доброе утро";
	else if (dateNowHHNN < 1700 && dateNowHHNN >= 1200)
		textToSayHello = "Добрый день";
	else if (dateNowHHNN < 2200 && dateNowHHNN >= 1700)
		textToSayHello = "Добрый вечер";
	else if (dateNowHHNN >= 2200 || dateNowHHNN < 600)
		textToSayHello = "Доброй ночи";

	let textToSayHelloForEnd = "";
	if (dateNowHHNN < 1200 && dateNowHHNN >= 600)
		textToSayHelloForEnd = "Доброго дня";
	else if (dateNowHHNN < 1700 && dateNowHHNN >= 1200)
		textToSayHelloForEnd = "Доброго дня";
	else if (dateNowHHNN < 2200 && dateNowHHNN >= 1700)
		textToSayHelloForEnd = "Доброго вечера";
	else if (dateNowHHNN >= 2200 || dateNowHHNN < 600)
		textToSayHelloForEnd = "Доброй ночи";

	try {
		let dataAboutClient;
		if (clientChatId)
			dataAboutClient = usersData.find((obj) => obj.chatId == clientChatId);

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
				message_id: usersData.find((obj) => obj.chatId == chatId).messageId,
				disable_web_page_preview: true,
				reply_markup: {
					inline_keyboard: [
						[
							{
								text:
									textNum == 1 ? `• Приветсвие 👋 •` : `Приветсвие 👋`,
								callback_data: "dialogBuilder1",
							},
						],
						[
							{
								text: textNum == 2 ? `• О нас ℹ️ •` : `О нас ℹ️`,
								callback_data: "dialogBuilder2",
							},
							{
								text: textNum == 3 ? `• Услуги 🛒 •` : `Услуги 🛒`,
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
								text: textNum == 5 ? `• Оплата 💰 •` : `Оплата 💰`,
								callback_data: "dialogBuilder5",
							},
							{
								text: textNum == 6 ? `• Отзыв 📧 •` : `Отзыв 📧`,
								callback_data: "dialogBuilder6",
							},
						],
						[
							{
								text: textNum == 7 ? `• Прощание 🫂 •` : `Прощание 🫂`,
								callback_data: "dialogBuilder7",
							},
						],
						[
							{
								text: `${
									dataAboutСertainRequest ? `К клиенту 👤` : ``
								}`,
								url: `tg://user?id=${clientChatId}`,
							},
							{
								text: `${
									dataAboutСertainRequest &&
									dataAboutСertainRequest.requestsData
										? `К заявке 🧑‍💻`
										: ``
								}`,
								callback_data: `${
									dataAboutСertainRequest &&
									dataAboutСertainRequest.requestsData
										? `requestWithId${
												dataAboutСertainRequest.requestsData.at(-1)
													.requestId
											}`
										: `-`
								}`,
							},
						],
						[
							{ text: "⬅️В меню", callback_data: "exit" },
							{
								text: `${
									dataAboutСertainRequest ? `К текстам 📖` : ``
								}`,
								callback_data: `dialogBuilder0`,
							},
						],
					],
				},
			}
		);
		// }
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
										allRequestsData.filter((obj) => obj.isActive)
											.length != 0
											? `❗Заявки (${
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
									text: "Услуги 💰",
									callback_data: "editCatalogOfServicesAdmin",
								},
							],
							[
								{
									text: "Статистика 📊",
									callback_data: "statisticListAdmin",
								},
							],
							[
								{ text: "Алерты 📣", callback_data: "alertsAdmin1" },
								{
									text: `Отзывы ${
										allFeedbacksData &&
										allFeedbacksData.filter(
											(obj) => !obj.isVerified && obj.isCreated
										).length > 0
											? `(${
													allFeedbacksData.filter(
														(obj) =>
															!obj.isVerified && obj.isCreated
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
	dataAboutRequestForUser = false
) {
	const dataAboutUser = usersData.find((obj) => obj.chatId == chatId);

	try {
		if (dataAboutRequestForUser) {
			let dataAboutСertainRequest;
			if (dataAboutUser.requestsData)
				dataAboutСertainRequest = dataAboutUser.requestsData.at(-1);

			await bot.editMessageText(
				`<b><i>🧑‍💻 Ваша заявка • <code>№${
					dataAboutСertainRequest.requestId
				}</code> 🪪</i>\n\nНа услугу №${
					dataAboutСertainRequest.serviceNum
				}:\n</b><blockquote><b>${dataAboutСertainRequest.serviceNum}. ${
					catalogOfServicesText[dataAboutСertainRequest.serviceNum - 1]
						.serviceName
				} - <a href="https://t.me/${BotName}/?start=catalogOfServices${
					dataAboutСertainRequest.serviceNum
				}">к услуге</a>\n\nПодробнее:</b> ${
					catalogOfServicesText[dataAboutСertainRequest.serviceNum - 1]
						.moreAbout
				}${
					catalogOfServicesText[dataAboutСertainRequest.serviceNum - 1]
						.lifeTime
						? `\n\n<b>Действует:</b> ${
								catalogOfServicesText[
									dataAboutСertainRequest.serviceNum - 1
								].lifeTime
							}`
						: ``
				}${
					catalogOfServicesText[dataAboutСertainRequest.serviceNum - 1]
						.executionDate
						? `\n\n<b>Срок выполнения:</b> ${
								catalogOfServicesText[
									dataAboutСertainRequest.serviceNum - 1
								].executionDate
							} ⌛`
						: ``
				}\n\n<b>Цена:</b> ${
					catalogOfServicesText[dataAboutСertainRequest.serviceNum - 1]
						.priceSentence
				} 💰</blockquote>\n\nСтатус: <b>${
					dataAboutСertainRequest.isActive
						? "Обрабатывается.. 🕑"
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
									text: dataAboutСertainRequest.isActive
										? `Сменить услугу 🔃`
										: "Оставить отзыв ✍️",
									callback_data: dataAboutСertainRequest.isActive
										? `catalogOfServices`
										: "writeFeedbacks",
								},
							],
							[
								{
									text: "Связь 💭",
									callback_data: `consultation`,
								},
								{
									text: dataAboutСertainRequest.isActive
										? `Удалить ❌`
										: `Каталог 🛒`,
									callback_data: dataAboutСertainRequest.isActive
										? `deleteRequestQuestionWithId${dataAboutСertainRequest.requestId}`
										: `catalogOfServices`,
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
									let dataAboutUserСertainRequest = usersData.find(
										(obj) =>
											obj.requestsData &&
											obj.requestsData.find(
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
										}">${
											dataAboutUserСertainRequest.login
										}</a> • <code>${
											dataAboutUserСertainRequest.chatId
										}</code> 🕑\n${allRequestsData[i].serviceNum}. ${
											catalogOfServicesText[
												allRequestsData[i].serviceNum - 1
											].serviceName
										}</b>\n<b>${allRequestsData[i].creationTime}</b> - ${
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
								let dataAboutUserСertainRequest = usersData.find(
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
										allRequestsData[i].isActive ? "🕑" : "✅"
									}\n${allRequestsData[i].serviceNum}. ${
										catalogOfServicesText[
											allRequestsData[i].serviceNum - 1
										].serviceName
									}</b>\n<b>${allRequestsData[i].creationTime}</b> - ${
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
							? "Новые❗"
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
												count % 10 >= 2 && count % 10 <= 4
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
						message_id: usersData.find((obj) => obj.chatId == chatId)
							.messageId,
						disable_web_page_preview: true,
						reply_markup: {
							inline_keyboard: [
								[
									{
										text:
											countOfLists > 1
												? dataAboutUser.supportiveCount > 1
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
												? listText[dataAboutUser.supportiveCount]
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
											allRequestsData.filter((obj) => obj.isActive)
												? `(${
														allRequestsData.filter(
															(obj) => obj.isActive
														).length
													} шт) `
												: ""
										}❗${listNum == 1 ? "•" : ""}`,
										callback_data: "requestsList1",
									},
								],
								[
									{ text: "⬅️Назад", callback_data: "adminMenu" },
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

					await bot.editMessageText(
						`<b><i>🧑‍💻 Заявка • <code>${requestId}</code> 🪪</i></b>\n\n<b><a href="tg://user?id=${
							dataAboutUserСertainRequest.chatId
						}">${dataAboutUserСertainRequest.login}</a></b> • <code>${
							dataAboutUserСertainRequest.chatId
						}</code>\n<b>Услуга:</b>\n<blockquote><b>${
							dataAboutСertainRequest.serviceNum
						}. ${
							catalogOfServicesText[
								dataAboutСertainRequest.serviceNum - 1
							].serviceName
						}\nЦена: </b>${
							catalogOfServicesText[
								dataAboutСertainRequest.serviceNum - 1
							].priceSentence
						}</blockquote>\n<b>${
							dataAboutСertainRequest.creationTime
						}</b> - ${dataAboutСertainRequest.creationDate} ${
							dataAboutСertainRequest.isActive ? "🕗" : `✅`
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
													: "🕑"
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
												dataAboutUser.userAction == "requestsList2"
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
						message_id: usersData.find((obj) => obj.chatId == chatId)
							.messageId,
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
										callback_data: `${
											dataAboutUser.userAction == "registryList1"
												? `registryList1`
												: dataAboutUser.userAction ==
													  "dialogBuilder"
													? `dialogBuilder1`
													: "-"
										}`,
									},
									// {
									// 	text: "Клиент 👤",
									// 	url: `tg://user?id=${dataAboutClient.chatId}`,
									// },
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
						text = ["", "", "", "", "", "", "", "", "", ""];
						for (let i = 0; i < usersData.length; i++) {
							if (count % 10 == 0 && count != 0) {
								++countOfLists;
							}

							if (usersData[i].registrationIsOver) {
								count++;
								text[countOfLists - 1] +=
									`<b>${count}. ${usersData[i].login} • <code>${usersData[i].chatId}</code>\n</b>Статус:<b> ${usersData[i].userStatus}\n<a href="https://t.me/${BotName}/?start=moreAboutUserWithId${usersData[i].chatId}">Подробнее о клиенте</a></b>\n\n`;
							}
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
														count % 10 >= 2 && count % 10 <= 4
															? "клиента"
															: ``
													}`
										}`
							}</i></b>\n\n${
								text[dataAboutUser.supportiveCount - 1]
									? `${
											text[dataAboutUser.supportiveCount - 1]
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
														? dataAboutUser.supportiveCount > 1
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
														? text[dataAboutUser.supportiveCount]
															? "➡️"
															: "🚫"
														: "",
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
					systemData.requestsAllTime += usersData[i].requestsData.length;
				if (usersData[i].feedbacksData)
					systemData.feedbacksAllTime += usersData[i].feedbacksData.length;
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
											systemData.newClientsToday % 10 >= 2 &&
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
											systemData.activityToday % 10 >= 2 &&
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
											systemData.newRequestsToday % 10 >= 2 &&
											systemData.newRequestsToday % 10 <= 4
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
											systemData.newFeedbacksToday % 10 >= 2 &&
											systemData.newFeedbacksToday % 10 <= 4
												? "отзыва"
												: ``
										}`
							}`
				}\n\n<b>За все время:</b>\n<b>• ${
					usersData.filter((obj) => obj.registrationIsOver).length
				} / ${usersData.length}</b> клиентов\n<b>• ${
					systemData.activityAllTime
				}</b> ${
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
											systemData.activityAllTime % 10 >= 2 &&
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
											systemData.requestsAllTime % 10 >= 2 &&
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
											systemData.feedbacksAllTime % 10 >= 2 &&
											systemData.feedbacksAllTime % 10 <= 4
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

async function editCatalogOfServices(chatId) {
	if (chatId == jackId || chatId == qu1z3xId) {
		const dataAboutUser = usersData.find((obj) => obj.chatId == chatId);

		try {
			await bot.editMessageText(
				`<b><i>✏️ Редактирование услуг 🛒</i></b>\n\n`,
				{
					parse_mode: "html",
					chat_id: chatId,
					message_id: usersData.find((obj) => obj.chatId == chatId)
						.messageId,
					disable_web_page_preview: true,
					reply_markup: {
						inline_keyboard: [
							[{ text: "⬅️Назад", callback_data: "adminMenu" }],
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

async function alertsAdmin(
	chatId,
	alertId,
	numOfStage = 1,
	blockingOfSending = true
) {
	if (chatId == jackId || chatId == qu1z3xId) {
		const dataAboutUser = usersData.find((obj) => obj.chatId == chatId);

		let dataAboutAlert;
		if (systemData.alertsData)
			dataAboutAlert = systemData.alertsData.find(
				(obj) => obj.alertId == dataAboutUser.currentAlertId
			);

		dataAboutUser.userAction = `alertsAdmin${numOfStage}`;

		try {
			if (alertId && systemData.alertsData) {
				dataAboutUser.currentAlertId = alertId;
				numOfStage = 2;

				dataAboutAlert = systemData.alertsData.find(
					(obj) => obj.alertId == dataAboutUser.currentAlertId
				);
			}

			switch (numOfStage) {
				case 1:
					await bot.editMessageText(
						`<i><b>📧 Алерты 📣\n\n❗${usersData.length} ${
							(usersData.length % 100 >= 5 &&
								usersData.length % 100 <= 20) ||
							(usersData.length % 10 >= 5 &&
								usersData.length % 10 <= 9) ||
							usersData.length % 10 == 0
								? "пользователей</b> получат"
								: `${
										usersData.length % 10 == 1
											? "пользователь</b> получит"
											: `${
													usersData.length % 10 >= 2 &&
													usersData.length % 10 <= 4
														? "пользователя</b> получат"
														: `</b>`
												}`
									}`
						} обьявление❗</i>\n\n<b>Отправьте ниже текст или фото! 😉</b>`,
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
											text:
												dataAboutAlert &&
												dataAboutUser.currentAlertId &&
												!dataAboutAlert.wasSend
													? `Черновик ↩️`
													: dataAboutAlert &&
														  dataAboutUser.currentAlertId &&
														  dataAboutAlert.wasSend
														? `Предыдущий ↩️`
														: ``,
											callback_data: `alertWithId${dataAboutUser.currentAlertId}`,
										},
									],
								],
							},
						}
					);
					break;
				case 2:
					await bot.editMessageText(
						`<b><i>📧 Алерты • Редактирование 📣</i>\n\nДанные об обьявлении:</b><blockquote><b>Текст: ${
							dataAboutAlert.text
								? `✅ ("</b>${truncateString(
										dataAboutAlert.text,
										10
									)}<b>") <a href="https://t.me/${BotName}/?start=alertsAdminResetText">❌</a>`
								: "</b>Нет<b>"
						}\nФорматирование: ${
							dataAboutAlert.entities
								? `✅ (${dataAboutAlert.entities.length}шт) <a href="https://t.me/${BotName}/?start=alertsAdminResetEntities">❌</a>`
								: "</b>Нет<b>"
						} \nМедиа: ${
							dataAboutAlert.media
								? `✅ (Id:</b>${truncateString(
										dataAboutAlert.media,
										10
									)}<b>) <a href="https://t.me/${BotName}/?start=alertsAdminResetMedia">❌</a>`
								: "</b>Нет<b>"
						}\nКнопки: ${
							dataAboutAlert.buttons
								? `✅ (${
										dataAboutAlert.buttons.flat().length
									}шт) <a href="https://t.me/${BotName}/?start=alertsAdminResetButtons">❌</a>`
								: "</b>Нет<b>"
						}</b></blockquote>\n<b>Формат данных:</b><blockquote><b>• Медиа</b>\nФотография, не файлом\n\n<b>• Кнопки</b>\n<code>Надпись ^ callback_data ; Выйти ^ exit\nНаш сайт ^ https://digfusion.ru</code></blockquote><b>${
							!dataAboutAlert.text && !dataAboutAlert.media
								? `❗Не хватает данных для отправки ⛔️`
								: `Отправляйте/редактируйте данные для обьявления! 🤗`
						}</b>`,
						{
							chat_id: chatId,
							parse_mode: "HTML",
							message_id: usersData.find((obj) => obj.chatId == chatId)
								.messageId,
							disable_web_page_preview: true,
							reply_markup: {
								inline_keyboard: [
									[
										{
											text:
												!dataAboutAlert.text &&
												!dataAboutAlert.media
													? "Нельзя ⛔️"
													: "Отправить пробное 🔎",
											callback_data:
												!dataAboutAlert.text &&
												!dataAboutAlert.media
													? "-"
													: "alertsAdmin3",
										},
									],
									[
										{
											text: "⬅️Выйти",
											callback_data:
												!dataAboutAlert.text &&
												!dataAboutAlert.media
													? "deleteAlert"
													: "alertsAdmin5",
										},
										{
											text: blockingOfSending
												? ``
												: !dataAboutAlert.text &&
													  !dataAboutAlert.media
													? "Нельзя ⛔️"
													: `Отправить ✅`,
											callback_data:
												!dataAboutAlert.text &&
												!dataAboutAlert.media
													? "-"
													: "alertsAdmin4",
										},
									],
								],
							},
						}
					);
					break;
				case 3:
					sendAlert(chatId, dataAboutAlert, true);

					alertsAdmin(chatId, null, 2, false);
					break;
				case 4:
					dataAboutAlert.wasSend = true;
					dataAboutAlert.isCreated = true;

					for (let i = 0; i < usersData.length; i++) {
						// if (usersData[i].chatId != chatId)
						sendAlert(usersData[i].chatId, dataAboutAlert);
					}

					await bot.editMessageText(
						`<b><i>📧 Алерты 📣</i>\n\nСообщение успешно отправлено! 😉</b>`,
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
										{ text: "Еще ➕", callback_data: "alertsAdmin1" },
									],
								],
							},
						}
					);

					break;

				case 5:
					await bot.editMessageText(
						`<b><i>📧 Алерты • Редактирование 📣</i>\n\nТекущее данные:</b><blockquote><b>Текст: ${
							dataAboutAlert.text
								? `✅ ("</b>${truncateString(
										dataAboutAlert.text,
										10
									)}<b>")`
								: "</b>Нет<b>"
						}\nФорматирование: ${
							dataAboutAlert.entities
								? `✅ (${dataAboutAlert.entities.length}шт)`
								: "</b>Нет<b>"
						} \nМедиа: ${
							dataAboutAlert.media
								? `✅ (Id:</b>${truncateString(
										dataAboutAlert.media,
										10
									)}<b>)`
								: "</b>Нет<b>"
						}\nКнопки: ${
							dataAboutAlert.buttons
								? `✅ (${dataAboutAlert.buttons.flat().length}шт)`
								: "</b>Нет<b>"
						}</b></blockquote>Вы действительно хотите <b>покинуть режим редактирования</b> и <b>сохранить внесенные изменения в черновике?</b> 🤔`,
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
											text: "Удалить ❌",
											callback_data: `deleteAlert`,
										},
										{
											text: "Сохранить 💾",
											callback_data: `adminMenu`,
										},
									],
									[
										{
											text: "⬅️Вернуться",
											callback_data: `alertsAdmin2`,
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
}

async function sendAlert(
	certainChatId,
	dataAboutAlert = null,
	deleteButtonIsActive = false
) {
	const dataAboutUser = usersData.find((obj) => obj.chatId == certainChatId);
	try {
		let buttons;

		console.log(buttons);
		if (dataAboutAlert) {
			buttons = dataAboutAlert.buttons || [];

			if (deleteButtonIsActive)
				buttons.push([
					{
						text: "❌",
						callback_data: `-`,
					},
				]);

			if (dataAboutAlert.media) {
				await bot
					.sendPhoto(dataAboutUser.chatId, dataAboutAlert.media, {
						caption: dataAboutAlert.text || null,
						caption_entities: dataAboutAlert.entities,
						// show_caption_above_media: false,
						disable_web_page_preview: true,
						reply_markup: {
							inline_keyboard: buttons || [[]],
						},
					})
					.then((message) => {
						dataAboutUser.messageIdOther = message.message_id;
					});
			} else {
				await bot
					.sendMessage(dataAboutUser.chatId, dataAboutAlert.text, {
						entities: dataAboutAlert.entities || null,
						disable_web_page_preview: true,
						reply_markup: {
							inline_keyboard: buttons || [[]],
						},
					})
					.then((message) => {
						dataAboutUser.messageIdOther = message.message_id;
					});
			}
		}
	} catch (error) {
		console.log(error);
		sendDataAboutError(certainChatId, `${String(error)}`);
	}
}

async function StartAll() {
	if (TOKEN == config.TOKENs[1]) {
		BotName = "digfusionbot";
		console.log("1");

		get(dataRef).then((snapshot) => {
			if (snapshot.exists()) {
				const dataFromDB = snapshot.val();
				usersData = dataFromDB.usersData || [];
				systemData = dataFromDB.systemData || [];
				console.log("DB is got");
			}
		});
	} else if (TOKEN == config.TOKENs[0]) {
		BotName = "digtestingbot";

		// if (
		// 	fs.readFileSync("supportiveDB.json") != "[]" &&
		// 	fs.readFileSync("supportiveDB.json") != ""
		// ) {
		// let dataFromDB = JSON.parse(fs.readFileSync("supportiveDB.json"));
		// НЕ ИСПОЛЬЗУЕТСЯ
		// }
	}

	bot.on("contact", (message) => {
		const chatId = message.chat.id;
		const dataAboutUser = usersData.find((obj) => obj.chatId == chatId);

		if (dataAboutUser && dataAboutUser.userAction == "firstMeeting4") {
			dataAboutUser.phoneNumber = message.contact.phone_number;
			menuHome(chatId);

			try {
				bot.deleteMessage(chatId, dataAboutUser.messageIdOther);
				bot.deleteMessage(chatId, message.message_id);
			} catch (error) {}
		}
	});

	bot.on("photo", (message) => {
		const chatId = message.chat.id;
		const fileId = message.photo[message.photo.length - 1].file_id; // file_id самой большой версии фото
		const text = message.caption || null;
		const entities = message.caption_entities || null;

		const dataAboutUser = usersData.find((obj) => obj.chatId == chatId);

		if (dataAboutUser) {
			if (
				(dataAboutUser.userAction == "alertsAdmin1" ||
					dataAboutUser.userAction == "alertsAdmin2") &&
				(chatId == jackId || chatId == qu1z3xId)
			) {
				let dataAboutAlert;
				if (systemData.alertsData)
					dataAboutAlert = systemData.alertsData.find(
						(obj) => obj.alertId == dataAboutUser.currentAlertId
					);

				if (dataAboutAlert) {
					dataAboutAlert.media = fileId;
				} else {
					let isUnique = false;
					while (!isUnique) {
						rndId = Math.floor(Math.random() * 9999);
						isUnique = true;

						if (systemData.alertsData) {
							for (let i = 0; i < systemData.alertsData.length; i++) {
								if (systemData.alertsData[i])
									if (systemData.alertsData[i].alertId === rndId) {
										isUnique = false;
										break;
									}
								if (!isUnique) break;
							}
						} else break;
					}
					if (!systemData.alertsData) {
						systemData.alertsData = [];
					}

					systemData.alertsData.push({
						text: text || null,
						entities: entities || null,
						media: fileId,
						buttons: null,

						creationDate: `${new Date()
							.getDate()
							.toString()
							.padStart(2, "0")}.${(new Date().getMonth() + 1)
							.toString()
							.padStart(2, "0")}.${(new Date().getFullYear() % 100)
							.toString()
							.padStart(2, "0")}`,
						date: new Date(),

						wasSend: false,
						isCreated: false,
						alertId: rndId,
					});

					dataAboutUser.currentAlertId = rndId;
				}

				alertsAdmin(chatId, null, 2);
			}
		}

		bot.deleteMessage(chatId, message.message_id);
	});

	bot.on("text", async (message) => {
		const chatId = message.chat.id;
		let text = message.text;
		const entities = message.entities;

		let dataAboutUser = usersData.find((obj) => obj.chatId == chatId);

		try {
			if (!usersData.find((obj) => obj.chatId === chatId)) {
				usersData.push({
					chatId: chatId,
					login: message.from.first_name,
					phoneNumber: null,
					userStatus: "Клиент 🙂",
					messageId: null,
					userAction: null,
					canWriteFeedbacks: false,

					requestsData: [],
					feedbacksData: [],

					messageIdOther: null,
					telegramFirstName: message.from.first_name,
					supportiveCount: null,
					supportiveCount2: null,
					registrationIsOver: false,
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
					dataAboutUser.userAction == "firstMeeting3" &&
					Array.from(text)[0] != "/"
				) {
					dataAboutUser.login = text;

					firstMeeting(chatId, 4);
				}

				if (
					dataAboutUser.userAction == "alertsAdmin2" &&
					(chatId == jackId || chatId == qu1z3xId) &&
					text.includes("^")
				) {
					let buttons = text
						.split("\n")
						.map((row) => row.trim())
						.filter((row) => row.length > 0)
						.map((row) => {
							const buttonsRows = [];
							row.split(";").forEach((col) => {
								const [text, callback_data] = col
									.split("^")
									.map((item) => item.trim());
								if (text && callback_data) {
									if (callback_data.includes(`https://`)) {
										buttonsRows.push({
											text: text,
											url: callback_data,
										});
									} else {
										buttonsRows.push({
											text: text,
											callback_data: callback_data,
										});
									}
								}
							});
							return buttonsRows;
						});
					if (systemData.alertsData)
						systemData.alertsData.find(
							(obj) => obj.alertId == dataAboutUser.currentAlertId
						).buttons = buttons;

					alertsAdmin(chatId, null, 2);
				}
				if (
					(dataAboutUser.userAction == "alertsAdmin1" ||
						dataAboutUser.userAction == "alertsAdmin2") &&
					(chatId == jackId || chatId == qu1z3xId) &&
					Array.from(text)[0] != "/" &&
					!text.includes("^")
				) {
					let dataAboutAlert;
					if (systemData.alertsData)
						dataAboutAlert = systemData.alertsData.find(
							(obj) => obj.alertId == dataAboutUser.currentAlertId
						);

					if (dataAboutAlert) {
						dataAboutAlert.text = text;
						dataAboutAlert.entities = entities;
					} else {
						let isUnique = false;
						while (!isUnique) {
							rndId = Math.floor(Math.random() * 9999);
							isUnique = true;

							if (systemData.alertsData) {
								for (let i = 0; i < systemData.alertsData.length; i++) {
									if (systemData.alertsData[i])
										if (systemData.alertsData[i].alertId === rndId) {
											isUnique = false;
											break;
										}
									if (!isUnique) break;
								}
							} else break;
						}

						if (!systemData.alertsData) {
							systemData.alertsData = [];
						}

						systemData.alertsData.push({
							text: text,
							entities: entities,
							media: null,
							buttons: null,

							creationDate: `${new Date()
								.getDate()
								.toString()
								.padStart(2, "0")}.${(new Date().getMonth() + 1)
								.toString()
								.padStart(2, "0")}.${(new Date().getFullYear() % 100)
								.toString()
								.padStart(2, "0")}`,
							date: new Date(),

							wasSend: false,
							isCreated: false,
							alertId: rndId,
						});

						dataAboutUser.currentAlertId = rndId;
					}

					alertsAdmin(chatId, null, 2);
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
					match = text.match(/^\/start catalogOfServices(\d+)$/);

					catalogOfServices(chatId, match[1]);
				}

				if (text.includes("/start consultationOnService")) {
					match = text.match(
						/^\/start consultationOnService(\d+)ForUserWithName(.*)$/
					);

					dataAboutUser.selectedService = match[1];
					dataAboutUser.login = match[2];

					if (!dataAboutUser.messageId) {
						await bot
							.sendMessage(chatId, "ㅤ")
							.then(
								(message) =>
									(dataAboutUser.messageId = message.message_id)
							);
					}

					consultationOnService(chatId, 1, match[1]);
				}

				if (
					dataAboutUser.userAction == "writeFeedbacks1" &&
					Array.from(text)[0] != "/"
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
											usersData[i].feedbacksData[j].feedbackId ===
											rndId
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

					if (dataAboutUser.feedbacksData && dataAboutUser.requestsData)
						dataAboutUser.feedbacksData.push({
							from: dataAboutUser.login,
							serviceNum: dataAboutUser.requestsData.at(-1).serviceNum,

							opinionRating: null,
							feedbackText: text,
							productLink: null,

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
							isCreated: false,
						});

					++systemData.newFeedbacksToday;

					dataAboutUser.currentFeedbackId = rndId;

					writeFeedbacks(chatId, 2);
				}

				if (
					dataAboutUser.userAction == "writeFeedbacks2" &&
					text.includes("https://t.me/") &&
					Array.from(text)[0] != "/" &&
					dataAboutUser.feedbacksData
				) {
					dataAboutUser.feedbacksData.find(
						(obj) => obj.feedbackId == dataAboutUser.currentFeedbackId
					).productLink = text;

					writeFeedbacks(chatId, 2);
				}

				if (text.includes("/start feedbackWithId")) {
					match = text.match(/^\/start feedbackWithId(\d+)$/);

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
					dataAboutUser.requestsData &&
					dataAboutUser.requestsData.find(
						(obj) => obj.requestId == parseInt(text)
					)
				) {
					requestsList(chatId, null, parseInt(text));
				}

				if (text.includes("/start requestWithId")) {
					match = text.match(/^\/start requestWithId(\d+)$/);

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
					match = text.match(/^\/start moreAboutUserWithId(\d+)$/);

					registryList(chatId, null, parseInt(match[1]));
				}

				if (text.includes(`/start alertsAdminReset`)) {
					match = text.match(/^\/start alertsAdminReset(.*)$/);

					let dataAboutAlert;
					if (systemData.alertsData)
						dataAboutAlert = systemData.alertsData.find(
							(obj) => obj.alertId == dataAboutUser.currentAlertId
						);

					switch (match[1]) {
						case "Text":
							console.log(2);

							dataAboutAlert.text = null;
							dataAboutAlert.entities = null;
							break;
						case "Entities":
							dataAboutAlert.entities = null;
							break;
						case "Media":
							dataAboutAlert.media = null;
							break;
						case "Buttons":
							dataAboutAlert.buttons = null;
							break;
					}

					await alertsAdmin(chatId, null, 2);
				}

				if (
					text == "/catalog" ||
					text == "/consultation" ||
					text == "/profile"
				) {
					if (dataAboutUser.registrationIsOver) {
						switch (text) {
							case "/catalog":
								catalogOfServices(chatId);

								break;
							case "/consultation":
								consultation(chatId);
								break;
							case "/profile":
								settings(chatId);
								break;
						}
					} else {
					}
				}

				switch (text) {
					case "/start":
						try {
							bot.deleteMessage(chatId, dataAboutUser.messageId);
						} catch (error) {}
						await bot
							.sendMessage(chatId, "ㅤ")
							.then(
								(message) =>
									(dataAboutUser.messageId = message.message_id)
							);

						firstMeeting(chatId);
						break;
					case "/restart":
						try {
							bot.deleteMessage(chatId, dataAboutUser.messageId);
						} catch (error) {}

						await bot
							.sendMessage(chatId, "ㅤ")
							.then(
								(message) =>
									(dataAboutUser.messageId = message.message_id)
							);

						if (
							chatId == jackId ||
							chatId == qu1z3xId ||
							dataAboutUser.registrationIsOver
						) {
							menuHome(chatId);
						} else if (!dataAboutUser.registrationIsOver) {
							firstMeeting(chatId);
						}
						break;
					case "Ые":
					case "ые":
					case "st":
					case "St":
						if (chatId == jackId || chatId == qu1z3xId) {
							try {
								bot.deleteMessage(chatId, dataAboutUser.messageId);
							} catch (error) {}

							await bot
								.sendMessage(chatId, "ㅤ")
								.then(
									(message) =>
										(dataAboutUser.messageId = message.message_id)
								);
							menuHome(chatId);
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

			bot.deleteMessage(chatId, message.message_id);

			++systemData.activityToday;
			++systemData.activityAllTime;

			if (chatId != qu1z3xId && chatId != jackId) {
				sendDataAboutText(chatId, dataAboutUser.login, text);
			}
		} catch (error) {
			console.log(error);
			sendDataAboutError(chatId, dataAboutUser.login, `${String(error)}`);
		}
	});

	bot.on("callback_query", (query) => {
		const chatId = query.message.chat.id;
		const data = query.data;

		let dataAboutUser = usersData.find((obj) => obj.chatId == chatId);

		try {
			if (!dataAboutUser) {
				usersData.push({
					chatId: chatId,
					login: query.from.first_name,
					phoneNumber: null,
					userStatus: "Клиент 🙂",
					messageId: query.message.message_id,
					userAction: null,
					canWriteFeedbacks: false,

					requestsData: [],
					feedbacksData: [],

					messageIdOther: null,
					telegramFirstName: query.from.first_name,
					supportiveCount: null,
					supportiveCount2: null,
					registrationIsOver: false,
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

			if (
				dataAboutUser &&
				query.message.message_id != dataAboutUser.messageIdOther
			) {
				dataAboutUser.messageId = query.message.message_id;
			}

			if (dataAboutUser && !dataAboutUser.inBlackList) {
				if (data.includes("firstMeeting")) {
					match = data.match(/^firstMeeting(\d+)$/);

					firstMeeting(chatId, parseInt(match[1]));
				}

				if (
					data.includes("nextServiceNum") ||
					data.includes("previousServiceNum")
				) {
					match = data.match(/^(.*)ServiceNum$/);

					if (dataAboutUser.supportiveCount == 4 && match[1] == "next") {
						dataAboutUser.supportiveCount = 1;
					} else if (
						dataAboutUser.supportiveCount == 1 &&
						match[1] == "previous"
					) {
						dataAboutUser.supportiveCount = 4;
					} else {
						match[1] == "next"
							? dataAboutUser.supportiveCount++
							: match[1] == "previous"
								? dataAboutUser.supportiveCount--
								: "";
					}

					catalogOfServices(chatId, dataAboutUser.supportiveCount);
				}

				if (data.includes("warningСonsultationOnService")) {
					match = data.match(/^warningСonsultationOnService(\d+)$/);

					if (
						dataAboutUser.selectedService == parseInt(match[1]) &&
						dataAboutUser.requestsData &&
						dataAboutUser.requestsData.at(-1).isActive
					) {
						consultation(chatId);
					} else {
						consultationOnService(chatId, 1, parseInt(match[1]));
					}
				}

				if (data.includes("consultationOnService")) {
					match = data.match(/^consultationOnService(\d+)$/);

					dataAboutUser.selectedService = parseInt(match[1]);
					consultationOnService(chatId, 2);
				}

				if (data.includes("ourProjectsList")) {
					match = data.match(/^ourProjectsList(\d+)$/);

					ourProjectsList(chatId, parseInt(match[1]));
				}

				if (data.includes("moreAboutUs")) {
					match = data.match(/^moreAboutUs(\d+)$/);

					moreAboutUs(chatId, parseInt(match[1]));
				}

				if (data.includes("deleteFeedbackWithId")) {
					match = data.match(/^deleteFeedbackWithId(\d+)$/);

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
									(obj) => obj.feedbackId === parseInt(match[1])
								),
								1
							)
						);
					}

					feedbacksList(chatId, 1);
				}

				if (data.includes("unverifiedFeedbackWithId")) {
					match = data.match(/^unverifiedFeedbackWithId(\d+)$/);

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
					match = data.match(/^verifiedFeedbackWithId(\d+)$/);

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
				} else if (data.includes("setOpinionRating")) {
					match = data.match(/^setOpinionRating(\d+)$/);

					if (dataAboutUser.feedbacksData)
						dataAboutUser.feedbacksData.find(
							(obj) => obj.feedbackId == dataAboutUser.currentFeedbackId
						).opinionRating =
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
					match = data.match(/^dialogBuilder(\d+)$/);

					dialogBuilder(chatId, parseInt(match[1]));
				}

				if (data.includes("requestsList")) {
					match = data.match(/^requestsList(\d+)$/);

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
					match = data.match(/^requestWithId(\d+)$/);

					dataAboutUser.supportiveCount = 1;

					requestsList(chatId, null, parseInt(match[1]));
				}

				if (data.includes("deleteRequest")) {
					match = data.match(/^deleteRequest(.*)WithId(\d+)$/);

					let dataAboutСertainRequest;
					if (dataAboutUser.requestsData)
						dataAboutСertainRequest = dataAboutUser.requestsData.at(-1);

					if (match[1] == "Question")
						bot.editMessageText(
							`❗<b>${
								dataAboutUser.login
							}, ваша <a href="https://t.me/${BotName}/?start=myRequest">заявка №${
								dataAboutСertainRequest.requestId
							}</a> на услугу:\n\n${
								dataAboutСertainRequest.serviceNum
							}. ${
								catalogOfServicesText[
									dataAboutСertainRequest.serviceNum - 1
								].serviceName
							}\n</b><blockquote><b>Подробнее:</b> ${
								catalogOfServicesText[
									dataAboutСertainRequest.serviceNum - 1
								].moreAbout
							}\n\n<b>Цена:</b> ${
								catalogOfServicesText[
									dataAboutСertainRequest.serviceNum - 1
								].priceSentence
							} 💰</blockquote>\n\nВы <b>действительно</b> хотите <b><i>безвозвратно</i> удалить вашу заявку?</b> 🤔`,
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
											request.requestId == parseInt(match[2])
									)
							)
						) {
							dataAboutUserСertainRequest = usersData.find(
								(obj) =>
									obj.requestsData &&
									obj.requestsData.find(
										(request) =>
											request.requestId == parseInt(match[2])
									)
							);

							dataAboutUserСertainRequest.requestsData.splice(
								dataAboutUserСertainRequest.requestsData.indexOf(
									dataAboutUserСertainRequest.requestsData.find(
										(obj) => obj.requestId == parseInt(match[2])
									),
									1
								)
							);

							menuHome(chatId);
						}
					}
				}

				if (data.includes("buildDialogForUserWithId")) {
					match = data.match(/^buildDialogForUserWithId(\d+)$/);

					clientChatId = parseInt(match[1]);

					dialogBuilder(chatId, 1);
				}

				if (data.includes("toggleToActiveRequestWithId")) {
					if (chatId == jackId || chatId == qu1z3xId) {
						match = data.match(/^toggleToActiveRequestWithId(\d+)$/);

						const dataAboutUserСertainRequest = usersData.find(
							(obj) =>
								obj.requestsData &&
								obj.requestsData.find(
									(request) => request.requestId == parseInt(match[1])
								)
						);
						let dataAboutСertainRequest = null;
						if (dataAboutUserСertainRequest.requestsData)
							dataAboutСertainRequest =
								dataAboutUserСertainRequest.requestsData.find(
									(obj) => obj.requestId == parseInt(match[1])
								);

						dataAboutСertainRequest.isActive =
							!dataAboutСertainRequest.isActive;

						dataAboutUserСertainRequest.canWriteFeedbacks =
							!dataAboutСertainRequest.isActive;

						dataAboutUser.selectedService = null;

						if (!dataAboutСertainRequest.isActive) {
							bot.sendMessage(
								dataAboutUserСertainRequest.chatId,
								`<b>${dataAboutUserСertainRequest.login}, <a href="https://t.me/${BotName}/?start=myRequest">заявка №${dataAboutСertainRequest.requestId}</a> успешно обработана! ✅</b>\n\n<i>Пожалуйста, оставьте содержательный отзыв о полученой работе 🙏</i> \n\n<b>Спасибо вам за сотрудничество! ❤️</b>`,
								{
									parse_mode: "HTML",
									disable_web_page_preview: true,
									reply_markup: {
										inline_keyboard: [
											[
												{
													text: "Оставить отзыв ✍️",
													callback_data: "writeFeedbacks",
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
								bot.deleteMessage(
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
					match = data.match(/^(.*)BlackListUserWithId(\d+)$/);

					const dataAboutClient =
						usersData.find((obj) => obj.chatId == parseInt(match[2])) ||
						null;

					if (match[1] == "addTo") {
						dataAboutClient.inBlackList = true;
					} else if (match[1] == "deleteFrom") {
						dataAboutClient.inBlackList = false;
					}

					registryList(chatId, null, parseInt(match[2]));
				}

				if (data.includes("alertsAdmin")) {
					match = data.match(/^alertsAdmin(\d+)$/);

					alertsAdmin(chatId, null, parseInt(match[1]));
				}

				if (data.includes("alertWithId")) {
					match = data.match(/^alertWithId(\d+)$/);

					alertsAdmin(chatId, parseInt(match[1]));
				}

				switch (data) {
					case "exit":
						menuHome(chatId);
						break;
					case "catalogOfServices":
						dataAboutUser.supportiveCount = 1;
						catalogOfServices(chatId);
						break;
					case "ideasForProjects":
						ideasForProjects(chatId);
						break;
					case "consultation":
						consultation(chatId);
						break;
					case "":
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
						if (dataAboutUser.feedbacksData)
							dataAboutUser.feedbacksData.find(
								(obj) =>
									obj.feedbackId == dataAboutUser.currentFeedbackId
							).isCreated = true;

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
					case "":
						break;
					case "myRequest":
						requestsList(chatId, null, null, true);
						break;
					case "settings":
						settings(chatId);
						break;
					case "resetLogin":
						dataAboutUser.login = dataAboutUser.telegramFirstName;

						bot.answerCallbackQuery(query.id, {
							text: `Ваш сброшен на\n«${dataAboutUser.login}» 😉`,
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
					case "editCatalogOfServicesAdmin":
						editCatalogOfServices(chatId);
						break;
					case "":
						break;
					case "":
						break;
					case "":
						break;
					case "deleteAlert":
						if (
							systemData.alertsData.find(
								(obj) => obj.alertId == dataAboutUser.currentAlertId
							)
						) {
							systemData.alertsData.splice(
								systemData.alertsData.indexOf(
									systemData.alertsData.find(
										(obj) =>
											obj.alertId == dataAboutUser.currentAlertId
									),
									1
								)
							);

							dataAboutUser.currentAlertId = null;
							adminMenu(chatId);
						}
						break;
					case "deleteexcess":
						try {
							bot.deleteMessage(chatId, query.message.message_id);
						} catch (error) {}
						break;
				}

				if (query.message.message_id == dataAboutUser.messageIdOther) {
					try {
						bot.deleteMessage(chatId, query.message.message_id);
						dataAboutUser.messageIdOther = null;
					} catch (error) {}
				}
			} else if (dataAboutUser && dataAboutUser.inBlackList) {
				dataAboutUser.userAction = "inBlackList";

				bot.editMessageText(
					`<b>Похоже у вас больше нет доступа в общении с нами! ☹️\n\nЧтобы узнать подробнее причину блокировки, обратитесь в поддержку! 🗯️</b>`,
					{
						chat_id: chatId,
						message_id: usersData.find((obj) => obj.chatId == chatId)
							.messageId,
						parse_mode: "html",
						disable_web_page_preview: true,
						reply_markup: {
							inline_keyboard: [
								[
									{ text: "Обновить 🔄️", callback_data: "exit" },
									{
										text: "Связь ✍️",
										url: "https://t.me/digfusionsupport",
									},
								],
							],
						},
					}
				);
			}
			// else if (!dataAboutUser) {
			// 	bot.editMessageText(
			// 		`<b>Мы разве знакомы? 🤨\n</b>Мои системы вас не помнят...<b>\n\n<i>Иногда такое бывает, когда происходят масштабные обновления! ☹️</i>\n\n</b>Раз уж так произошло, давайте начнем все с <b>чистого листа!</b> Нажмите - <b>/start</b> 😉`,
			// 		{
			// 			chat_id: chatId,
			// 			message_id: query.message.message_id,
			// 			parse_mode: "html",
			// 			disable_web_page_preview: true,
			// 		}
			// 	);
			// }

			++systemData.activityToday;
			++systemData.activityAllTime;

			if (chatId != qu1z3xId && chatId != jackId) {
				sendDataAboutButton(chatId, dataAboutUser.login, data);
			}
		} catch (error) {
			console.log(error);
			sendDataAboutError(chatId, dataAboutUser.login, `${String(error)}`);
		}
	});

	cron.schedule(`0 */5 * * *`, function () {
		// Запись данных в базу данных
		try {
			if (TOKEN == config.TOKENs[1]) {
				set(dataRef, {
					usersData: usersData,
					systemData: systemData,
				});

				const dataToSend = {
					usersData,
					systemData,
				};

				sendDataAboutDataBase(dataToSend);
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

StartAll();
