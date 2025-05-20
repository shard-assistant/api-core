export const defaultNodes: INode[] = [
	{
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
	{
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
	{
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
]
