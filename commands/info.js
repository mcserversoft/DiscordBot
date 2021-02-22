const Discord = require("discord.js");
const pjson = require('../package.json');
module.exports.run = async(bot, message, args) => {
    let embed = new Discord.MessageEmbed()
    .setTitle("MCSS Discord Bot Info:")
    .addField("Basics:", `
    **Description:** ${pjson.description}
    **Version:** ${pjson.version}
    **Commands:** Info, Lmgt, Ping, ~~Purge~~
    **Owner:** <@209386978481799168>
    **Developer:** <@329353232570908682>
    **Github Code:** https://github.com/mcserversoft/DiscordBot
    **Most Recent Change:** ${pjson.patch}
    `)
    .setColor("0x7ba73f");
    message.channel.send(embed)
};

module.exports.help = {
    name: "info"
};
