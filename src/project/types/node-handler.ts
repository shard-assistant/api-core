import { NodeService } from "../node.service"

export abstract class NodeHandler<StorageType, NodeConfig extends INode> {
	public config: NodeConfig

	constructor(readonly nodeService: NodeService) {}

	async getNode(nodeId: string) {
		return this.nodeService.findById(nodeId)
	}

	async getStorage(nodeId: string) {
		const node = await this.nodeService.findById(nodeId)

		return node.storage as NodeStorage<StorageType, NodeConfig>
	}

	async saveStorage(
		nodeId: string,
		storage: NodeStorage<StorageType, NodeConfig>
	) {
		await this.nodeService.setStorage(nodeId, storage)
	}

	async getInputPort(nodeId: string, portId: string) {
		const port = this.config.inputPorts.find((port) => port.id === portId)
		if (!port) throw new Error(`Input port ${portId} not found`)

		const connection = await this.nodeService.findConnectionsByNodeIdAndPortId(
			nodeId,
			portId
		)

		if (!connection) throw new Error(`Input port ${portId} not connected`)

		const sourceNode = await this.nodeService.findById(connection.sourceNodeId)

		const storage = await this.getStorage(sourceNode.id)

		if (!storage.outputs[connection.sourcePort])
			throw new Error(`Source port data not found`)

		return storage.outputs[connection.sourcePort]
	}

	async setOutputPort(nodeId: string, portId: string, data: any) {
		const storage = await this.getStorage(nodeId)

		storage.outputs[portId] = data

		await this.saveStorage(nodeId, storage)
	}

	abstract run(nodeId: string): Promise<void>
}
