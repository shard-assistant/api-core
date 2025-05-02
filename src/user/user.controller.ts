import { Body, Controller, Get, HttpCode, HttpStatus, Param, Patch } from "@nestjs/common"
import { UserRole } from "@prisma/__generated__"

import { Authorization } from "@/auth/decorators/auth.decorator"
import { Authorized } from "@/auth/decorators/authorized.decorator"

import { UpdateUserDto } from './dto/update-user.dto'
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

	@Authorization()
	@Patch("profile/current")
	@HttpCode(HttpStatus.OK)
	public async updateProfile(
		@Authorized("id") userId: string,
		@Body() data: UpdateUserDto
	) {
		return this.userService.update(userId, data)
	}

	@Authorization(UserRole.ADMIN)
	@Patch("profile/:id")
	@HttpCode(HttpStatus.OK)
	public async updateProfileById(
		@Param("id") userId: string, 
		@Body() data: UpdateUserDto
	) {
		return this.userService.update(userId, data)
	}
}
