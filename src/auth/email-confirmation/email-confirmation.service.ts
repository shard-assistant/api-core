import {
	BadRequestException,
	Inject,
	Injectable,
	NotFoundException,
	forwardRef
} from "@nestjs/common"
import { TokenType } from "@prisma/__generated__"
import { Request } from "express"
import { v4 as uuidv4 } from "uuid"

import { PrismaService } from "@/prisma/prisma.service"
import { UserService } from "@/user/user.service"

import { AuthService } from "../auth.service"

import { NotificationService } from '@/libs/notification/notification.service'
import { ConfigService } from '@nestjs/config'
import { ConfirmationDto } from "./dto/confirmation.dto"

@Injectable()
export class EmailConfirmationService {
	public constructor(
		private readonly prisma: PrismaService,
		private readonly userService: UserService,
		@Inject(forwardRef(() => AuthService))
		private readonly authService: AuthService,
		private readonly configService: ConfigService,
		private readonly notificationService: NotificationService
	) {}

	public async newVerification(req: Request, dto: ConfirmationDto) {
		const existingToken = await this.prisma.token.findUnique({
			where: {
				token: dto.token,
				type: TokenType.VERIFICATION
			}
		})

		if (!existingToken) {
			throw new NotFoundException(
				"Токен подтверждения не найден. Убедитесь, что ваш токен правильный"
			)
		}

		const hasExpired = new Date(existingToken.expiresIn) < new Date()

		if (hasExpired) {
			throw new BadRequestException(
				"Токен подтверждения истек. Запросите новый токен"
			)
		}

		const existingUser = await this.userService.findByEmail(existingToken.email)

		if (!existingUser) {
			throw new NotFoundException(
				"Пользователь с указанным email не найден. Убедитесь что вы ввели правильный адрес электронной почты"
			)
		}

		await this.prisma.user.update({
			where: {
				id: existingUser.id
			},
			data: {
				isVerified: true
			}
		})

		await this.prisma.token.delete({
			where: {
				id: existingToken.id,
				type: TokenType.VERIFICATION
			}
		})

		return this.authService.saveSession(req, existingUser)
	}

	public async sendVerificationToken(email: string) {
		const verificationToken = await this.generateVerificationToken(email)

		const domain = this.configService.getOrThrow<string>("ALLOWED_ORIGIN")
		const confirmLink = `${domain}/auth/new-verification?token=${verificationToken.token}`

		await this.notificationService
			.sendNotification("mail", verificationToken.email, 'reg_confirmation', { 
				confirmLink
			}
		)

		return true
	}

	private async generateVerificationToken(email: string) {
		const token = uuidv4()
		const expiresIn = new Date(new Date().getTime() + 3600 * 1000)

		const existingToken = await this.prisma.token.findFirst({
			where: {
				email,
				type: TokenType.VERIFICATION
			}
		})

		if (existingToken) {
			await this.prisma.token.delete({
				where: {
					id: existingToken.id,
					type: TokenType.VERIFICATION
				}
			})
		}

		const verificationToken = await this.prisma.token.create({
			data: {
				email,
				token,
				expiresIn,
				type: TokenType.VERIFICATION
			}
		})

		return verificationToken
	}

	public async sendVerificationLink(email: string) {}
}
