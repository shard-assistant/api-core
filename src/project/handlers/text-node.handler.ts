import { Injectable } from "@nestjs/common"

import { defaultNodes, findNodeConfigById } from "../config/nodes.config"
import { NodeService } from "../node.service"
import { NodeHandler } from "../types/node-handler"

@Injectable()
export class TextNodeHandler extends NodeHandler<
	string,
	(typeof defaultNodes)["text"]
> {
	constructor(readonly nodeService: NodeService) {
		super(nodeService)

		this.config = findNodeConfigById("text")
	}

	async run(nodeId: string) {
		const storage = await this.getStorage(nodeId)

		storage.outputs.data = storage.data || ""
	}
}
