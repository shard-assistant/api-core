import { Injectable, NotFoundException } from "@nestjs/common"
import { AuthMethod } from "@prisma/__generated__"
import { hash } from "argon2"

import { PrismaService } from "@/prisma/prisma.service"
import { UpdateUserDto } from './dto/update-user.dto'

@Injectable()
export class UserService {
	constructor(private readonly prisma: PrismaService) {}

	public async findById(id: string) {
		const user = await this.prisma.user.findUnique({
			where: {
				id
			},
			include: {
				accounts: true
			}
		})

		if (!user) {
			throw new NotFoundException("Пользователь не найден")
		}

		return user
	}
	public async findByEmail(email: string) {
		const user = await this.prisma.user.findUnique({
			where: {
				email
			},
			include: {
				accounts: true
			}
		})

		return user
	}
	public async create(
		email: string,
		password: string,
		displayName: string,
		picture: string,
		method: AuthMethod,
		isVerified: boolean
	) {
		const user = await this.prisma.user.create({
			data: {
				email,
				password: password ? await hash(password) : "",
				displayName,
				picture,
				method,
				isVerified
			},
			include: {
				accounts: true
			}
		})

		return user
	}

	public async update(userId: string, data: UpdateUserDto) {
		const user = await this.findById(userId)

		const updatedUser = await this.prisma.user.update({
			where: {
				id: user.id
			},
			data: {
				email: data.email,
				displayName: data.name,
				isTwoFactorEnabled: data.isTwoFactorEnabled
			}
		})

		return updatedUser
	}
}
