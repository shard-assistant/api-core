import { IsNotEmpty, IsObject, IsString } from "class-validator"

export class CreateNodeDto {
	@IsString()
	@IsNotEmpty()
	type: string

	@IsObject()
	@IsNotEmpty()
	storage: Record<string, any>

	@IsObject()
	@IsNotEmpty()
	position: { x: number; y: number }

	@IsString()
	@IsNotEmpty()
	projectId: string
}
