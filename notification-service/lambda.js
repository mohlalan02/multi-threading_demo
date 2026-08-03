export async function handler(event) {
  for (const record of event.Records) {
    const snsMessage = JSON.parse(record.body);
    const userEvent = JSON.parse(snsMessage.Message);

    console.log("Event received:", userEvent.eventType);
    console.log("Payload:", userEvent.payload);

    if (userEvent.eventType === "UserCreated") {
      console.log(`Welcome message would be sent to ${userEvent.payload.email}`);
    }
  }

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: "Messages processed"
    })
  };
}