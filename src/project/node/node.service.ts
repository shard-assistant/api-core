import {
	BadRequestException,
	Injectable,
	NotFoundException
} from "@nestjs/common"
import { Node } from "@prisma/__generated__"
import { PrismaService } from "src/prisma/prisma.service"

import { ProjectService } from "../project.service"

import { defaultNodes } from "./config/nodes.config"
import { CreateConnectionDto } from "./dto/create-connection.dto"
import { CreateNodeDto } from "./dto/create-node.dto"
import { UpdateNodeDto } from "./dto/update-node.dto"

@Injectable()
export class NodeService {
	constructor(
		private readonly prisma: PrismaService,
		private readonly projectService: ProjectService
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

	createConnection(projectId: string, data: CreateConnectionDto) {
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

	findConnectionsByProjectId(projectId: string) {
		return this.prisma.connection.findMany({
			where: {
				projectId
			}
		})
	}

	validateType(type: string) {
		return defaultNodes.some((node) => node.id === type)
	}

	async validateUserAccessNode(userId: string, node: Node) {
		const project = await this.projectService.findById(node.projectId, userId)

		if (!project) throw new NotFoundException("Project not found")

		return true
	}

	async validateUserAccessNodeId(userId: string, nodeId: string) {
		const node = await this.findById(nodeId)

		return this.validateUserAccessNode(userId, node)
	}
}
