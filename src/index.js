const Discord = require("discord.js");

let config = require("../config.json");

// ALL NON PRIVLAGED
intents = new Discord.IntentsBitField(3243773);
const client = new Discord.Client({ intents: intents });

// ALL NON PRIVLAGED + MESSAGE CONTENT
// intents = new Discord.IntentsBitField(3276541);
// const client = new Discord.Client({ intents: intents });

client.commands = new Discord.Collection();
const cmdFiles = require("./util/getAllFiles")("./cmds/").filter((file) =>
  file.endsWith(".js")
);
for (const file of cmdFiles) {
  const cmd = require(`${file}`);
  client.commands.set(cmd.data.name, cmd);
}

client.on("ready", async () => {
  console.log("Ready!");
  console.log(`Logged in as ${client.user.tag}!`);
  console.log(client);
  client.user.setActivity(`${client.guilds.cache.size} servers!`, {
    type: Discord.ActivityType.Watching,
  });

  // Send slash commands to discord
  const { REST } = require("@discordjs/rest");
  const { Routes } = require("discord-api-types/v10");
  const { token } = config;
  const commands = [];
  const clientId = config.clientID;
  for (const file of cmdFiles) {
    const command = require(`${file}`);
    commands.push(command.data.toJSON());
  }
  const rest = new REST({ version: "10" }).setToken(token);
  try {
    console.log("Started refreshing application (/) commands.");
    await rest.put(Routes.applicationCommands(clientId), { body: commands });
    console.log("Successfully reloaded application (/) commands.");
  } catch (error) {
    console.error(error);
  }

  client.commands.forEach((cmd) => {
    console.log(`🗸 Loaded ${cmd.data.name}`);
  });

  console.log(client.user.tag);
});

client.on("interactionCreate", async (interaction) => {
  if (interaction.type != Discord.InteractionType.ApplicationCommand) return;
  const { commandName } = interaction;
  const command = client.commands.get(commandName);
  if (!command) return;
  if (!interaction.inGuild()) return;

  interaction.author = interaction.user;
  interaction.send = interaction.reply;

  try {
    await command.execute(interaction, client, config).catch(async (error) => {
      console.log(error);
    });
  } catch (error) {
    console.log(error);
  }
});

client.login(config.token);
