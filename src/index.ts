import dotenv from "dotenv";
import { Client, IntentsBitField, Partials } from "discord.js";
import eventHandler from "./handlers/eventHandler";
import { setupBot } from "./bot-config/config";

dotenv.config();

export const client: Client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.MessageContent,
    IntentsBitField.Flags.GuildMessageReactions,
  ],
  partials: [
    Partials.Channel,
    Partials.Message,
    Partials.Reaction,
    Partials.User,
  ],
});

(async () => {
  try {
    eventHandler(client);
    await client.login(process.env.TOKEN!);
    console.log("Bot is ready!");
    setupBot();
  } catch (error) {
    console.error(`Error: ${error}`);
  }
})();
