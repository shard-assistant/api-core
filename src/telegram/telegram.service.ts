import { Injectable } from "@nestjs/common"

@Injectable()
export class TelegramService {
	private async markAsRead(
		botToken: string,
		messageId: number,
		chatId: number
	) {
		const baseUrl = `https://api.telegram.org/bot${botToken}`
		await fetch(`${baseUrl}/viewMessages`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ chat_id: chatId, message_ids: [messageId] })
		})
	}

	async getMessages({
		botToken,
		keepUnread = true,
		offset = 0,
		limit = 100
	}: {
		botToken: string
		keepUnread?: boolean
		offset?: string | number
		limit?: string | number
	}) {
		const baseUrl = `https://api.telegram.org/bot${botToken}`
		const response = await fetch(
			`${baseUrl}/getUpdates?offset=${offset}&limit=${limit}&allowed_updates=["message"]`
		)
		const data = await response.json()
		const messages = data.result.filter(
			(update) => update.message && !update.message.is_read
		)

		if (!keepUnread) {
			for (const update of messages) {
				await this.markAsRead(
					botToken,
					update.message.message_id,
					update.message.chat.id
				)
			}
			return messages
		}
		return messages.slice(-limit)
	}
}
