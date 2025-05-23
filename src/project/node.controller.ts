import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	HttpStatus,
	NotFoundException,
	Param,
	Patch,
	Post
} from "@nestjs/common"

import { Authorization } from "@/auth/decorators/auth.decorator"
import { Authorized } from "@/auth/decorators/authorized.decorator"

import { defaultNodes } from "./config/nodes.config"
import { CreateConnectionDto } from "./dto/create-connection.dto"
import { CreateNodeDto } from "./dto/create-node.dto"
import { UpdateNodeDto } from "./dto/update-node.dto"
import { NodeService } from "./node.service"
import { ProjectService } from "./project.service"

@Controller("nodes")
@Authorization()
export class NodeController {
	constructor(
		private readonly nodeService: NodeService,
		private readonly projectService: ProjectService
	) {}

	@Get("types")
	@HttpCode(HttpStatus.OK)
	async types() {
		return Object.values(defaultNodes)
	}

	@Post()
	@HttpCode(HttpStatus.CREATED)
	async create(@Authorized("id") userId: string, @Body() data: CreateNodeDto) {
		const project = await this.projectService.findById(data.projectId, userId)

		if (!project) throw new NotFoundException("Project not found")

		return this.nodeService.create(data)
	}

	@Get(":id")
	@HttpCode(HttpStatus.OK)
	async findById(@Authorized("id") userId: string, @Param("id") id: string) {
		const node = await this.nodeService.findById(id)

		await this.nodeService.validateUserAccessNode(userId, node)

		return node
	}

	@Patch(":id")
	@HttpCode(HttpStatus.OK)
	async update(
		@Param("id") id: string,
		@Authorized("id") userId: string,
		@Body() data: UpdateNodeDto
	) {
		await this.nodeService.validateUserAccessNodeId(userId, id)

		return this.nodeService.update(id, data)
	}

	@Delete(":id")
	@HttpCode(HttpStatus.OK)
	async remove(@Param("id") id: string, @Authorized("id") userId: string) {
		await this.nodeService.validateUserAccessNodeId(userId, id)

		return this.nodeService.remove(id)
	}

	@Post(":id/connections")
	@HttpCode(HttpStatus.CREATED)
	async createConnection(
		@Param("id") id: string,
		@Authorized("id") userId: string,
		@Body() data: CreateConnectionDto
	) {
		const node = await this.nodeService.findById(id)

		const project = await this.projectService.findById(node.projectId, userId)

		if (!project) throw new NotFoundException("Project not found")

		return this.nodeService.createConnection(project.id, data)
	}

	@Delete(":id/connections/:connectionId")
	@HttpCode(HttpStatus.OK)
	async removeConnection(
		@Param("id") id: string,
		@Param("connectionId") connectionId: string,
		@Authorized("id") userId: string
	) {
		await this.nodeService.validateUserAccessNodeId(userId, id)

		return this.nodeService.removeConnection(connectionId)
	}
}
