import { Module } from "@nestjs/common"

import { CacheModule } from "@/cache/cache.module"
import { UserModule } from "@/user/user.module"

import { AINodeHandler } from "./handlers/ai-node.handler"
import { DisplayNodeHandler } from "./handlers/display-node.handler"
import { TextNodeHandler } from "./handlers/text-node.handler"
import { NodeController } from "./node.controller"
import { NodeService } from "./node.service"
import { ProjectController } from "./project.controller"
import { ProjectService } from "./project.service"

@Module({
	imports: [UserModule, CacheModule],
	controllers: [ProjectController, NodeController],
	providers: [
		ProjectService,
		NodeService,
		TextNodeHandler,
		AINodeHandler,
		DisplayNodeHandler
	],
	exports: [ProjectService, NodeService]
})
export class ProjectModule {}
