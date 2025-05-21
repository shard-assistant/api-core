import { Injectable } from "@nestjs/common"

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
	constructor(readonly nodeService: NodeService) {
		super(nodeService)
		this.config = findNodeConfigById("ai")
	}

	async run(
		node: RuntimeNode,
		findSourcePortData: (nodeId: string, portId: string) => any
	) {
		const prompt = findSourcePortData(node.id, "prompt")
		const request = findSourcePortData(node.id, "request")

		const response = `AI Response to: ${request}\nUsing prompt: ${prompt}`

		return { response }
	}
}
