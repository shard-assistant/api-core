import { Injectable, Logger } from "@nestjs/common"

import { TelegramService } from "@/telegram/telegram.service"

import { findNodeConfigById } from "../config/nodes.config"
import { NodeService } from "../node.service"
import { NodeHandler } from "../types/node-handler"
import { RuntimeNode } from "../types/node.types"

type StorageType = {
	token: string
}

type OutputType = {
	messages: {
		message: string
		chatId: string
	}[]
}

const LOGGER = new Logger("TelegramMessageImportHandler")

@Injectable()
export class TelegramMessageImportHandler extends NodeHandler<
	StorageType,
	OutputType
> {
	constructor(
		readonly nodeService: NodeService,
		readonly telegramService: TelegramService
	) {
		super(nodeService)
		this.config = findNodeConfigById("telegramMessageImport")
	}

	async run(
		node: RuntimeNode,
		_: (nodeId: string, portId: string, dataType: string) => any
	) {
		const { token, keepUnread, limit } = node.storage
		const offset = node.storage.offset || 0

		const messages = await this.telegramService.getMessages({
			botToken: token,
			offset,
			limit
		})

		if (!keepUnread && messages.length > 0) {
			const maxUpdateId = Math.max(
				...messages.map((message) => message.update_id),
				offset - 1
			)

			await this.nodeService.setStorage(node.id, {
				...node.storage,
				offset: maxUpdateId + 1
			})
		}

		if (messages.length === 0)
			return {
				output: {
					messages: []
				},
				runtimeStorage: {}
			}

		return {
			output: {
				messages: messages.map((message) => ({
					chatId: message.message.chat.id.toString(),
					message: message.message.text
				}))
			},
			runtimeStorage: {}
		}
	}
}
