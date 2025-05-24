import { Injectable, Logger } from "@nestjs/common"

import { findNodeConfigById } from "../config/nodes.config"
import { NodeService } from "../node.service"
import { NodeHandler } from "../types/node-handler"
import { RuntimeNode } from "../types/node.types"

const LOGGER = new Logger("ImportJsonNodeHandler")

const notFoundResponse = {
	output: {
		response: "Ключ не найден"
	},
	runtimeStorage: {}
}

@Injectable()
export class ImportJsonNodeHandler extends NodeHandler<
	undefined,
	{
		response: string
	}
> {
	constructor(readonly nodeService: NodeService) {
		super(nodeService)
		this.config = findNodeConfigById("importJson")
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
			const object = findSourcePortData(node.id, "object", "any")
			const key = node.storage.key || undefined

			if (!key && !object) return notFoundResponse
			if (Object.keys(object).length === 0) return notFoundResponse

			const child = object[key]

			let response: string
			if (typeof child === "object") response = JSON.stringify(child)
			else response = child.toString()

			return {
				output: { response },
				runtimeStorage: {}
			}
		} catch {
			return notFoundResponse
		}
	}
}
