import { Module, forwardRef } from "@nestjs/common"

import { UserModule } from "@/user/user.module"

import { NodeModule } from "./node/node.module"
import { ProjectController } from "./project.controller"
import { ProjectService } from "./project.service"

@Module({
	imports: [UserModule, forwardRef(() => NodeModule)],
	controllers: [ProjectController],
	providers: [ProjectService],
	exports: [ProjectService]
})
export class ProjectModule {}
