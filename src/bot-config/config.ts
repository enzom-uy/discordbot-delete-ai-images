import { Events } from "discord.js";
import { client } from "..";

export const setupBot = () => {
  client.on(Events.ClientReady, () => {
    client.user.setActivity("DayZ 2");
  });
  return;
};
