import { Injectable, Logger } from "@nestjs/common"

import { findNodeConfigById } from "../config/nodes.config"
import { NodeService } from "../node.service"
import { NodeHandler } from "../types/node-handler"
import { RuntimeNode } from "../types/node.types"

const LOGGER = new Logger("IteratorHandler")

@Injectable()
export class IteratorHandler extends NodeHandler<
	undefined,
	{
		response: any
	}
> {
	constructor(readonly nodeService: NodeService) {
		super(nodeService)
		this.config = findNodeConfigById("iterator")
	}

	async run(
		node: RuntimeNode,
		findSourcePortData: (
			nodeId: string,
			portId: string,
			dataType: string
		) => any
	) {
		let data = []
		if (!node.runtimeStorage.data) {
			data = findSourcePortData(node.id, "data", "array")
			if (!Array.isArray(data)) {
				switch (typeof data) {
					case "string":
						data = JSON.parse(data)
						break
					default:
						data = [data]
				}
			}
		} else data = node.runtimeStorage.data

		const response = data.pop()

		return {
			output: {
				response
			},
			runtimeStorage: {
				data,
				end: data.length === 0
			}
		}
	}
}
