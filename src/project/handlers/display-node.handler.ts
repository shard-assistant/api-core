import { Injectable } from "@nestjs/common"

import { findNodeConfigById } from "../config/nodes.config"
import { NodeService } from "../node.service"
import { NodeHandler } from "../types/node-handler"
import { RuntimeNode } from "../types/node.types"

type DisplayStorage = {
	displayFormat: "text" | "json" | "html"
}

@Injectable()
export class DisplayNodeHandler extends NodeHandler<DisplayStorage, undefined> {
	constructor(readonly nodeService: NodeService) {
		super(nodeService)
		this.config = findNodeConfigById("display")
	}

	async run(
		node: RuntimeNode,
		findSourcePortData: (nodeId: string, portId: string) => any
	): Promise<any> {
		const data = findSourcePortData(node.id, "data")

		return data
	}
}
