import { Injectable } from "@nestjs/common"

import { AiService } from "@/ai/ai.service"
import { PromptSettings } from "@/ai/types/ai.types"

import { findNodeConfigById } from "../config/nodes.config"
import { NodeService } from "../node.service"
import { NodeHandler } from "../types/node-handler"
import { RuntimeNode } from "../types/node.types"

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
		findSourcePortData: (nodeId: string, portId: string) => any
	) {
		const prompt = findSourcePortData(node.id, "prompt")
		const request = findSourcePortData(node.id, "request")

		const settings: PromptSettings = {
			token: node.storage.token,
			catalog: node.storage.catalog,
			temperature: node.storage.temperature,
			maxTokens: node.storage.maxTokens
		}

		try {
			const response = await this.aiService.fetchPrompt(
				prompt,
				request,
				settings
			)
			return { response: response.result.alternatives[0].message.text }
		} catch (error) {
			return { response: error.message }
		}
	}
}
