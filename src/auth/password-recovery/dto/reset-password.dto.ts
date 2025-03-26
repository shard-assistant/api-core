import { IsEmail, IsNotEmpty } from "class-validator"

export class ResetPasswordDto {
	@IsEmail({}, { message: "Некорректный email" })
	@IsNotEmpty({ message: "Email не может быть пустым" })
	email: string
}
