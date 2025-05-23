import { Injectable } from "@nestjs/common"

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
		const messages = await this.telegramService.getMessages({
			botToken: token,
			keepUnread,
			limit
		})

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
