import { BaseOAuthService } from "./base-oauth.service"
import { ProviderOptionsType } from "./types/provider-options.type"
import { UserInfoType } from "./types/user-info.type"

export class YandexOAuthProvider extends BaseOAuthService {
	public constructor(options: ProviderOptionsType) {
		super({
			name: "yandex",
			authorize_url: "https://oauth.yandex.ru/authorize",
			access_url: "https://oauth.yandex.ru/token",
			profile_url: "https://login.yandex.ru/info?format=json",
			scopes: options.scopes,
			client_id: options.client_id,
			client_secret: options.client_secret
		})
	}

	public async extractUserInfo(data: YandexProfile): Promise<UserInfoType> {
		return super.extractUserInfo({
			email: data.emails[0]
		})
	}
}

interface YandexProfile extends Record<string, any> {
	login: string
	id: string
	client_id: string
	psuid: string
	emails?: string[]
	default_email?: string
	is_avatar_empty?: boolean
	default_avatar_id?: string
	birthday?: string | null
	first_name?: string
	last_name?: string
	display_name?: string
	real_name?: string
	sex?: "male" | "female" | null
	default_phone?: { id: number; number: string }
	access_token: string
	refresh_token?: string
}
