import { IsNotEmpty, IsString } from "class-validator"

export class CreateConnectionDto {
	@IsString()
	@IsNotEmpty()
	sourceNodeId: string

	@IsString()
	@IsNotEmpty()
	targetNodeId: string

	@IsString()
	@IsNotEmpty()
	sourcePort: string

	@IsString()
	@IsNotEmpty()
	targetPort: string
}
