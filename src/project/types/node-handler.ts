import { Connection } from "@prisma/__generated__"

import { NodeService } from "../node.service"

import { INode, RuntimeNode } from "./node.types"

export abstract class NodeHandler<StorageType, OutputType> {
	public config: INode

	constructor(readonly nodeService: NodeService) {}

	async getNode(nodeId: string) {
		return this.nodeService.findById(nodeId)
	}

	async getStorage(nodeId: string) {
		const node = await this.nodeService.findById(nodeId)

		return node.storage as StorageType
	}

	async saveStorage(nodeId: string, storage: StorageType) {
		await this.nodeService.setStorage(nodeId, storage)
	}

	abstract run(
		node: RuntimeNode,
		findSourcePortData: (nodeId: string, portId: string) => any
	): Promise<OutputType>
}
