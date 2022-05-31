import { SubscriptionParameters } from "../../domain/ports/messaging/consumer";

const PostServiceTopic = "post_service";

const CreatePostEvent = "create_post";
const UpdatePostEvent = "update_post";

class PostConsumer {
  onPostCreated(): SubscriptionParameters {
    return {
      topic: PostServiceTopic,
      eventTypes: [CreatePostEvent],
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
      topic: PostServiceTopic,
      eventTypes: [UpdatePostEvent],
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
