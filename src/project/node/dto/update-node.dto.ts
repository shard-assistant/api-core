import { IsNotEmpty } from "class-validator"
import { IsString } from "class-validator"

export class UpdateNodeDto {
	@IsString()
	@IsNotEmpty()
	storage: string

	@IsString()
	@IsNotEmpty()
	position: string
}
