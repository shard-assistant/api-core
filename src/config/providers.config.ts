import { ConfigService } from "@nestjs/config"

import { OptionsType } from "@/auth/provider/provider.constants"
import { GoogleOAuthProvider } from "@/auth/provider/services/google.provider"
import { YandexOAuthProvider } from "@/auth/provider/services/yandex.provider"

export const getProvidersConfig = async (
	configService: ConfigService
): Promise<OptionsType> => ({
	baseUrl: configService.getOrThrow<string>("APPLICATION_URL"),
	services: [
		new GoogleOAuthProvider({
			client_id: configService.getOrThrow<string>("GOOGLE_CLIENT_ID"),
			client_secret: configService.getOrThrow<string>("GOOGLE_CLIENT_SECRET"),
			scopes: ["email", "profile"]
		}),
		new YandexOAuthProvider({
			client_id: configService.getOrThrow<string>("YANDEX_CLIENT_ID"),
			client_secret: configService.getOrThrow<string>("YANDEX_CLIENT_SECRET"),
			scopes: ["login:email", "login:avatar", "login:info"]
		})
	]
})
