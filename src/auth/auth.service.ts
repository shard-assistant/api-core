import {
	ConflictException,
	Injectable,
	InternalServerErrorException,
	NotFoundException,
	UnauthorizedException
} from "@nestjs/common"
import { ConfigService } from "@nestjs/config"
import { AuthMethod, User } from "@prisma/__generated__"
import { verify } from "argon2"
import { Request, Response } from "express"

import { PrismaService } from "@/prisma/prisma.service"
import { UserService } from "@/user/user.service"

import { LoginDto } from "./dto/login.dto"
import { RegisterDto } from "./dto/register.dto"
import { EmailConfirmationService } from "./email-confirmation/email-confirmation.service"
import { ProviderService } from "./provider/provider.service"
import { TwoFactorAuthService } from "./two-factor-auth/two-factor-auth.service"

@Injectable()
export class AuthService {
	constructor(
		private readonly prisma: PrismaService,
		private readonly userService: UserService,
		private readonly configService: ConfigService,
		private readonly providerService: ProviderService,
		private readonly emailConfirmationService: EmailConfirmationService,
		private readonly twoFactorAuthService: TwoFactorAuthService
	) {}

	public async register(req: Request, dto: RegisterDto) {
		const isExists = await this.userService.findByEmail(dto.email)

		if (isExists) {
			throw new ConflictException("Пользователь с таким email уже существует")
		}

		const newUser = await this.userService.create(
			dto.email,
			dto.password,
			AuthMethod.CREDENTIALS,
			false
		)

		this.emailConfirmationService.sendVerificationToken(newUser.email)

		return {
			message:
				"Для продолжения регистрации подтвердите ваш email. Сообщение было отправлено на ваш почтовый адрес."
		}
	}
	public async login(req: Request, dto: LoginDto) {
		const user = await this.userService.findByEmail(dto.email)

		if (!user || !dto.password) {
			throw new NotFoundException("Пользователь не найден")
		}

		const isPasswordValid = await verify(user.password, dto.password)

		if (!isPasswordValid) {
			throw new UnauthorizedException("Неверный email или пароль")
		}

		if (!user.isVerified) {
			await this.emailConfirmationService.sendVerificationToken(user.email)
			throw new UnauthorizedException(
				"Для продолжения регистрации подтвердите ваш email. Сообщение было отправлено на ваш почтовый адрес."
			)
		}

		if (user.isTwoFactorEnabled) {
			if (!dto.code) {
				await this.twoFactorAuthService.sendTwoFactorToken(user.email)

				return {
					message:
						"Проверьте вашу почту. Требуется код двухфакторной аутентификации."
				}
			}

			await this.twoFactorAuthService.validateTwoFactorToken(
				user.email,
				dto.code
			)
		}

		return this.saveSession(req, user)
	}

	public async extractProfileFromCode(
		req: Request,
		provider: string,
		code: string
	) {
		const providerInstance = this.providerService.findByService(provider)
		const profile = await providerInstance.findUserByCode(code)

		const account = await this.prisma.account.findFirst({
			where: {
				id: profile.id,
				provider: profile.provider
			}
		})

		let user = account?.userId
			? await this.userService.findById(account.userId)
			: null

		if (user) {
			return this.saveSession(req, user)
		}

		user =
			(await this.userService.findByEmail(profile.email)) ||
			(await this.userService.create(
				profile.email,
				"",
				AuthMethod[profile.provider.toUpperCase()],
				true
			))

		if (!account) {
			await this.prisma.account.create({
				data: {
					userId: user.id,
					type: "oauth",
					provider: profile.provider,
					accessToken: profile.access_token,
					refreshToken: profile.refresh_token,
					expiresAt: profile.expires_at
				}
			})
		}

		return this.saveSession(req, user)
	}

	public async logout(req: Request, res: Response): Promise<void> {
		return new Promise((resolve, reject) => {
			req.session.destroy((err) => {
				if (err) {
					reject(
						new InternalServerErrorException(
							"Не удалось завершить сессию. Возможно, возникла проблема с сервером или сессия уже была завершена"
						)
					)
				}
				res.clearCookie(this.configService.getOrThrow<string>("SESSION_NAME"))
				resolve()
			})
		})
	}

	public async saveSession(req: Request, user: User) {
		return new Promise((resolve, reject) => {
			req.session.userId = user.id

			req.session.save((err) => {
				if (err) {
					reject(
						new InternalServerErrorException(
							"Ошибка при сохранении сессии. Проверьте настройки Redis"
						)
					)
				}
				resolve({ user })
			})
		})
	}
}
