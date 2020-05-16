const Discord = require("discord.js");
module.exports.run = async(bot, message, args) => {
    //define role id's
    let role1 = "366290789170544650";
    //let role2 = "";
    //let role3 = "";
    //make sure they have alteast one role
    if(!message.member.roles.cache.has(role1))return;
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
