import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	HttpStatus,
	Param,
	Patch,
	Post
} from "@nestjs/common"

import { Authorization } from "@/auth/decorators/auth.decorator"
import { Authorized } from "@/auth/decorators/authorized.decorator"
import { TaskStatus } from "@/cache/cache.service"

import { CreateProjectDto } from "./dto/create-project.dto"
import { UpdateProjectDto } from "./dto/update-project.dto"
import { ProjectService } from "./project.service"

@Controller("projects")
@Authorization()
export class ProjectController {
	constructor(private readonly projectService: ProjectService) {}

	@Post()
	@HttpCode(HttpStatus.CREATED)
	create(@Authorized("id") userId: string, @Body() data: CreateProjectDto) {
		return this.projectService.create(userId, data)
	}

	@Get()
	@HttpCode(HttpStatus.OK)
	findAll(@Authorized("id") userId: string) {
		return this.projectService.findAllByUserId(userId)
	}

	@Get(":id")
	@HttpCode(HttpStatus.OK)
	findById(@Param("id") id: string, @Authorized("id") userId: string) {
		return this.projectService.findById(id, userId)
	}

	@Patch(":id")
	@HttpCode(HttpStatus.OK)
	update(
		@Param("id") id: string,
		@Authorized("id") userId: string,
		@Body() data: UpdateProjectDto
	) {
		return this.projectService.update(id, userId, data)
	}

	@Delete(":id")
	@HttpCode(HttpStatus.OK)
	remove(@Param("id") id: string, @Authorized("id") userId: string) {
		return this.projectService.remove(id, userId)
	}

	@Post(":id/run")
	@HttpCode(HttpStatus.OK)
	async run(@Param("id") id: string, @Authorized("id") userId: string) {
		await this.projectService.validateUserAccess(userId, id)
		return this.projectService.run(id)
	}

	@Get(":id/status")
	@HttpCode(HttpStatus.OK)
	async getTaskStatus(
		@Param("id") id: string,
		@Authorized("id") userId: string
	): Promise<TaskStatus> {
		await this.projectService.validateUserAccess(userId, id)
		return this.projectService.getTaskStatus(id)
	}
}
