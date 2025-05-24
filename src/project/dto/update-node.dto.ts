import { IsNotEmpty, IsObject, IsOptional } from "class-validator"

export class UpdateNodeDto {
	@IsObject()
	@IsNotEmpty()
	@IsOptional()
	storage?: Record<string, any>

	@IsObject()
	@IsNotEmpty()
	@IsOptional()
	position?: { x: number; y: number }
}
