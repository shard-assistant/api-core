import { IsBoolean, IsEmail, IsNotEmpty, IsString } from 'class-validator'

export class UpdateUserDto {
	@IsString()
	@IsNotEmpty()
	name: string

	@IsString({ message: "Значение должно быть строкой" })
	@IsEmail({}, { message: "Некорректный формат" })
	@IsNotEmpty({ message: "Это обязательное поле" })
	email: string

	@IsBoolean()
	isTwoFactorEnabled: boolean
}

