const Discord = require("discord.js");
//Import .env Config (removed for final hosting)
//require('dotenv').config()
module.exports.run = async(bot, message, args) => {
    if(message.guild.id == process.env.GUILDID){
        if(args[0] == "releases"){
            var ReleaseRole = message.guild.roles.cache.find(role => role.id == process.env.RELEASESROLEID);
            if(message.member.roles.cache.has(process.env.RELEASESROLEID)){
                message.member.roles.remove(ReleaseRole,"BOT - Request Command").catch(console.error);
                let embed = new Discord.MessageEmbed()
                .addField("Main Release Role Removed","You will no longer be mentioned when there is a new release.")
                .setColor("0x7ba73f");
                message.channel.send(embed);       
            }else{
                message.member.roles.add(ReleaseRole,"BOT - Request Command");
                let embed = new Discord.MessageEmbed()
                .addField("Main Release Role Added","You will now be mentioned when there is a new release.")
                .setColor("0x7ba73f");
                message.channel.send(embed); 
            }
        }else if(args[0] == "dev"){
            var DevRole = message.guild.roles.cache.find(role => role.id == process.env.DEVROLEID);
            if(message.member.roles.cache.has(process.env.DEVROLEID)){
                message.member.roles.remove(DevRole,"BOT - Request Command").catch(console.error);
                let embed = new Discord.MessageEmbed()
                .addField("Dev Release Role Removed","You will no longer be mentioned when there is a new dev release.")
                .setColor("0x7ba73f");
                message.channel.send(embed);   
            }else{
                message.member.roles.add(DevRole,"BOT - Request Command");
                let embed = new Discord.MessageEmbed()
                .addField("Dev Release Role Added","You will now be mentioned when there is a new dev release.")
                .setColor("0x7ba73f");
                message.channel.send(embed); 
            }
        }
    }
};

module.exports.help = {
    name: "request-news"
};
