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
