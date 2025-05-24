import { Module } from "@nestjs/common"
import { ConfigModule } from "@nestjs/config"

import { AiModule } from "./ai/ai.module"
import { AiService } from "./ai/ai.service"
import { AuthModule } from "./auth/auth.module"
import { EmailConfirmationModule } from "./auth/email-confirmation/email-confirmation.module"
import { PasswordRecoveryModule } from "./auth/password-recovery/password-recovery.module"
import { ProviderModule } from "./auth/provider/provider.module"
import { TwoFactorAuthModule } from "./auth/two-factor-auth/two-factor-auth.module"
import { CacheModule } from "./cache/cache.module"
import { IS_DEV_ENV } from "./libs/common/utils/is-dev.util"
import { NotificationModule } from "./libs/notification/notification.module"
import { PrismaModule } from "./prisma/prisma.module"
import { ProjectModule } from "./project/project.module"
import { TelegramModule } from "./telegram/telegram.module"
import { UserModule } from "./user/user.module"

@Module({
	imports: [
		ConfigModule.forRoot({
			ignoreEnvFile: !IS_DEV_ENV,
			isGlobal: true
		}),
		PrismaModule,
		AuthModule,
		UserModule,
		ProviderModule,
		EmailConfirmationModule,
		PasswordRecoveryModule,
		TwoFactorAuthModule,
		NotificationModule,
		ProjectModule,
		CacheModule,
		AiModule,
		TelegramModule
	],
	providers: [AiService]
})
export class AppModule {}
