import { IsNotEmpty, IsString } from "class-validator"

export class CreateNodeDto {
	@IsString()
	@IsNotEmpty()
	type: string

	@IsString()
	@IsNotEmpty()
	storage: string

	@IsString()
	@IsNotEmpty()
	position: string

	@IsString()
	@IsNotEmpty()
	projectId: string
}
