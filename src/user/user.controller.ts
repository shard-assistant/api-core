import { Controller, Get, HttpCode, HttpStatus, Param } from "@nestjs/common"
import { UserRole } from "@prisma/__generated__"

import { Authorization } from "@/auth/decorators/auth.decorator"
import { Authorized } from "@/auth/decorators/authorized.decorator"

import { UserService } from "./user.service"

@Controller("user")
export class UserController {
	constructor(private readonly userService: UserService) {}

	@Authorization()
	@Get("profile/current")
	@HttpCode(HttpStatus.OK)
	public async findProfile(@Authorized("id") userId: string) {
		return this.userService.findById(userId)
	}

	@Authorization(UserRole.ADMIN)
	@Get("profile/:id")
	@HttpCode(HttpStatus.OK)
	public async findProfileById(@Param("id") userId: string) {
		return this.userService.findById(userId)
	}
}
