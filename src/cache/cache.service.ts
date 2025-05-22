import { Injectable, OnModuleDestroy, OnModuleInit } from "@nestjs/common"
import { ConfigService } from "@nestjs/config"
import IORedis from "ioredis"

export interface TaskStatus {
	status: "pending" | "completed" | "failed"
	result?: any
	error?: string
}

@Injectable()
export class CacheService implements OnModuleInit, OnModuleDestroy {
	private redis: IORedis

	constructor(private readonly configService: ConfigService) {}

	async onModuleInit() {
		this.redis = new IORedis(this.configService.getOrThrow<string>("REDIS_URI"))
	}

	async onModuleDestroy() {
		await this.redis.quit()
	}

	async createTask(projectId: string): Promise<void> {
		await this.redis.set(
			`task:${projectId}`,
			JSON.stringify({
				status: "pending"
			})
		)
	}

	async completeTask(projectId: string, result: any) {
		await this.redis.set(
			`task:${projectId}`,
			JSON.stringify({
				status: "completed",
				result
			})
		)
	}

	async failTask(projectId: string, error: string) {
		await this.redis.set(
			`task:${projectId}`,
			JSON.stringify({
				status: "failed",
				error
			})
		)
	}

	async getTaskStatus(projectId: string): Promise<TaskStatus> {
		const data = await this.redis.get(`task:${projectId}`)
		return data ? JSON.parse(data) : null
	}
}
