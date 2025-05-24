import { INode, NodeTypes } from "../types/node.types"

export const registeredNodeTypes = [
	"text",
	"ai",
	"display",
	"telegramMessageImport",
	"telegramMessageSend",
	"iterator",
	"storage",
	"importJson",
	"equal"
] as const
export const inputNodeTypes = ["text", "telegramMessageImport"]

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
				dataType: "any"
			}
		],
		outputPorts: []
	},
	telegramMessageImport: {
		id: "telegramMessageImport",
		displayName: "Импорт сообщений из Telegram",
		inputPorts: [],
		outputPorts: [
			{
				id: "messages",
				displayName: "сообщения",
				dataType: "array"
			}
		]
	},
	telegramMessageSend: {
		id: "telegramMessageSend",
		displayName: "Отправка сообщения в Telegram",
		inputPorts: [
			{
				id: "send",
				displayName: "отправить",
				dataType: "any"
			},
			{
				id: "message",
				displayName: "сообщение",
				dataType: "string"
			},
			{
				id: "chatId",
				displayName: "id чата",
				dataType: "string"
			}
		],
		outputPorts: []
	},
	iterator: {
		id: "iterator",
		displayName: "Обход массива",
		inputPorts: [
			{
				id: "data",
				displayName: "массив",
				dataType: "array"
			}
		],
		outputPorts: [
			{
				id: "response",
				displayName: "элемент массива",
				dataType: "any"
			}
		]
	},
	storage: {
		id: "storage",
		displayName: "Хранилище",
		inputPorts: [
			{
				id: "add",
				displayName: "добавить",
				dataType: "string"
			}
		],
		outputPorts: []
	},
	importJson: {
		id: "importJson",
		displayName: "Импорт JSON",
		inputPorts: [
			{
				id: "object",
				displayName: "объект",
				dataType: "any"
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
	equal: {
		id: "equal",
		displayName: "Сравнение",
		inputPorts: [
			{
				id: "goal",
				displayName: "цель сравнения",
				dataType: "string"
			},
			{
				id: "value",
				displayName: "с чем сравнить",
				dataType: "string"
			}
		],
		outputPorts: [
			{
				id: "hasEqual",
				displayName: "совпадает",
				dataType: "string"
			},
			{
				id: "hasNotEqual",
				displayName: "не совпадает",
				dataType: "string"
			}
		]
	}
} as const

export function findNodeConfigById(id: NodeTypes): INode {
	return defaultNodes[id] as INode
}
