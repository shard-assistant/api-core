import { Module } from "@nestjs/common"

import { NotificationModule } from '@/libs/notification/notification.module'
import { TwoFactorAuthService } from "./two-factor-auth.service"

@Module({
	providers: [TwoFactorAuthService],
	imports: [NotificationModule]
})
export class TwoFactorAuthModule {}
