import {
	BadRequestException,
	Injectable,
	NotFoundException
} from "@nestjs/common"
import { Node } from "@prisma/__generated__"
import { PrismaService } from "src/prisma/prisma.service"

import {
	defaultNodes,
	findNodeConfigById,
	registeredNodeTypes
} from "./config/nodes.config"
import { CreateConnectionDto } from "./dto/create-connection.dto"
import { CreateNodeDto } from "./dto/create-node.dto"
import { UpdateNodeDto } from "./dto/update-node.dto"
import { AINodeHandler } from "./handlers/ai-node.handler"
import { DisplayNodeHandler } from "./handlers/display-node.handler"
import { TextNodeHandler } from "./handlers/text-node.handler"
import { NodeTypes } from "./types/node.types"

@Injectable()
export class NodeService {
	constructor(
		private readonly prisma: PrismaService,
		private readonly textNodeHandler: TextNodeHandler,
		private readonly aiNodeHandler: AINodeHandler,
		private readonly displayNodeHandler: DisplayNodeHandler
	) {}

	create(data: CreateNodeDto) {
		if (!this.validateType(data.type)) {
			throw new BadRequestException("Invalid node type")
		}

		return this.prisma.node.create({
			data: {
				type: data.type,
				storage: data.storage,
				position: data.position,
				projectId: data.projectId
			}
		})
	}

	findByProjectId(projectId: string) {
		return this.prisma.node.findMany({
			where: {
				projectId
			}
		})
	}

	findById(id: string) {
		return this.prisma.node.findUnique({
			where: {
				id
			}
		})
	}

	update(id: string, data: UpdateNodeDto) {
		return this.prisma.node.update({
			where: {
				id
			},
			data: {
				storage: data.storage,
				position: data.position
			}
		})
	}

	remove(id: string) {
		return this.prisma.node.delete({
			where: {
				id
			}
		})
	}

	setStorage(id: string, storage: any) {
		return this.prisma.node.update({
			where: {
				id
			},
			data: {
				storage
			}
		})
	}

	async createConnection(projectId: string, data: CreateConnectionDto) {
		await this.validateConnection(data)

		return this.prisma.connection.create({
			data: {
				sourceNodeId: data.sourceNodeId,
				targetNodeId: data.targetNodeId,
				sourcePort: data.sourcePort,
				targetPort: data.targetPort,
				projectId
			}
		})
	}

	removeConnection(id: string) {
		return this.prisma.connection.delete({
			where: {
				id
			}
		})
	}

	findConnectionsByNodeIdAndPortId(nodeId: string, portId: string) {
		return this.prisma.connection.findFirst({
			where: {
				targetNodeId: nodeId,
				targetPort: portId
			}
		})
	}

	validateType(type: string) {
		return type in defaultNodes
	}

	async validateConnection(data: CreateConnectionDto) {
		const connection = await this.findConnectionsByNodeIdAndPortId(
			data.sourceNodeId,
			data.sourcePort
		)

		if (connection) throw new BadRequestException("Connection already exists")
	}

	async validateUserAccessNode(userId: string, node: Node) {
		const project = await this.prisma.project.findUnique({
			where: {
				id: node.projectId,
				userId
			}
		})

		if (!project) throw new NotFoundException("Project not found")

		return true
	}

	async validateUserAccessNodeId(userId: string, nodeId: string) {
		const node = await this.findById(nodeId)

		return this.validateUserAccessNode(userId, node)
	}

	async runNode(node: Node) {
		if (!this.validateType(node.type)) {
			throw new BadRequestException(`Invalid node type: ${node.type}`)
		}

		const nodeType = node.type as NodeTypes
		const config = findNodeConfigById(nodeType)
		if (!config) {
			throw new BadRequestException(
				`Handler for node type ${nodeType} not found`
			)
		}

		switch (nodeType) {
			case "text":
				await this.textNodeHandler.run(node.id)
				break
			case "ai":
				await this.aiNodeHandler.run(node.id)
				break
			case "display":
				await this.displayNodeHandler.run(node.id)
				break
			default:
				throw new BadRequestException(
					`Handler for node type ${nodeType} not implemented`
				)
		}
	}
}
