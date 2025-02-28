import {
  Injectable,
  OnApplicationShutdown,
  OnModuleInit
} from "@nestjs/common";
import { Kafka, ProducerRecord } from "kafkajs";

@Injectable()
export class ProducerService implements OnModuleInit, OnApplicationShutdown {
  private readonly kafka = new Kafka({
    brokers: process.env.KAFKA_BROKERS?.split(",") || []
  });

  private readonly producer = this.kafka.producer();

  async onModuleInit() {
    await this.producer.connect();
  }

  async produce(record: ProducerRecord) {
    await this.producer.send(record);
  }

  async onApplicationShutdown() {
    await this.producer.disconnect();
  }
}
