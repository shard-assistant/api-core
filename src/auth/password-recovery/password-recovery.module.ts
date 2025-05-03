import { Module } from "@nestjs/common"

import { UserService } from "@/user/user.service"

import { NotificationModule } from '@/libs/notification/notification.module'
import { PasswordRecoveryController } from "./password-recovery.controller"
import { PasswordRecoveryService } from "./password-recovery.service"

@Module({
	controllers: [PasswordRecoveryController],
	providers: [PasswordRecoveryService, UserService],
	imports: [NotificationModule]
})
export class PasswordRecoveryModule {}
