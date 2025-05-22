import { IsNotEmpty, IsObject } from "class-validator"

export class UpdateNodeDto {
	@IsObject()
	@IsNotEmpty()
	storage: Record<string, any>

	@IsObject()
	@IsNotEmpty()
	position: { x: number; y: number }
}
