import { MailerOptions } from "@nestjs-modules/mailer"
import { ConfigService } from "@nestjs/config"

import { isDev } from "@/libs/common/utils/is-dev.util"

export const getMailerConfig = async (
	configService: ConfigService
): Promise<MailerOptions> => ({
	transport: {
		host: configService.getOrThrow<string>("SMTP_HOST"),
		port: configService.getOrThrow<number>("SMTP_PORT"),
		secure: !isDev(configService),
		auth: {
			user: configService.getOrThrow<string>("SMTP_USER"),
			pass: configService.getOrThrow<string>("SMTP_PASSWORD")
		}
	},
	defaults: {
		from: configService.getOrThrow<string>("SMTP_FROM")
	},
	preview: true
})
