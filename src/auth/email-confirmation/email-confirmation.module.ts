import { Module, forwardRef } from "@nestjs/common"

import { UserService } from "@/user/user.service"

import { AuthModule } from "../auth.module"

import { NotificationModule } from '@/libs/notification/notification.module'
import { EmailConfirmationController } from "./email-confirmation.controller"
import { EmailConfirmationService } from "./email-confirmation.service"

@Module({
	imports: [forwardRef(() => AuthModule), NotificationModule],
	controllers: [EmailConfirmationController],
	providers: [EmailConfirmationService, UserService],
	exports: [EmailConfirmationService]
})
export class EmailConfirmationModule {}
