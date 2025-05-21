import { INode, NodeTypes } from "../types/node.types"

export const registeredNodeTypes = ["text", "ai", "display"] as const
export const inputNodeTypes = ["text"]

export const defaultNodes: Record<NodeTypes, INode> = {
	text: {
		id: "text",
		displayName: "Текстовое поле",
		inputPorts: [],
		outputPorts: [
			{
				id: "data",
				displayName: "текст",
				dataType: "string"
			}
		]
	},
	ai: {
		id: "ai",
		displayName: "Искусственный интеллект",
		inputPorts: [
			{
				id: "prompt",
				displayName: "инструкции",
				dataType: "string"
			},
			{
				id: "request",
				displayName: "запрос",
				dataType: "string"
			}
		],
		outputPorts: [
			{
				id: "response",
				displayName: "ответ",
				dataType: "string"
			}
		]
	},
	display: {
		id: "display",
		displayName: "Отображение",
		inputPorts: [
			{
				id: "data",
				displayName: "данные",
				dataType: "string"
			}
		],
		outputPorts: []
	}
} as const

export function findNodeConfigById(id: NodeTypes): INode {
	return defaultNodes[id] as INode
}
