import { Injectable } from "@nestjs/common"

import { PromptSettings } from "./types/ai.types"

@Injectable()
export class AiService {
	private async getIAmToken(oauthToken: string) {
		const response = await fetch(
			"https://iam.api.cloud.yandex.net/iam/v1/tokens",
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json"
				},
				body: JSON.stringify({
					yandexPassportOauthToken: oauthToken
				})
			}
		)

		return (await response.json()).iamToken
	}

	async fetchPrompt(prompt: string, data: string, settings: PromptSettings) {
		const iamToken = await this.getIAmToken(settings.token)

		const response = await fetch(
			"https://llm.api.cloud.yandex.net/foundationModels/v1/completion",
			{
				method: "POST",
				headers: {
					Authorization: `Bearer ${iamToken}`,
					"Content-Type": "application/json"
				},
				body: JSON.stringify({
					modelUri: `gpt://${settings.catalog}/yandexgpt-lite`,
					completionOptions: {
						stream: false,
						temperature: settings.temperature,
						maxTokens: settings.maxTokens
					},
					messages: [
						{
							role: "system",
							content: prompt
						},
						{
							role: "user",
							content: data
						}
					]
				})
			}
		)

		return response.json()
	}
}
