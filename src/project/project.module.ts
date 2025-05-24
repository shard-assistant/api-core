import { Module } from "@nestjs/common"

import { AiModule } from "@/ai/ai.module"
import { CacheModule } from "@/cache/cache.module"
import { TelegramModule } from "@/telegram/telegram.module"
import { UserModule } from "@/user/user.module"

import { AINodeHandler } from "./handlers/ai-node.handler"
import { DisplayNodeHandler } from "./handlers/display-node.handler"
import { EqualNodeHandler } from "./handlers/equal-node.handler"
import { ImportJsonNodeHandler } from "./handlers/import-json-node.handler"
import { IteratorHandler } from "./handlers/iterator.handler"
import { StorageNodeHandler } from "./handlers/storage-node.handler"
import { TelegramMessageImportHandler } from "./handlers/telegram-message-import.handler"
import { TelegramMessageSendHandler } from "./handlers/telegram-message-send.handler"
import { TextNodeHandler } from "./handlers/text-node.handler"
import { NodeController } from "./node.controller"
import { NodeService } from "./node.service"
import { ProjectController } from "./project.controller"
import { ProjectService } from "./project.service"

@Module({
	imports: [UserModule, CacheModule, AiModule, TelegramModule],
	controllers: [ProjectController, NodeController],
	providers: [
		ProjectService,
		NodeService,
		TextNodeHandler,
		AINodeHandler,
		DisplayNodeHandler,
		TelegramMessageImportHandler,
		IteratorHandler,
		StorageNodeHandler,
		ImportJsonNodeHandler,
		EqualNodeHandler,
		TelegramMessageSendHandler
	],
	exports: [ProjectService, NodeService]
})
export class ProjectModule {}
