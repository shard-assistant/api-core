import {
	BadRequestException,
	Injectable,
	NotFoundException
} from "@nestjs/common"
import { TokenType, User } from "@prisma/__generated__"

import { MailService } from "@/libs/mail/mail.service"
import { PrismaService } from "@/prisma/prisma.service"

@Injectable()
export class TwoFactorAuthService {
	public constructor(
		private readonly prisma: PrismaService,
		private readonly mailService: MailService
	) {}

	public async validateTwoFactorToken(email: string, code: string) {
		const existingToken = await this.prisma.token.findFirst({
			where: {
				email,
				type: TokenType.TWO_FACTOR
			}
		})

		if (!existingToken) {
			throw new NotFoundException(
				"Токен двухфакторной аутентификации не найден. Убедитесь, что вы запрашивали токен для данного адреса электронной почты"
			)
		}

		if (existingToken.token !== code) {
			throw new BadRequestException(
				"Неверный код двухфакторной аутентификации. Проверьте введенный код и попробуйте снова."
			)
		}

		const hasExpired = new Date(existingToken.expiresIn) < new Date()

		if (hasExpired) {
			throw new BadRequestException(
				"Срок действия кода истек. Пожалуйста запросите новый код."
			)
		}

		await this.prisma.token.delete({
			where: {
				id: existingToken.id,
				type: TokenType.TWO_FACTOR
			}
		})

		return true
	}

	public async sendTwoFactorToken(email: string) {
		const twoFactorToken = await this.generateTwoFactorToken(email)

		await this.mailService.sendTwoFactorTokenEmail(
			twoFactorToken.email,
			twoFactorToken.token
		)

		return true
	}

	private async generateTwoFactorToken(email: string) {
		const token = Math.floor(
			Math.random() * (1000000 - 100000) + 100000
		).toString()
		const expiresIn = new Date(new Date().getTime() + 300000)

		const existingToken = await this.prisma.token.findFirst({
			where: {
				email,
				type: TokenType.TWO_FACTOR
			}
		})

		if (existingToken) {
			await this.prisma.token.delete({
				where: {
					id: existingToken.id,
					type: TokenType.TWO_FACTOR
				}
			})
		}

		const twoFactorToken = await this.prisma.token.create({
			data: {
				email,
				token,
				expiresIn,
				type: TokenType.TWO_FACTOR
			}
		})

		return twoFactorToken
	}
}
