import { Logger } from "@nestjs/common"
import { Connection, Node } from "@prisma/__generated__"

import { findNodeConfigById, inputNodeTypes } from "./config/nodes.config"
import { NodeHandler } from "./types/node-handler"
import { RuntimeNode } from "./types/node.types"

const LOGGER = new Logger("GraphExecutor")

export class GraphExecutor {
	nodes: Map<string, RuntimeNode>
	connections: Connection[]
	handlerMap: Map<string, NodeHandler<any, any>>
	nextIterationNodes: Set<string>

	constructor(
		nodes: Node[],
		connections: Connection[],
		handlerMap: Map<string, NodeHandler<any, any>>
	) {
		this.nodes = new Map(
			nodes.map((node) => [
				node.id,
				{
					id: node.id,
					type: node.type,
					storage: node.storage,
					output: {},
					runtimeStorage: {}
				} as RuntimeNode
			])
		)
		this.connections = connections
		this.handlerMap = handlerMap
		this.nextIterationNodes = new Set(
			nodes
				.filter((node) => inputNodeTypes.includes(node.type))
				.map((node) => node.id)
		)
	}

	public hasNext() {
		return this.nextIterationNodes.size > 0
	}

	public async next() {
		const currentNodes = Array.from(this.nextIterationNodes)
		this.nextIterationNodes.clear()

		for (const nodeId of currentNodes) {
			const node = this.findNode(nodeId)
			if (!node) continue

			if (!this.validateConnections(node)) continue

			await this.process(node)
		}
	}

	public async process(node: RuntimeNode): Promise<boolean> {
		const handler = this.handlerMap.get(node.type)
		if (!handler) return false

		const { output, runtimeStorage } = await handler.run(
			node,
			this.findSourcePortData.bind(this)
		)
		if (!output) return false

		this.nodes.set(node.id, {
			...node,
			output,
			runtimeStorage
		})

		this.findTargetNodesIds(node.id).forEach((id) => {
			this.nextIterationNodes.add(id)
		})

		if (node.type === "iterator" && !runtimeStorage.end) {
			this.nextIterationNodes.add(node.id)
		}

		return true
	}

	public findSourcePortData(nodeId: string, portId: string, dataType: string) {
		const node = this.findNode(nodeId)
		if (!node) throw new Error(`Node ${nodeId} not found`)

		const connection = this.connections.find(
			(conn) => conn.targetNodeId === nodeId && conn.targetPort === portId
		)
		if (!connection)
			throw new Error(`Connection ${nodeId} -> ${portId} not found`)

		const sourceNode = this.findNode(connection.sourceNodeId)
		if (!sourceNode)
			throw new Error(`Source node ${connection.sourceNodeId} not found`)

		const portData = sourceNode.output[connection.sourcePort]
		if (!portData)
			throw new Error(
				`Port ${connection.sourcePort} not found on node ${connection.sourceNodeId}`
			)

		const nodeConfig = findNodeConfigById(sourceNode.type)
		const sourceDataType = nodeConfig.outputPorts.find(
			(port) => port.id === connection.sourcePort
		)?.dataType

		if (sourceDataType === dataType) {
			return portData
		} else {
			switch (sourceDataType) {
				case "string":
					switch (dataType) {
						default:
							return portData
					}
				case "array":
					switch (dataType) {
						case "string":
							return JSON.stringify(portData)
						default:
							return portData
					}
				default:
					return portData
			}
		}
	}

	findNode(nodeId: string) {
		return this.nodes.get(nodeId)
	}

	findConnection(connectionId: string) {
		return this.connections.find((conn) => conn.id === connectionId)
	}

	findTargetNodesIds(nodeId: string) {
		return this.connections
			.filter((conn) => conn.sourceNodeId === nodeId)
			.map((conn) => conn.targetNodeId)
	}

	private validateConnections(node: RuntimeNode): boolean {
		const nodeConfig = findNodeConfigById(node.type as any)
		if (!nodeConfig) return false

		for (const inputPort of nodeConfig.inputPorts) {
			const hasConnection = this.connections.some(
				(conn) =>
					conn.targetNodeId === node.id && conn.targetPort === inputPort.id
			)

			if (!hasConnection) return false
		}

		return true
	}
}
