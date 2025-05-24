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
	lastIterationNodes: string[] = []

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
		return (
			this.nextIterationNodes.size > 0 || this.lastIterationNodes.length > 0
		)
	}

	public async next() {
		const currentNodes =
			this.nextIterationNodes.size > 0
				? Array.from(this.nextIterationNodes)
				: [this.lastIterationNodes.pop()]

		if (this.nextIterationNodes.size === 0) {
			this.lastIterationNodes = []
		} else {
			this.nextIterationNodes.clear()
		}

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
			this.findSourcePortData.bind(this),
			this.getAndClearSourcePortData.bind(this)
		)
		if (!output) return false

		this.nodes.set(node.id, {
			...node,
			output,
			runtimeStorage
		})

		if (!runtimeStorage || !runtimeStorage.hasNotReady) {
			if (node.type === "equal") {
				const exclusionPorts = []
				if (output.hasEqual) exclusionPorts.push("hasNotEqual")
				else exclusionPorts.push("hasEqual")

				this.findTargetNodesIds(node.id, exclusionPorts).forEach((id) => {
					this.nextIterationNodes.add(id)
				})
			} else if (node.type === "iterator") {
				if (!runtimeStorage.end) {
					this.lastIterationNodes.push(node.id)
				}

				if (output.response !== undefined) {
					this.findTargetNodesIds(node.id).forEach((id) => {
						this.nextIterationNodes.add(id)
					})
				}
			} else {
				this.findTargetNodesIds(node.id).forEach((id) => {
					this.nextIterationNodes.add(id)
				})
			}
		}

		return true
	}

	public getAndClearSourcePortData(nodeId: string, portId: string) {
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

		sourceNode.output[connection.sourcePort] = undefined

		return portData
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
						case "array":
							return JSON.parse(portData.replace(/`/g, ""))
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

	findTargetNodesIds(nodeId: string, exclusionPorts: string[] = []) {
		return this.connections
			.filter(
				(conn) =>
					conn.sourceNodeId === nodeId &&
					!exclusionPorts.includes(conn.sourcePort)
			)
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
