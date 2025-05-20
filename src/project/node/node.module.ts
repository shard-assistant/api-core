import { Module, forwardRef } from "@nestjs/common"

import { UserModule } from "@/user/user.module"

import { ProjectModule } from "../project.module"

import { NodeController } from "./node.controller"
import { NodeService } from "./node.service"

@Module({
	imports: [UserModule, forwardRef(() => ProjectModule)],
	controllers: [NodeController],
	providers: [NodeService]
})
export class NodeModule {}
