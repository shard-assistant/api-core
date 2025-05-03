import { ConfigService } from "@nestjs/config"

import { OptionsType } from "@/auth/provider/provider.constants"
import { GithubOAuthProvider } from "@/auth/provider/services/github.provider"
import { YandexOAuthProvider } from "@/auth/provider/services/yandex.provider"
export const getProvidersConfig = async (
	configService: ConfigService
): Promise<OptionsType> => ({
	baseUrl: configService.getOrThrow<string>("APPLICATION_URL"),
	services: [
		new YandexOAuthProvider({
			client_id: configService.getOrThrow<string>("YANDEX_CLIENT_ID"),
			client_secret: configService.getOrThrow<string>("YANDEX_CLIENT_SECRET"),
			scopes: ["login:email", "login:avatar", "login:info"]
		}),
		new GithubOAuthProvider({
			client_id: configService.getOrThrow<string>("GITHUB_CLIENT_ID"),
			client_secret: configService.getOrThrow<string>("GITHUB_CLIENT_SECRET"),
			scopes: ["user:email", "read:user"]
		})
	]
})
