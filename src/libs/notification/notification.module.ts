import { KafkaModule } from '@/kafka/kafka.module'
import { Module } from "@nestjs/common"
import { NotificationService } from './notification.service'

@Module({
  imports: [KafkaModule],
  providers: [NotificationService],
  exports: [NotificationService]
})
export class NotificationModule {}
