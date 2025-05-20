export abstract class NodeHandler {
	public config: INode

	constructor(config: INode) {
		this.config = config
	}

	abstract run(node: INode): Promise<void>
}
