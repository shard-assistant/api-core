import { Injectable, Logger } from "@nestjs/common"

import { findNodeConfigById } from "../config/nodes.config"
import { NodeService } from "../node.service"
import { NodeHandler } from "../types/node-handler"
import { RuntimeNode } from "../types/node.types"

const LOGGER = new Logger("StorageNodeHandler")

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
		const storage: string[] =
			node.runtimeStorage.storage || node.storage.data || []
		const data = findSourcePortData(node.id, "add", "string")

		await this.nodeService.setStorage(node.id, { data: [...storage, data] })

		return {
			output: {},
			runtimeStorage: {
				storage: [...storage, data]
			}
		}
	}
}
