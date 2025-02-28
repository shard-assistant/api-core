import { Logger } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import * as dotenv from "dotenv";
import { AppModule } from "./app.module";

export const LOGGER = new Logger("Auth Service");

async function bootstrap() {
  dotenv.config();

  const PORT = process.env.PORT ?? 3000;

  const app = await NestFactory.create(AppModule);
  await app.listen(PORT);

  LOGGER.log("------------------------------------");
  LOGGER.log(`| 🚀 http://localhost:${PORT}/api`);
  LOGGER.log(`| 🌐 Сервер запущен на порту: ${PORT}`);
  LOGGER.log("------------------------------------");
}
bootstrap();
