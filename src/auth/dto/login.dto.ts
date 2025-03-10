import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator"

export class LoginDto {
	@IsString({ message: "Значение должно быть строкой" })
	@IsEmail({}, { message: "Некорректный формат" })
	@IsNotEmpty({ message: "Это обязательное поле" })
	email: string

	@IsString({ message: "Значение должно быть строкой" })
	@IsNotEmpty({ message: "Это обязательное поле" })
	@MinLength(8, { message: "Пароль должен содержать не менее 8 символов" })
	password: string
}
