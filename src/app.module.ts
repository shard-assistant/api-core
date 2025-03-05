import { Module } from "@nestjs/common"
import { ConfigModule } from "@nestjs/config"

import { KafkaModule } from "@/kafka/kafka.module"

import { IS_DEV_ENV } from "./libs/common/utils/is-dev.util"

@Module({
	imports: [
		KafkaModule,
		ConfigModule.forRoot({
			ignoreEnvFile: !IS_DEV_ENV,
			isGlobal: true
		})
	]
})
export class AppModule {}
