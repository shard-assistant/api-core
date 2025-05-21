import { Injectable, OnModuleDestroy, OnModuleInit } from "@nestjs/common"
import { ConfigService } from "@nestjs/config"
import cuid from "cuid"
import IORedis from "ioredis"

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

	async saveIteration(projectId: string, results: Record<string, any>) {
		const iterationId = cuid()
		const key = `iteration:${projectId}:${iterationId}`
		const timestamp = Date.now()

		await this.redis.set(key, JSON.stringify({ ...results, timestamp }))
		await this.redis.expire(key, 60 * 60 * 24) // Хранить 24 часа

		return iterationId
	}

	async getIteration(projectId: string, iterationId: string) {
		const key = `iteration:${projectId}:${iterationId}`
		const data = await this.redis.get(key)

		if (!data) {
			return null
		}

		return JSON.parse(data)
	}

	async getAllIterations(projectId: string) {
		const keys = await this.redis.keys(`iteration:${projectId}:*`)

		if (!keys.length) {
			return []
		}

		const iterations = await Promise.all(
			keys.map(async (key) => {
				const data = await this.redis.get(key)
				if (!data) return null

				const iterationId = key.split(":")[2]
				const parsed = JSON.parse(data)
				const { timestamp, ...results } = parsed
				return {
					iterationId,
					timestamp,
					results
				}
			})
		)

		return iterations.filter(Boolean).sort((a, b) => b.timestamp - a.timestamp)
	}
}
