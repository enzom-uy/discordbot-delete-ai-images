import { Events, TextChannel } from "discord.js";
import { client } from "../..";
import { DAYZ_MESSAGES } from "../../constants/dayz";

let lastMessageIndex: number | null = null;

async function sendRandomMessage() {
  const channel = client.channels.cache.get(
    process.env.DEV_TARGET_DISCORD_CHANNEL_ID,
  ) as TextChannel;

  if (channel) {
    let randomIndex;

    do {
      randomIndex = Math.floor(Math.random() * DAYZ_MESSAGES.length);
    } while (randomIndex === lastMessageIndex);

    lastMessageIndex = randomIndex;
    const randomMessage = DAYZ_MESSAGES[randomIndex];

    await channel
      .send(
        `## Fact random de por qué DayZ es el mejor survival zombie PvPvE:\n\n${randomMessage}`,
      )
      .then(() => console.log("Random DayZ best survival game ever fact sent"))
      .catch((error) => console.error("Error sending message:", error));
  }

  const delay = 1440 * 60 * 1000;

  setTimeout(sendRandomMessage, delay);
}

client.on(Events.ClientReady, async () => {
  await sendRandomMessage();
});
