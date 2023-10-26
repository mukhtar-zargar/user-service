import { Container, interfaces } from "inversify";
import { Logger } from "./infra/logging/pino";
import { TYPES } from "./application/constants/types";
import { AppDataSource } from "./infra/typeorm/typeorm.config";
import { UserRepository } from "./infra/repos/users";
// import { DomainProducerMessagingRepositoryKafka } from "./infra/messaging/kafka/producer";
// import { KafkaConfiguration } from "./infra/messaging/kafka/configuration";
// import { AppSettings } from "./settings.ts/app.settings";
// import { IDomainProducerMessagingRepository } from "./domain/ports/messaging/producer";

const container = new Container();

container.bind(TYPES.Logger).to(Logger).inSingletonScope();
container.bind(TYPES.UserRepository).to(UserRepository);
container.bind(TYPES.DataSource).to(AppDataSource).inSingletonScope();
// container
//   .bind<IDomainProducerMessagingRepository>(TYPES.MessagingProducer)
//   .toFactory<IDomainProducerMessagingRepository>((context: interfaces.Context) => {
//     const producer = new DomainProducerMessagingRepositoryKafka(
//       KafkaConfiguration.getKafkaConfiguration({
//         KAFKA_BROKERS: [AppSettings.KAFKA_BROKER],
//         KAFKA_SASL_USERNAME: AppSettings.KAFKA_SASL_USERNAME || "dummy",
//         KAFKA_SASL_PASSWORD: AppSettings.KAFKA_SASL_PASSWORD || "pass",
//         KAFKA_CONNECTION_TIMEOUT: 5000,
//         KAFKA_CERTIFICATE_BASE64: "122"
//       })
//     );
//     producer.connect();
//     return () => producer;
//   });

export { container };
