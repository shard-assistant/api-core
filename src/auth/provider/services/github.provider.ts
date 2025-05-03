import { BaseOAuthService } from "./base-oauth.service"
import { ProviderOptionsType } from "./types/provider-options.type"
import { UserInfoType } from "./types/user-info.type"

export class GithubOAuthProvider extends BaseOAuthService {
	public constructor(options: ProviderOptionsType) {
		super({
			name: "github",
			authorize_url: "https://github.com/login/oauth/authorize",
			access_url: "https://github.com/login/oauth/access_token",
			profile_url: "https://api.github.com/user",
			scopes: options.scopes,
			client_id: options.client_id,
			client_secret: options.client_secret
		})
	}

	public async extractUserInfo(data: GithubProfile, accessToken: string): Promise<UserInfoType> {
		const emailResponse = await fetch("https://api.github.com/user/emails", {
			headers: {
				Authorization: `Bearer ${accessToken}`
			}
		})

		const emails = await emailResponse.json() as {email: string, primary: boolean}[]

		const email = emails.find((email) => email.primary)?.email

		return super.extractUserInfo({
			email: data.email || email,
			name: data.login,
			picture: data.avatar_url
		})
	}
	
}

interface GithubProfile extends Record<string, any> {
	id: number
	login: string
	name: null | string
	email: null | string
	avatar_url: string
}
