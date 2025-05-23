import { Injectable, Logger } from "@nestjs/common"

import { findNodeConfigById } from "../config/nodes.config"
import { NodeService } from "../node.service"
import { NodeHandler } from "../types/node-handler"
import { RuntimeNode } from "../types/node.types"

const LOGGER = new Logger("DisplayNodeHandler")

type StorageStorage = {
	storage: string[]
}

@Injectable()
export class StorageNodeHandler extends NodeHandler<StorageStorage, undefined> {
	constructor(readonly nodeService: NodeService) {
		super(nodeService)
		this.config = findNodeConfigById("storage")
	}

	async run(
		node: RuntimeNode,
		findSourcePortData: (
			nodeId: string,
			portId: string,
			dataType: string
		) => any
	): Promise<any> {
		const data = findSourcePortData(node.id, "add", "string")
		const storage: string[] = node.storage || []

		this.nodeService.setStorage(node.id, [...storage, data])
	}
}
