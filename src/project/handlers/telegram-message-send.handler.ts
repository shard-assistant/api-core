import { Injectable } from "@nestjs/common"

import { TelegramService } from "@/telegram/telegram.service"

import { findNodeConfigById } from "../config/nodes.config"
import { NodeService } from "../node.service"
import { NodeHandler } from "../types/node-handler"
import { RuntimeNode } from "../types/node.types"

type StorageType = {
	token: string
}

@Injectable()
export class TelegramMessageSendHandler extends NodeHandler<
	StorageType,
	undefined
> {
	constructor(
		readonly nodeService: NodeService,
		readonly telegramService: TelegramService
	) {
		super(nodeService)
		this.config = findNodeConfigById("telegramMessageSend")
	}

	async run(
		node: RuntimeNode,
		findSourcePortData: (
			nodeId: string,
			portId: string,
			dataType: string
		) => any,
		getAndClearSourcePortData: (nodeId: string, portId: string) => any
	) {
		try {
			const send = getAndClearSourcePortData(node.id, "send")
			const message = findSourcePortData(node.id, "message", "string")
			const chatId = findSourcePortData(node.id, "chatId", "string")

			if (!send || send.length === 0) {
				return {
					output: undefined,
					runtimeStorage: {
						hasNotReady: true
					}
				}
			}

			const { token } = node.storage

			await this.telegramService.sendMessage({
				botToken: token,
				chatId,
				message
			})

			return {
				output: undefined,
				runtimeStorage: {}
			}
		} catch (error) {
			return {
				output: undefined,
				runtimeStorage: {
					hasNotReady: true
				}
			}
		}
	}
}
