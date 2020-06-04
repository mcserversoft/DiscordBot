const Discord = require("discord.js");
module.exports.run = async(bot, message, args) => {
    //create link
    let link = `http://letmegooglethat.com/?q=${args.join("+")}`;
    let embed = new Discord.MessageEmbed()
    .addField("**It seems like your problem could be solved with a simple Google search.**", `[View answer to: ${args.join(" ")}](${link})`)
    .setColor("0x7ba73f");
    message.delete();
    message.channel.send(embed);
};

module.exports.help = {
    name: "lmgt"
};
