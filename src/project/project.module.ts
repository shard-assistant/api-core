import { Module } from "@nestjs/common"

import { UserModule } from "@/user/user.module"

import { NodeController } from "./node.controller"
import { NodeService } from "./node.service"
import { ProjectController } from "./project.controller"
import { ProjectService } from "./project.service"

@Module({
	imports: [UserModule],
	controllers: [ProjectController, NodeController],
	providers: [ProjectService, NodeService],
	exports: [ProjectService, NodeService]
})
export class ProjectModule {}
