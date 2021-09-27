module.exports = {
  name: "ping",
  usage: "ping",
  aliases: [ "pi", "botping" ],
  desc: "Gets the ping of the bot",
  async execute(
    msg,
    args,
    client,
    Discord
  ) {
    const pingEm = new Discord.MessageEmbed()
      .setTitle(`Pong!`)
      .setAuthor(botNick, client.user.avatarURL())
      .addFields(
        { name: `Bot Ping`, value: `\`${client.ws.ping}ms\``, inline: true }
      )
      .setColor("RANDOM");

    msg.reply({ embeds: [pingEm] });
  },
};
