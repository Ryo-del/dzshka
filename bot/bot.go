package main

import (
	"log"

	tgbotapi "github.com/ilpy20/telegram-bot-api/v7" // <- форк
)

func main() {
	bot, err := tgbotapi.NewBotAPI("7582375690:AAHOzDEALtSjbiovqytc6cj0p1xwj_m_0nU")
	if err != nil {
		log.Panic(err)
	}

	u := tgbotapi.NewUpdate(0)
	u.Timeout = 60
	updates := bot.GetUpdatesChan(u)

	for update := range updates {
		// Обработка /start
		if update.Message != nil && update.Message.Text == "/start" {
			// Определяем WebApp
			webApp := tgbotapi.WebAppInfo{
				URL: "https://resilient-torte-d6b424.netlify.app",
			}

			// Создаём Inline кнопку
			button := tgbotapi.NewInlineKeyboardButtonWebApp("Открыть", webApp)

			// Кладём кнопку в разметку
			keyboard := tgbotapi.NewInlineKeyboardMarkup(
				tgbotapi.NewInlineKeyboardRow(button),
			)

			msg := tgbotapi.NewMessage(update.Message.Chat.ID, "Привет! Я — Dz Bot. Здесь ты можешь узнать своё домашнее задание. Теперь бот доступен и в формате Web App (кнопка ниже). Чтобы узнать больше о моих возможностях, введи команду /new.")
			msg.ReplyMarkup = keyboard
			bot.Send(msg)
		}

		if update.Message != nil && update.Message.Text == "/new" {
			msg := tgbotapi.NewMessage(update.Message.Chat.ID, "Devblog 0.1\n\n -обновление 1\n -обновление 2") // продолжить (дизайн в freefrom)
			bot.Send(msg)
		}
		// Когда WebApp присылает данные
		if update.Message != nil && update.Message.WebAppData != nil {
			data := update.Message.WebAppData.Data
			log.Printf("Получили: %s", data)
			bot.Send(tgbotapi.NewMessage(update.Message.Chat.ID, "Принял данные: "+data))
		}
	}
}
