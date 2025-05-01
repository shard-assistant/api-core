import { Injectable } from '@nestjs/common'
import { ProducerService } from '../../kafka/producer.service'

@Injectable()
export class NotificationService {
  constructor(private readonly kafkaProducer: ProducerService) {}

	async sendNotification(type: "mail", sendTo: string, template: "reg_confirmation" | "reset_password" | "tf_auth", data: any) {
		return await this.kafkaProducer.produce({
			topic: "notification",
			messages: [
				{
					value: JSON.stringify({
						type,
						sendTo,
						template,
						data
					})
				}
			]
		})
  }
}
