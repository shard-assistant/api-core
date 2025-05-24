import { Injectable, Logger } from "@nestjs/common"

import { AiService } from "@/ai/ai.service"
import { PromptSettings } from "@/ai/types/ai.types"

import { findNodeConfigById } from "../config/nodes.config"
import { NodeService } from "../node.service"
import { NodeHandler } from "../types/node-handler"
import { RuntimeNode } from "../types/node.types"

const LOGGER = new Logger("AINodeHandler")

@Injectable()
export class AINodeHandler extends NodeHandler<
	undefined,
	{
		response: string
	}
> {
	constructor(
		readonly nodeService: NodeService,
		readonly aiService: AiService
	) {
		super(nodeService)
		this.config = findNodeConfigById("ai")
	}

	async run(
		node: RuntimeNode,
		findSourcePortData: (
			nodeId: string,
			portId: string,
			dataType: string
		) => any
	) {
		try {
			const prompt = findSourcePortData(node.id, "prompt", "string")
			const request = findSourcePortData(node.id, "request", "string")

			const settings: PromptSettings = {
				token: node.storage.token,
				catalog: node.storage.catalog,
				temperature: node.storage.temperature,
				maxTokens: node.storage.maxTokens
			}

			const response = await this.aiService.fetchPrompt(
				prompt,
				request,
				settings
			)
			return {
				output: { response: response.result.alternatives[0].message.text },
				runtimeStorage: {}
			}
		} catch (error) {
			return {
				output: { response: error.message },
				runtimeStorage: {
					hasNotReady: true
				}
			}
		}
	}
}
