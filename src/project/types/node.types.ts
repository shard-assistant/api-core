type INode = {
	id: string

	displayName: string

	inputPorts: IPort[]
	outputPorts: IPort[]
}

type IPort = {
	id: string

	displayName: string
	dataType: string
}

type NodeStorage<StorageType, NodeConfig extends INode> = {
	data: StorageType
	outputs: {
		[K in NodeConfig["outputPorts"][number]["id"]]: any
	}
}
