import { Injectable } from "@nestjs/common"

import { findNodeConfigById } from "../config/nodes.config"
import { NodeService } from "../node.service"
import { NodeHandler } from "../types/node-handler"
import { RuntimeNode } from "../types/node.types"

@Injectable()
export class TextNodeHandler extends NodeHandler<string, string> {
	constructor(readonly nodeService: NodeService) {
		super(nodeService)

		this.config = findNodeConfigById("text")
	}

	async run(
		node: RuntimeNode,
		_: (nodeId: string, portId: string, dataType: string) => any
	) {
		return {
			output: node.storage || "",
			runtimeStorage: {}
		}
	}
}
