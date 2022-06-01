import { SubscriptionParameters } from "../../domain/ports/messaging/consumer";
import { PostEvents, Topics } from "../constants/messaging.constants";

class PostConsumer {
  onPostCreated(): SubscriptionParameters {
    return {
      topic: Topics.PostService,
      eventTypes: [PostEvents.Created],
      readFromBeginning: true,
      handles: {
        async handle(event) {
          console.log(`Consumed Event ${JSON.stringify(event)}`);
          return {
            handled: true
          };
        }
      }
    };
  }

  onPostUpdated(): SubscriptionParameters {
    return {
      topic: Topics.PostService,
      eventTypes: [PostEvents.Updated],
      readFromBeginning: true,
      handles: {
        async handle(event) {
          console.log(`Consumed Event ${JSON.stringify(event)}`);
          return {
            handled: true
          };
        }
      }
    };
  }

  getAllPostConsumers() {
    return [this.onPostCreated(), this.onPostUpdated()];
  }
}

export { PostConsumer };
