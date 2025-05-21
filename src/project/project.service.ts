import { Injectable, NotFoundException } from "@nestjs/common"

import { CacheService } from "../cache/cache.service"
import { PrismaService } from "../prisma/prisma.service"

import { CreateProjectDto } from "./dto/create-project.dto"
import { UpdateProjectDto } from "./dto/update-project.dto"
import { GraphExecutor } from "./graph-executor"
import { AINodeHandler } from "./handlers/ai-node.handler"
import { DisplayNodeHandler } from "./handlers/display-node.handler"
import { TextNodeHandler } from "./handlers/text-node.handler"
import { NodeHandler } from "./types/node-handler"

@Injectable()
export class ProjectService {
	handlerMap: Map<string, NodeHandler<any, any>> = new Map()
	constructor(
		private readonly prisma: PrismaService,
		private readonly cacheService: CacheService,
		readonly textNodeHandler: TextNodeHandler,
		readonly aiNodeHandler: AINodeHandler,
		readonly displayNodeHandler: DisplayNodeHandler
	) {
		this.handlerMap.set(textNodeHandler.config.id, textNodeHandler)
		this.handlerMap.set(aiNodeHandler.config.id, aiNodeHandler)
		this.handlerMap.set(displayNodeHandler.config.id, displayNodeHandler)
	}

	create(userId: string, data: CreateProjectDto) {
		return this.prisma.project.create({
			data: {
				name: data.name,
				userId
			}
		})
	}

	findAllByUserId(userId: string) {
		return this.prisma.project.findMany({
			where: {
				userId
			}
		})
	}

	findById(id: string, userId: string) {
		return this.prisma.project.findUnique({
			where: {
				id,
				userId
			}
		})
	}

	update(id: string, userId: string, data: UpdateProjectDto) {
		return this.prisma.project.update({
			where: {
				id,
				userId
			},
			data: {
				name: data.name
			}
		})
	}

	remove(id: string, userId: string) {
		return this.prisma.project.delete({
			where: {
				id,
				userId
			}
		})
	}

	async findConnections(projectId: string, userId: string) {
		await this.validateUserAccess(userId, projectId)

		return this.prisma.connection.findMany({
			where: {
				projectId
			}
		})
	}

	async validateUserAccess(userId: string, projectId: string) {
		const project = await this.findById(projectId, userId)

		if (!project) throw new NotFoundException("Project not found")

		return true
	}

	async run(projectId: string) {
		const [nodes, connections] = await Promise.all([
			this.prisma.node.findMany({
				where: { projectId }
			}),
			this.prisma.connection.findMany({
				where: { projectId }
			})
		])

		const executor = new GraphExecutor(nodes, connections, this.handlerMap)

		while (executor.hasNext()) {
			await executor.next()
		}

		const result = Array.from(executor.nodes.values()).reduce(
			(acc, node) => ({
				...acc,
				[node.id]: node.output
			}),
			{}
		)

		const iterationId = await this.cacheService.saveIteration(projectId, result)

		return {
			iterationId,
			results: result
		}
	}

	async getIterationResults(projectId: string, iterationId: string) {
		const results = await this.cacheService.getIteration(projectId, iterationId)

		if (!results) {
			throw new NotFoundException("Результаты итерации не найдены")
		}

		return results
	}

	async getAllIterations(projectId: string) {
		return this.cacheService.getAllIterations(projectId)
	}
}
