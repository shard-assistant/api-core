import {
	IsEmail,
	IsNotEmpty,
	IsString,
	MinLength,
	Validate
} from "class-validator"

import { IsPasswordMatchingConstraint } from "@/libs/common/decorators/is-password-matching-constraint.decorator"

export class RegisterDto {
	@IsString({ message: "Значение должно быть строкой" })
	@IsNotEmpty({ message: "Это обязательное поле" })
	name: string

	@IsString({ message: "Значение должно быть строкой" })
	@IsEmail({}, { message: "Некорректный формат" })
	@IsNotEmpty({ message: "Это обязательное поле" })
	email: string

	@IsString({ message: "Значение должно быть строкой" })
	@IsNotEmpty({ message: "Это обязательное поле" })
	@MinLength(8, { message: "Пароль должен содержать не менее 8 символов" })
	password: string

	@IsString({ message: "Значение должно быть строкой" })
	@IsNotEmpty({ message: "Это обязательное поле" })
	@MinLength(8, { message: "Пароль должен содержать не менее 8 символов" })
	@Validate(IsPasswordMatchingConstraint)
	passwordRepeat: string
}
