import {
  ChatInputCommandInteraction,
  Client,
  CommandInteraction,
  MessageFlags,
  SlashCommandBuilder,
} from "discord.js";

export const data = new SlashCommandBuilder()
  .setName("hltb")
  .setDescription("Devuelve la duración del juego según HowLongToBeat.")
  .addStringOption((option) =>
    option.setName("juego").setDescription("Juego a buscar").setRequired(true),
  );

interface Response {
  error?: string;
  GameTitle: string;
  GameDurations: {
    main_story: string;
    main_sides: string;
    completionist: string;
  };
  GameID: string;
  GameURL: string;
}

export async function execute(
  client: Client,
  interaction: ChatInputCommandInteraction,
) {
  await interaction.deferReply({ flags: MessageFlags.Ephemeral });

  const queryUrl = new URL("http://localhost:3333/api/v1/scraper/search");
  const game = interaction.options.getString("juego");
  queryUrl.searchParams.append("game_name", game);
  console.log(queryUrl);

  const response: Response = await fetch(queryUrl, {
    headers: {
      "Content-Type": "application/json",
      "X-API-Key": process.env.GO_API_KEY,
    },
  }).then((res) => res.json());

  if (response.error) {
    await interaction.editReply("Ha ocurrido un error al buscar el juego.");
    console.error(
      `[HLTB ERROR] There was an error fetching the game. Check API Key.`,
    );
    return;
  }

  const gameTitle = response.GameTitle;
  const mainStory = response.GameDurations.main_story;
  const mainSides = response.GameDurations.main_sides;
  const completionist = response.GameDurations.completionist;

  await interaction.editReply(
    `**${gameTitle}**

    **Historia principal:** ${mainStory}
    **Historia principal + extras:** ${mainSides}
    **Completionista:** ${completionist}

    **Source:** ${response.GameURL}
        `,
  );
}
