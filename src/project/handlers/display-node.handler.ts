import { Injectable, Logger } from "@nestjs/common"

import { findNodeConfigById } from "../config/nodes.config"
import { NodeService } from "../node.service"
import { NodeHandler } from "../types/node-handler"
import { RuntimeNode } from "../types/node.types"

const LOGGER = new Logger("DisplayNodeHandler")

type DisplayStorage = {
	displayFormat: "text" | "json" | "html"
}

@Injectable()
export class DisplayNodeHandler extends NodeHandler<DisplayStorage, undefined> {
	constructor(readonly nodeService: NodeService) {
		super(nodeService)
		this.config = findNodeConfigById("display")
	}

	async run(
		node: RuntimeNode,
		findSourcePortData: (
			nodeId: string,
			portId: string,
			dataType: string
		) => any
	): Promise<any> {
		const data = findSourcePortData(node.id, "data", "any")

		try {
			let response
			if (!Array.isArray(data)) {
				switch (typeof data) {
					case "string":
						response = JSON.parse(data)
						break
				}
			} else response = data
			return {
				output: response
			}
		} catch {
			return {
				output: "Ошибка при разборе данных"
			}
		}
	}
}
