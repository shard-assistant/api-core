import { Injectable, Logger } from "@nestjs/common"

import { findNodeConfigById } from "../config/nodes.config"
import { NodeService } from "../node.service"
import { NodeHandler } from "../types/node-handler"
import { RuntimeNode } from "../types/node.types"

const LOGGER = new Logger("AINodeHandler")

@Injectable()
export class EqualNodeHandler extends NodeHandler<
	undefined,
	{
		hasEqual: string | undefined
		hasNotEqual: string | undefined
	}
> {
	constructor(readonly nodeService: NodeService) {
		super(nodeService)
		this.config = findNodeConfigById("equal")
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
			const goal = findSourcePortData(node.id, "goal", "string")
			const value = findSourcePortData(node.id, "value", "string")

			const result = goal === value

			return {
				output: {
					hasEqual: result ? goal : undefined,
					hasNotEqual: !result ? goal : undefined
				},
				runtimeStorage: {}
			}
		} catch (error) {
			return {
				output: { hasEqual: undefined, hasNotEqual: undefined },
				runtimeStorage: {
					hasNotReady: true
				}
			}
		}
	}
}
