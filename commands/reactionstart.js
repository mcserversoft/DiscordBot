const Discord = require("discord.js");
module.exports.run = async(bot, message, args) => {
    //make sure its fireblade
    if(message.author.id != "209386978481799168") return;
    let embed = new Discord.MessageEmbed()
    .setTitle("Mentions For Main And Dev Releases")
    .addField("React To This Message To Get Mentioned When There Are New Releases",`
    🌈 = Main Releases
    🦄 = Developer Releases
    `)
    .setColor("0x7ba73f");
    message.channel.send(embed).then(msg => {
        //react with all the emojis
        msg.react(process.env.RELEASEEMOJI);
        msg.react(process.env.DEVEMOJI);
        console.log(msg.id);
    })
};

module.exports.help = {
    name: "startreactionrole"
};
