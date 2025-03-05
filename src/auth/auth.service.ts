import { ConflictException, Injectable } from "@nestjs/common"
import { AuthMethod, User } from "@prisma/__generated__"

import { UserService } from "@/user/user.service"

import { RegisterDto } from "./dto/register.dto"

@Injectable()
export class AuthService {
	constructor(private readonly userService: UserService) {}

	public async register(dto: RegisterDto) {
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

		return this.saveSession(newUser)
	}
	public async login() {}
	public async logout() {}
	public async saveSession(user: User) {
		console.log("Session saved. User: ", user)
	}
}
