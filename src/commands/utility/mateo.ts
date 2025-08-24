import { Events } from "discord.js";
import { client } from "../../index";
import { MATEO_ID } from "../../utils/constants";

interface SightEngineApiResponseSuccess {
  status: "success" | "error";
  request: {
    id: string;
    timestamp: number;
    operations: number;
  };
  type: {
    ai_generated: number; // Score de 0 a 1
  };
  media: {
    id: string;
    uri: string;
  };
}

client.on(Events.MessageCreate, async (message) => {
  if (message.author.id !== MATEO_ID || message.author.bot) return;
  if (message.attachments.size === 0) return;
  if (message.channel.id !== "1106569629406601309") return;

  const url = new URL("https://api.sightengine.com/1.0/check.json");

  message.attachments.forEach(async (attachment) => {
    url.searchParams.append("url", attachment.url);
    url.searchParams.append("models", "genai");
    url.searchParams.append("api_user", process.env.SIGHT_API_USER!);
    url.searchParams.append("api_secret", process.env.SIGHT_API_SECRET!);

    await fetch(url)
      .then(async function (response) {
        if (!response.ok) {
          // handle HTTP error responses
          const errorData = await response
            .json()
            .catch(() => ({ message: response.statusText }));
          throw new Error(
            `HTTP ${response.status}: ${JSON.stringify(errorData)}`,
          );
        }
        return response.json();
      })
      .then(function (data: SightEngineApiResponseSuccess) {
        console.log("Success");
        if (data.type.ai_generated > 0.5) {
          message.reply("pelotudeces no");

          setTimeout(() => {
            message.delete();
          }, 1000);
          return;
        } else {
          message.reply("bien ahi mate por fin algo no hecho con chatgpt");
          return;
        }
      })
      .catch(function (error) {
        console.log("Error");
        console.log(error.message);
      });
  });
  console.log(message);

  return;
});
