import "dotenv/config";
import {
  SQSClient,
  ReceiveMessageCommand,
  DeleteMessageCommand
} from "@aws-sdk/client-sqs";

const sqsClient = new SQSClient({
  region: process.env.AWS_REGION
});

const queueUrl = process.env.SQS_QUEUE_URL;

async function pollMessages() {
  console.log("Notification service is listening for UserCreated events...");

  while (true) {
    const command = new ReceiveMessageCommand({
      QueueUrl: queueUrl,
      MaxNumberOfMessages: 1,
      WaitTimeSeconds: 10
    });

    const response = await sqsClient.send(command);

    if (!response.Messages || response.Messages.length === 0) {
      console.log("No messages found");
      continue;
    }

    for (const message of response.Messages) {
      const snsMessage = JSON.parse(message.Body);
      const event = JSON.parse(snsMessage.Message);

      console.log("Event received:", event.eventType);
      console.log("Payload:", event.payload);

      if (event.eventType === "UserCreated") {
        console.log(`Welcome message would be sent to ${event.payload.email}`);
      }

      await sqsClient.send(
        new DeleteMessageCommand({
          QueueUrl: queueUrl,
          ReceiptHandle: message.ReceiptHandle
        })
      );

      console.log("Message processed and deleted from SQS");
    }
  }
}

pollMessages().catch((error) => {
  console.error("Notification service failed:", error.message);
});