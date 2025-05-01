import { Module } from "@nestjs/common"
import { NotificationService } from "../libs/notification/notification.service"
import { ConsumerService } from "./consumer.service"
import { ProducerService } from "./producer.service"
@Module({
  providers: [ProducerService, ConsumerService, NotificationService],
  exports: [ProducerService, ConsumerService, NotificationService]
})
export class KafkaModule {}
