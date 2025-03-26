import { IsNotEmpty, IsString, MinLength } from "class-validator"

export class NewPasswordDto {
	@IsString({ message: "Пароль должен быть строкой" })
	@MinLength(8, { message: "Пароль должен быть не менее 8 символов" })
	@IsNotEmpty({ message: "Пароль не может быть пустым" })
	password: string
}
