import { KafkaModule } from "@/kafka/kafka.module";
import { Module } from "@nestjs/common";

@Module({ 
  imports: [KafkaModule]
}) 
export class AppModule {} 
