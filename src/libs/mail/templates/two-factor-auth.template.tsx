import { Body, Heading, Tailwind, Text } from "@react-email/components"
import { Html } from "@react-email/html"
import * as React from "react"

interface TwoFactorAuthTemplateProps {
	token: string
}

export function TwoFactorAuthTemplate({
	token
}: TwoFactorAuthTemplateProps) {
  return (
    <Tailwind>
      <Html>
			<Body className="text-black">
				<Heading>Двухфакторная аутентификация</Heading>
				<Text>
					Ваш код двухвакторной аутентификации: <strong>{token}</strong>
				</Text>
				<Text>
					Введите этот код в приложении для завершения
					процесса аутентификации.
				</Text>
				<Text>Если вы не запрашивали этот код, просто проигнорируйте это письмо.</Text>
			</Body>
		</Html>
    </Tailwind>
  )
}
