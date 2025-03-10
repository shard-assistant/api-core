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

import { UserService } from "@/user/user.service"

import { LoginDto } from "./dto/login.dto"
import { RegisterDto } from "./dto/register.dto"

@Injectable()
export class AuthService {
	constructor(
		private readonly userService: UserService,
		private readonly configService: ConfigService
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

		return this.saveSession(req, newUser)
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
