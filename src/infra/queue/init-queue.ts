import { Job, Queue, QueueEvents, Worker } from "bullmq";
import IORedis from "ioredis";

// export class CustomQueue {
//   private queue: Queue;

//   constructor() {
//     const connection = new IORedis({ host: "", port: 6379 });

//     this.queue = new Queue("user-service-queue", {
//       connection
//     });
//   }

//   public getQueueInstance(): Queue {
//     return this.queue;
//   }
// }

const connection = new IORedis({ host: "", port: 6379 });

const queue = new Queue("user-service-queue", {
  connection
});

queue.add(
  "job-name",
  { foo: "bar" },
  {
    // options
  }
);
queue.add("job-name", { qux: "baz" });

// await queue.drain();
// await queue.pause()
// await queue.clean(
//   60000, // 1 minute
//   1000, // max number of jobs to clean
//   "paused"
// );
// await queue.count();
// await queue.obliterate();

const worker = new Worker(
  "user-service-queue",
  async (job) => {
    console.log(job.data);
    // job.progress = 1
  },
  {
    connection
  }
);

worker.on("completed", (job) => {
  console.log(`${job.id} has completed`);
});

worker.on("failed", (job) => {
  console.log(`${job.id} has failed`);
});

const queueEvents = new QueueEvents("queued-events", { connection });

queueEvents.on("active", ({ jobId, prev }) => {
  console.log(`Job ${jobId} is now active; previous status was ${prev}`);
});

queueEvents.on("completed", ({ jobId, returnvalue }) => {
  console.log(`${jobId} has completed and returned ${returnvalue}`);
});

queueEvents.on("failed", ({ jobId, failedReason }) => {
  console.log(`${jobId} has failed with reason ${failedReason}`);
});

queueEvents.on("progress", ({ jobId, data }, timestamp) => {
  console.log(`${jobId} reported progress ${data} at ${timestamp}`);
});

async function creatingJob() {
  const job = await Job.create(queue, "test", { foo: "bar" }, { delay: 2000 });

  await job.changeDelay(4000);
}
