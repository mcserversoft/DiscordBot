const Discord = require("discord.js");

//Import .env Config (removed for final hosting)
//require('dotenv').config()
module.exports.run = async(bot, message, args) => {
    if(!args[0] || args[0] <= 0 || args[0] >= 100){return message.channel.send("Please Specify A Number Between 1 - 99 (This is due to the discord API (Messages older than 14 days also can not be removed))")}
    if(isNaN(args[0])){
        message.channel.bulkDelete(ammount);
        let embed = new Discord.MessageEmbed()
        .addField("Error",`NaN: Not A Number`)
        .setColor("0x7ba73f");
        return message.channel.send(embed)
    }
    let ammount;
    if(message.member.roles.cache.has(process.env.STAFFROLEID) && message.channel.type != "dm"){
        ammount = parseInt(args[0]) + 1
        message.channel.fetch({
            limit: ammount.toString()
        })
        .then(messages => {
            try{
                message.channel.bulkDelete(ammount);
                let embed = new Discord.MessageEmbed()
                .addField("Messages Purged",`Deleted ${ammount-1} messages\nThis message will self destruct in 5 seconds`)
                .setColor("0x7ba73f");
                message.channel.send(embed).then(msg => msg.delete({timeout: 5000}))
            }
            catch{
                message.channel.send("Error: Missing Perms")
            }
        });
    }else{
        return;
    }
};

module.exports.help = {
    name: "purge"
};
