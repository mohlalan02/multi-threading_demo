import { SNSClient, PublishCommand } from "@aws-sdk/client-sns";

const snsClient = new SNSClient({
  region: process.env.AWS_REGION
});

export async function publishEvent(eventType, payload) {
  if (!process.env.SNS_TOPIC_ARN) {
    console.log("SNS_TOPIC_ARN is missing. Event was not published.");
    return;
  }

  const event = {
    eventType,
    payload,
    occurredAt: new Date().toISOString()
  };

  const command = new PublishCommand({
    TopicArn: process.env.SNS_TOPIC_ARN,
    Message: JSON.stringify(event),
    MessageAttributes: {
      eventType: {
        DataType: "String",
        StringValue: eventType
      }
    }
  });

  await snsClient.send(command);

  console.log(`${eventType} event published to SNS`);
}