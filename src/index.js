const Discord = require("discord.js")
const fs = require("fs")

let config = require("../config.json")
let { prefix } = config

let intents = new Discord.Intents(32509) // All non-privilaged intents
const client = new Discord.Client({ intents: intents }) // Create the client with the intents

// create collections for commands and aliases
client.commands = new Discord.Collection()
client.aliases = new Discord.Collection()

client.config = config

// get command files
const cmdFiles = require("./util/getAllFiles")("./cmds/").filter((file) =>
  file.endsWith(".js")
);

// add each command to the command collection
for (const file of cmdFiles) {
  const cmd = require(`${file}`);
  client.commands.set(cmd.name, cmd);
  // if the command has aliases, add the alaises to the aliases collection, if not, keep going
  if (cmd.aliases) {
    cmd.aliases.forEach((alias) => {
      client.aliases.set(alias, cmd.name);
    });
  } else continue;
}

client.on("ready", () => {
  console.log("Ready!");
  console.log(`Logged in as ${client.user.tag}!`);
  client.commands.forEach((cmd) => {
    console.log(`🗸 Loaded ${cmd.name}`);
  });
  console.log(client);
    client.user.setActivity(
      `${client.guilds.cache.size} servers! | ${config.prefix}help`,
      { type: "WATCHING" }
    );
  console.log(client.user.tag);
});

client.on("messageCreate", async (msg) => {
  if (author.bot) return // ignore other bots
  if (!msg.content.startsWith(prefix)) return // ignore messages that dont start with the prefix

  const args = msg.content.slice(prefix.length).trim().split(/ +/g);
  let cmd = args.shift().toLowerCase();

  if (client.aliases.has(cmd)) cmd = client.aliases.get(cmd);
  if (!client.commands.has(cmd)) return;
  try {
    client.commands
      .get(cmd)
      .execute(
        msg,
        args,
        client,
        Discord
      );
  } catch (error) {
    console.error(error);
    msg.reply(
      `An error occured executing that command! Try again! (\`${error}\`)`
    );
  }
}

// login
client.login(config.token)
