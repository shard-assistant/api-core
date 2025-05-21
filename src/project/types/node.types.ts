import { registeredNodeTypes } from "../config/nodes.config"

export type INode = {
	id: string

	displayName: string
	hasInput?: boolean

	inputPorts: IPort[]
	outputPorts: IPort[]
}

export type IPort = {
	id: string

	displayName: string
	dataType: string
}

export type RuntimeNode = {
	id: string

	type: NodeTypes

	storage: any
	output: Record<string, any>
}

export type NodeTypes = (typeof registeredNodeTypes)[number]
