import { Injectable, NotFoundException } from "@nestjs/common"

import { PrismaService } from "../prisma/prisma.service"

import { CreateProjectDto } from "./dto/create-project.dto"
import { UpdateProjectDto } from "./dto/update-project.dto"
import { NodeService } from "./node/node.service"

@Injectable()
export class ProjectService {
	constructor(
		private readonly prisma: PrismaService,
		private readonly nodeService: NodeService
	) {}

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

		return this.nodeService.findConnectionsByProjectId(projectId)
	}

	async validateUserAccess(userId: string, projectId: string) {
		const project = await this.findById(projectId, userId)

		if (!project) throw new NotFoundException("Project not found")

		return true
	}
}
